import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';

type ImportSourceType = 'github' | 'website';
type FunctionAction = 'import_project' | 'list_models';
type ImportErrorCode =
  | 'INVALID_URL'
  | 'UNAUTHORIZED_IMPORT'
  | 'FETCH_FAILED'
  | 'AI_PARSE_FAILED'
  | 'RATE_LIMITED';

type ProjectStatus = 'live' | 'development' | 'archived';

type NormalizedProject = {
  title: string;
  description: string;
  liveUrl: string;
  githubUrl?: string;
  tags: string[];
  category: string;
  image?: string;
  status: ProjectStatus;
  detailedDescription?: string;
  features?: string[];
};

interface ImportRequestBody {
  action?: FunctionAction;
  sourceUrl?: string;
  sourceType?: ImportSourceType;
  sessionPasscode?: string;
  aiConfig?: {
    apiKey?: string;
    baseUrl?: string;
    model?: string;
  };
}

interface ImportSuccessResponse {
  normalizedProject: NormalizedProject;
  rawMetadata: Record<string, unknown>;
  warnings: string[];
  confidence: number;
}

interface ListModelsSuccessResponse {
  models: string[];
  defaultModel: string;
}

interface ImportErrorResponse {
  errorCode: ImportErrorCode;
  message: string;
}

interface AiNormalizationResult {
  normalizedProject: Partial<NormalizedProject>;
  warnings: string[];
  confidence: number;
}

interface AiRuntimeConfig {
  apiKey: string;
  baseUrl: string;
  model: string;
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const categoryWhitelist = new Set(['web', 'mobile', 'tool', 'analytics']);

const jsonResponse = (
  payload: ImportSuccessResponse | ListModelsSuccessResponse | ImportErrorResponse,
  status = 200
): Response => {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json; charset=utf-8',
    },
  });
};

const toError = (code: ImportErrorCode, message: string, status: number): Response => {
  return jsonResponse({ errorCode: code, message }, status);
};

const normalizeText = (value: unknown): string => (typeof value === 'string' ? value.trim() : '');

const normalizeStringArray = (value: unknown): string[] => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => (typeof item === 'string' ? item.trim() : ''))
    .filter(Boolean)
    .slice(0, 20);
};

const normalizeStatus = (value: unknown): ProjectStatus => {
  if (value === 'live' || value === 'development' || value === 'archived') {
    return value;
  }
  return 'live';
};

const normalizeCategory = (value: unknown): string => {
  const category = normalizeText(value).toLowerCase();
  if (categoryWhitelist.has(category)) {
    return category;
  }
  return 'web';
};

const normalizeUrl = (value: string): string => {
  const parsed = new URL(value);
  if (!['http:', 'https:'].includes(parsed.protocol)) {
    throw new Error('仅支持 http/https 链接');
  }
  parsed.hash = '';
  return parsed.toString();
};

const sanitizeOptionalUrl = (value: unknown): string | undefined => {
  const raw = normalizeText(value);
  if (!raw) return undefined;

  try {
    return normalizeUrl(raw);
  } catch {
    return undefined;
  }
};

const sanitizeNormalizedProject = (
  candidate: Partial<NormalizedProject>,
  fallback: NormalizedProject
): NormalizedProject => {
  const liveUrl = sanitizeOptionalUrl(candidate.liveUrl) || fallback.liveUrl;

  return {
    title: normalizeText(candidate.title) || fallback.title,
    description: normalizeText(candidate.description) || fallback.description,
    liveUrl,
    githubUrl: sanitizeOptionalUrl(candidate.githubUrl) || fallback.githubUrl,
    tags: normalizeStringArray(candidate.tags).length > 0 ? normalizeStringArray(candidate.tags) : fallback.tags,
    category: normalizeCategory(candidate.category) || fallback.category,
    image: sanitizeOptionalUrl(candidate.image) || fallback.image,
    status: normalizeStatus(candidate.status),
    detailedDescription:
      normalizeText(candidate.detailedDescription) || fallback.detailedDescription,
    features:
      normalizeStringArray(candidate.features).length > 0
        ? normalizeStringArray(candidate.features)
        : fallback.features,
  };
};

