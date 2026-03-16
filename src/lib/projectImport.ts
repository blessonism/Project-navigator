import type {
  BatchImportItem,
  BatchImportPreview,
  ImportPreview,
  ImportSourceType,
  Project,
  ProjectDraft,
  ProjectFormData,
} from '@/types/project';

const allowedStatuses: Project['status'][] = ['live', 'development', 'archived'];

const normalizeText = (value: unknown): string => (typeof value === 'string' ? value.trim() : '');

const normalizeOptionalUrl = (value: unknown): string | undefined => {
  const url = normalizeText(value);
  if (!url) return undefined;
  try {
    const parsed = new URL(url);
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return undefined;
    }
    parsed.hash = '';
    return parsed.toString();
  } catch {
    return undefined;
  }
};

export const normalizeProjectUrl = (value: string): string => {
  const raw = value.trim();
  if (!raw) return '';

  try {
    const parsed = new URL(raw);
    parsed.hostname = parsed.hostname.toLowerCase();
    parsed.hash = '';
    parsed.search = '';

    if (parsed.pathname !== '/') {
      parsed.pathname = parsed.pathname.replace(/\/+$/, '');
    }

    return parsed.toString();
  } catch {
    return raw;
  }
};

export const detectImportSourceType = (sourceUrl: string): ImportSourceType => {
  const normalized = normalizeProjectUrl(sourceUrl);
  try {
    const parsed = new URL(normalized);
    if (parsed.hostname === 'github.com') {
      const segments = parsed.pathname.split('/').filter(Boolean);
      if (segments.length >= 2) {
        return 'github';
      }
    }
  } catch {
    return 'website';
  }

  return 'website';
};

const normalizeTags = (value: unknown): string[] => {
  if (Array.isArray(value)) {
    return value
      .map((item) => normalizeText(item))
      .filter(Boolean)
      .slice(0, 20);
  }

  if (typeof value === 'string') {
    return value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean)
      .slice(0, 20);
  }

  return [];
};

const normalizeStringArray = (value: unknown): string[] | undefined => {
  if (Array.isArray(value)) {
    const list = value.map((item) => normalizeText(item)).filter(Boolean);
    return list.length > 0 ? list : undefined;
  }

  if (typeof value === 'string') {
    const list = value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
    return list.length > 0 ? list : undefined;
  }

  return undefined;
};

const normalizeStatus = (value: unknown): Project['status'] => {
  if (typeof value === 'string' && allowedStatuses.includes(value as Project['status'])) {
    return value as Project['status'];
  }
  return 'live';
};

const normalizeCategory = (value: unknown): string => {
  const category = normalizeText(value);
  return category || 'web';
};

const toRecord = (value: unknown): Record<string, unknown> | null => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return null;
  }
  return value as Record<string, unknown>;
};

const createProjectId = (index: number): string => {
  const random = Math.random().toString(36).slice(2, 8);
  return `${Date.now()}-${index}-${random}`;
};

const createBatchImportItem = (
  raw: unknown,
  index: number,
  existingLiveUrls: Set<string>,
  existingGithubUrls: Set<string>,
  seenLiveUrls: Set<string>,
  seenGithubUrls: Set<string>
): BatchImportItem => {
  const row = toRecord(raw);
  if (!row) {
    return {
      index,
      status: 'invalid',
      raw,
      errors: ['项目项必须是 JSON 对象'],
    };
  }

  const title = normalizeText(row.title);
  const description = normalizeText(row.description);
  const liveUrl = normalizeOptionalUrl(row.liveUrl);
  const githubUrl = normalizeOptionalUrl(row.githubUrl);

  const errors: string[] = [];
  if (!title) errors.push('title 不能为空');
  if (!description) errors.push('description 不能为空');
  if (!liveUrl) errors.push('liveUrl 必须是合法 http/https 地址');

  const normalizedLiveUrl = liveUrl ? normalizeProjectUrl(liveUrl) : '';
  const normalizedGithubUrl = githubUrl ? normalizeProjectUrl(githubUrl) : '';

  if (normalizedLiveUrl && (existingLiveUrls.has(normalizedLiveUrl) || seenLiveUrls.has(normalizedLiveUrl))) {
    return {
      index,
      status: 'duplicate',
      raw,
      errors: ['liveUrl 与现有项目重复'],
      duplicateBy: 'liveUrl',
    };
  }

  if (
    normalizedGithubUrl &&
    (existingGithubUrls.has(normalizedGithubUrl) || seenGithubUrls.has(normalizedGithubUrl))
  ) {
    return {
      index,
      status: 'duplicate',
      raw,
      errors: ['githubUrl 与现有项目重复'],
      duplicateBy: 'githubUrl',
    };
  }

  if (errors.length > 0) {
    return {
      index,
      status: 'invalid',
      raw,
      errors,
    };
  }

  const tags = normalizeTags(row.tags);
  const features = normalizeStringArray(row.features);
  const screenshots = normalizeStringArray(row.screenshots);
  const detailedDescription = normalizeText(row.detailedDescription) || undefined;

  const project: Project = {
    id: createProjectId(index),
    title,
    description,
    liveUrl: liveUrl!,
    githubUrl,
    tags,
    category: normalizeCategory(row.category),
    image: normalizeOptionalUrl(row.image),
    status: normalizeStatus(row.status),
    order: 0,
    detailedDescription,
    screenshots,
    features,
    showGallery: true,
    showOverview: true,
    showTechStack: true,
    showChallenges: true,
    showTimeline: true,
  };

  if (normalizedLiveUrl) seenLiveUrls.add(normalizedLiveUrl);
  if (normalizedGithubUrl) seenGithubUrls.add(normalizedGithubUrl);

  return {
    index,
    status: 'valid',
    raw,
    project,
    errors: [],
  };
};

