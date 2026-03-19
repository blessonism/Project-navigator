import { describe, expect, it } from 'vitest';
import { createBatchImportPreview, normalizeProjectUrl } from './projectImport';
import type { Project } from '@/types/project';

const existingProjects: Project[] = [
  {
    id: '1',
    title: 'Old Project',
    description: 'old',
    liveUrl: 'https://demo.com/',
    tags: ['React'],
    category: 'web',
    status: 'live',
  },
];

describe('normalizeProjectUrl', () => {
  it('应当归一化大小写、尾斜杠和查询参数', () => {
    expect(normalizeProjectUrl('https://Example.com/demo/?utm=1#hash')).toBe('https://example.com/demo');
  });

  it('根路径应保留结尾斜杠', () => {
    expect(normalizeProjectUrl('https://Example.com/?x=1')).toBe('https://example.com/');
  });
});

describe('createBatchImportPreview', () => {
  it('应正确区分有效项、重复项和错误项', () => {
    const json = JSON.stringify([
      {
        title: '重复项目',
        description: '重复 liveUrl',
        liveUrl: 'https://demo.com?from=import',
      },
      {
        title: '有效项目',
        description: 'new',
        liveUrl: 'https://fresh.com',
        githubUrl: 'https://github.com/acme/fresh',
        tags: ['TypeScript'],
      },
      {
        title: '',
        description: '',
        liveUrl: 'not-valid-url',
      },
    ]);

    const preview = createBatchImportPreview(json, existingProjects);

    expect(preview.validItems).toHaveLength(1);
    expect(preview.duplicateItems).toHaveLength(1);
    expect(preview.invalidItems).toHaveLength(1);
    expect(preview.duplicateItems[0].duplicateBy).toBe('liveUrl');
    expect(preview.validItems[0].project?.title).toBe('有效项目');
    expect(preview.validItems[0].project?.visibility).toBe('public');
  });

  it('JSON 非数组时应返回 invalid 预览', () => {
    const preview = createBatchImportPreview('{"foo":"bar"}', existingProjects);

    expect(preview.validItems).toHaveLength(0);
    expect(preview.invalidItems).toHaveLength(1);
    expect(preview.invalidItems[0].errors[0]).toContain('顶层必须是数组');
  });
});
