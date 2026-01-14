import type { Project } from '@/types/project';

export type ThemeVariant = 'classic' | 'modern';

export interface BaseProjectProps {
  project: Project;
  variant: ThemeVariant;
  className?: string;
}

export interface ProjectHeroProps extends BaseProjectProps {
  activeImage: number;
  onActiveImageChange: (index: number) => void;
}

export interface ProjectTechStackProps extends BaseProjectProps {
  showEmptyState?: boolean;
}

export interface ProjectTimelineProps extends BaseProjectProps {
  useErrorBoundary?: boolean;
}

export interface ProjectChallengesProps extends BaseProjectProps {}

export interface ProjectOverviewProps extends BaseProjectProps {}
