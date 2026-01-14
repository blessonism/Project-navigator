import { supabase, isSupabaseConfigured } from './supabase';
import { logger } from './logger';

const BUCKET_NAME = 'project-images';
const MAX_IMAGE_SIZE_MB = 5;
const MAX_IMAGE_SIZE = MAX_IMAGE_SIZE_MB * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);

const sanitizeFileName = (name: string) => {
  const trimmed = name.trim();
  if (!trimmed) {
    return 'image';
  }
  return trimmed.replace(/[^a-zA-Z0-9._-]/g, '-');
};

const buildObjectPath = (projectId: string, fileName: string) => {
  const safeName = sanitizeFileName(fileName);
  const timestamp = Date.now();
  return `projects/${projectId}/${timestamp}-${safeName}`;
};

const resolveStoragePath = (value: string): string => {
  if (!value) {
    throw new Error('图片路径无效');
  }

  if (value.startsWith(`${BUCKET_NAME}/`)) {
    return value.slice(BUCKET_NAME.length + 1);
  }

  if (value.startsWith('http')) {
    try {
      const url = new URL(value);
      const segments = url.pathname.split('/').filter(Boolean);
      const bucketIndex = segments.indexOf(BUCKET_NAME);
      if (bucketIndex !== -1) {
        return segments.slice(bucketIndex + 1).join('/');
      }
    } catch (error) {
      logger.warn('解析图片地址失败:', error);
    }
  }

  return value;
};

const validateImageFile = (file: File) => {
  if (!file) {
    throw new Error('请选择要上传的图片');
  }

  if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
    throw new Error('图片格式不支持，请使用 JPG、PNG、WEBP 或 GIF');
  }

  if (file.size > MAX_IMAGE_SIZE) {
    throw new Error(`图片大小不能超过 ${MAX_IMAGE_SIZE_MB}MB`);
  }
};

export const uploadProjectImage = async (file: File, projectId: string): Promise<string> => {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase 未配置，无法上传图片');
  }

  if (!projectId) {
    throw new Error('项目 ID 不能为空');
  }

  validateImageFile(file);

  const filePath = buildObjectPath(projectId, file.name);

  try {
    const { error } = await supabase.storage.from(BUCKET_NAME).upload(filePath, file, {
      cacheControl: '3600',
      upsert: true,
      contentType: file.type,
    });

    if (error) {
      logger.error('上传项目图片失败:', error);
      throw new Error('图片上传失败');
    }

    const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(filePath);

    if (!data?.publicUrl) {
      throw new Error('获取图片地址失败');
    }

    return data.publicUrl;
  } catch (error) {
    logger.error('上传项目图片失败:', error);
    throw error instanceof Error ? error : new Error('图片上传失败');
  }
};

export const deleteProjectImage = async (imageUrlOrPath: string): Promise<void> => {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase 未配置，无法删除图片');
  }

  const storagePath = resolveStoragePath(imageUrlOrPath);

  try {
    const { error } = await supabase.storage.from(BUCKET_NAME).remove([storagePath]);

    if (error) {
      logger.error('删除项目图片失败:', error);
      throw new Error('图片删除失败');
    }
  } catch (error) {
    logger.error('删除项目图片失败:', error);
    throw error instanceof Error ? error : new Error('图片删除失败');
  }
};
