import {
  supabase,
  isSupabaseConfigured,
  SupabaseProject,
  SupabaseProjectDraft,
} from './supabase';
import { safeLocalStorage } from './storageDetector';
import { logger } from './logger';
import {
  deserializeProjectDrafts,
  sanitizeProjectFormData,
  serializeProjectDrafts,
} from './projectDraftSerializer';
import { resolveProjectVisibility } from './projectVisibility';
import type { Project, TechStackItem, Challenge, TimelineEvent, ProjectDraft } from '@/types/project';

export type { Project, TechStackItem, Challenge, TimelineEvent, ProjectDraft };

type SupabaseProjectWritePayload = Omit<SupabaseProject, 'created_at' | 'updated_at'>;

const getErrorText = (error: unknown): string => {
  if (!error) return '';
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === 'object' && error !== null) {
    const message = Reflect.get(error, 'message');
    return typeof message === 'string' ? message : '';
  }

  return '';
};

export const isProjectsOrderColumnMissingError = (error: unknown): boolean => {
  const message = getErrorText(error).toLowerCase();
  return message.includes('projects.order') && message.includes('does not exist');
};

export const stripOrderFromSupabaseProject = (
  project: SupabaseProjectWritePayload
): Omit<SupabaseProjectWritePayload, 'order'> => {
  const { order, ...legacyProject } = project;
  return legacyProject;
};

export const mapProjectToSupabasePayload = (
  project: Project
): SupabaseProjectWritePayload => {
  return {
    id: project.id,
    title: project.title,
    description: project.description,
    live_url: project.liveUrl,
    github_url: project.githubUrl,
    tags: project.tags,
    category: project.category,
    image: project.image,
    status: project.status,
    visibility: resolveProjectVisibility(project.visibility),
    order: project.order ?? 0,
    detailed_description: project.detailedDescription,
    screenshots: project.screenshots || [],
    tech_stack: project.techStack || [],
    features: project.features || [],
    challenges: project.challenges || [],
    timeline: project.timeline || [],
    start_date: project.startDate,
    duration: project.duration,
    show_gallery: project.showGallery,
    show_overview: project.showOverview,
    show_tech_stack: project.showTechStack,
    show_challenges: project.showChallenges,
    show_timeline: project.showTimeline,
  };
};

export const mapSupabaseProjectToProject = (supabaseProject: SupabaseProject): Project => {
  return {
    id: supabaseProject.id,
    title: supabaseProject.title,
    description: supabaseProject.description,
    liveUrl: supabaseProject.live_url,
    githubUrl: supabaseProject.github_url,
    tags: supabaseProject.tags,
    category: supabaseProject.category,
    image: supabaseProject.image,
    status: supabaseProject.status,
    visibility: resolveProjectVisibility(supabaseProject.visibility),
    order: supabaseProject.order,
    detailedDescription: supabaseProject.detailed_description,
    screenshots: supabaseProject.screenshots,
    techStack: supabaseProject.tech_stack,
    features: supabaseProject.features,
    challenges: supabaseProject.challenges,
    timeline: supabaseProject.timeline,
    startDate: supabaseProject.start_date,
    duration: supabaseProject.duration,
    showGallery: supabaseProject.show_gallery,
    showOverview: supabaseProject.show_overview,
    showTechStack: supabaseProject.show_tech_stack,
    showChallenges: supabaseProject.show_challenges,
    showTimeline: supabaseProject.show_timeline,
  };
};

// 存储服务接口
export interface StorageService {
  loadProjects(): Promise<Project[]>;
  saveProjects(projects: Project[]): Promise<void>;
  saveProjectsBatch(projects: Project[]): Promise<void>;
  loadProjectDrafts(): Promise<ProjectDraft[]>;
  saveProjectDraft(draft: ProjectDraft): Promise<void>;
  deleteProjectDraft(id: string): Promise<void>;
  migrateFromLocalStorage(): Promise<void>;
}

// 混合存储实现：Supabase 优先，localStorage 降级
class HybridStorage implements StorageService {
  private readonly STORAGE_KEY = 'projects';
  private readonly DRAFT_STORAGE_KEY = 'project_drafts';
  private readonly MIGRATION_KEY = 'supabase_migrated';

