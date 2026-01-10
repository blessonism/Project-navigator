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

export type ProjectStatus = Project['status'];
export type TimelineEventType = TimelineEvent['type'];
export type TechCategory = TechStackItem['category'];
