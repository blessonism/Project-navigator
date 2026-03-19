export interface TechStackItem {
  name: string;
  version?: string;
  purpose: string;
  category: 'frontend' | 'backend' | 'database' | 'devops' | 'other';
}

export interface Challenge {
  title: string;
  description: string;
  solution: string;
}

export interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  type: 'milestone' | 'feature' | 'bugfix' | 'release';
}

export type ProjectVisibility = 'public' | 'admin-only';

export interface Project {
  id: string;
  title: string;
  description: string;
  liveUrl: string;
  githubUrl?: string;
  tags: string[];
  category: string;
  image?: string;
  status: 'live' | 'development' | 'archived';
  visibility?: ProjectVisibility;
  order?: number;

  detailedDescription?: string;
  screenshots?: string[];
  techStack?: TechStackItem[];
  features?: string[];
  challenges?: Challenge[];
  timeline?: TimelineEvent[];
  startDate?: string;
  duration?: string;
  showGallery?: boolean;
  showOverview?: boolean;
  showTechStack?: boolean;
  showChallenges?: boolean;
  showTimeline?: boolean;
}

export interface ProjectFormData {
  title: string;
  description: string;
  liveUrl: string;
  githubUrl: string;
  tags: string;
  category: string;
  image: string;
  status: 'live' | 'development' | 'archived';
  visibility: ProjectVisibility;

  detailedDescription: string;
  screenshots: string;
  features: string;
  challenges: string;

  startDate: string;
  duration: string;
  timelineData: string;
  showGallery: boolean;
  showOverview: boolean;
  showTechStack: boolean;
  showChallenges: boolean;
  showTimeline: boolean;
}

export type ImportSourceType = 'github' | 'website';

export interface FrontendAiConfig {
  enabled: boolean;
  apiKey: string;
  baseUrl: string;
  model: string;
}

export interface ImportPreview {
  sourceUrl: string;
  sourceType: ImportSourceType;
  normalizedProject: Partial<Project>;
  rawMetadata: Record<string, unknown>;
  warnings: string[];
  confidence: number;
}

export interface ProjectDraft {
  id: string;
  title: string;
  sourceUrl: string;
  sourceType: ImportSourceType;
  payload: ProjectFormData;
  updatedAt: string;
}

export type BatchImportStatus = 'valid' | 'duplicate' | 'invalid';

export interface BatchImportItem {
  index: number;
  status: BatchImportStatus;
  raw: unknown;
  project?: Project;
  errors: string[];
  duplicateBy?: 'liveUrl' | 'githubUrl';
}

export interface BatchImportPreview {
  items: BatchImportItem[];
  validItems: BatchImportItem[];
  duplicateItems: BatchImportItem[];
  invalidItems: BatchImportItem[];
}

export type ProjectStatus = Project['status'];
export type TimelineEventType = TimelineEvent['type'];
export type TechCategory = TechStackItem['category'];