  // 将 Project 转换为 Supabase 格式
  private projectToSupabase(project: Project): SupabaseProjectWritePayload {
    return mapProjectToSupabasePayload(project);
  }

  // 将 Supabase 格式转换为 Project
  private supabaseToProject(supabaseProject: SupabaseProject): Project {
    return mapSupabaseProjectToProject(supabaseProject);
  }

  private projectDraftToSupabase(
    draft: ProjectDraft
  ): Omit<SupabaseProjectDraft, 'created_at' | 'updated_at'> {
    return {
      id: draft.id,
      title: draft.title,
      source_url: draft.sourceUrl,
      source_type: draft.sourceType,
      payload: draft.payload as unknown as Record<string, unknown>,
    };
  }

  private supabaseToProjectDraft(supabaseDraft: SupabaseProjectDraft): ProjectDraft {
    const payload = sanitizeProjectFormData(supabaseDraft.payload);
    return {
      id: supabaseDraft.id,
      title: supabaseDraft.title,
      sourceUrl: supabaseDraft.source_url,
      sourceType: supabaseDraft.source_type,
      payload,
      updatedAt: supabaseDraft.updated_at || new Date(0).toISOString(),
    };
  }

  // 检查是否已有云端数据
  private async hasCloudData(): Promise<boolean> {
    if (!isSupabaseConfigured()) return false;

    try {
      const { data, error } = await supabase.from('projects').select('id').limit(1);

      if (error) throw error;
      return (data?.length || 0) > 0;
    } catch (error) {
      logger.warn('检查云端数据失败:', error);
      return false;
    }
  }

  // 从 localStorage 加载数据
  private loadFromLocalStorage(): Project[] {
    try {
      const saved = safeLocalStorage.getItem(this.STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      logger.warn('从 localStorage 加载数据失败:', error);
      return [];
    }
  }

  private loadDraftsFromLocalStorage(): ProjectDraft[] {
    const saved = safeLocalStorage.getItem(this.DRAFT_STORAGE_KEY);
    return deserializeProjectDrafts(saved);
  }

  getLocalProjectsSnapshot(): Project[] {
    return this.loadFromLocalStorage();
  }

  getLocalProjectDraftsSnapshot(): ProjectDraft[] {
    return this.loadDraftsFromLocalStorage();
  }

  // 保存到 localStorage
  private saveToLocalStorage(projects: Project[]): void {
    try {
      safeLocalStorage.setItem(this.STORAGE_KEY, JSON.stringify(projects));
    } catch (error) {
      logger.warn('保存到 localStorage 失败:', error);
    }
  }

  private saveDraftsToLocalStorage(drafts: ProjectDraft[]): void {
    try {
      safeLocalStorage.setItem(this.DRAFT_STORAGE_KEY, serializeProjectDrafts(drafts));
    } catch (error) {
      logger.warn('保存草稿到 localStorage 失败:', error);
    }
  }

  // 从 Supabase 加载数据
  private async loadFromSupabase(): Promise<Project[]> {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase 未配置');
    }

    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('order', { ascending: true });

    if (error) {
      if (!isProjectsOrderColumnMissingError(error)) {
        throw error;
      }

      logger.warn('projects 表缺少 order 列，改为按 created_at 回退加载');

      const { data: legacyData, error: legacyError } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: true })
        .order('id', { ascending: true });

      if (legacyError) throw legacyError;

