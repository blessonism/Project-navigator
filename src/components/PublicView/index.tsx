import React from 'react';
import { Toaster } from '@/components/ui/toaster';
import { Header } from './Header';
import { ProjectGrid } from './ProjectGrid';
import { Footer } from './Footer';
import { AuthDialog } from '@/components/AuthDialog';
import ProjectDetailDialog from '@/components/ProjectDetailDialog';
import type { Project } from '@/types/project';

interface PublicViewProps {
  projects: Project[];
  filteredProjects: Project[];
  isProjectsLoading: boolean;
  showImages: boolean;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  getStatusColor: (status: string) => string;

  selectedProject: Project | null;
  isDetailDialogOpen: boolean;
  onDetailDialogChange: (open: boolean) => void;
  onViewDetail: (project: Project) => void;

  isAuthDialogOpen: boolean;
  onAuthDialogChange: (open: boolean) => void;
  password: string;
  onPasswordChange: (password: string) => void;
  showPassword: boolean;
  onShowPasswordChange: (show: boolean) => void;
  authError: string;
  onAuthSubmit: () => void;
  onAuthCancel: () => void;
}

export const PublicView: React.FC<PublicViewProps> = ({
  projects,
  filteredProjects,
  isProjectsLoading,
  showImages,
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  getStatusColor,

  selectedProject,
  isDetailDialogOpen,
  onDetailDialogChange,
  onViewDetail,

  isAuthDialogOpen,
  onAuthDialogChange,
  password,
  onPasswordChange,
  showPassword,
  onShowPasswordChange,
  authError,
  onAuthSubmit,
  onAuthCancel,
}) => {
  return (
    <div className="min-h-screen bg-background">
      <Header
        projectCount={projects.length}
        filteredCount={filteredProjects.length}
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
      />

      <main className="container mx-auto py-8">
        <ProjectGrid
          projects={projects}
          filteredProjects={filteredProjects}
          isLoading={isProjectsLoading}
          showImages={showImages}
          selectedCategory={selectedCategory}
          onCategoryChange={onCategoryChange}
          getStatusColor={getStatusColor}
          onViewDetail={onViewDetail}
        />
      </main>

      <Footer />

      <AuthDialog
        open={isAuthDialogOpen}
        onOpenChange={onAuthDialogChange}
        password={password}
        onPasswordChange={onPasswordChange}
        showPassword={showPassword}
        onShowPasswordChange={onShowPasswordChange}
        authError={authError}
        onSubmit={onAuthSubmit}
        onCancel={onAuthCancel}
      />

      {selectedProject && (
        <ProjectDetailDialog
          project={selectedProject}
          open={isDetailDialogOpen}
          onOpenChange={onDetailDialogChange}
        />
      )}

      <Toaster />
    </div>
  );
};

export default PublicView;
