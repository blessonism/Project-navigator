import type { ImportSourceType, ProjectDraft, ProjectFormData } from '@/types/project';

const isObjectRecord = (value: unknown): value is Record<string, unknown> => {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
};

const normalizeSourceType = (value: unknown): ImportSourceType => {
  if (value === 'github' || value === 'website') {
    return value;
  }
  return 'website';
};

const emptyPayload: ProjectFormData = {
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
  showOverview: true,
  showTechStack: true,
  showChallenges: true,
  showTimeline: true,
};

export const sanitizeProjectFormData = (value: unknown): ProjectFormData => {
  if (!isObjectRecord(value)) {
    return emptyPayload;
  }

  const getText = (key: keyof ProjectFormData): string => {
    const field = value[key];
    return typeof field === 'string' ? field : '';
  };

  const getBool = (key: keyof ProjectFormData, fallback: boolean): boolean => {
    const field = value[key];
    return typeof field === 'boolean' ? field : fallback;
  };

  const status = value.status;
  const normalizedStatus =
    status === 'live' || status === 'development' || status === 'archived' ? status : 'live';

  return {
    title: getText('title'),
    description: getText('description'),
    liveUrl: getText('liveUrl'),
    githubUrl: getText('githubUrl'),
    tags: getText('tags'),
    category: getText('category') || 'web',
    image: getText('image'),
    status: normalizedStatus,
    detailedDescription: getText('detailedDescription'),
    screenshots: getText('screenshots'),
    features: getText('features'),
    challenges: getText('challenges'),
    startDate: getText('startDate'),
    duration: getText('duration'),
    timelineData: getText('timelineData'),
    showGallery: getBool('showGallery', true),
    showOverview: getBool('showOverview', true),
    showTechStack: getBool('showTechStack', true),
    showChallenges: getBool('showChallenges', true),
    showTimeline: getBool('showTimeline', true),
  };
};

const sanitizeDraft = (value: unknown): ProjectDraft | null => {
  if (!isObjectRecord(value)) {
    return null;
  }

  const id = typeof value.id === 'string' ? value.id : '';
  const title = typeof value.title === 'string' ? value.title : '未命名草稿';
  const sourceUrl = typeof value.sourceUrl === 'string' ? value.sourceUrl : '';
  const updatedAt = typeof value.updatedAt === 'string' ? value.updatedAt : new Date(0).toISOString();

  if (!id) {
    return null;
  }

  return {
    id,
    title,
    sourceUrl,
    sourceType: normalizeSourceType(value.sourceType),
    payload: sanitizeProjectFormData(value.payload),
    updatedAt,
  };
};

export const serializeProjectDrafts = (drafts: ProjectDraft[]): string => {
  return JSON.stringify(drafts);
};

export const deserializeProjectDrafts = (raw: string | null): ProjectDraft[] => {
  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed
      .map((item) => sanitizeDraft(item))
      .filter((item): item is ProjectDraft => item !== null)
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  } catch {
    return [];
  }
};
