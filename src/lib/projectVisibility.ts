import type { Project, ProjectVisibility } from '@/types/project';

export type ProjectAudience = 'public' | 'admin';

export const resolveProjectVisibility = (value: unknown): ProjectVisibility => {
  return value === 'admin-only' ? 'admin-only' : 'public';
};

export const getProjectVisibilityLabel = (value: unknown): string => {
  return resolveProjectVisibility(value) === 'admin-only' ? '仅面向管理员' : '面向大众';
};

export const getPublicProjects = (projects: Project[]): Project[] => {
  return projects.filter((project) => resolveProjectVisibility(project.visibility) === 'public');
};

export const getProjectsForAudience = (
  projects: Project[],
  audience: ProjectAudience
): Project[] => {
  return audience === 'admin' ? projects : getPublicProjects(projects);
};

export const filterPublicProjects = (
  projects: Project[],
  searchQuery: string,
  selectedCategory: string
): Project[] => {
  return filterProjectsByAudience(projects, 'public', searchQuery, selectedCategory);
};

export const filterProjectsByAudience = (
  projects: Project[],
  audience: ProjectAudience,
  searchQuery: string,
  selectedCategory: string
): Project[] => {
  const normalizedQuery = searchQuery.trim().toLowerCase();

  return getProjectsForAudience(projects, audience).filter((project) => {
    const matchesSearch =
      normalizedQuery === '' ||
      project.title.toLowerCase().includes(normalizedQuery) ||
      project.description.toLowerCase().includes(normalizedQuery) ||
      project.tags.some((tag) => tag.toLowerCase().includes(normalizedQuery));

    const matchesCategory = selectedCategory === 'all' || project.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });
};
