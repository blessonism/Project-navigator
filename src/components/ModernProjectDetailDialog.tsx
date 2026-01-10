'use client';

import * as React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import {
  X,
  Github,
  ExternalLink,
  CheckCircle2,
  Code2,
  Lightbulb,
  Target,
  Zap,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChallengeSection, Challenge } from './ChallengeSection';
import { EmptyState } from './EmptyState';

const DialogPortal = DialogPrimitive.Portal;
const DialogClose = DialogPrimitive.Close;

// Error Boundary for Timeline component
class TimelineErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Timeline component error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full h-32 flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <p>时间线加载失败</p>
            <button
              onClick={() => this.setState({ hasError: false })}
              className="text-primary hover:underline text-sm mt-2"
            >
              重试
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

interface TimelineEntry {
  title: string;
  content: React.ReactNode;
}

const Timeline = ({ data }: { data: TimelineEntry[] }) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [height, setHeight] = React.useState(0);

  React.useEffect(() => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setHeight(rect.height);
    }
  }, [ref, data]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 10%', 'end 50%'],
  });

  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, Math.max(height, 100)]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

  return (
    <div className="w-full font-sans" ref={containerRef}>
      <div ref={ref} className="relative pb-8">
        {data.map((item, index) => (
          <div key={index} className="flex justify-start pt-8 md:gap-10">
            <div className="sticky flex flex-col md:flex-row z-40 items-center top-20 self-start max-w-xs lg:max-w-sm md:w-full">
              <div className="h-10 absolute left-3 md:left-3 w-10 rounded-full bg-background flex items-center justify-center">
                <div className="h-4 w-4 rounded-full bg-muted border border-border p-2" />
              </div>
              <h3 className="hidden md:block text-lg md:pl-20 md:text-2xl font-bold text-muted-foreground">
                {item.title}
              </h3>
            </div>

            <div className="relative pl-20 pr-4 md:pl-4 w-full">
              <h3 className="md:hidden block text-xl mb-4 text-left font-bold text-muted-foreground">
                {item.title}
              </h3>
              {item.content}
            </div>
          </div>
        ))}
        <div
          style={{ height: height + 'px' }}
          className="absolute md:left-8 left-8 top-0 overflow-hidden w-[2px] bg-gradient-to-b from-transparent via-border to-transparent [mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)]"
        >
          <motion.div
            style={{
              height: heightTransform,
              opacity: opacityTransform,
            }}
            className="absolute inset-x-0 top-0 w-[2px] bg-gradient-to-t from-primary via-primary/50 to-transparent rounded-full"
          />
        </div>
      </div>
    </div>
  );
};

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      'fixed inset-0 z-50 bg-black/50 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
      className
    )}
    {...props}
  />
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

interface Screenshot {
  url: string;
  title: string;
  description?: string;
}

interface TechStackItem {
  name: string;
  version?: string;
  purpose: string;
  category: 'frontend' | 'backend' | 'database' | 'devops' | 'other';
}

interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  type: 'milestone' | 'feature' | 'bugfix' | 'release';
}

interface Project {
  id: string;
  title: string;
  description: string;
  detailedDescription?: string;
  screenshots?: string[];
  techStack?: TechStackItem[];
  features?: string[];
  challenges?: Challenge[];
  timeline?: TimelineEvent[];
  startDate?: string;
  duration?: string;
  liveUrl?: string;
  githubUrl?: string;
  status: 'live' | 'development' | 'archived';
  image?: string;
  tags?: string[];
  showGallery?: boolean;
}

