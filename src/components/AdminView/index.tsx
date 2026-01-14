import React from 'react';
import { ArrowLeft, Plus, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Toaster } from '@/components/ui/toaster';
import { SettingsCard } from './SettingsCard';
import { ProjectList } from './ProjectList';
import { ProjectFormDialog } from './ProjectFormDialog';
import { DeleteConfirmDialog } from '@/components/DeleteConfirmDialog';
import type { Project, ProjectFormData } from '@/types/project';

interface AdminViewProps {
  projects: Project[];
  isProjectsLoading: boolean;
  showImages: boolean;
  onShowImagesChange: (show: boolean) => void;
  getStatusColor: (status: string) => string;

  isDialogOpen: boolean;
  onDialogOpenChange: (open: boolean) => void;
  editingProject: Project | null;
  formData: ProjectFormData;
  onFormDataChange: (data: ProjectFormData) => void;
  onAddProject: () => void;
  onEditProject: (project: Project) => void;
  onSaveProject: () => void;

  deleteProjectId: string | null;
  onDeleteProjectIdChange: (id: string | null) => void;
  onDeleteProject: (id: string) => void;
  onConfirmDelete: () => void;

  onReorder?: (activeId: string, overId: string) => void;

  onBackToPublic: () => void;
  onLogout: () => void;
}

export const AdminView: React.FC<AdminViewProps> = ({
  projects,
  isProjectsLoading,
  showImages,
  onShowImagesChange,
  getStatusColor,

  isDialogOpen,
  onDialogOpenChange,
  editingProject,
  formData,
  onFormDataChange,
  onAddProject,
  onEditProject,
  onSaveProject,

  deleteProjectId,
  onDeleteProjectIdChange,
  onDeleteProject,
  onConfirmDelete,

  onReorder,

  onBackToPublic,
  onLogout,
}) => {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto py-4 sm:py-6 px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 w-full sm:w-auto">
              <Button variant="ghost" size="sm" onClick={onBackToPublic} className="w-full sm:w-auto justify-start">
                <ArrowLeft className="h-4 w-4 mr-2" />
                <span className="sm:inline">返回</span>
                <span className="hidden sm:inline">展示页面</span>
              </Button>
              <div>
                <h1 className="text-xl sm:text-3xl font-bold text-foreground">项目管理</h1>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">{projects.length} 个项目</p>
              </div>
            </div>
            <div className="flex flex-row items-center gap-2 w-full sm:w-auto">
              <Button onClick={onAddProject} className="flex-1 sm:flex-none">
                <Plus className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">添加项目</span>
                <span className="sm:hidden ml-2">添加</span>
              </Button>
              <Button variant="outline" onClick={onLogout} className="flex-1 sm:flex-none">
                <LogOut className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">退出登录</span>
                <span className="sm:hidden ml-2">退出</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto py-4 sm:py-8 px-4 sm:px-6">
        <SettingsCard showImages={showImages} onShowImagesChange={onShowImagesChange} />

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">所有项目</h2>
          <ProjectList
            projects={projects}
            isLoading={isProjectsLoading}
            getStatusColor={getStatusColor}
            onEdit={onEditProject}
            onDelete={onDeleteProject}
            onReorder={onReorder}
          />
        </div>
      </main>

      <ProjectFormDialog
        open={isDialogOpen}
        onOpenChange={onDialogOpenChange}
        editingProject={editingProject}
        formData={formData}
        onFormDataChange={onFormDataChange}
        onSave={onSaveProject}
      />

      <DeleteConfirmDialog
        open={deleteProjectId !== null}
        onOpenChange={() => onDeleteProjectIdChange(null)}
        onConfirm={onConfirmDelete}
      />

      <Toaster />
    </div>
  );
};

export default AdminView;