const getMetaContent = (html: string, attribute: string, value: string): string => {
  const regex = new RegExp(
    `<meta\\s+[^>]*${attribute}=["']${value}["'][^>]*content=["']([^"']+)["'][^>]*>`,
    'i'
  );
  const reverseRegex = new RegExp(
    `<meta\\s+[^>]*content=["']([^"']+)["'][^>]*${attribute}=["']${value}["'][^>]*>`,
    'i'
  );
  const matched = html.match(regex) || html.match(reverseRegex);
  return matched?.[1]?.trim() || '';
};

const extractTitle = (html: string): string => {
  const matched = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  return matched?.[1]?.trim() || '';
};

const fetchGitHubMetadata = async (sourceUrl: string): Promise<Record<string, unknown>> => {
  const parsedUrl = new URL(sourceUrl);
  const segments = parsedUrl.pathname.split('/').filter(Boolean);

  if (segments.length < 2) {
    throw new Error('GitHub 仓库地址格式错误');
  }

  const [owner, repoName] = segments;
  const repo = repoName.replace(/\.git$/i, '');
  const apiUrl = `https://api.github.com/repos/${owner}/${repo}`;

  const response = await fetch(apiUrl, {
    headers: {
      Accept: 'application/vnd.github+json',
      'User-Agent': 'navigator-import-bot',
    },
  });

  if (!response.ok) {
    throw new Error(`GitHub API 请求失败: ${response.status}`);
  }

  const data = await response.json();

  return {
    sourceType: 'github',
    sourceUrl,
    owner,
    repo,
    fullName: data.full_name,
    title: data.name,
    description: data.description,
    homepage: data.homepage,
    tags: Array.isArray(data.topics) ? data.topics : [],
    language: data.language,
    stars: data.stargazers_count,
    forks: data.forks_count,
    openIssues: data.open_issues_count,
    updatedAt: data.updated_at,
    license: data.license?.spdx_id,
    avatar: data.owner?.avatar_url,
  };
};

const fetchWebsiteMetadata = async (sourceUrl: string): Promise<Record<string, unknown>> => {
  const response = await fetch(sourceUrl, {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (compatible; NavigatorImport/1.0; +https://navigator.local/import)',
    },
    redirect: 'follow',
  });

  if (!response.ok) {
    throw new Error(`网页抓取失败: ${response.status}`);
  }

  const finalUrl = response.url;
  const html = await response.text();

  return {
    sourceType: 'website',
    sourceUrl,
    finalUrl,
    title: extractTitle(html),
    description:
      getMetaContent(html, 'name', 'description') ||
      getMetaContent(html, 'property', 'og:description'),
    ogTitle: getMetaContent(html, 'property', 'og:title'),
    ogDescription: getMetaContent(html, 'property', 'og:description'),
    ogImage: getMetaContent(html, 'property', 'og:image'),
    ogSiteName: getMetaContent(html, 'property', 'og:site_name'),
  };
};

const createHeuristicProject = (
  metadata: Record<string, unknown>,
  sourceType: ImportSourceType,
  sourceUrl: string
): NormalizedProject => {
  if (sourceType === 'github') {
    const tags = normalizeStringArray(metadata.tags);
    const language = normalizeText(metadata.language);
    if (language) {
      tags.unshift(language);
    }

    const title = normalizeText(metadata.title) || normalizeText(metadata.repo) || '未命名项目';
    const description = normalizeText(metadata.description) || '该项目暂无简介，可在编辑页补充。';
    const liveUrl = sanitizeOptionalUrl(metadata.homepage) || sourceUrl;

    return {
      title,
      description,
      liveUrl,
      githubUrl: sourceUrl,
      tags: Array.from(new Set(tags)).slice(0, 20),
      category: 'web',
      image: sanitizeOptionalUrl(metadata.avatar),
      status: 'live',
      detailedDescription: description,
      features: [],
    };
  }

  const title =
    normalizeText(metadata.ogTitle) || normalizeText(metadata.title) || new URL(sourceUrl).hostname;
  const description =
    normalizeText(metadata.description) ||
    normalizeText(metadata.ogDescription) ||
    '该网站暂无可用描述，可在编辑页补充。';

  return {
    title,
    description,
    liveUrl: normalizeText(metadata.finalUrl) || sourceUrl,
    tags: [],
    category: 'web',
    image: sanitizeOptionalUrl(metadata.ogImage),
    status: 'live',
    detailedDescription: description,
    features: [],
  };
};

