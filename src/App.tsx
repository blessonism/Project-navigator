import React from 'react';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { useProjects } from '@/hooks/useProjects';
import { AdminView } from '@/components/AdminView';
import { PublicView } from '@/components/PublicView';

const App: React.FC = () => {
  const auth = useAdminAuth();
  const projectsHook = useProjects();

  if (auth.isAdminMode) {
    return (
      <AdminView
        projects={projectsHook.projects}
        isProjectsLoading={projectsHook.isProjectsLoading}
        showImages={projectsHook.showImages}
        onShowImagesChange={projectsHook.setShowImages}
        getStatusColor={projectsHook.getStatusColor}
        isDialogOpen={projectsHook.isDialogOpen}
        onDialogOpenChange={projectsHook.setIsDialogOpen}
        editingProject={projectsHook.editingProject}
        formData={projectsHook.formData}
        currentDraftId={projectsHook.currentDraftId}
        importPreview={projectsHook.importPreview}
        onFormDataChange={projectsHook.setFormData}
        onAddProject={projectsHook.handleAddProject}
        onEditProject={projectsHook.handleEditProject}
        onSaveProject={projectsHook.handleSaveProject}
        onSaveDraft={async () => {
          await projectsHook.handleSaveDraft();
        }}
        drafts={projectsHook.drafts}
        onRestoreDraft={async (draftId) => {
          await projectsHook.restoreDraft(draftId);
        }}
        onDeleteDraft={async (draftId) => {
          await projectsHook.deleteDraft(draftId);
        }}
        importError={projectsHook.importError}
        isImporting={projectsHook.isImporting}
        importSessionPasscode={projectsHook.importSessionPasscode}
        onImportSessionPasscodeChange={projectsHook.setImportSessionPasscode}
        frontendAiConfig={projectsHook.frontendAiConfig}
        onFrontendAiConfigChange={projectsHook.setFrontendAiConfig}
        onSaveAiSettings={projectsHook.saveAiSettings}
        isAiSettingsDirty={projectsHook.isAiSettingsDirty}
        isSavingAiSettings={projectsHook.isSavingAiSettings}
        aiModelOptions={projectsHook.aiModelOptions}
        isLoadingAiModels={projectsHook.isLoadingAiModels}
        onLoadAiModels={async () => {
          await projectsHook.loadAiModels();
        }}
        onTestAiConfig={async () => {
          await projectsHook.testAiConfig();
        }}
        onImportFromUrl={projectsHook.importFromUrl}
        batchImportPreview={projectsHook.batchImportPreview}
        onAnalyzeBatchImport={projectsHook.analyzeBatchImport}
        onImportBatch={projectsHook.importBatch}
        onClearBatchImportPreview={projectsHook.clearBatchImportPreview}
        deleteProjectId={projectsHook.deleteProjectId}
        onDeleteProjectIdChange={projectsHook.setDeleteProjectId}
        onDeleteProject={projectsHook.handleDeleteProject}
        onConfirmDelete={projectsHook.confirmDelete}
        onReorder={projectsHook.reorderProjects}
        onBackToPublic={() => auth.setIsAdminMode(false)}
        onLogout={auth.handleLogout}
      />
    );
  }

  return (
    <PublicView
      projects={projectsHook.projects}
      filteredProjects={projectsHook.filteredProjects}
      isProjectsLoading={projectsHook.isProjectsLoading}
      showImages={projectsHook.showImages}
      searchQuery={projectsHook.searchQuery}
      onSearchChange={projectsHook.setSearchQuery}
      selectedCategory={projectsHook.selectedCategory}
      onCategoryChange={projectsHook.setSelectedCategory}
      getStatusColor={projectsHook.getStatusColor}
      selectedProject={projectsHook.selectedProject}
      isDetailDialogOpen={projectsHook.isDetailDialogOpen}
      onDetailDialogChange={projectsHook.setIsDetailDialogOpen}
      onViewDetail={(project) => {
        projectsHook.setSelectedProject(project);
        projectsHook.setIsDetailDialogOpen(true);
      }}
      isAuthDialogOpen={auth.isAuthDialogOpen}
      onAuthDialogChange={auth.setIsAuthDialogOpen}
      password={auth.password}
      onPasswordChange={auth.setPassword}
      showPassword={auth.showPassword}
      onShowPasswordChange={auth.setShowPassword}
      authError={auth.authError}
      onAuthSubmit={auth.handlePasswordSubmit}
      onAuthCancel={auth.resetAuthDialog}
    />
  );
};

export default App;
