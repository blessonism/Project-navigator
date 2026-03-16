import React, { useMemo, useState } from 'react';
import { DownloadCloud, FileJson2, Link2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { BatchImportPreview, ImportSourceType } from '@/types/project';

interface ImportProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  importError: string;
  isImporting: boolean;
  onImportFromUrl: (sourceUrl: string, sourceType?: ImportSourceType) => Promise<boolean>;
  onAnalyzeBatchImport: (jsonText: string) => BatchImportPreview;
  batchImportPreview: BatchImportPreview | null;
  onImportBatch: () => Promise<{ imported: number; skipped: number; invalid: number }>;
  onClearBatchImportPreview: () => void;
}

export const ImportProjectDialog: React.FC<ImportProjectDialogProps> = ({
  open,
  onOpenChange,
  importError,
  isImporting,
  onImportFromUrl,
  onAnalyzeBatchImport,
  batchImportPreview,
  onImportBatch,
  onClearBatchImportPreview,
}) => {
  const [sourceUrl, setSourceUrl] = useState('');
  const [sourceTypeChoice, setSourceTypeChoice] = useState<'auto' | ImportSourceType>('auto');
  const [batchJsonText, setBatchJsonText] = useState('');

  const previewSummary = useMemo(() => {
    if (!batchImportPreview) {
      return null;
    }

    return {
      total: batchImportPreview.items.length,
      valid: batchImportPreview.validItems.length,
      duplicate: batchImportPreview.duplicateItems.length,
      invalid: batchImportPreview.invalidItems.length,
    };
  }, [batchImportPreview]);

  const handleSingleImport = async () => {
    const success = await onImportFromUrl(
      sourceUrl,
      sourceTypeChoice === 'auto' ? undefined : sourceTypeChoice
    );

    if (success) {
      onOpenChange(false);
      setSourceUrl('');
    }
  };

  const handleBatchPreview = () => {
    onAnalyzeBatchImport(batchJsonText);
  };

  const handleDialogOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      onClearBatchImportPreview();
    }
    onOpenChange(nextOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogOpenChange}>
      <DialogContent className="max-w-full sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>导入项目</DialogTitle>
          <DialogDescription>支持单条链接导入与 JSON 批量导入，导入后可继续编辑并保存</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="single" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="single">单条导入</TabsTrigger>
            <TabsTrigger value="batch">JSON 批量导入</TabsTrigger>
          </TabsList>

          <TabsContent value="single" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="source-url">项目链接</Label>
              <Input
                id="source-url"
                value={sourceUrl}
                onChange={(event) => setSourceUrl(event.target.value)}
                placeholder="https://github.com/owner/repo 或 https://example.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="source-type">来源类型</Label>
              <Select
                value={sourceTypeChoice}
                onValueChange={(value: 'auto' | ImportSourceType) => setSourceTypeChoice(value)}
              >
                <SelectTrigger id="source-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="auto">自动识别</SelectItem>
                  <SelectItem value="github">GitHub 仓库</SelectItem>
                  <SelectItem value="website">网站链接</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {importError && <p className="text-sm text-destructive">{importError}</p>}

            <Button onClick={handleSingleImport} disabled={isImporting || !sourceUrl.trim()}>
              <Link2 className="h-4 w-4 mr-2" />
              {isImporting ? '导入中...' : '开始导入并回填'}
            </Button>
          </TabsContent>

          <TabsContent value="batch" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="batch-json">批量导入 JSON</Label>
              <Textarea
                id="batch-json"
                value={batchJsonText}
                onChange={(event) => setBatchJsonText(event.target.value)}
                rows={10}
                className="font-mono text-xs"
                placeholder='[{"title":"项目A","description":"...","liveUrl":"https://a.com"}]'
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <Button onClick={handleBatchPreview} disabled={!batchJsonText.trim()}>
                <FileJson2 className="h-4 w-4 mr-2" />
                预览导入结果
              </Button>
              <Button
                variant="secondary"
                onClick={onImportBatch}
                disabled={!batchImportPreview || batchImportPreview.validItems.length === 0}
              >
                <DownloadCloud className="h-4 w-4 mr-2" />
                导入有效项
              </Button>
            </div>

            {previewSummary && (
              <div className="rounded-lg border p-3 text-sm space-y-1">
                <p>总计：{previewSummary.total}</p>
                <p className="text-green-600">有效：{previewSummary.valid}</p>
                <p className="text-amber-600">重复：{previewSummary.duplicate}</p>
                <p className="text-destructive">错误：{previewSummary.invalid}</p>
              </div>
            )}

            {batchImportPreview && (
              <ScrollArea className="h-52 rounded-md border p-3">
                <div className="space-y-2 text-sm">
                  {batchImportPreview.items.map((item) => (
                    <div key={`${item.index}-${item.status}`} className="border-b pb-2 last:border-b-0">
                      <p>
                        第 {item.index + 1} 条 · <span className="font-medium">{item.status}</span>
                      </p>
                      {item.project?.title && (
                        <p className="text-muted-foreground">标题：{item.project.title}</p>
                      )}
                      {item.errors.length > 0 && (
                        <p className="text-destructive">{item.errors.join('；')}</p>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            关闭
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
