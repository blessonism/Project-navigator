import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import {
  getLocalProjectsSnapshot,
  getLocalSettingsSnapshot,
  loadProjects,
  loadProjectDrafts as fetchProjectDrafts,
  saveProjects,
  saveProjectsBatch,
  saveProjectDraft as persistProjectDraft,
  deleteProjectDraft as removeProjectDraft,
  loadSettings,
  saveSettings,
  saveSetting,
} from '@/lib/storage';
import { safeSessionStorage } from '@/lib/storageDetector';
import { importProjectMetadata, ImportClientError, listAiModels } from '@/lib/importClient';
import {
  createBatchImportPreview,
  createProjectDraft,
  detectImportSourceType,
  isMeaningfulFormData,
  mergeImportPreviewToFormData,
} from '@/lib/projectImport';
import {
  filterPublicProjects,
  getPublicProjects,
  resolveProjectVisibility,
} from '@/lib/projectVisibility';
import { logger } from '@/lib/logger';
import { defaultProjects } from '@/constants/defaultProjects';
import type {
  BatchImportPreview,
  Challenge,
  FrontendAiConfig,
  ImportPreview,
  ImportSourceType,
  Project,
  ProjectDraft,
  ProjectFormData,
  TimelineEvent,
} from '@/types/project';

const emptyFormData: ProjectFormData = {
  title: '',
  description: '',
  liveUrl: '',
  githubUrl: '',
  tags: '',
  category: 'web',
  image: '',
  status: 'live',
  visibility: 'public',
  detailedDescription: '',
  screenshots: '',
  features: '',
  challenges: '',
  startDate: '',
  duration: '',
  timelineData: '',
  showGallery: true,
  showOverview: true,
  showTechStack: true,
  showChallenges: true,
  showTimeline: true,
};

const normalizeProjectOrder = (items: Project[]): Project[] =>
  items.map((project, index) => ({ ...project, order: index }));

const IMPORT_PASSCODE_STORAGE_KEY = 'navigator_import_session_passcode';
const IMPORT_AI_CONFIG_STORAGE_KEY = 'navigator_import_ai_config';
const AUTO_SAVE_INTERVAL_MS = 15000;

const defaultFrontendAiConfig: FrontendAiConfig = {
  enabled: false,
  apiKey: '',
  baseUrl: '',
  model: 'gpt-4.1-mini',
};

const normalizeFrontendAiConfig = (config: FrontendAiConfig): FrontendAiConfig => ({
  enabled: Boolean(config.enabled),
  apiKey: config.apiKey.trim(),
  baseUrl: config.baseUrl.trim(),
  model: config.model.trim() || 'gpt-4.1-mini',
});

const arrayMove = <T,>(items: T[], fromIndex: number, toIndex: number): T[] => {
  const next = [...items];
  const [moved] = next.splice(fromIndex, 1);
  if (moved === undefined) {
    return next;
  }
  next.splice(toIndex, 0, moved);
  return next;
};

const loadFrontendAiConfigFromSession = (): FrontendAiConfig => {
  const raw = safeSessionStorage.getItem(IMPORT_AI_CONFIG_STORAGE_KEY);
  if (!raw) {
    return defaultFrontendAiConfig;
  }

  try {
    const parsed = JSON.parse(raw) as Partial<FrontendAiConfig>;
    return {
      enabled: Boolean(parsed.enabled),
      apiKey: typeof parsed.apiKey === 'string' ? parsed.apiKey : '',
      baseUrl: typeof parsed.baseUrl === 'string' ? parsed.baseUrl : '',
      model: typeof parsed.model === 'string' && parsed.model.trim() ? parsed.model : 'gpt-4.1-mini',
    };
  } catch {
    return defaultFrontendAiConfig;
  }
};

