import React from 'react';
import { X, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
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
import type { Project, ProjectFormData } from '@/types/project';

interface ProjectFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingProject: Project | null;
  formData: ProjectFormData;
  onFormDataChange: (data: ProjectFormData) => void;
  onSave: () => void;
}

export const ProjectFormDialog: React.FC<ProjectFormDialogProps> = ({
  open,
  onOpenChange,
  editingProject,
  formData,
  onFormDataChange,
  onSave,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editingProject ? '编辑项目' : '添加新项目'}</DialogTitle>
          <DialogDescription>
            {editingProject ? '修改项目信息' : '填写项目信息以添加到您的作品集'}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">项目标题 *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => onFormDataChange({ ...formData, title: e.target.value })}
              placeholder="例如：E-Commerce Platform"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">项目描述 *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => onFormDataChange({ ...formData, description: e.target.value })}
              placeholder="简要描述您的项目功能和特点"
              rows={3}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">项目分类 *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => onFormDataChange({ ...formData, category: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="web">Web Apps</SelectItem>
                  <SelectItem value="mobile">Mobile</SelectItem>
                  <SelectItem value="tool">Tools</SelectItem>
                  <SelectItem value="analytics">Analytics</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">项目状态 *</Label>
              <Select
                value={formData.status}
                onValueChange={(value: 'live' | 'development' | 'archived') =>
                  onFormDataChange({ ...formData, status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="live">Live</SelectItem>
                  <SelectItem value="development">Development</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="liveUrl">在线链接 *</Label>
            <Input
              id="liveUrl"
              value={formData.liveUrl}
              onChange={(e) => onFormDataChange({ ...formData, liveUrl: e.target.value })}
              placeholder="https://example.com"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="githubUrl">GitHub 链接（可选）</Label>
            <Input
              id="githubUrl"
              value={formData.githubUrl}
              onChange={(e) => onFormDataChange({ ...formData, githubUrl: e.target.value })}
              placeholder="https://github.com/user/repo"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="image">卡片封面图</Label>
            <Input
              id="image"
              value={formData.image}
              onChange={(e) => onFormDataChange({ ...formData, image: e.target.value })}
              placeholder="https://example.com/cover.jpg"
            />
            <p className="text-xs text-muted-foreground">
              显示在项目列表卡片上的封面图片，建议尺寸 800×600
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="tags">技术标签 *</Label>
            <Input
              id="tags"
              value={formData.tags}
              onChange={(e) => onFormDataChange({ ...formData, tags: e.target.value })}
              placeholder="用逗号分隔，例如：React, Node.js, MongoDB"
            />
          </div>

          <div className="border-t pt-4 mt-4">
            <h4 className="text-sm font-semibold mb-3 text-muted-foreground">详情页内容（可选）</h4>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="detailedDescription">详细描述（支持 Markdown）</Label>
                <Textarea
                  id="detailedDescription"
                  value={formData.detailedDescription}
                  onChange={(e) =>
                    onFormDataChange({ ...formData, detailedDescription: e.target.value })
                  }
                  placeholder="使用 Markdown 格式编写详细介绍，支持标题、列表、链接等"
                  rows={5}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="screenshots">详情页截图（Gallery）</Label>
                <Textarea
                  id="screenshots"
                  value={formData.screenshots}
                  onChange={(e) => onFormDataChange({ ...formData, screenshots: e.target.value })}
                  placeholder="https://example.com/screenshot1.jpg, https://example.com/screenshot2.jpg"
                  rows={3}
                />
                <p className="text-xs text-muted-foreground">
                  在详情页 Gallery 标签中展示的多张截图，用逗号分隔多个 URL
                </p>
              </div>

              <div className="flex items-center justify-between py-3 px-4 rounded-lg bg-muted/50">
                <div>
                  <Label htmlFor="showGallery" className="text-sm font-medium">
                    显示 Gallery 标签
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    关闭后详情页将隐藏图片画廊（仅 Modern 主题）
                  </p>
                </div>
                <Switch
                  id="showGallery"
                  checked={formData.showGallery}
                  onCheckedChange={(checked) => onFormDataChange({ ...formData, showGallery: checked })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="features">核心功能</Label>
                <Textarea
                  id="features"
                  value={formData.features}
                  onChange={(e) => onFormDataChange({ ...formData, features: e.target.value })}
                  placeholder="用逗号分隔，例如：用户认证, 实时通知, 数据可视化"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="challenges">开发挑战</Label>
                <Textarea
                  id="challenges"
                  value={formData.challenges}
                  onChange={(e) => onFormDataChange({ ...formData, challenges: e.target.value })}
                  placeholder="用逗号分隔，例如：性能优化, 跨浏览器兼容, 复杂状态管理"
                  rows={3}
                />
              </div>
            </div>
          </div>

          <div className="border-t pt-4 mt-4">
            <h4 className="text-sm font-semibold mb-3 text-muted-foreground">项目时间线（可选）</h4>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">开始日期</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => onFormDataChange({ ...formData, startDate: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration">开发周期</Label>
                  <Input
                    id="duration"
                    value={formData.duration}
                    onChange={(e) => onFormDataChange({ ...formData, duration: e.target.value })}
                    placeholder="例如：3 个月"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="timelineData">时间线事件（JSON 格式）</Label>
                <Textarea
                  id="timelineData"
                  value={formData.timelineData}
                  onChange={(e) => onFormDataChange({ ...formData, timelineData: e.target.value })}
                  placeholder={`JSON 格式示例：
[
  {
    "id": "1",
    "date": "2024-01-15",
    "title": "项目启动",
    "description": "完成需求分析和技术选型",
    "type": "milestone"
  },
  {
    "id": "2",
    "date": "2024-03-20",
    "title": "核心功能完成",
    "description": "实现用户认证和数据管理",
    "type": "feature"
  }
]`}
                  rows={8}
                  className="font-mono text-xs"
                />
                <p className="text-xs text-muted-foreground">
                  事件类型：milestone（里程碑）、feature（新功能）、bugfix（修复）、release（发布）
                </p>
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            <X className="h-4 w-4 mr-2" />
            取消
          </Button>
          <Button onClick={onSave}>
            <Save className="h-4 w-4 mr-2" />
            保存
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