      return (legacyData || []).map((item) => this.supabaseToProject(item));
    }

    return (data || []).map((item) => this.supabaseToProject(item));
  }

  private async loadDraftsFromSupabase(): Promise<ProjectDraft[]> {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase 未配置');
    }

    const { data, error } = await supabase
      .from('project_drafts')
      .select('*')
      .order('updated_at', { ascending: false });

    if (error) throw error;

    return (data || []).map((item) => this.supabaseToProjectDraft(item));
  }

  // 保存到 Supabase
  private async saveToSupabase(projects: Project[]): Promise<void> {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase 未配置');
    }

    if (projects.length === 0) {
      // 如果没有项目，清空表
      const { error: deleteError } = await supabase.from('projects').delete().neq('id', '');

      if (deleteError) throw deleteError;
      return;
    }

    // 使用 upsert 策略：如果存在则更新，不存在则插入
    const supabaseProjects = projects.map((p) => this.projectToSupabase(p));
    const { error: upsertError } = await supabase.from('projects').upsert(supabaseProjects, {
      onConflict: 'id',
      ignoreDuplicates: false,
    });

    if (upsertError) {
      if (!isProjectsOrderColumnMissingError(upsertError)) {
        throw upsertError;
      }

      logger.warn('projects 表缺少 order 列，改为去除 order 字段后重试保存');

      const legacyProjects = supabaseProjects.map((project) => stripOrderFromSupabaseProject(project));
      const { error: legacyUpsertError } = await supabase.from('projects').upsert(legacyProjects, {
        onConflict: 'id',
        ignoreDuplicates: false,
      });

      if (legacyUpsertError) throw legacyUpsertError;
    }
  }

  private async saveDraftToSupabase(draft: ProjectDraft): Promise<void> {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase 未配置');
    }

    const supabaseDraft = this.projectDraftToSupabase(draft);
    const { error } = await supabase.from('project_drafts').upsert(supabaseDraft, {
      onConflict: 'id',
      ignoreDuplicates: false,
    });

    if (error) throw error;
  }

  private async deleteDraftFromSupabase(id: string): Promise<void> {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase 未配置');
    }

    const { error } = await supabase.from('project_drafts').delete().eq('id', id);
    if (error) throw error;
  }

  // 加载项目数据
  async loadProjects(): Promise<Project[]> {
    // 如果 Supabase 已配置，优先从云端加载
    if (isSupabaseConfigured()) {
      try {
        const projects = await this.loadFromSupabase();
        // 同步到本地作为备份
        this.saveToLocalStorage(projects);
        return projects;
      } catch (error) {
        logger.warn('从 Supabase 加载失败，降级到 localStorage:', error);
        return this.loadFromLocalStorage();
      }
    }

    // 否则从 localStorage 加载
    return this.loadFromLocalStorage();
  }

  // 保存项目数据
  async saveProjects(projects: Project[]): Promise<void> {
    // 总是先保存到本地（快速响应）
    this.saveToLocalStorage(projects);

    // 如果 Supabase 已配置，尝试同步到云端
    if (isSupabaseConfigured()) {
      try {
        await this.saveToSupabase(projects);
        logger.log('数据已同步到 Supabase');
      } catch (error) {
        logger.warn('同步到 Supabase 失败，数据已保存到本地:', error);
        // 不抛出错误，因为本地保存已成功
      }
    }
  }

  async saveProjectsBatch(projects: Project[]): Promise<void> {
    await this.saveProjects(projects);
  }

  async loadProjectDrafts(): Promise<ProjectDraft[]> {
    if (isSupabaseConfigured()) {
      try {
        const drafts = await this.loadDraftsFromSupabase();
        this.saveDraftsToLocalStorage(drafts);
        return drafts;
      } catch (error) {
        logger.warn('从 Supabase 加载草稿失败，降级到 localStorage:', error);
        return this.loadDraftsFromLocalStorage();
      }
    }

    return this.loadDraftsFromLocalStorage();
  }

  async saveProjectDraft(draft: ProjectDraft): Promise<void> {
    const currentDrafts = this.loadDraftsFromLocalStorage();
    const nextDrafts = [draft, ...currentDrafts.filter((item) => item.id !== draft.id)].sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );

    this.saveDraftsToLocalStorage(nextDrafts);

    if (isSupabaseConfigured()) {
      try {
        await this.saveDraftToSupabase(draft);
      } catch (error) {
        logger.warn('同步草稿到 Supabase 失败，已保存在本地:', error);
      }
    }
  }

  async deleteProjectDraft(id: string): Promise<void> {
    const nextDrafts = this.loadDraftsFromLocalStorage().filter((item) => item.id !== id);
    this.saveDraftsToLocalStorage(nextDrafts);

    if (isSupabaseConfigured()) {
      try {
        await this.deleteDraftFromSupabase(id);
      } catch (error) {
        logger.warn('删除云端草稿失败，本地已删除:', error);
      }
    }
  }

  // 从 localStorage 迁移数据到 Supabase
  async migrateFromLocalStorage(): Promise<void> {
    // 检查是否已迁移
    if (safeLocalStorage.getItem(this.MIGRATION_KEY) === 'true') {
      return;
    }

    // 检查是否有 Supabase 配置
    if (!isSupabaseConfigured()) {
      return;
    }

    try {
      // 检查是否已有云端数据
      if (await this.hasCloudData()) {
        logger.log('云端已有数据，跳过迁移');
        safeLocalStorage.setItem(this.MIGRATION_KEY, 'true');
        return;
      }

      const localProjects = this.loadFromLocalStorage();

      if (localProjects.length > 0) {
        logger.log(`开始迁移 ${localProjects.length} 个项目到 Supabase...`);
        await this.saveToSupabase(localProjects);
        logger.log('数据迁移完成');

        // 标记已迁移
        safeLocalStorage.setItem(this.MIGRATION_KEY, 'true');
      }
    } catch (error) {
      logger.warn('数据迁移失败:', error);
      // 不抛出错误，继续使用本地存储
    }
  }
}

