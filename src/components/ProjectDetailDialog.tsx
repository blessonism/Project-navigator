'use client';

import * as React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X, Github, ExternalLink, Calendar, Layers, Code2, Target } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useTheme } from '@/hooks/useTheme';
import {
  ProjectHero,
  ProjectTechStack,
  ProjectTimeline,
  ProjectChallenges,
  ProjectOverview,
  type ThemeVariant,
} from './ProjectDetail';
import type { Project } from '@/types/project';

const DialogPortal = DialogPrimitive.Portal;
const DialogClose = DialogPrimitive.Close;

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay> & { variant: ThemeVariant }
>(({ className, variant, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      'fixed inset-0 z-50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
      variant === 'modern' ? 'bg-black/50 backdrop-blur-sm' : 'bg-background/80 backdrop-blur-sm',
      className
    )}
    {...props}
  />
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

interface ProjectDetailDialogProps {
  project: Project;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function ProjectDetailDialog({ project, open, onOpenChange }: ProjectDetailDialogProps) {
  const { theme } = useTheme();
  const variant: ThemeVariant = theme === 'modern' ? 'modern' : 'classic';

  const [activeImage, setActiveImage] = React.useState(0);

  const showOverviewTab = project.showOverview !== false;
  const showTechStackTab = project.showTechStack !== false;
  const showChallengesTab = project.showChallenges !== false;
  const showTimelineTab = project.showTimeline !== false;

  const visibleTabCount = [
    showOverviewTab,
    showTechStackTab,
    showChallengesTab,
    showTimelineTab,
  ].filter(Boolean).length;

  React.useEffect(() => {
    setActiveImage(0);
  }, [project.id]);

  const defaultTab = showOverviewTab
    ? 'overview'
    : showTechStackTab
      ? 'tech'
      : showChallengesTab
        ? 'challenges'
        : 'timeline';

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogOverlay variant={variant} />
        <DialogPrimitive.Content
          className={cn(
            'fixed left-[50%] top-[50%] z-50 grid w-full translate-x-[-50%] translate-y-[-50%] gap-0 bg-background shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg max-h-[90vh] overflow-hidden',
            variant === 'modern'
              ? 'max-w-6xl bg-background/95 backdrop-blur-xl border border-border/50'
              : 'max-w-5xl'
          )}
        >
          <DialogPrimitive.Title className="sr-only">{project.title}</DialogPrimitive.Title>
          <DialogPrimitive.Description className="sr-only">
            {project.description}
          </DialogPrimitive.Description>

          <ScrollArea className={cn('h-[90vh]', variant === 'modern' && 'modern-detail-scroll')}>
            <div className="relative">
              <ProjectHero
                project={project}
                variant={variant}
                activeImage={activeImage}
                onActiveImageChange={setActiveImage}
              />

              <div className={cn(variant === 'modern' ? 'p-8' : 'p-6', 'space-y-6')}>
                {variant === 'classic' && (
                  <div className="space-y-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-2 flex-1">
                        <h2 className="text-3xl font-bold tracking-tight">{project.title}</h2>
                        <p className="text-muted-foreground">{project.description}</p>
                      </div>
                      <div className="flex gap-2">
                        {project.githubUrl && (
                          <Button variant="outline" size="icon" asChild>
                            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                              <Github className="w-4 h-4" />
                            </a>
                          </Button>
                        )}
                        {project.liveUrl && (
                          <Button variant="outline" size="icon" asChild>
                            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          </Button>
                        )}
                      </div>
                    </div>

                    {project.duration && (
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{project.duration}</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <Tabs defaultValue={defaultTab} className="w-full">
                  <TabsList
                    className={cn(
                      'grid w-full',
                      variant === 'modern' &&
                        'modern-tabs-list mb-8 h-auto !p-[6px] !bg-transparent !rounded-xl'
                    )}
                    style={{ gridTemplateColumns: `repeat(${visibleTabCount}, minmax(0, 1fr))` }}
                  >
                    {showOverviewTab && (
                      <TabsTrigger
                        value="overview"
                        className={variant === 'modern' ? 'modern-tab-trigger !rounded-lg' : ''}
                      >
                        <Layers className="w-4 h-4 mr-2" />
                        {variant === 'modern' ? 'Overview' : '概览'}
                      </TabsTrigger>
                    )}
                    {showTechStackTab && (
                      <TabsTrigger
                        value="tech"
                        className={variant === 'modern' ? 'modern-tab-trigger !rounded-lg' : ''}
                      >
                        <Code2 className="w-4 h-4 mr-2" />
                        {variant === 'modern' ? 'Tech Stack' : '技术栈'}
                      </TabsTrigger>
                    )}
                    {showChallengesTab && (
                      <TabsTrigger
                        value="challenges"
                        className={variant === 'modern' ? 'modern-tab-trigger !rounded-lg' : ''}
                      >
                        <Target className="w-4 h-4 mr-2" />
                        {variant === 'modern' ? 'Challenges' : '挑战与方案'}
                      </TabsTrigger>
                    )}
                    {showTimelineTab && (
                      <TabsTrigger
                        value="timeline"
                        className={variant === 'modern' ? 'modern-tab-trigger !rounded-lg' : ''}
                      >
                        <Calendar className="w-4 h-4 mr-2" />
                        {variant === 'modern' ? 'Timeline' : '时间线'}
                      </TabsTrigger>
                    )}
                  </TabsList>

                  {showOverviewTab && (
                    <TabsContent value="overview" className="mt-6">
                      <ProjectOverview project={project} variant={variant} />
                    </TabsContent>
                  )}

                  {showTechStackTab && (
                    <TabsContent value="tech" className="mt-6">
                      <ProjectTechStack project={project} variant={variant} />
                    </TabsContent>
                  )}

                  {showChallengesTab && (
                    <TabsContent value="challenges" className="mt-6">
                      <ProjectChallenges project={project} variant={variant} />
                    </TabsContent>
                  )}

                  {showTimelineTab && (
                    <TabsContent value="timeline" className="mt-6">
                      <ProjectTimeline project={project} variant={variant} />
                    </TabsContent>
                  )}
                </Tabs>
              </div>
            </div>
          </ScrollArea>

          <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground z-50">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogClose>
        </DialogPrimitive.Content>
      </DialogPortal>
    </DialogPrimitive.Root>
  );
}

export default ProjectDetailDialog;
