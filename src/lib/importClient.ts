import { supabase, isSupabaseConfigured } from './supabase';
import { detectImportSourceType } from './projectImport';
import type {
  FrontendAiConfig,
  ImportPreview,
  ImportSourceType,
  Project,
} from '@/types/project';

export class ImportClientError extends Error {
  code: string;

  constructor(code: string, message: string) {
    super(message);
    this.code = code;
    this.name = 'ImportClientError';
  }
}

interface ImportProjectMetadataRequest {
  sourceUrl: string;
  sourceType?: ImportSourceType;
  sessionPasscode: string;
  aiConfig?: FrontendAiConfig;
}

interface ListAiModelsRequest {
  sessionPasscode: string;
  aiConfig?: FrontendAiConfig;
}

interface ImportProjectMetadataResponse {
  normalizedProject: Partial<Project>;
  rawMetadata: Record<string, unknown>;
  warnings: string[];
  confidence: number;
  errorCode?: string;
  message?: string;
}

interface ListAiModelsResponse {
  models?: string[];
  defaultModel?: string;
  errorCode?: string;
  message?: string;
}

const normalizePreviewResponse = (
  payload: ImportProjectMetadataResponse,
  sourceUrl: string,
  sourceType: ImportSourceType
): ImportPreview => {
  return {
    sourceUrl,
    sourceType,
    normalizedProject: payload.normalizedProject || {},
    rawMetadata: payload.rawMetadata || {},
    warnings: Array.isArray(payload.warnings)
      ? payload.warnings.filter((item): item is string => typeof item === 'string')
      : [],
    confidence: typeof payload.confidence === 'number' ? payload.confidence : 0,
  };
};

const asObject = (value: unknown): Record<string, unknown> | null => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return null;
  }
  return value as Record<string, unknown>;
};

const resolveFunctionInvokeError = async (
  error: unknown,
  fallbackMessage: string
): Promise<ImportClientError> => {
  let code = 'FUNCTION_INVOKE_FAILED';
  let message = fallbackMessage;

  if (error instanceof Error && error.message.trim()) {
    message = error.message;
  }

  const context = asObject(error)?.context;
  if (context instanceof Response) {
    try {
      const responseBody = await context.clone().json();
      const payload = asObject(responseBody);
      if (payload) {
        if (typeof payload.errorCode === 'string' && payload.errorCode.trim()) {
          code = payload.errorCode;
        }
        if (typeof payload.message === 'string' && payload.message.trim()) {
          message = payload.message;
        }
      }
    } catch {
      const text = await context.clone().text();
      if (text.trim()) {
        message = text;
      }
    }

    if (!message.trim()) {
      message = `Edge Function 返回非 2xx 状态（HTTP ${context.status}）`;
    }
  }

  return new ImportClientError(code, message);
};

const resolveAiConfigPayload = (
  aiConfig?: FrontendAiConfig
): { apiKey: string; baseUrl?: string; model?: string } | undefined => {
  if (!aiConfig?.enabled) {
    return undefined;
  }

  const apiKey = aiConfig.apiKey.trim();
  if (!apiKey) {
    return undefined;
  }

  const baseUrl = aiConfig.baseUrl.trim();
  const model = aiConfig.model.trim();

  return {
    apiKey,
    baseUrl: baseUrl || undefined,
    model: model || undefined,
  };
};

export const importProjectMetadata = async (
  request: ImportProjectMetadataRequest
): Promise<ImportPreview> => {
  if (!isSupabaseConfigured()) {
    throw new ImportClientError('SUPABASE_NOT_CONFIGURED', '未配置 Supabase，无法使用 AI 一键导入');
  }

  const sourceUrl = request.sourceUrl.trim();
  if (!sourceUrl) {
    throw new ImportClientError('INVALID_URL', '请输入项目链接');
  }

  const sourceType = request.sourceType || detectImportSourceType(sourceUrl);

  const { data, error } = await supabase.functions.invoke('import-project-metadata', {
    body: {
      sourceUrl,
      sourceType,
      sessionPasscode: request.sessionPasscode,
      aiConfig: resolveAiConfigPayload(request.aiConfig),
    },
  });

  if (error) {
    throw await resolveFunctionInvokeError(error, '导入服务调用失败');
  }

  const response = asObject(data);
  if (!response) {
    throw new ImportClientError('INVALID_RESPONSE', '导入服务返回数据格式错误');
  }

  if (typeof response.errorCode === 'string') {
    throw new ImportClientError(
      response.errorCode,
      typeof response.message === 'string' ? response.message : '导入服务执行失败'
    );
  }

  const payload = response as unknown as ImportProjectMetadataResponse;
  return normalizePreviewResponse(payload, sourceUrl, sourceType);
};

export const listAiModels = async (request: ListAiModelsRequest): Promise<string[]> => {
  if (!isSupabaseConfigured()) {
    throw new ImportClientError('SUPABASE_NOT_CONFIGURED', '未配置 Supabase，无法拉取模型列表');
  }

  const { data, error } = await supabase.functions.invoke('import-project-metadata', {
    body: {
      action: 'list_models',
      sessionPasscode: request.sessionPasscode,
      aiConfig: resolveAiConfigPayload(request.aiConfig),
    },
  });

  if (error) {
    throw await resolveFunctionInvokeError(error, '模型列表调用失败');
  }

  const response = asObject(data);
  if (!response) {
    throw new ImportClientError('INVALID_RESPONSE', '模型列表返回数据格式错误');
  }

  if (typeof response.errorCode === 'string') {
    throw new ImportClientError(
      response.errorCode,
      typeof response.message === 'string' ? response.message : '模型列表调用失败'
    );
  }

  const payload = response as unknown as ListAiModelsResponse;
  const models = Array.isArray(payload.models)
    ? payload.models.filter((item): item is string => typeof item === 'string' && item.trim().length > 0)
    : [];

  return Array.from(new Set(models));
};
