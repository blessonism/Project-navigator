import type { Project, ProjectVisibility } from '@/types/project';

export const resolveProjectVisibility = (value: unknown): ProjectVisibility => {
  return value === 'admin-only' ? 'admin-only' : 'public';
};

export const getProjectVisibilityLabel = (value: unknown): string => {
  return resolveProjectVisibility(value) === 'admin-only' ? '仅面向管理员' : '面向大众';
};

export const getPublicProjects = (projects: Project[]): Project[] => {
  return projects.filter((project) => resolveProjectVisibility(project.visibility) === 'public');
};

export const filterPublicProjects = (
  projects: Project[],
  searchQuery: string,
  selectedCategory: string
): Project[] => {
  const normalizedQuery = searchQuery.trim().toLowerCase();

  return getPublicProjects(projects).filter((project) => {
    const matchesSearch =
      normalizedQuery === '' ||
      project.title.toLowerCase().includes(normalizedQuery) ||
      project.description.toLowerCase().includes(normalizedQuery) ||
      project.tags.some((tag) => tag.toLowerCase().includes(normalizedQuery));

    const matchesCategory = selectedCategory === 'all' || project.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });
};