// 创建存储服务实例
export const storageService = new HybridStorage();

// 便捷函数
export const loadProjects = () => storageService.loadProjects();
export const saveProjects = (projects: Project[]) => storageService.saveProjects(projects);
export const saveProjectsBatch = (projects: Project[]) => storageService.saveProjectsBatch(projects);
export const loadProjectDrafts = () => storageService.loadProjectDrafts();
export const saveProjectDraft = (draft: ProjectDraft) => storageService.saveProjectDraft(draft);
export const deleteProjectDraft = (id: string) => storageService.deleteProjectDraft(id);
export const migrateFromLocalStorage = () => storageService.migrateFromLocalStorage();
export const getLocalProjectsSnapshot = () => storageService.getLocalProjectsSnapshot();
export const getLocalProjectDraftsSnapshot = () => storageService.getLocalProjectDraftsSnapshot();

// ============================================
// 用户设置管理
// ============================================

// 用户设置类型定义
export interface UserSettings {
  showImages: boolean;
  theme: string;
  aiEnabled: boolean;
  aiBaseUrl: string;
  aiModel: string;
  aiApiKey: string;
}

// Supabase 设置类型
interface SupabaseSettings {
  id: string;
  show_images: boolean;
  theme: string;
  ai_enabled: boolean;
  ai_base_url: string;
  ai_model: string;
  ai_api_key: string;
  created_at?: string;
  updated_at?: string;
}

// 设置管理类
class SettingsManager {
  private readonly SETTINGS_ID = 'default';
  private readonly SHOW_IMAGES_KEY = 'showImages';
  private readonly THEME_KEY = 'navigator-theme';
  private readonly AI_ENABLED_KEY = 'navigator-ai-enabled';
  private readonly AI_BASE_URL_KEY = 'navigator-ai-base-url';
  private readonly AI_MODEL_KEY = 'navigator-ai-model';
  private readonly AI_API_KEY_KEY = 'navigator-ai-api-key';

  // 从 Supabase 加载设置
  private async loadFromSupabase(): Promise<UserSettings | null> {
    if (!isSupabaseConfigured()) {
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('user_settings')
        .select('*')
        .eq('id', this.SETTINGS_ID)
        .single();

      if (error) {
        // 如果记录不存在，返回 null
        if (error.code === 'PGRST116') {
          return null;
        }
        throw error;
      }

      return {
        showImages: data.show_images,
        theme: data.theme,
        aiEnabled: Boolean(data.ai_enabled),
        aiBaseUrl: typeof data.ai_base_url === 'string' ? data.ai_base_url : '',
        aiModel: typeof data.ai_model === 'string' && data.ai_model.trim() ? data.ai_model : 'gpt-4.1-mini',
        aiApiKey: typeof data.ai_api_key === 'string' ? data.ai_api_key : '',
      };
    } catch (error) {
      logger.warn('从 Supabase 加载设置失败:', error);
      return null;
    }
  }

