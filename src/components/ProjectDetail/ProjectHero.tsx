import * as React from 'react';
import { motion } from 'framer-motion';
import { Github, ExternalLink, CheckCircle, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { ProjectHeroProps } from './types';

export const ProjectHero: React.FC<ProjectHeroProps> = ({
  project,
  variant,
  activeImage,
  onActiveImageChange,
  className,
}) => {
  const images = React.useMemo(
    () =>
      project.screenshots && project.screenshots.length > 0
        ? project.screenshots
        : project.image
          ? [project.image]
          : [],
    [project.screenshots, project.image]
  );

  if (variant === 'modern') {
    return (
      <div
        className={cn(
          'relative h-[400px] bg-gradient-to-br from-primary/20 via-primary/10 to-background overflow-hidden',
          className
        )}
      >
        {images[0] && (
          <>
            <div
              className="absolute inset-0 bg-cover bg-center opacity-40 blur-sm"
              style={{ backgroundImage: `url(${images[0]})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
          </>
        )}

        <div className="relative h-full flex flex-col justify-end p-8">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h2 className="text-4xl font-bold mb-3 text-foreground">{project.title}</h2>
              <p className="text-lg text-muted-foreground max-w-2xl">{project.description}</p>
            </div>
          </div>

          {project.tags && project.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {project.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="px-3 py-1">
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
    );
  }

  return (
    <div className={cn('relative h-[400px] bg-muted', className)}>
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
                'absolute bottom-6 left-1/2 z-10 -translate-x-1/2 flex gap-2 rounded-lg bg-background/80 p-2 backdrop-blur-sm transition-all duration-300',
                'opacity-100 translate-y-0',
                'md:opacity-0 md:translate-y-3 md:pointer-events-none',
                'md:group-hover:opacity-100 md:group-hover:translate-y-0 md:group-hover:pointer-events-auto',
                'md:group-focus-within:opacity-100 md:group-focus-within:translate-y-0 md:group-focus-within:pointer-events-auto'
              )}
            >
              {images.map((img, idx) => (
                <button
                  key={img}
                  onClick={() => onActiveImageChange(idx)}
                  className={cn(
                    'w-24 h-18 rounded overflow-hidden border transition-all',
                    activeImage === idx
                      ? 'border-primary scale-110'
                      : 'border-transparent opacity-60 hover:opacity-100'
                  )}
                >
                  <img
                    src={img}
                    alt={`Thumbnail ${idx + 1}`}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="absolute top-4 right-4">
        <Badge
          variant={
            project.status === 'live'
              ? 'default'
              : project.status === 'development'
                ? 'secondary'
                : 'outline'
          }
          className="capitalize"
        >
          {project.status === 'live' && <CheckCircle className="w-3 h-3 mr-1" />}
          {project.status === 'development' && <Zap className="w-3 h-3 mr-1" />}
          {project.status}
        </Badge>
      </div>
    </div>
  );
};
