import React, { useEffect, useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Pencil, Trash2, GripVertical } from 'lucide-react';
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
  onReorder?: (activeId: string, overId: string) => void;
}

interface SortableProjectCardProps {
  project: Project;
  getStatusColor: (status: string) => string;
  onEdit: (project: Project) => void;
  onDelete: (id: string) => void;
  isMobile: boolean;
}

const SortableProjectCard: React.FC<SortableProjectCardProps> = ({
  project,
  getStatusColor,
  onEdit,
  onDelete,
  isMobile,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: project.id, disabled: isMobile });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className="relative group">
      {!isMobile && (
        <button
          type="button"
          {...attributes}
          {...listeners}
          aria-label={`拖拽排序：${project.title}`}
          className="absolute left-2 top-6 z-10 cursor-move opacity-0 group-hover:opacity-50 focus:opacity-100 hover:!opacity-100 transition-opacity p-1 rounded focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <GripVertical className="h-5 w-5 text-muted-foreground" />
        </button>
      )}
      <Card className={`${isMobile ? '' : 'pl-8'} transition-all hover:shadow-md`}>
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start justify-between gap-3 sm:gap-0">
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <CardTitle className="text-base sm:text-lg">{project.title}</CardTitle>
                <Badge variant="outline" className={getStatusColor(project.status)}>
                  {project.status}
                </Badge>
              </div>
              <CardDescription className="line-clamp-4">{project.description}</CardDescription>
            </div>
            <div className="flex gap-2 sm:ml-4 w-full sm:w-auto">
              <Button variant="outline" size="sm" onClick={() => onEdit(project)} className="flex-1 sm:flex-none">
                <Pencil className="h-4 w-4 sm:mr-0" />
                <span className="sm:hidden ml-2">编辑</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDelete(project.id)}
                className="text-destructive hover:text-destructive flex-1 sm:flex-none"
              >
                <Trash2 className="h-4 w-4 sm:mr-0" />
                <span className="sm:hidden ml-2">删除</span>
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
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
              <span>分类: {project.category}</span>
              <span className="hidden sm:inline">•</span>
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
                  <span className="hidden sm:inline">•</span>
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
    </div>
  );
};

export const ProjectList: React.FC<ProjectListProps> = ({
  projects,
  isLoading,
  getStatusColor,
  onEdit,
  onDelete,
  onReorder,
}) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (over && active.id !== over.id && onReorder) {
      onReorder(active.id as string, over.id as string);
    }
  }

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
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={projects.map((p) => p.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-4">
          {projects.map((project) => (
            <SortableProjectCard
              key={project.id}
              project={project}
              getStatusColor={getStatusColor}
              onEdit={onEdit}
              onDelete={onDelete}
              isMobile={isMobile}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
};
