import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import {
  getLocalProjectsSnapshot,
  getLocalSettingsSnapshot,
  loadProjects,
  saveProjects,
  loadSettings,
  saveSetting,
} from '@/lib/storage';
import { defaultProjects } from '@/constants/defaultProjects';
import type { Project, ProjectFormData, Challenge, TimelineEvent } from '@/types/project';

const emptyFormData: ProjectFormData = {
  title: '',
  description: '',
  liveUrl: '',
  githubUrl: '',
  tags: '',
  category: 'web',
  image: '',
  status: 'live',
  detailedDescription: '',
  screenshots: '',
  features: '',
  challenges: '',
  startDate: '',
  duration: '',
  timelineData: '',
  showGallery: true,
};

export interface UseProjectsReturn {
  projects: Project[];
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

  deleteProjectId: string | null;
  setDeleteProjectId: (id: string | null) => void;
  handleDeleteProject: (id: string) => void;
  confirmDelete: () => void;

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
  const initialProjects = useMemo(() => getLocalProjectsSnapshot(), []);

  const [projects, setProjects] = useState<Project[]>(() =>
    initialProjects.length > 0 ? initialProjects : []
  );
  const [isProjectsLoading, setIsProjectsLoading] = useState(initialProjects.length === 0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showImages, setShowImagesState] = useState(() => getLocalSettingsSnapshot().showImages);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState<ProjectFormData>(emptyFormData);
  const [deleteProjectId, setDeleteProjectId] = useState<string | null>(null);

  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesSearch =
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory = selectedCategory === 'all' || project.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [projects, searchQuery, selectedCategory]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const projectsData = await loadProjects();

        if (projectsData.length > 0) {
          setProjects(projectsData);
        } else {
          setProjects(defaultProjects);
        }

        const settings = await loadSettings();
        setShowImagesState(settings.showImages);
      } catch (error) {
        console.error('加载数据失败:', error);
        setProjects(defaultProjects);
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
      console.error('保存项目数据失败:', error);
    }
  }, []);

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
        console.error('保存图片显示设置失败:', error);
        toast({
          title: '保存失败',
          description: '设置已保存到本地，但云端同步失败',
          variant: 'destructive',
        });
      }
    };

    saveImageSetting();
  }, [showImages, toast, isInitialized]);

  const handleAddProject = useCallback(() => {
    setEditingProject(null);
    setFormData(emptyFormData);
    setIsDialogOpen(true);
  }, []);

  const handleEditProject = useCallback((project: Project) => {
    setEditingProject(project);

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
      detailedDescription: project.detailedDescription || '',
      screenshots: project.screenshots?.join(', ') || '',
      features: project.features?.join(', ') || '',
      challenges: challengesJson,
      startDate: project.startDate || '',
      duration: project.duration || '',
      timelineData: timelineJson,
      showGallery: project.showGallery !== false,
    });
    setIsDialogOpen(true);
  }, []);

  const handleSaveProject = useCallback((): boolean => {
    if (!formData.title || !formData.description || !formData.liveUrl) {
      alert('请填写必填项：标题、描述和在线链接');
      return false;
    }

    const tagsArray = formData.tags.split(',').map((tag) => tag.trim()).filter((tag) => tag);
    const screenshotsArray = formData.screenshots.split(',').map((url) => url.trim()).filter((url) => url);
    const featuresArray = formData.features.split(',').map((f) => f.trim()).filter((f) => f);

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
              detailedDescription: formData.detailedDescription || undefined,
              screenshots: screenshotsArray.length > 0 ? screenshotsArray : undefined,
              features: featuresArray.length > 0 ? featuresArray : undefined,
              challenges: challengesArray,
              startDate: formData.startDate || undefined,
              duration: formData.duration || undefined,
              timeline: timelineArray,
              showGallery: formData.showGallery,
            }
          : p
      );
      setProjects(updatedProjects);
      void persistProjects(updatedProjects);
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
        detailedDescription: formData.detailedDescription || undefined,
        screenshots: screenshotsArray.length > 0 ? screenshotsArray : undefined,
        features: featuresArray.length > 0 ? featuresArray : undefined,
        challenges: challengesArray,
        startDate: formData.startDate || undefined,
        duration: formData.duration || undefined,
        timeline: timelineArray,
        showGallery: formData.showGallery,
      };
      const updatedProjects = [...projects, newProject];
      setProjects(updatedProjects);
      void persistProjects(updatedProjects);
      toast({
        title: '项目已添加',
        description: '新项目已加入列表',
      });
    }

    setIsDialogOpen(false);
    return true;
  }, [formData, editingProject, projects, persistProjects, toast]);

  const handleDeleteProject = useCallback((id: string) => {
    setDeleteProjectId(id);
  }, []);

  const confirmDelete = useCallback(() => {
    if (deleteProjectId) {
      const targetProject = projects.find((project) => project.id === deleteProjectId);
      const updatedProjects = projects.filter((p) => p.id !== deleteProjectId);
      setProjects(updatedProjects);
      void persistProjects(updatedProjects);
      toast({
        title: '项目已删除',
        description: targetProject ? `已删除：${targetProject.title}` : '项目已从列表移除',
      });
      setDeleteProjectId(null);
    }
  }, [deleteProjectId, projects, persistProjects, toast]);

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

    deleteProjectId,
    setDeleteProjectId,
    handleDeleteProject,
    confirmDelete,

    selectedProject,
    setSelectedProject,
    isDetailDialogOpen,
    setIsDetailDialogOpen,

    getStatusColor,
  };
}