const resolveInitialFrontendAiConfig = (
  localSettings: ReturnType<typeof getLocalSettingsSnapshot>
): FrontendAiConfig => {
  const sessionConfig = loadFrontendAiConfigFromSession();

  return {
    enabled: localSettings.aiEnabled,
    apiKey: localSettings.aiApiKey || sessionConfig.apiKey,
    baseUrl: localSettings.aiBaseUrl || sessionConfig.baseUrl,
    model: localSettings.aiModel || sessionConfig.model || 'gpt-4.1-mini',
  };
};

export interface UseProjectsReturn {
  projects: Project[];
  publicProjects: Project[];
  filteredProjects: Project[];
  isProjectsLoading: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  showImages: boolean;
  setShowImages: (show: boolean) => void;

  isDialogOpen: boolean;
  setIsDialogOpen: (open: boolean) => void;
  editingProject: Project | null;
  formData: ProjectFormData;
  setFormData: (data: ProjectFormData) => void;
  handleAddProject: () => void;
  handleEditProject: (project: Project) => void;
  handleSaveProject: () => boolean;
  handleSaveDraft: () => Promise<boolean>;

  drafts: ProjectDraft[];
  currentDraftId: string | null;
  listDrafts: () => Promise<ProjectDraft[]>;
  restoreDraft: (draftId: string) => Promise<boolean>;
  deleteDraft: (draftId: string) => Promise<void>;

  importPreview: ImportPreview | null;
  importError: string;
  isImporting: boolean;
  importSessionPasscode: string;
  setImportSessionPasscode: (value: string) => void;
  frontendAiConfig: FrontendAiConfig;
  setFrontendAiConfig: (next: FrontendAiConfig) => void;
  saveAiSettings: () => Promise<boolean>;
  isAiSettingsDirty: boolean;
  isSavingAiSettings: boolean;
  aiModelOptions: string[];
  isLoadingAiModels: boolean;
  loadAiModels: () => Promise<string[]>;
  testAiConfig: () => Promise<boolean>;
  importFromUrl: (sourceUrl: string, sourceType?: ImportSourceType) => Promise<boolean>;

  batchImportPreview: BatchImportPreview | null;
  analyzeBatchImport: (jsonText: string) => BatchImportPreview;
  importBatch: () => Promise<{ imported: number; skipped: number; invalid: number }>;
  clearBatchImportPreview: () => void;

  deleteProjectId: string | null;
  setDeleteProjectId: (id: string | null) => void;
  handleDeleteProject: (id: string) => void;
  confirmDelete: () => void;
  reorderProjects: (activeId: string, overId: string) => void;

  selectedProject: Project | null;
  setSelectedProject: (project: Project | null) => void;
  isDetailDialogOpen: boolean;
  setIsDetailDialogOpen: (open: boolean) => void;

  getStatusColor: (status: string) => string;
}

