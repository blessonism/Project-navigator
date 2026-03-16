import React, { useState } from 'react';
import { ArrowLeft, DownloadCloud, Plus, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Toaster } from '@/components/ui/toaster';
import { SettingsCard } from './SettingsCard';
import { AiSettingsCard } from './AiSettingsCard';
import { ProjectList } from './ProjectList';
import { ProjectFormDialog } from './ProjectFormDialog';
import { ImportProjectDialog } from './ImportProjectDialog';
import { DraftListCard } from './DraftListCard';
import { DeleteConfirmDialog } from '@/components/DeleteConfirmDialog';
import type {
  BatchImportPreview,
  FrontendAiConfig,
  ImportPreview,
  ImportSourceType,
  Project,
  ProjectDraft,
  ProjectFormData,
} from '@/types/project';

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
  currentDraftId: string | null;
  importPreview: ImportPreview | null;
  onFormDataChange: (data: ProjectFormData) => void;
  onAddProject: () => void;
  onEditProject: (project: Project) => void;
  onSaveProject: () => void;
  onSaveDraft: () => void;

  drafts: ProjectDraft[];
  onRestoreDraft: (draftId: string) => void;
  onDeleteDraft: (draftId: string) => void;

  importError: string;
  isImporting: boolean;
  importSessionPasscode: string;
  onImportSessionPasscodeChange: (value: string) => void;
  frontendAiConfig: FrontendAiConfig;
  onFrontendAiConfigChange: (next: FrontendAiConfig) => void;
  onSaveAiSettings: () => Promise<boolean>;
  isAiSettingsDirty: boolean;
  isSavingAiSettings: boolean;
  aiModelOptions: string[];
  isLoadingAiModels: boolean;
  onLoadAiModels: () => void;
  onTestAiConfig: () => void;
  onImportFromUrl: (sourceUrl: string, sourceType?: ImportSourceType) => Promise<boolean>;

  batchImportPreview: BatchImportPreview | null;
  onAnalyzeBatchImport: (jsonText: string) => BatchImportPreview;
  onImportBatch: () => Promise<{ imported: number; skipped: number; invalid: number }>;
  onClearBatchImportPreview: () => void;

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
  currentDraftId,
  importPreview,
  onFormDataChange,
  onAddProject,
  onEditProject,
  onSaveProject,
  onSaveDraft,

  drafts,
  onRestoreDraft,
  onDeleteDraft,

  importError,
  isImporting,
  importSessionPasscode,
  onImportSessionPasscodeChange,
  frontendAiConfig,
  onFrontendAiConfigChange,
  onSaveAiSettings,
  isAiSettingsDirty,
  isSavingAiSettings,
  aiModelOptions,
  isLoadingAiModels,
  onLoadAiModels,
  onTestAiConfig,
  onImportFromUrl,

  batchImportPreview,
  onAnalyzeBatchImport,
  onImportBatch,
  onClearBatchImportPreview,

  deleteProjectId,
  onDeleteProjectIdChange,
  onDeleteProject,
  onConfirmDelete,

  onReorder,

  onBackToPublic,
  onLogout,
}) => {
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);

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
              <Button
                variant="secondary"
                onClick={() => setIsImportDialogOpen(true)}
                className="flex-1 sm:flex-none"
              >
                <DownloadCloud className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">导入项目</span>
                <span className="sm:hidden ml-2">导入</span>
              </Button>
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
        <AiSettingsCard
          importSessionPasscode={importSessionPasscode}
          onImportSessionPasscodeChange={onImportSessionPasscodeChange}
          frontendAiConfig={frontendAiConfig}
          onFrontendAiConfigChange={onFrontendAiConfigChange}
          onSaveAiSettings={() => {
            void onSaveAiSettings();
          }}
          isAiSettingsDirty={isAiSettingsDirty}
          isSavingAiSettings={isSavingAiSettings}
          aiModelOptions={aiModelOptions}
          isLoadingAiModels={isLoadingAiModels}
          onLoadAiModels={onLoadAiModels}
          onTestAiConfig={onTestAiConfig}
        />
        <DraftListCard
          drafts={drafts}
          onRestoreDraft={(draftId) => onRestoreDraft(draftId)}
          onDeleteDraft={(draftId) => onDeleteDraft(draftId)}
        />

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
        currentDraftId={currentDraftId}
        importPreview={importPreview}
        onFormDataChange={onFormDataChange}
        onSave={onSaveProject}
        onSaveDraft={onSaveDraft}
      />

      <ImportProjectDialog
        open={isImportDialogOpen}
        onOpenChange={setIsImportDialogOpen}
        importError={importError}
        isImporting={isImporting}
        onImportFromUrl={onImportFromUrl}
        onAnalyzeBatchImport={onAnalyzeBatchImport}
        batchImportPreview={batchImportPreview}
        onImportBatch={async () => {
          const result = await onImportBatch();
          if (result.imported > 0) {
            setIsImportDialogOpen(false);
          }
          return result;
        }}
        onClearBatchImportPreview={onClearBatchImportPreview}
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
