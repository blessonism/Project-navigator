import * as React from 'react';
import { cn } from '@/lib/utils';
import { ChallengeSection } from '@/components/ChallengeSection';
import { EmptyState } from '@/components/EmptyState';
import type { ProjectChallengesProps } from './types';

export const ProjectChallenges: React.FC<ProjectChallengesProps> = ({
  project,
  variant,
  className,
}) => {
  if (!project.challenges || project.challenges.length === 0) {
    return <EmptyState message="暂无挑战与解决方案" variant={variant} />;
  }

  return (
    <div className={cn(className)}>
      <ChallengeSection challenges={project.challenges} />
    </div>
  );
};
