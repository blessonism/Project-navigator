import React from 'react';
import { FileClock, RotateCcw, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { ProjectDraft } from '@/types/project';

interface DraftListCardProps {
  drafts: ProjectDraft[];
  onRestoreDraft: (draftId: string) => void;
  onDeleteDraft: (draftId: string) => void;
}

const formatTime = (value: string): string => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '未知时间';
  }

  return date.toLocaleString('zh-CN', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const DraftListCard: React.FC<DraftListCardProps> = ({
  drafts,
  onRestoreDraft,
  onDeleteDraft,
}) => {
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileClock className="h-5 w-5" />
          草稿箱
        </CardTitle>
        <CardDescription>自动保存与手动保存的项目草稿，可随时恢复继续编辑</CardDescription>
      </CardHeader>
      <CardContent>
        {drafts.length === 0 ? (
          <p className="text-sm text-muted-foreground">暂无草稿</p>
        ) : (
          <div className="space-y-3">
            {drafts.map((draft) => (
              <div
                key={draft.id}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 rounded-lg border"
              >
                <div className="space-y-1 min-w-0">
                  <p className="text-sm font-medium truncate">{draft.title}</p>
                  <p className="text-xs text-muted-foreground truncate">{draft.sourceUrl || '手动草稿'}</p>
                  <p className="text-xs text-muted-foreground">更新时间：{formatTime(draft.updatedAt)}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => onRestoreDraft(draft.id)}>
                    <RotateCcw className="h-4 w-4 mr-1" />
                    恢复
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => onDeleteDraft(draft.id)}>
                    <Trash2 className="h-4 w-4 mr-1" />
                    删除
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