const extractJsonFromContent = (content: string): Record<string, unknown> => {
  const direct = content.trim();
  const fenced = direct.match(/```json\s*([\s\S]*?)```/i);
  const candidate = fenced?.[1] || direct;

  const start = candidate.indexOf('{');
  const end = candidate.lastIndexOf('}');
  if (start === -1 || end === -1 || end < start) {
    throw new Error('AI 返回内容中缺少 JSON 对象');
  }

  const jsonText = candidate.slice(start, end + 1);
  const parsed = JSON.parse(jsonText);
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    throw new Error('AI 返回 JSON 结构无效');
  }

  return parsed as Record<string, unknown>;
};

const resolveAiRuntimeConfig = (configFromRequest?: ImportRequestBody['aiConfig']): AiRuntimeConfig | null => {
  const requestApiKey = normalizeText(configFromRequest?.apiKey);
  const envApiKey = normalizeText(Deno.env.get('OPENAI_API_KEY'));
  const apiKey = requestApiKey || envApiKey;

  if (!apiKey) {
    return null;
  }

  const requestBaseUrl = normalizeText(configFromRequest?.baseUrl);
  const envBaseUrl = normalizeText(Deno.env.get('OPENAI_BASE_URL'));
  const baseUrl = (requestBaseUrl || envBaseUrl || 'https://api.openai.com/v1').replace(/\/+$/, '');

  const requestModel = normalizeText(configFromRequest?.model);
  const envModel = normalizeText(Deno.env.get('OPENAI_MODEL'));
  const model = requestModel || envModel || 'gpt-4.1-mini';

  return {
    apiKey,
    baseUrl,
    model,
  };
};

const fetchModelsByConfig = async (runtimeConfig: AiRuntimeConfig): Promise<string[]> => {
  const response = await fetch(`${runtimeConfig.baseUrl}/models`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${runtimeConfig.apiKey}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`模型列表请求失败: ${response.status}`);
  }

  const data = await response.json();
  const models = Array.isArray(data?.data)
    ? data.data
        .map((item: unknown) => {
          if (!item || typeof item !== 'object') {
            return '';
          }
          const id = (item as Record<string, unknown>).id;
          return typeof id === 'string' ? id.trim() : '';
        })
        .filter(Boolean)
    : [];

  return Array.from(new Set(models));
};