export const createBatchImportPreview = (
  jsonText: string,
  existingProjects: Project[]
): BatchImportPreview => {
  let parsed: unknown;

  try {
    parsed = JSON.parse(jsonText);
  } catch {
    const invalidItem: BatchImportItem = {
      index: -1,
      status: 'invalid',
      raw: jsonText,
      errors: ['JSON 解析失败，请检查格式'],
    };

    return {
      items: [invalidItem],
      validItems: [],
      duplicateItems: [],
      invalidItems: [invalidItem],
    };
  }

  if (!Array.isArray(parsed)) {
    const invalidItem: BatchImportItem = {
      index: -1,
      status: 'invalid',
      raw: parsed,
      errors: ['批量导入 JSON 顶层必须是数组'],
    };

    return {
      items: [invalidItem],
      validItems: [],
      duplicateItems: [],
      invalidItems: [invalidItem],
    };
  }

  const existingLiveUrls = new Set(
    existingProjects.map((project) => normalizeProjectUrl(project.liveUrl)).filter(Boolean)
  );
  const existingGithubUrls = new Set(
    existingProjects
      .map((project) => (project.githubUrl ? normalizeProjectUrl(project.githubUrl) : ''))
      .filter(Boolean)
  );

  const seenLiveUrls = new Set<string>();
  const seenGithubUrls = new Set<string>();

  const items = parsed.map((item, index) =>
    createBatchImportItem(
      item,
      index,
      existingLiveUrls,
      existingGithubUrls,
      seenLiveUrls,
      seenGithubUrls
    )
  );

  return {
    items,
    validItems: items.filter((item) => item.status === 'valid'),
    duplicateItems: items.filter((item) => item.status === 'duplicate'),
    invalidItems: items.filter((item) => item.status === 'invalid'),
  };
};

const mergeStringListToInput = (value: string[] | undefined): string => (value ? value.join(', ') : '');

export const mergeImportPreviewToFormData = (
  current: ProjectFormData,
  preview: ImportPreview
): ProjectFormData => {
  const project = preview.normalizedProject;

  return {
    ...current,
    title: normalizeText(project.title) || current.title,
    description: normalizeText(project.description) || current.description,
    liveUrl: normalizeText(project.liveUrl) || current.liveUrl,
    githubUrl: normalizeText(project.githubUrl) || current.githubUrl,
    tags: Array.isArray(project.tags)
      ? project.tags.map((tag) => normalizeText(tag)).filter(Boolean).join(', ')
      : current.tags,
    category: normalizeText(project.category) || current.category,
    image: normalizeText(project.image) || current.image,
    status: normalizeStatus(project.status),
    detailedDescription: normalizeText(project.detailedDescription) || current.detailedDescription,
    screenshots: mergeStringListToInput(project.screenshots) || current.screenshots,
    features: mergeStringListToInput(project.features) || current.features,
  };
};

export const isMeaningfulFormData = (formData: ProjectFormData): boolean => {
  return Boolean(
    formData.title.trim() ||
      formData.description.trim() ||
      formData.liveUrl.trim() ||
      formData.githubUrl.trim() ||
      formData.tags.trim() ||
      formData.detailedDescription.trim()
  );
};

const resolveDraftSourceType = (
  sourceType: ImportSourceType | undefined,
  sourceUrl: string
): ImportSourceType => {
  if (sourceType) {
    return sourceType;
  }

  if (sourceUrl.trim()) {
    return detectImportSourceType(sourceUrl);
  }

  return 'website';
};

export const createProjectDraft = (params: {
  draftId?: string;
  formData: ProjectFormData;
  sourceUrl?: string;
  sourceType?: ImportSourceType;
}): ProjectDraft => {
  const sourceUrl = params.sourceUrl?.trim() || params.formData.liveUrl.trim();
  const sourceType = resolveDraftSourceType(params.sourceType, sourceUrl);

  return {
    id: params.draftId || createProjectId(0),
    title: params.formData.title.trim() || '未命名草稿',
    sourceUrl,
    sourceType,
    payload: params.formData,
    updatedAt: new Date().toISOString(),
  };
};
