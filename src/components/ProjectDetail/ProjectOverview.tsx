import * as React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, CheckCircle2, Zap, Target, Lightbulb } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EmptyState } from '@/components/EmptyState';
import { MarkdownRenderer } from '@/components/MarkdownRenderer';
import type { ProjectOverviewProps } from './types';

export const ProjectOverview: React.FC<ProjectOverviewProps> = ({
  project,
  variant,
  className,
}) => {
  const features = React.useMemo(() => {
    if (!project.features) return [];

    if (variant === 'modern') {
      const icons = [
        <Zap className="w-5 h-5" key="zap" />,
        <Target className="w-5 h-5" key="target" />,
        <Lightbulb className="w-5 h-5" key="lightbulb" />,
        <CheckCircle2 className="w-5 h-5" key="check" />,
      ];

      return project.features.map((feature, index) => ({
        title: feature,
        description: feature,
        icon: icons[index % icons.length],
      }));
    }

    return project.features;
  }, [project.features, variant]);

  if (variant === 'modern') {
    return (
      <div className={cn('space-y-6', className)}>
        <Card className="bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>About This Project</CardTitle>
          </CardHeader>
          <CardContent>
            {project.detailedDescription || project.description ? (
              <MarkdownRenderer
                content={project.detailedDescription || project.description || ''}
              />
            ) : (
              <EmptyState message="暂无项目详情" variant="modern" />
            )}
          </CardContent>
        </Card>

        {features.length > 0 ? (
          <div>
            <h3 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <Zap className="w-6 h-6 text-primary" />
              Key Features
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(features as { title: string; description: string; icon: React.ReactNode }[]).map(
                (feature) => (
                  <Card
                    key={feature.title}
                    className="border-2 hover:border-primary/50 transition-colors bg-card/50 backdrop-blur-sm"
                  >
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <div className="p-2 rounded-lg bg-primary/10 text-primary">
                          {feature.icon}
                        </div>
                        {feature.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </CardContent>
                  </Card>
                )
              )}
            </div>
          </div>
        ) : (
          <div>
            <h3 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <Zap className="w-6 h-6 text-primary" />
              Key Features
            </h3>
            <EmptyState message="暂无功能特性" variant="modern" />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={cn('space-y-4', className)}>
      <Card>
        <CardHeader>
          <CardTitle>About This Project</CardTitle>
        </CardHeader>
        <CardContent>
          {project.detailedDescription || project.description ? (
            <MarkdownRenderer
              content={project.detailedDescription || project.description || ''}
              className="text-muted-foreground"
            />
          ) : (
            <EmptyState message="暂无项目详情" variant="classic" />
          )}
        </CardContent>
      </Card>

      {(features as string[]).length > 0 ? (
        <div>
          <h3 className="text-lg font-semibold mb-3">核心功能</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {(features as string[]).map((feature, idx) => (
              <motion.div
                key={feature}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="flex items-start gap-2 p-3 rounded-lg bg-muted/50"
              >
                <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-sm">{feature}</span>
              </motion.div>
            ))}
          </div>
        </div>
      ) : (
        <EmptyState message="暂无功能特性" variant="classic" />
      )}
    </div>
  );
};