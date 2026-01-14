import React from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import type { Project } from '@/types/project';

interface ProjectListProps {
  projects: Project[];
  isLoading: boolean;
  getStatusColor: (status: string) => string;
  onEdit: (project: Project) => void;
  onDelete: (id: string) => void;
}

export const ProjectList: React.FC<ProjectListProps> = ({
  projects,
  isLoading,
  getStatusColor,
  onEdit,
  onDelete,
}) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <Card key={`admin-skeleton-${index}`}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-5 w-40" />
                  <Skeleton className="h-4 w-full" />
                </div>
                <div className="ml-4 flex gap-2">
                  <Skeleton className="h-8 w-8" />
                  <Skeleton className="h-8 w-8" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-5 w-14" />
                <Skeleton className="h-5 w-12" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <Card>
        <CardContent className="py-16 text-center">
          <p className="text-muted-foreground">暂无项目，点击上方按钮添加您的第一个项目</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {projects.map((project) => (
        <Card key={project.id} className="group">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <CardTitle>{project.title}</CardTitle>
                  <Badge variant="outline" className={getStatusColor(project.status)}>
                    {project.status}
                  </Badge>
                </div>
                <CardDescription>{project.description}</CardDescription>
              </div>
              <div className="flex gap-2 ml-4">
                <Button variant="outline" size="sm" onClick={() => onEdit(project)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDelete(project.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>分类: {project.category}</span>
                <span>•</span>
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary"
                >
                  在线链接
                </a>
                {project.githubUrl && (
                  <>
                    <span>•</span>
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-primary"
                    >
                      GitHub
                    </a>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
