import * as React from 'react';
import { motion } from 'framer-motion';
import { Code2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EmptyState } from '@/components/EmptyState';
import type { ProjectTechStackProps } from './types';

export const ProjectTechStack: React.FC<ProjectTechStackProps> = ({
  project,
  variant,
  showEmptyState = true,
  className,
}) => {
  const techStack = React.useMemo(() => {
    if (!project.techStack) return [];

    const grouped: { [key: string]: string[] } = {};
    project.techStack.forEach((tech) => {
      const category = tech.category.charAt(0).toUpperCase() + tech.category.slice(1);
      if (!grouped[category]) {
        grouped[category] = [];
      }
      grouped[category].push(tech.name);
    });

    return Object.entries(grouped).map(([category, technologies]) => ({
      category,
      technologies,
    }));
  }, [project.techStack]);

  if (techStack.length === 0) {
    if (!showEmptyState) return null;
    return <EmptyState message="暂无技术栈信息" variant={variant} />;
  }

  if (variant === 'modern') {
    return (
      <div className={cn('grid grid-cols-1 md:grid-cols-2 gap-6', className)}>
        {techStack.map((stack) => (
          <Card key={stack.category} className="bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code2 className="w-5 h-5 text-primary" />
                {stack.category}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {stack.technologies.map((tech) => (
                  <Badge key={tech} variant="outline" className="px-3 py-1">
                    {tech}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className={cn('grid grid-cols-1 md:grid-cols-2 gap-4', className)}>
      {project.techStack?.map((tech, idx) => (
        <motion.div
          key={tech.name}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: idx * 0.05 }}
          className="p-4 rounded-lg border bg-card"
        >
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold">{tech.name}</h4>
            <Badge variant="outline" className="text-xs">
              {tech.category}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">{tech.purpose}</p>
        </motion.div>
      ))}
    </div>
  );
};
