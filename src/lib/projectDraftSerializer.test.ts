import { describe, expect, it } from 'vitest';
import { deserializeProjectDrafts, serializeProjectDrafts } from './projectDraftSerializer';
import type { ProjectDraft } from '@/types/project';

const draftA: ProjectDraft = {
  id: 'draft-a',
  title: '草稿 A',
  sourceUrl: 'https://a.com',
  sourceType: 'website',
  updatedAt: '2026-03-16T10:00:00.000Z',
  payload: {
    title: 'A',
    description: 'desc',
    liveUrl: 'https://a.com',
    githubUrl: '',
    tags: 'React',
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
    showOverview: true,
    showTechStack: true,
    showChallenges: true,
    showTimeline: true,
  },
};

const draftB: ProjectDraft = {
  ...draftA,
  id: 'draft-b',
  title: '草稿 B',
  updatedAt: '2026-03-16T11:00:00.000Z',
};

describe('projectDraftSerializer', () => {
  it('应能序列化与反序列化，并按更新时间倒序', () => {
    const raw = serializeProjectDrafts([draftA, draftB]);
    const drafts = deserializeProjectDrafts(raw);

    expect(drafts).toHaveLength(2);
    expect(drafts[0].id).toBe('draft-b');
    expect(drafts[1].id).toBe('draft-a');
  });

  it('损坏数据应返回空数组', () => {
    expect(deserializeProjectDrafts('{broken')).toEqual([]);
    expect(deserializeProjectDrafts('{"foo":1}')).toEqual([]);
  });

  it('缺失字段时应做安全兜底', () => {
    const raw = JSON.stringify([
      {
        id: 'x',
        payload: {
          title: 'X',
        },
      },
    ]);

    const drafts = deserializeProjectDrafts(raw);

    expect(drafts).toHaveLength(1);
    expect(drafts[0].payload.showGallery).toBe(true);
    expect(drafts[0].sourceType).toBe('website');
  });
});
