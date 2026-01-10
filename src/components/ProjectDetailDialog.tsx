"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X, Github, ExternalLink, Calendar, CheckCircle, AlertCircle, Code2, Layers, Zap, Target } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChallengeSection, Challenge } from "./ChallengeSection";
import { EmptyState } from "./EmptyState";
import { useTheme } from "@/hooks/useTheme";
import ModernProjectDetailDialog from "./ModernProjectDetailDialog";

const DialogPortal = DialogPrimitive.Portal;
const DialogClose = DialogPrimitive.Close;

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-background/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
  />
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => {
  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Content
        ref={ref}
        className={cn(
          "fixed left-[50%] top-[50%] z-50 grid w-full max-w-5xl translate-x-[-50%] translate-y-[-50%] gap-0 bg-background shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg max-h-[90vh] overflow-hidden",
          className
        )}
        {...props}
      >
        {children}
        <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground z-50">
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </DialogClose>
      </DialogPrimitive.Content>
    </DialogPortal>
  );
});
DialogContent.displayName = DialogPrimitive.Content.displayName;

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
  }, [ref]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 10%", "end 50%"],
  });

  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height]);
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
          style={{ height: height + "px" }}
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
}

interface ProjectDetailDialogProps {
  project: Project;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function ProjectDetailDialog({ project, open, onOpenChange }: ProjectDetailDialogProps) {
  const { theme } = useTheme();

  // 始终在顶层调用 hooks，避免渲染路径不一致
  const [activeImage, setActiveImage] = React.useState(0);

  // 先完成 hooks 调用，再根据主题决定渲染路径
  const timelineData: TimelineEntry[] = React.useMemo(() => {
    if (!project.timeline) return [];

    return project.timeline.map((event) => ({
      title: new Date(event.date).toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long'
      }),
      content: (
        <div>
          <p className="text-foreground text-sm font-normal mb-4">
            {event.title}
          </p>
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

  const images = React.useMemo(
    () =>
      project.screenshots && project.screenshots.length > 0
        ? project.screenshots
        : project.image
          ? [project.image]
          : [],
    [project.screenshots, project.image]
  );

  React.useEffect(() => {
    setActiveImage(0);
  }, [project.id]);

  if (theme === 'modern') {
    return <ModernProjectDetailDialog project={project} open={open} onOpenChange={onOpenChange} />;
  }

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogOverlay />
        <DialogPrimitive.Content className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-5xl translate-x-[-50%] translate-y-[-50%] gap-0 bg-background shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg max-h-[90vh] overflow-hidden">
          <DialogPrimitive.Title className="sr-only">{project.title}</DialogPrimitive.Title>
          <DialogPrimitive.Description className="sr-only">{project.description}</DialogPrimitive.Description>
          <ScrollArea className="h-[90vh]">
            <div className="relative">
              {/* Hero Section with Image Gallery */}
              <div className="relative h-[400px] bg-muted">
                <motion.img
                  key={activeImage}
                  src={images[activeImage]}
                  alt={`${project.title} screenshot ${activeImage + 1}`}
                  className="w-full h-full object-cover"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />

                {/* Image Thumbnails */}
                {images.length > 1 && (
                  <div className="absolute inset-x-0 bottom-0 flex justify-center">
                    <div className="group relative flex flex-col items-center">
                      <span
                        className="absolute bottom-0 left-1/2 hidden h-16 w-40 -translate-x-1/2 md:block"
                        aria-hidden="true"
                      />
                      <button
                        type="button"
                        className="absolute bottom-2 left-1/2 z-10 hidden h-2 w-16 -translate-x-1/2 items-center justify-center rounded-full md:flex"
                        aria-label="显示缩略图"
                      >
                        <span className="h-1 w-8 rounded-full bg-foreground/60" />
                      </button>
                      <div
                        className={cn(
                          "absolute bottom-6 left-1/2 z-10 -translate-x-1/2 flex gap-2 rounded-lg bg-background/80 p-2 backdrop-blur-sm transition-all duration-300",
                          "opacity-100 translate-y-0",
                          "md:opacity-0 md:translate-y-3 md:pointer-events-none",
                          "md:group-hover:opacity-100 md:group-hover:translate-y-0 md:group-hover:pointer-events-auto",
                          "md:group-focus-within:opacity-100 md:group-focus-within:translate-y-0 md:group-focus-within:pointer-events-auto"
                        )}
                      >
                        {images.map((img, idx) => (
                          <button
                            key={idx}
                            onClick={() => setActiveImage(idx)}
                            className={cn(
                              "w-24 h-18 rounded overflow-hidden border transition-all",
                              activeImage === idx ? "border-primary scale-110" : "border-transparent opacity-60 hover:opacity-100"
                            )}
                          >
                            <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Status Badge */}
                <div className="absolute top-4 right-4">
                  <Badge
                    variant={project.status === "live" ? "default" : project.status === "development" ? "secondary" : "outline"}
                    className="capitalize"
                  >
                    {project.status === "live" && <CheckCircle className="w-3 h-3 mr-1" />}
                    {project.status === "development" && <Zap className="w-3 h-3 mr-1" />}
                    {project.status}
                  </Badge>
                </div>
              </div>

              {/* Content Section */}
              <div className="p-6 space-y-6">
                {/* Header */}
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

                {/* Tabs Section */}
                <Tabs defaultValue="overview" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="overview">
                      <Layers className="w-4 h-4 mr-2" />
                      概览
                    </TabsTrigger>
                    <TabsTrigger value="tech">
                      <Code2 className="w-4 h-4 mr-2" />
                      技术栈
                    </TabsTrigger>
                    <TabsTrigger value="challenges">
                      <Target className="w-4 h-4 mr-2" />
                      挑战与方案
                    </TabsTrigger>
                    <TabsTrigger value="timeline">
                      <Calendar className="w-4 h-4 mr-2" />
                      时间线
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="space-y-4 mt-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>About This Project</CardTitle>
                      </CardHeader>
                      <CardContent>
                        {(project.detailedDescription || project.description) ? (
                          <p className="text-muted-foreground leading-relaxed">
                            {project.detailedDescription || project.description}
                          </p>
                        ) : (
                          <EmptyState message="暂无项目详情" variant="classic" />
                        )}
                      </CardContent>
                    </Card>

                    {/* 功能特性 */}
                    {project.features && project.features.length > 0 ? (
                      <div>
                        <h3 className="text-lg font-semibold mb-3">核心功能</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {project.features.map((feature, idx) => (
                            <motion.div
                              key={idx}
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
                  </TabsContent>

                  <TabsContent value="tech" className="space-y-4 mt-6">
                    {project.techStack && project.techStack.length > 0 ? (
                      <div>
                        <h3 className="text-lg font-semibold mb-3">技术栈</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {project.techStack.map((tech, idx) => (
                            <motion.div
                              key={idx}
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
                      </div>
                    ) : (
                      <EmptyState message="暂无技术栈信息" variant="classic" />
                    )}
                  </TabsContent>

                  <TabsContent value="challenges" className="space-y-4 mt-6">
                    {project.challenges && project.challenges.length > 0 ? (
                      <ChallengeSection challenges={project.challenges} />
                    ) : (
                      <EmptyState message="暂无挑战与解决方案" variant="classic" />
                    )}
                  </TabsContent>

                  <TabsContent value="timeline" className="mt-6">
                    {timelineData.length > 0 ? (
                      <div>
                        <h3 className="text-lg font-semibold mb-3">项目时间线</h3>
                        <Timeline data={timelineData} />
                      </div>
                    ) : (
                      <EmptyState message="暂无时间线数据" variant="classic" />
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
  );
}

export default ProjectDetailDialog;
