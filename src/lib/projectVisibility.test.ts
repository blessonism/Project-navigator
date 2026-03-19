import { describe, expect, it } from 'vitest';
import { filterPublicProjects, getPublicProjects, resolveProjectVisibility } from './projectVisibility';
import type { Project } from '@/types/project';

const baseProject: Project = {
  id: '1',
  title: '项目',
  description: '描述',
  liveUrl: 'https://example.com',
  tags: ['React'],
  category: 'web',
  status: 'live',
};

describe('projectVisibility', () => {
  it('缺失或非法 visibility 时应回退为 public', () => {
    expect(resolveProjectVisibility(undefined)).toBe('public');
    expect(resolveProjectVisibility('unknown')).toBe('public');
    expect(resolveProjectVisibility('admin-only')).toBe('admin-only');
  });

  it('应仅返回公开项目', () => {
    const projects: Project[] = [
      baseProject,
      {
        ...baseProject,
        id: '2',
        title: '管理员项目',
        visibility: 'admin-only',
      },
    ];

    expect(getPublicProjects(projects).map((project) => project.id)).toEqual(['1']);
  });

  it('搜索和分类应只基于公开项目', () => {
    const projects: Project[] = [
      {
        ...baseProject,
        id: '1',
        title: '公开 React 项目',
        tags: ['React'],
        category: 'web',
      },
      {
        ...baseProject,
        id: '2',
        title: '管理员 React 项目',
        tags: ['React'],
        category: 'web',
        visibility: 'admin-only',
      },
      {
        ...baseProject,
        id: '3',
        title: '公开工具项目',
        tags: ['CLI'],
        category: 'tool',
      },
    ];

    expect(filterPublicProjects(projects, 'react', 'web').map((project) => project.id)).toEqual([
      '1',
    ]);
    expect(filterPublicProjects(projects, '', 'tool').map((project) => project.id)).toEqual(['3']);
  });
});
