import { describe, expect, it } from 'vitest';
import {
  isProjectsOrderColumnMissingError,
  mapProjectToSupabasePayload,
  mapSupabaseProjectToProject,
  stripOrderFromSupabaseProject,
} from './storage';
import type { Project } from '@/types/project';

const baseProject: Project = {
  id: '1',
  title: '项目',
  description: '描述',
  liveUrl: 'https://example.com',
  tags: ['React'],
  category: 'web',
  status: 'live',
  visibility: 'admin-only',
};

describe('isProjectsOrderColumnMissingError', () => {
  it('应识别 projects.order 列缺失错误', () => {
    expect(
      isProjectsOrderColumnMissingError({
        message: 'column projects.order does not exist',
      })
    ).toBe(true);
  });

  it('非 order 列缺失错误时应返回 false', () => {
    expect(
      isProjectsOrderColumnMissingError({
        message: 'column projects.priority does not exist',
      })
    ).toBe(false);
  });
});

describe('stripOrderFromSupabaseProject', () => {
  it('应移除 Supabase 项目 payload 中的 order 字段', () => {
    const payload = stripOrderFromSupabaseProject({
      id: 'demo',
      title: 'Demo',
      description: 'desc',
      live_url: 'https://example.com',
      github_url: 'https://github.com/example/demo',
      tags: ['Go'],
      category: 'tool',
      status: 'live',
      order: 3,
      screenshots: [],
      tech_stack: [],
      features: [],
      challenges: [],
      timeline: [],
    });

    expect(payload).not.toHaveProperty('order');
    expect(payload.id).toBe('demo');
    expect(payload.title).toBe('Demo');
  });
});

describe('storage visibility mapping', () => {
  it('写入 Supabase payload 时应保留 visibility', () => {
    const payload = mapProjectToSupabasePayload(baseProject);

    expect(payload.visibility).toBe('admin-only');
  });

  it('Supabase 数据缺失 visibility 时应回退为 public', () => {
    const project = mapSupabaseProjectToProject({
      id: '1',
      title: '项目',
      description: '描述',
      live_url: 'https://example.com',
      tags: ['React'],
      category: 'web',
      status: 'live',
    });

    expect(project.visibility).toBe('public');
  });
});