  private async saveToSupabase(settings: UserSettings): Promise<void> {
    if (!isSupabaseConfigured()) {
      return;
    }

    try {
      const supabaseSettings: Omit<SupabaseSettings, 'created_at' | 'updated_at'> = {
        id: this.SETTINGS_ID,
        show_images: settings.showImages,
        theme: settings.theme,
        ai_enabled: settings.aiEnabled,
        ai_base_url: settings.aiBaseUrl,
        ai_model: settings.aiModel,
        ai_api_key: settings.aiApiKey,
      };

      const { error } = await supabase.from('user_settings').upsert(supabaseSettings, {
        onConflict: 'id',
        ignoreDuplicates: false,
      });

      if (error) throw error;
    } catch (error) {
      throw new Error(`同步设置到 Supabase 失败: ${error}`);
    }
  }

  // 从 localStorage 加载设置
  private loadFromLocalStorage(): UserSettings {
    const showImages = safeLocalStorage.getItem(this.SHOW_IMAGES_KEY);
    const theme = safeLocalStorage.getItem(this.THEME_KEY);
    const aiEnabled = safeLocalStorage.getItem(this.AI_ENABLED_KEY);
    const aiBaseUrl = safeLocalStorage.getItem(this.AI_BASE_URL_KEY);
    const aiModel = safeLocalStorage.getItem(this.AI_MODEL_KEY);
    const aiApiKey = safeLocalStorage.getItem(this.AI_API_KEY_KEY);

    return {
      showImages: showImages !== null ? showImages === 'true' : true,
      theme: theme || 'default',
      aiEnabled: aiEnabled === 'true',
      aiBaseUrl: aiBaseUrl || '',
      aiModel: aiModel || 'gpt-4.1-mini',
      aiApiKey: aiApiKey || '',
    };
  }

  getLocalSettingsSnapshot(): UserSettings {
    return this.loadFromLocalStorage();
  }

  // 保存设置到 localStorage
  private saveToLocalStorage(settings: UserSettings): void {
    safeLocalStorage.setItem(this.SHOW_IMAGES_KEY, String(settings.showImages));
    safeLocalStorage.setItem(this.THEME_KEY, settings.theme);
    safeLocalStorage.setItem(this.AI_ENABLED_KEY, String(settings.aiEnabled));
    safeLocalStorage.setItem(this.AI_BASE_URL_KEY, settings.aiBaseUrl);
    safeLocalStorage.setItem(this.AI_MODEL_KEY, settings.aiModel);
    safeLocalStorage.setItem(this.AI_API_KEY_KEY, settings.aiApiKey);
  }

  // 加载设置（优先从 Supabase）
  async loadSettings(): Promise<UserSettings> {
    if (isSupabaseConfigured()) {
      try {
        const cloudSettings = await this.loadFromSupabase();
        if (cloudSettings) {
          // 同步到本地作为备份
          this.saveToLocalStorage(cloudSettings);
          return cloudSettings;
        }
      } catch (error) {
        logger.warn('从 Supabase 加载设置失败，使用本地设置:', error);
      }
    }

    // 降级到 localStorage
    return this.loadFromLocalStorage();
  }

  // 保存设置（同时保存到本地和云端）
  async saveSettings(settings: UserSettings): Promise<void> {
    // 先保存到本地（快速响应）
    this.saveToLocalStorage(settings);

    // 异步同步到 Supabase
    if (isSupabaseConfigured()) {
      await this.saveToSupabase(settings);
    }
  }

  // 保存单个设置项
  async saveSetting(key: keyof UserSettings, value: boolean | string): Promise<void> {
    const currentSettings = this.loadFromLocalStorage();
    const newSettings = { ...currentSettings, [key]: value };
    await this.saveSettings(newSettings);
  }
}

// 创建设置管理器实例
export const settingsManager = new SettingsManager();

// 便捷函数
export const loadSettings = () => settingsManager.loadSettings();
export const saveSettings = (settings: UserSettings) => settingsManager.saveSettings(settings);
export const saveSetting = (key: keyof UserSettings, value: boolean | string) =>
  settingsManager.saveSetting(key, value);
export const getLocalSettingsSnapshot = () => settingsManager.getLocalSettingsSnapshot();