interface ModernProjectDetailDialogProps {
  project: Project;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function ModernProjectDetailDialog({
  project,
  open,
  onOpenChange,
}: ModernProjectDetailDialogProps) {
  const [currentImageIndex, setCurrentImageIndex] = React.useState(0);
  const [isImageModalOpen, setIsImageModalOpen] = React.useState(false);

  const showGalleryTab = project.showGallery !== false;

  const screenshots: Screenshot[] = React.useMemo(() => {
    if (project.screenshots && project.screenshots.length > 0) {
      return project.screenshots.map((url, index) => ({
        url,
        title: `Screenshot ${index + 1}`,
        description: '',
      }));
    }
    if (project.image) {
      return [{ url: project.image, title: project.title, description: '' }];
    }
    return [];
  }, [project.screenshots, project.image, project.title]);

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

  const features = React.useMemo(() => {
    if (!project.features) return [];

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
  }, [project.features]);

  const timelineData: TimelineEntry[] = React.useMemo(() => {
    if (!project.timeline) return [];

    return project.timeline.map((event) => ({
      title: new Date(event.date).toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
      }),
      content: (
        <div>
          <p className="text-foreground text-sm font-normal mb-4">{event.title}</p>
          <div className="space-y-2">
            <div className="flex gap-2 items-center text-muted-foreground text-sm">
              {event.type === 'milestone' && <CheckCircle className="w-4 h-4 text-green-500" />}
              {event.type === 'feature' && <Code2 className="w-4 h-4 text-blue-500" />}
              {event.type === 'bugfix' && <AlertCircle className="w-4 h-4 text-red-500" />}
              {event.type === 'release' && <Zap className="w-4 h-4 text-purple-500" />}
              {event.description}
            </div>
          </div>
        </div>
      ),
    }));
  }, [project.timeline]);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % screenshots.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + screenshots.length) % screenshots.length);
  };

  return (
    <>
      <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
        <DialogPortal>
          <DialogOverlay />
          <DialogPrimitive.Content
            className={cn(
              'theme-modern fixed left-[50%] top-[50%] z-50 grid w-full max-w-6xl translate-x-[-50%] translate-y-[-50%] gap-0 bg-background/95 backdrop-blur-xl shadow-2xl duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:rounded-lg max-h-[90vh] overflow-hidden p-0 border border-border/50'
            )}
          >
            <DialogPrimitive.Title className="sr-only">{project.title}</DialogPrimitive.Title>
            <DialogPrimitive.Description className="sr-only">
              {project.description}
            </DialogPrimitive.Description>
            <ScrollArea className="h-[90vh] modern-detail-scroll" hideScrollbar>
              <div className="relative">
                {/* Hero Section */}
                <div className="relative h-[400px] bg-gradient-to-br from-primary/20 via-primary/10 to-background overflow-hidden">
                  {screenshots[0] && (
                    <>
                      <div
                        className="absolute inset-0 bg-cover bg-center opacity-40 blur-sm"
                        style={{ backgroundImage: `url(${screenshots[0].url})` }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
                    </>
                  )}

                  <div className="relative h-full flex flex-col justify-end p-8">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h2 className="text-4xl font-bold mb-3 text-foreground">{project.title}</h2>
                        <p className="text-lg text-muted-foreground max-w-2xl">
                          {project.description}
                        </p>
                      </div>
                    </div>

                    {project.tags && project.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary" className="px-3 py-1">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}

                    <div className="flex gap-3">
                      {project.githubUrl && (
                        <Button variant="outline" size="sm" asChild>
                          <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                            <Github className="w-4 h-4 mr-2" />
                            GitHub
                          </a>
                        </Button>
                      )}
                      {project.liveUrl && (
                        <Button size="sm" asChild>
                          <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Live Demo
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-8">
                  <Tabs defaultValue="overview" className="w-full">
                    <TabsList
                      className={cn(
                        'modern-tabs-list w-full mb-8 h-auto !p-[6px] !bg-transparent !rounded-xl',
                        showGalleryTab ? 'grid grid-cols-5' : 'grid grid-cols-4'
                      )}
                    >
                      <TabsTrigger value="overview" className="modern-tab-trigger !rounded-lg">
                        Overview
                      </TabsTrigger>
                      {showGalleryTab && (
                        <TabsTrigger value="gallery" className="modern-tab-trigger !rounded-lg">
                          Gallery
                        </TabsTrigger>
                      )}
                      <TabsTrigger value="tech" className="modern-tab-trigger !rounded-lg">
                        Tech Stack
                      </TabsTrigger>
                      <TabsTrigger value="challenges" className="modern-tab-trigger !rounded-lg">
                        Challenges
                      </TabsTrigger>
                      <TabsTrigger value="timeline" className="modern-tab-trigger !rounded-lg">
                        Timeline
                      </TabsTrigger>
                    </TabsList>

                    {/* Overview Tab */}
                    <TabsContent value="overview" className="space-y-6">
                      <Card className="bg-card/50 backdrop-blur-sm">
                        <CardHeader>
                          <CardTitle>About This Project</CardTitle>
                        </CardHeader>
                        <CardContent>
                          {project.detailedDescription || project.description ? (
                            <p className="text-muted-foreground leading-relaxed">
                              {project.detailedDescription || project.description}
                            </p>
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
                            {features.map((feature, index) => (
                              <Card
                                key={index}
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
                                  <p className="text-sm text-muted-foreground">
                                    {feature.description}
                                  </p>
                                </CardContent>
                              </Card>
                            ))}
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
                    </TabsContent>

                    {/* Gallery Tab */}
                    {showGalleryTab && (
                      <TabsContent value="gallery" className="space-y-6">
                        {screenshots.length > 0 ? (
                          <div className="grid grid-cols-2 gap-4">
                            {screenshots.map((screenshot, index) => (
                              <Card
                                key={index}
                                className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow group bg-card/50 backdrop-blur-sm"
                                onClick={() => {
                                  setCurrentImageIndex(index);
                                  setIsImageModalOpen(true);
                                }}
                              >
                                <div className="relative aspect-video overflow-hidden">
                                  <img
                                    src={screenshot.url}
                                    alt={screenshot.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                  />
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                                <CardHeader>
                                  <CardTitle className="text-base">{screenshot.title}</CardTitle>
                                  {screenshot.description && (
                                    <CardDescription>{screenshot.description}</CardDescription>
                                  )}
                                </CardHeader>
                              </Card>
                            ))}
                          </div>
                        ) : (
                          <EmptyState message="暂无项目截图" variant="modern" />
                        )}
                      </TabsContent>
                    )}

                    {/* Tech Stack Tab */}
                    <TabsContent value="tech" className="space-y-6">
                      {techStack.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {techStack.map((stack, index) => (
                            <Card key={index} className="bg-card/50 backdrop-blur-sm">
                              <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                  <Code2 className="w-5 h-5 text-primary" />
                                  {stack.category}
                                </CardTitle>
                              </CardHeader>
                              <CardContent>
                                <div className="flex flex-wrap gap-2">
                                  {stack.technologies.map((tech, techIndex) => (
                                    <Badge key={techIndex} variant="outline" className="px-3 py-1">
                                      {tech}
                                    </Badge>
                                  ))}
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      ) : (
                        <EmptyState message="暂无技术栈信息" variant="modern" />
                      )}
                    </TabsContent>

                    {/* Challenges Tab */}
                    <TabsContent value="challenges" className="space-y-6">
                      {project.challenges && project.challenges.length > 0 ? (
                        <ChallengeSection challenges={project.challenges} />
                      ) : (
                        <EmptyState message="暂无挑战与解决方案" variant="modern" />
                      )}
                    </TabsContent>

                    {/* Timeline Tab */}
                    <TabsContent value="timeline" className="space-y-6">
                      {timelineData.length > 0 ? (
                        <div>
                          <h3 className="text-lg font-semibold mb-3">项目时间线</h3>
                          <TimelineErrorBoundary>
                            <Timeline data={timelineData} />
                          </TimelineErrorBoundary>
                        </div>
                      ) : (
                        <EmptyState message="暂无时间线数据" variant="modern" />
                      )}
                    </TabsContent>
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

      {/* Image Modal */}
      {isImageModalOpen && screenshots.length > 0 && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center"
          onClick={() => setIsImageModalOpen(false)}
        >
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 text-white hover:bg-white/20"
            onClick={() => setIsImageModalOpen(false)}
          >
            <X className="w-6 h-6" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20"
            onClick={(e) => {
              e.stopPropagation();
              prevImage();
            }}
          >
            <ChevronLeft className="w-8 h-8" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20"
            onClick={(e) => {
              e.stopPropagation();
              nextImage();
            }}
          >
            <ChevronRight className="w-8 h-8" />
          </Button>

          <div className="max-w-6xl max-h-[90vh] w-full px-16" onClick={(e) => e.stopPropagation()}>
            <img
              src={screenshots[currentImageIndex]?.url}
              alt={screenshots[currentImageIndex]?.title}
              className="w-full h-full object-contain rounded-lg"
            />
            <div className="text-center mt-4 text-white">
              <h3 className="text-xl font-semibold">{screenshots[currentImageIndex]?.title}</h3>
              {screenshots[currentImageIndex]?.description && (
                <p className="text-sm text-gray-300 mt-1">
                  {screenshots[currentImageIndex]?.description}
                </p>
              )}
              <p className="text-sm text-gray-400 mt-2">
                {currentImageIndex + 1} / {screenshots.length}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ModernProjectDetailDialog;
