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
        <div className="container mx-auto py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={onBackToPublic}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                返回展示页面
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-foreground">项目管理</h1>
                <p className="text-muted-foreground mt-1">管理您的 {projects.length} 个项目</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button onClick={onAddProject}>
                <Plus className="h-4 w-4 mr-2" />
                添加项目
              </Button>
              <Button variant="outline" onClick={onLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                退出登录
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto py-8">
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