export function useProjects(): UseProjectsReturn {
  const { toast } = useToast();
  const [isInitialized, setIsInitialized] = useState(false);
  const hasImageSettingToast = useRef(false);
  const initialSettings = useMemo(() => getLocalSettingsSnapshot(), []);
  const initialProjects = useMemo(() => getLocalProjectsSnapshot(), []);

  const [projects, setProjects] = useState<Project[]>(() =>
    initialProjects.length > 0 ? initialProjects : []
  );
  const [isProjectsLoading, setIsProjectsLoading] = useState(initialProjects.length === 0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showImages, setShowImagesState] = useState(() => initialSettings.showImages);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState<ProjectFormData>(emptyFormData);
  const [drafts, setDrafts] = useState<ProjectDraft[]>([]);
  const [currentDraftId, setCurrentDraftId] = useState<string | null>(null);
  const [importPreview, setImportPreview] = useState<ImportPreview | null>(null);
  const [importError, setImportError] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  const [importSessionPasscodeState, setImportSessionPasscodeState] = useState(() =>
    safeSessionStorage.getItem(IMPORT_PASSCODE_STORAGE_KEY) || ''
  );
  const [frontendAiConfigState, setFrontendAiConfigState] = useState<FrontendAiConfig>(() =>
    resolveInitialFrontendAiConfig(initialSettings)
  );
  const [savedFrontendAiConfig, setSavedFrontendAiConfig] = useState<FrontendAiConfig>(() =>
    normalizeFrontendAiConfig(resolveInitialFrontendAiConfig(initialSettings))
  );
  const [isSavingAiSettings, setIsSavingAiSettings] = useState(false);
  const [aiModelOptions, setAiModelOptions] = useState<string[]>([]);
  const [isLoadingAiModels, setIsLoadingAiModels] = useState(false);
  const [batchImportPreview, setBatchImportPreview] = useState<BatchImportPreview | null>(null);
  const [deleteProjectId, setDeleteProjectId] = useState<string | null>(null);

  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);

  const publicProjects = useMemo(() => getPublicProjects(projects), [projects]);
  const filteredProjects = useMemo(() => {
    return filterPublicProjects(projects, searchQuery, selectedCategory);
  }, [projects, searchQuery, selectedCategory]);

  const normalizedFrontendAiConfig = useMemo(
    () => normalizeFrontendAiConfig(frontendAiConfigState),
    [frontendAiConfigState]
  );
  const isAiSettingsDirty = useMemo(() => {
    const current = normalizedFrontendAiConfig;
    const saved = normalizeFrontendAiConfig(savedFrontendAiConfig);

    return (
      current.enabled !== saved.enabled ||
      current.apiKey !== saved.apiKey ||
      current.baseUrl !== saved.baseUrl ||
      current.model !== saved.model
    );
  }, [normalizedFrontendAiConfig, savedFrontendAiConfig]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const projectsData = await loadProjects();

        const nextProjects = projectsData.length > 0 ? projectsData : defaultProjects;
        setProjects(normalizeProjectOrder(nextProjects));

        const settings = await loadSettings();
        setShowImagesState(settings.showImages);
        setFrontendAiConfigState((current) => ({
          ...current,
          enabled: settings.aiEnabled,
          apiKey: settings.aiApiKey || current.apiKey,
          baseUrl: settings.aiBaseUrl,
          model: settings.aiModel || 'gpt-4.1-mini',
        }));
        setSavedFrontendAiConfig({
          enabled: settings.aiEnabled,
          apiKey: settings.aiApiKey || '',
          baseUrl: settings.aiBaseUrl,
          model: settings.aiModel || 'gpt-4.1-mini',
        });

        const draftsData = await fetchProjectDrafts();
        setDrafts(draftsData);
      } catch (error) {
        logger.error('加载数据失败:', error);
        setProjects(normalizeProjectOrder(defaultProjects));
        setDrafts([]);
      } finally {
        setIsProjectsLoading(false);
        setIsInitialized(true);
      }
    };

    loadData();
  }, []);

  const persistProjects = useCallback(async (nextProjects: Project[]) => {
    try {
      await saveProjects(nextProjects);
    } catch (error) {
      logger.error('保存项目数据失败:', error);
    }
  }, []);

  const listDrafts = useCallback(async (): Promise<ProjectDraft[]> => {
    try {
      const draftList = await fetchProjectDrafts();
      setDrafts(draftList);
      return draftList;
    } catch (error) {
      logger.error('加载草稿失败:', error);
      return [];
    }
  }, []);

  const persistDraft = useCallback(
    async (options?: { silent?: boolean }): Promise<boolean> => {
      if (!isMeaningfulFormData(formData)) {
        return false;
      }

      try {
        const draft = createProjectDraft({
          draftId: currentDraftId || undefined,
          formData,
          sourceUrl: importPreview?.sourceUrl,
          sourceType: importPreview?.sourceType,
        });

        await persistProjectDraft(draft);

        setCurrentDraftId(draft.id);
        setDrafts((prev) =>
          [draft, ...prev.filter((item) => item.id !== draft.id)].sort(
            (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          )
        );

        if (!options?.silent) {
          toast({
            title: '草稿已保存',
            description: `已保存草稿：${draft.title}`,
          });
        }

        return true;
      } catch (error) {
        logger.error('保存草稿失败:', error);
        if (!options?.silent) {
          toast({
            title: '草稿保存失败',
            description: '请稍后重试',
            variant: 'destructive',
          });
        }
        return false;
      }
    },
    [currentDraftId, formData, importPreview, toast]
  );

  const handleSaveDraft = useCallback(async (): Promise<boolean> => {
    return persistDraft();
  }, [persistDraft]);

  const restoreDraft = useCallback(
    async (draftId: string): Promise<boolean> => {
      const cachedDraft = drafts.find((item) => item.id === draftId);
      if (!cachedDraft) {
        const latestDrafts = await listDrafts();
        const matched = latestDrafts.find((item) => item.id === draftId);
        if (!matched) {
          toast({
            title: '草稿不存在',
            description: '该草稿可能已被删除',
            variant: 'destructive',
          });
          return false;
        }
        setFormData(matched.payload);
        setCurrentDraftId(matched.id);
        setEditingProject(null);
        setImportPreview(
          matched.sourceUrl
            ? {
                sourceUrl: matched.sourceUrl,
                sourceType: matched.sourceType,
                normalizedProject: {},
                rawMetadata: {},
                warnings: [],
                confidence: 0,
              }
            : null
        );
        setIsDialogOpen(true);
        return true;
      }

      setFormData(cachedDraft.payload);
      setCurrentDraftId(cachedDraft.id);
      setEditingProject(null);
      setImportPreview(
        cachedDraft.sourceUrl
          ? {
              sourceUrl: cachedDraft.sourceUrl,
              sourceType: cachedDraft.sourceType,
              normalizedProject: {},
              rawMetadata: {},
              warnings: [],
              confidence: 0,
            }
          : null
      );
      setIsDialogOpen(true);
      toast({
        title: '草稿已恢复',
        description: `已加载：${cachedDraft.title}`,
      });
      return true;
    },
    [drafts, listDrafts, toast]
  );

  const deleteDraft = useCallback(
    async (draftId: string) => {
      try {
        await removeProjectDraft(draftId);
        setDrafts((prev) => prev.filter((item) => item.id !== draftId));

        if (currentDraftId === draftId) {
          setCurrentDraftId(null);
        }
      } catch (error) {
        logger.error('删除草稿失败:', error);
        toast({
          title: '删除草稿失败',
          description: '请稍后重试',
          variant: 'destructive',
        });
      }
    },
    [currentDraftId, toast]
  );

  const setImportSessionPasscode = useCallback((value: string) => {
    setImportSessionPasscodeState(value);
    if (value.trim()) {
      safeSessionStorage.setItem(IMPORT_PASSCODE_STORAGE_KEY, value.trim());
    } else {
      safeSessionStorage.removeItem(IMPORT_PASSCODE_STORAGE_KEY);
    }
  }, []);

  const setFrontendAiConfig = useCallback((next: FrontendAiConfig) => {
    const normalized: FrontendAiConfig = {
      enabled: Boolean(next.enabled),
      apiKey: next.apiKey,
      baseUrl: next.baseUrl,
      model: next.model || 'gpt-4.1-mini',
    };

    setFrontendAiConfigState(normalized);
    safeSessionStorage.setItem(IMPORT_AI_CONFIG_STORAGE_KEY, JSON.stringify(normalized));
  }, []);

  const saveAiSettings = useCallback(async (): Promise<boolean> => {
    const configToSave = normalizeFrontendAiConfig(frontendAiConfigState);
    setIsSavingAiSettings(true);

    try {
      const currentSettings = getLocalSettingsSnapshot();
      await saveSettings({
        ...currentSettings,
        aiEnabled: configToSave.enabled,
        aiBaseUrl: configToSave.baseUrl,
        aiModel: configToSave.model,
        aiApiKey: configToSave.apiKey,
      });

      setFrontendAiConfigState(configToSave);
      setSavedFrontendAiConfig(configToSave);
      safeSessionStorage.setItem(IMPORT_AI_CONFIG_STORAGE_KEY, JSON.stringify(configToSave));

      toast({
        title: 'AI 配置已保存',
        description: '已同步到 Supabase',
      });
      return true;
    } catch (error) {
      logger.error('保存 AI 配置失败:', error);
      toast({
        title: 'AI 配置保存失败',
        description: '请稍后重试',
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsSavingAiSettings(false);
    }
  }, [frontendAiConfigState, toast]);

  const loadAiModels = useCallback(async (): Promise<string[]> => {
    if (!importSessionPasscodeState.trim()) {
      toast({
        title: '请先填写导入口令',
        description: '模型拉取依赖函数口令校验',
        variant: 'destructive',
      });
      return [];
    }

    if (frontendAiConfigState.enabled && !frontendAiConfigState.apiKey.trim()) {
      toast({
        title: '请先填写 AI API Key',
        description: '开启前端 AI 配置后，拉取模型需提供 API Key',
        variant: 'destructive',
      });
      return [];
    }

    setIsLoadingAiModels(true);
    try {
      const models = await listAiModels({
        sessionPasscode: importSessionPasscodeState,
        aiConfig: frontendAiConfigState,
      });

      setAiModelOptions(models);
      toast({
        title: '模型拉取成功',
        description: models.length > 0 ? `共 ${models.length} 个模型` : '当前返回空模型列表',
      });

      return models;
    } catch (error) {
      let message = '拉取模型失败，请稍后重试';
      if (error instanceof ImportClientError) {
        message = `${error.code}: ${error.message}`;
      } else if (error instanceof Error) {
        message = error.message;
      }

      toast({
        title: '模型拉取失败',
        description: message,
        variant: 'destructive',
      });
      return [];
    } finally {
      setIsLoadingAiModels(false);
    }
  }, [frontendAiConfigState, importSessionPasscodeState, toast]);

  const testAiConfig = useCallback(async (): Promise<boolean> => {
    const models = await loadAiModels();
    if (models.length === 0) {
      toast({
        title: '快速测试失败',
        description: '未能获取可用模型，请检查配置',
        variant: 'destructive',
      });
      return false;
    }

    const selectedModel = frontendAiConfigState.model.trim();
    if (selectedModel && !models.includes(selectedModel)) {
      toast({
        title: '快速测试通过（模型未命中）',
        description: `连接可用，但当前模型 ${selectedModel} 不在返回列表内`,
      });
      return true;
    }

    toast({
      title: '快速测试通过',
      description: selectedModel
        ? `当前模型 ${selectedModel} 可用`
        : '连接可用，可从列表中选择模型',
    });
    return true;
  }, [frontendAiConfigState.model, loadAiModels, toast]);

  const importFromUrl = useCallback(
    async (sourceUrl: string, sourceType?: ImportSourceType): Promise<boolean> => {
      const targetUrl = sourceUrl.trim();
      if (!targetUrl) {
        setImportError('请输入项目链接');
        return false;
      }

      if (frontendAiConfigState.enabled && !frontendAiConfigState.apiKey.trim()) {
        const message = '已开启前端 AI 配置，请填写 API Key';
        setImportError(message);
        toast({
          title: '导入失败',
          description: message,
          variant: 'destructive',
        });
        return false;
      }

      setIsImporting(true);
      setImportError('');

      try {
        const preview = await importProjectMetadata({
          sourceUrl: targetUrl,
          sourceType: sourceType || detectImportSourceType(targetUrl),
          sessionPasscode: importSessionPasscodeState,
          aiConfig: frontendAiConfigState,
        });

        setImportPreview(preview);
        setFormData((current) => mergeImportPreviewToFormData(current, preview));
        setEditingProject(null);
        setCurrentDraftId(null);
        setBatchImportPreview(null);
        setIsDialogOpen(true);

        toast({
          title: '导入成功',
          description: 'AI 已回填项目字段，请确认后保存或另存草稿',
        });
        return true;
      } catch (error) {
        let message = '导入失败，请稍后重试';
        if (error instanceof ImportClientError) {
          message = `${error.code}: ${error.message}`;
        } else if (error instanceof Error) {
          message = error.message;
        }

        setImportError(message);
        toast({
          title: '导入失败',
          description: message,
          variant: 'destructive',
        });
        return false;
      } finally {
        setIsImporting(false);
      }
    },
    [frontendAiConfigState, importSessionPasscodeState, toast]
  );

  const analyzeBatchImport = useCallback(
    (jsonText: string): BatchImportPreview => {
      const preview = createBatchImportPreview(jsonText, projects);
      setBatchImportPreview(preview);
      return preview;
    },
    [projects]
  );

  const clearBatchImportPreview = useCallback(() => {
    setBatchImportPreview(null);
  }, []);

  const importBatch = useCallback(async (): Promise<{
    imported: number;
    skipped: number;
    invalid: number;
  }> => {
    if (!batchImportPreview) {
      toast({
        title: '请先预览导入结果',
        description: '上传 JSON 后先执行预览，再执行导入',
        variant: 'destructive',
      });
      return { imported: 0, skipped: 0, invalid: 0 };
    }

    const validProjects = batchImportPreview.validItems
      .map((item) => item.project)
      .filter((item): item is Project => Boolean(item))
      .map((project, index) => ({
        ...project,
        order: projects.length + index,
      }));

    if (validProjects.length === 0) {
      toast({
        title: '没有可导入的数据',
        description: '请检查重复项或错误项后重试',
        variant: 'destructive',
      });
      return {
        imported: 0,
        skipped: batchImportPreview.duplicateItems.length,
        invalid: batchImportPreview.invalidItems.length,
      };
    }

    const nextProjects = normalizeProjectOrder([...projects, ...validProjects]);
    setProjects(nextProjects);
    await saveProjectsBatch(nextProjects);
    setBatchImportPreview(null);

    toast({
      title: '批量导入完成',
      description: `成功 ${validProjects.length} 条，跳过 ${batchImportPreview.duplicateItems.length} 条，错误 ${batchImportPreview.invalidItems.length} 条`,
    });

    return {
      imported: validProjects.length,
      skipped: batchImportPreview.duplicateItems.length,
      invalid: batchImportPreview.invalidItems.length,
    };
  }, [batchImportPreview, projects, toast]);

  const setShowImages = useCallback((value: boolean) => {
    setShowImagesState(value);
  }, []);

  useEffect(() => {
    if (!isInitialized) return;
    if (!hasImageSettingToast.current) {
      hasImageSettingToast.current = true;
      return;
    }

    const saveImageSetting = async () => {
      try {
        await saveSetting('showImages', showImages);
        toast({
          title: '设置已保存',
          description: '图片显示设置已同步到云端',
        });
      } catch (error) {
        logger.error('保存图片显示设置失败:', error);
        toast({
          title: '保存失败',
          description: '设置已保存到本地，但云端同步失败',
          variant: 'destructive',
        });
      }
    };

    saveImageSetting();
  }, [showImages, toast, isInitialized]);

  useEffect(() => {
    if (!isDialogOpen || editingProject) {
      return;
    }

    const handleWindowBlur = () => {
      void persistDraft({ silent: true });
    };

    const timer = window.setInterval(() => {
      void persistDraft({ silent: true });
    }, AUTO_SAVE_INTERVAL_MS);

    window.addEventListener('blur', handleWindowBlur);

    return () => {
      window.removeEventListener('blur', handleWindowBlur);
      window.clearInterval(timer);
    };
  }, [isDialogOpen, editingProject, persistDraft]);

  const handleAddProject = useCallback(() => {
    setEditingProject(null);
    setFormData(emptyFormData);
    setCurrentDraftId(null);
    setImportPreview(null);
    setImportError('');
    setIsDialogOpen(true);
  }, []);

  const handleEditProject = useCallback((project: Project) => {
    setEditingProject(project);
    setCurrentDraftId(null);
    setImportPreview(null);
    setImportError('');

    const timelineJson = project.timeline ? JSON.stringify(project.timeline, null, 2) : '';
    const challengesJson = project.challenges ? JSON.stringify(project.challenges, null, 2) : '';

    setFormData({
      title: project.title,
      description: project.description,
      liveUrl: project.liveUrl,
      githubUrl: project.githubUrl || '',
      tags: project.tags.join(', '),
      category: project.category,
      image: project.image || '',
      status: project.status,
      visibility: resolveProjectVisibility(project.visibility),
      detailedDescription: project.detailedDescription || '',
      screenshots: project.screenshots?.join(', ') || '',
      features: project.features?.join(', ') || '',
      challenges: challengesJson,
      startDate: project.startDate || '',
      duration: project.duration || '',
      timelineData: timelineJson,
      showGallery: project.showGallery !== false,
      showOverview: project.showOverview !== false,
      showTechStack: project.showTechStack !== false,
      showChallenges: project.showChallenges !== false,
      showTimeline: project.showTimeline !== false,
    });
    setIsDialogOpen(true);
  }, []);

  const handleSaveProject = useCallback((): boolean => {
    if (!formData.title || !formData.description || !formData.liveUrl) {
      alert('请填写必填项：标题、描述和在线链接');
      return false;
    }

    const tagsArray = formData.tags
      .split(',')
      .map((tag) => tag.trim())
      .filter((tag) => tag);
    const screenshotsArray = formData.screenshots
      .split(',')
      .map((url) => url.trim())
      .filter((url) => url);
    const featuresArray = formData.features
      .split(',')
      .map((f) => f.trim())
      .filter((f) => f);

    let timelineArray: TimelineEvent[] | undefined;
    if (formData.timelineData.trim()) {
      try {
        timelineArray = JSON.parse(formData.timelineData);
      } catch {
        alert('时间线数据格式错误，请检查 JSON 格式');
        return false;
      }
    }

    let challengesArray: Challenge[] | undefined;
    if (formData.challenges.trim()) {
      try {
        challengesArray = JSON.parse(formData.challenges);
      } catch {
        alert('挑战数据格式错误，请检查 JSON 格式');
        return false;
      }
    }

    const clearLinkedDraft = () => {
      if (!currentDraftId) return;
      void removeProjectDraft(currentDraftId);
      setDrafts((prev) => prev.filter((item) => item.id !== currentDraftId));
      setCurrentDraftId(null);
    };

    if (editingProject) {
      const updatedProjects = projects.map((p) =>
        p.id === editingProject.id
          ? {
              ...p,
              title: formData.title,
              description: formData.description,
              liveUrl: formData.liveUrl,
              githubUrl: formData.githubUrl || undefined,
              tags: tagsArray,
              category: formData.category,
              image: formData.image || undefined,
              status: formData.status,
              visibility: formData.visibility,
              detailedDescription: formData.detailedDescription || undefined,
              screenshots: screenshotsArray.length > 0 ? screenshotsArray : undefined,
              features: featuresArray.length > 0 ? featuresArray : undefined,
              challenges: challengesArray,
              startDate: formData.startDate || undefined,
              duration: formData.duration || undefined,
              timeline: timelineArray,
              showGallery: formData.showGallery,
              showOverview: formData.showOverview,
              showTechStack: formData.showTechStack,
              showChallenges: formData.showChallenges,
              showTimeline: formData.showTimeline,
            }
          : p
      );
      const normalizedProjects = normalizeProjectOrder(updatedProjects);
      setProjects(normalizedProjects);
      void persistProjects(normalizedProjects);
      clearLinkedDraft();
      toast({
        title: '项目已更新',
        description: '项目信息已保存',
      });
    } else {
      const newProject: Project = {
        id: Date.now().toString(),
        title: formData.title,
        description: formData.description,
        liveUrl: formData.liveUrl,
        githubUrl: formData.githubUrl || undefined,
        tags: tagsArray,
        category: formData.category,
        image: formData.image || undefined,
        status: formData.status,
        visibility: formData.visibility,
        order: projects.length,
        detailedDescription: formData.detailedDescription || undefined,
        screenshots: screenshotsArray.length > 0 ? screenshotsArray : undefined,
        features: featuresArray.length > 0 ? featuresArray : undefined,
        challenges: challengesArray,
        startDate: formData.startDate || undefined,
        duration: formData.duration || undefined,
        timeline: timelineArray,
        showGallery: formData.showGallery,
        showOverview: formData.showOverview,
        showTechStack: formData.showTechStack,
        showChallenges: formData.showChallenges,
        showTimeline: formData.showTimeline,
      };
      const updatedProjects = normalizeProjectOrder([...projects, newProject]);
      setProjects(updatedProjects);
      void persistProjects(updatedProjects);
      clearLinkedDraft();
      toast({
        title: '项目已添加',
        description: '新项目已加入列表',
      });
    }

    setImportPreview(null);
    setImportError('');
    setIsDialogOpen(false);
    return true;
  }, [formData, editingProject, projects, persistProjects, toast, currentDraftId]);

  const handleDeleteProject = useCallback((id: string) => {
    setDeleteProjectId(id);
  }, []);

  const confirmDelete = useCallback(() => {
    if (deleteProjectId) {
      const targetProject = projects.find((project) => project.id === deleteProjectId);
      const updatedProjects = normalizeProjectOrder(
        projects.filter((p) => p.id !== deleteProjectId)
      );
      setProjects(updatedProjects);
      void persistProjects(updatedProjects);
      toast({
        title: '项目已删除',
        description: targetProject ? `已删除：${targetProject.title}` : '项目已从列表移除',
      });
      setDeleteProjectId(null);
    }
  }, [deleteProjectId, projects, persistProjects, toast]);

  const reorderProjects = useCallback(
    (activeId: string, overId: string) => {
      if (activeId === overId) return;

      setProjects((currentProjects) => {
        const activeIndex = currentProjects.findIndex((project) => project.id === activeId);
        const overIndex = currentProjects.findIndex((project) => project.id === overId);

        if (activeIndex === -1 || overIndex === -1) {
          return currentProjects;
        }

        const reorderedProjects = arrayMove(currentProjects, activeIndex, overIndex);
        const normalizedProjects = normalizeProjectOrder(reorderedProjects);
        void persistProjects(normalizedProjects);
        return normalizedProjects;
      });
    },
    [persistProjects]
  );

  const getStatusColor = useCallback((status: string) => {
    switch (status) {
      case 'live':
        return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'development':
        return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'archived':
        return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
      default:
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
    }
  }, []);

  return {
    projects,
    publicProjects,
    filteredProjects,
    isProjectsLoading,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    showImages,
    setShowImages,

    isDialogOpen,
    setIsDialogOpen,
    editingProject,
    formData,
    setFormData,
    handleAddProject,
    handleEditProject,
    handleSaveProject,
    handleSaveDraft,

    drafts,
    currentDraftId,
    listDrafts,
    restoreDraft,
    deleteDraft,

    importPreview,
    importError,
    isImporting,
    importSessionPasscode: importSessionPasscodeState,
    setImportSessionPasscode,
    frontendAiConfig: frontendAiConfigState,
    setFrontendAiConfig,
    saveAiSettings,
    isAiSettingsDirty,
    isSavingAiSettings,
    aiModelOptions,
    isLoadingAiModels,
    loadAiModels,
    testAiConfig,
    importFromUrl,

    batchImportPreview,
    analyzeBatchImport,
    importBatch,
    clearBatchImportPreview,

    deleteProjectId,
    setDeleteProjectId,
    handleDeleteProject,
    confirmDelete,
    reorderProjects,

    selectedProject,
    setSelectedProject,
    isDetailDialogOpen,
    setIsDetailDialogOpen,

    getStatusColor,
  };
}
