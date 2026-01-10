import { supabase, isSupabaseConfigured, SupabaseProject } from './supabase';
import { safeLocalStorage } from './storageDetector';
import type { Project, TechStackItem, Challenge, TimelineEvent } from '@/types/project';

export type { Project, TechStackItem, Challenge, TimelineEvent };

// 存储服务接口
export interface StorageService {
  loadProjects(): Promise<Project[]>;
  saveProjects(projects: Project[]): Promise<void>;
  migrateFromLocalStorage(): Promise<void>;
}

// 混合存储实现：Supabase 优先，localStorage 降级
class HybridStorage implements StorageService {
  private readonly STORAGE_KEY = 'projects';
  private readonly MIGRATION_KEY = 'supabase_migrated';

  // 将 Project 转换为 Supabase 格式
  private projectToSupabase(project: Project): Omit<SupabaseProject, 'created_at' | 'updated_at'> {
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
  }

  // 将 Supabase 格式转换为 Project
  private supabaseToProject(supabaseProject: SupabaseProject): Project {
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
  }

  // 检查是否已有云端数据
  private async hasCloudData(): Promise<boolean> {
    if (!isSupabaseConfigured()) return false;

    try {
      const { data, error } = await supabase.from('projects').select('id').limit(1);

      if (error) throw error;
      return (data?.length || 0) > 0;
    } catch (error) {
      console.warn('检查云端数据失败:', error);
      return false;
    }
  }

  // 从 localStorage 加载数据
  private loadFromLocalStorage(): Project[] {
    try {
      const saved = safeLocalStorage.getItem(this.STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.warn('从 localStorage 加载数据失败:', error);
      return [];
    }
  }

  getLocalProjectsSnapshot(): Project[] {
    return this.loadFromLocalStorage();
  }

  // 保存到 localStorage
  private saveToLocalStorage(projects: Project[]): void {
    try {
      safeLocalStorage.setItem(this.STORAGE_KEY, JSON.stringify(projects));
    } catch (error) {
      console.warn('保存到 localStorage 失败:', error);
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
      .order('created_at', { ascending: false });

    if (error) throw error;

    return (data || []).map((item) => this.supabaseToProject(item));
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

    if (upsertError) throw upsertError;
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
        console.warn('从 Supabase 加载失败，降级到 localStorage:', error);
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
        console.log('数据已同步到 Supabase');
      } catch (error) {
        console.warn('同步到 Supabase 失败，数据已保存到本地:', error);
        // 不抛出错误，因为本地保存已成功
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
        console.log('云端已有数据，跳过迁移');
        safeLocalStorage.setItem(this.MIGRATION_KEY, 'true');
        return;
      }

      // 获取本地数据
      const localProjects = this.loadFromLocalStorage();

      if (localProjects.length > 0) {
        console.log(`开始迁移 ${localProjects.length} 个项目到 Supabase...`);
        await this.saveToSupabase(localProjects);
        console.log('数据迁移完成');

        // 标记已迁移
        safeLocalStorage.setItem(this.MIGRATION_KEY, 'true');
      }
    } catch (error) {
      console.warn('数据迁移失败:', error);
      // 不抛出错误，继续使用本地存储
    }
  }
}

// 创建存储服务实例
export const storageService = new HybridStorage();

// 便捷函数
export const loadProjects = () => storageService.loadProjects();
export const saveProjects = (projects: Project[]) => storageService.saveProjects(projects);
export const migrateFromLocalStorage = () => storageService.migrateFromLocalStorage();
export const getLocalProjectsSnapshot = () => storageService.getLocalProjectsSnapshot();

// ============================================
// 用户设置管理
// ============================================

// 用户设置类型定义
export interface UserSettings {
  showImages: boolean;
  theme: string;
}

// Supabase 设置类型
interface SupabaseSettings {
  id: string;
  show_images: boolean;
  theme: string;
  created_at?: string;
  updated_at?: string;
}

// 设置管理类
class SettingsManager {
  private readonly SETTINGS_ID = 'default';
  private readonly SHOW_IMAGES_KEY = 'showImages';
  private readonly THEME_KEY = 'navigator-theme';

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
      };
    } catch (error) {
      console.warn('从 Supabase 加载设置失败:', error);
      return null;
    }
  }

  // 保存设置到 Supabase
  private async saveToSupabase(settings: UserSettings): Promise<void> {
    if (!isSupabaseConfigured()) {
      return;
    }

    try {
      const supabaseSettings: Omit<SupabaseSettings, 'created_at' | 'updated_at'> = {
        id: this.SETTINGS_ID,
        show_images: settings.showImages,
        theme: settings.theme,
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

    return {
      showImages: showImages !== null ? showImages === 'true' : true,
      theme: theme || 'default',
    };
  }

  getLocalSettingsSnapshot(): UserSettings {
    return this.loadFromLocalStorage();
  }

  // 保存设置到 localStorage
  private saveToLocalStorage(settings: UserSettings): void {
    safeLocalStorage.setItem(this.SHOW_IMAGES_KEY, String(settings.showImages));
    safeLocalStorage.setItem(this.THEME_KEY, settings.theme);
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
        console.warn('从 Supabase 加载设置失败，使用本地设置:', error);
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