const callAiForNormalization = async (
  sourceType: ImportSourceType,
  sourceUrl: string,
  metadata: Record<string, unknown>,
  runtimeConfig: AiRuntimeConfig
): Promise<AiNormalizationResult | null> => {
  const systemPrompt = `你是项目元数据结构化助手。\n输出必须是严格 JSON 对象，字段只允许：title, description, liveUrl, githubUrl, tags, category, image, status, detailedDescription, features, warnings, confidence。\n要求：\n1) title/description 使用中文。\n2) tags 为字符串数组。\n3) category 仅可为 web/mobile/tool/analytics。\n4) status 仅可为 live/development/archived。\n5) confidence 为 0~1 小数。\n6) warnings 为字符串数组。\n禁止输出任何 JSON 之外内容。`;

  const userPrompt = JSON.stringify(
    {
      sourceType,
      sourceUrl,
      rawMetadata: metadata,
    },
    null,
    2
  );

  const response = await fetch(`${runtimeConfig.baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${runtimeConfig.apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: runtimeConfig.model,
      temperature: 0.2,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(`AI 请求失败: ${response.status}`);
  }

  const data = await response.json();
  const content = data?.choices?.[0]?.message?.content;
  if (typeof content !== 'string' || !content.trim()) {
    throw new Error('AI 返回内容为空');
  }

  const parsed = extractJsonFromContent(content);

  const warnings = normalizeStringArray(parsed.warnings);
  const confidenceRaw = parsed.confidence;
  const confidence =
    typeof confidenceRaw === 'number' && Number.isFinite(confidenceRaw)
      ? Math.max(0, Math.min(1, confidenceRaw))
      : 0.6;

  return {
    normalizedProject: {
      title: normalizeText(parsed.title),
      description: normalizeText(parsed.description),
      liveUrl: normalizeText(parsed.liveUrl),
      githubUrl: normalizeText(parsed.githubUrl),
      tags: normalizeStringArray(parsed.tags),
      category: normalizeCategory(parsed.category),
      image: normalizeText(parsed.image),
      status: normalizeStatus(parsed.status),
      detailedDescription: normalizeText(parsed.detailedDescription),
      features: normalizeStringArray(parsed.features),
    },
    warnings,
    confidence,
  };
};

serve(async (request: Request) => {
  if (request.method === 'OPTIONS') {
    return new Response('ok', {
      headers: corsHeaders,
    });
  }

  if (request.method !== 'POST') {
    return toError('FETCH_FAILED', '仅支持 POST 请求', 405);
  }

  let body: ImportRequestBody;
  try {
    body = await request.json();
  } catch {
    return toError('FETCH_FAILED', '请求体必须是 JSON', 400);
  }

  const sourceUrl = normalizeText(body.sourceUrl);
  const action: FunctionAction = body.action === 'list_models' ? 'list_models' : 'import_project';
  const sourceType = body.sourceType === 'github' ? 'github' : 'website';
  const sessionPasscode = normalizeText(body.sessionPasscode);

  const expectedPasscode = Deno.env.get('IMPORT_SESSION_PASSCODE');
  if (!expectedPasscode || !sessionPasscode || sessionPasscode !== expectedPasscode) {
    return toError('UNAUTHORIZED_IMPORT', '导入口令无效', 401);
  }

  const aiRuntimeConfig = resolveAiRuntimeConfig(body.aiConfig);

  if (action === 'list_models') {
    if (!aiRuntimeConfig) {
      return toError('AI_PARSE_FAILED', '未提供可用 AI 配置', 400);
    }

    try {
      const models = await fetchModelsByConfig(aiRuntimeConfig);
      return jsonResponse({
        models,
        defaultModel: aiRuntimeConfig.model,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : '模型列表拉取失败';
      return toError('FETCH_FAILED', message, 500);
    }
  }

  if (!sourceUrl) {
    return toError('INVALID_URL', 'sourceUrl 不能为空', 400);
  }

  let normalizedSourceUrl: string;
  try {
    normalizedSourceUrl = normalizeUrl(sourceUrl);
  } catch {
    return toError('INVALID_URL', '链接格式无效，仅支持 http/https', 400);
  }

  try {
    const rawMetadata =
      sourceType === 'github'
        ? await fetchGitHubMetadata(normalizedSourceUrl)
        : await fetchWebsiteMetadata(normalizedSourceUrl);

    const fallbackProject = createHeuristicProject(rawMetadata, sourceType, normalizedSourceUrl);
    const warnings: string[] = [];
    let confidence = 0.35;

    let aiResult: AiNormalizationResult | null = null;
    try {
      if (aiRuntimeConfig) {
        aiResult = await callAiForNormalization(
          sourceType,
          normalizedSourceUrl,
          rawMetadata,
          aiRuntimeConfig
        );
      }
      if (!aiResult) {
        warnings.push('未配置 AI Key，已使用规则推断结果');
      }
    } catch (aiError) {
      const aiMessage = aiError instanceof Error ? aiError.message : '未知错误';
      warnings.push(`AI 结构化失败，已降级规则抽取：${aiMessage}`);
    }

    if (aiResult) {
      warnings.push(...aiResult.warnings);
      confidence = aiResult.confidence;
    }

    const normalizedProject = sanitizeNormalizedProject(
      aiResult?.normalizedProject || {},
      fallbackProject
    );

    return jsonResponse({
      normalizedProject,
      rawMetadata,
      warnings,
      confidence,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : '导入服务异常';

    if (message.includes('AI')) {
      return toError('AI_PARSE_FAILED', message, 422);
    }

    return toError('FETCH_FAILED', message, 500);
  }
});
