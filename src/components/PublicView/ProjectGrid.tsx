import React from 'react';
import { Search, ExternalLink, Github, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { categories } from '@/constants/defaultProjects';
import type { Project } from '@/types/project';

interface ProjectGridProps {
  projects: Project[];
  filteredProjects: Project[];
  isLoading: boolean;
  showImages: boolean;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  getStatusColor: (status: string) => string;
  onViewDetail: (project: Project) => void;
}

export const ProjectGrid: React.FC<ProjectGridProps> = ({
  filteredProjects,
  isLoading,
  showImages,
  selectedCategory,
  onCategoryChange,
  getStatusColor,
  onViewDetail,
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <Card key={`skeleton-${index}`} className="flex flex-col overflow-hidden">
            <Skeleton className="h-48 w-full" />
            <CardHeader className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-5 w-16" />
              </div>
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="flex flex-wrap gap-2">
                <Skeleton className="h-5 w-12" />
                <Skeleton className="h-5 w-14" />
                <Skeleton className="h-5 w-10" />
              </div>
            </CardContent>
            <CardFooter className="flex gap-2 pt-4 border-t border-border">
              <Skeleton className="h-9 w-16" />
              <Skeleton className="h-9 flex-1" />
              <Skeleton className="h-9 w-16" />
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <Tabs defaultValue="all" className="w-full" onValueChange={onCategoryChange} value={selectedCategory}>
      <TabsList className="grid w-full max-w-2xl grid-cols-5 mb-8">
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <TabsTrigger key={category.value} value={category.value} className="flex items-center gap-2">
              <Icon className="h-4 w-4" />
              <span className="hidden sm:inline">{category.label}</span>
            </TabsTrigger>
          );
        })}
      </TabsList>

      {categories.map((category) => (
        <TabsContent key={category.value} value={category.value} className="mt-0">
          {filteredProjects.length === 0 ? (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">No projects found</h3>
              <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project) => (
                <Card
                  key={project.id}
                  className="group hover:shadow-lg transition-all duration-300 hover:border-primary/50 flex flex-col overflow-hidden"
                >
                  {showImages && project.image && (
                    <div className="relative w-full h-48 overflow-hidden">
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110 group-hover:brightness-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  )}
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <CardTitle className="text-xl group-hover:text-primary transition-colors">
                        {project.title}
                      </CardTitle>
                      <Badge
                        variant="outline"
                        className={`${getStatusColor(project.status)} capitalize text-xs`}
                      >
                        {project.status}
                      </Badge>
                    </div>
                    <CardDescription className="line-clamp-3">{project.description}</CardDescription>
                  </CardHeader>

                  <CardContent className="flex-grow">
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>

                  <CardFooter className="flex gap-2 pt-4 border-t border-border">
                    <Button variant="outline" size="sm" onClick={() => onViewDetail(project)}>
                      <Info className="h-4 w-4 mr-2" />
                      详情
                    </Button>
                    <Button variant="default" size="sm" className="flex-1" asChild>
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2"
                      >
                        <ExternalLink className="h-4 w-4" />
                        View Live
                      </a>
                    </Button>
                    {project.githubUrl && (
                      <Button variant="outline" size="sm" asChild>
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-2"
                        >
                          <Github className="h-4 w-4" />
                          <span className="hidden sm:inline">Code</span>
                        </a>
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      ))}
    </Tabs>
  );
};
