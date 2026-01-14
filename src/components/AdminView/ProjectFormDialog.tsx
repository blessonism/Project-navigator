import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { X, Save, Layers, Image, Code2, Target, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
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
import { ImageUpload } from './ImageUpload';

interface ProjectFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingProject: Project | null;
  formData: ProjectFormData;
  onFormDataChange: (data: ProjectFormData) => void;
  onSave: () => void;
}

interface ModuleToggleProps {
  id: string;
  icon: React.ReactNode;
  label: string;
  description: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

const ModuleToggle: React.FC<ModuleToggleProps> = ({
  id,
  icon,
  label,
  description,
  checked,
  onCheckedChange,
}) => (
  <div className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
    <div className="flex-shrink-0 w-8 h-8 rounded-md bg-primary/10 text-primary flex items-center justify-center">
      {icon}
    </div>
    <div className="flex-1 min-w-0">
      <Label htmlFor={id} className="text-sm font-medium cursor-pointer">
        {label}
      </Label>
      <p className="text-xs text-muted-foreground truncate">{description}</p>
    </div>
    <Switch id={id} checked={checked} onCheckedChange={onCheckedChange} />
  </div>
);

interface FormSectionProps {
  title: string;
  description?: string;
  enabled?: boolean;
  children: React.ReactNode;
}

const FormSection: React.FC<FormSectionProps> = ({
  title,
  description,
  enabled = true,
  children,
}) => (
  <div
    className={`space-y-3 p-4 rounded-lg border ${enabled ? 'bg-card' : 'bg-muted/30 opacity-60'}`}
  >
    <div className="flex items-center justify-between">
      <div>
        <h5 className="text-sm font-medium">{title}</h5>
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
      </div>
      {!enabled && (
        <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">已禁用</span>
      )}
    </div>
    <div className={enabled ? '' : 'pointer-events-none'}>{children}</div>
  </div>
);

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

        <div className="space-y-6 py-4">
          {/* 基本信息 */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <div className="w-1 h-4 bg-primary rounded-full" />
              基本信息
            </h4>

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

            <div className="grid grid-cols-2 gap-4">
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
                <Label htmlFor="githubUrl">GitHub 链接</Label>
                <Input
                  id="githubUrl"
                  value={formData.githubUrl}
                  onChange={(e) => onFormDataChange({ ...formData, githubUrl: e.target.value })}
                  placeholder="https://github.com/user/repo"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">卡片封面图</Label>
              <ImageUpload
                value={formData.image}
                onChange={(value) => onFormDataChange({ ...formData, image: value })}
                className="w-full"
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
          </div>

          {/* 详情页模块配置 */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <div className="w-1 h-4 bg-primary rounded-full" />
              详情页模块配置
            </h4>
            <p className="text-xs text-muted-foreground -mt-2">选择在项目详情页中显示哪些模块</p>

            <div className="grid grid-cols-2 gap-3">
              <ModuleToggle
                id="showOverview"
                icon={<Layers className="w-4 h-4" />}
                label="概览"
                description="项目介绍与核心功能"
                checked={formData.showOverview}
                onCheckedChange={(checked) =>
                  onFormDataChange({ ...formData, showOverview: checked })
                }
              />
              <ModuleToggle
                id="showGallery"
                icon={<Image className="w-4 h-4" />}
                label="Gallery"
                description="项目截图画廊 (Modern)"
                checked={formData.showGallery}
                onCheckedChange={(checked) =>
                  onFormDataChange({ ...formData, showGallery: checked })
                }
              />
              <ModuleToggle
                id="showTechStack"
                icon={<Code2 className="w-4 h-4" />}
                label="技术栈"
                description="使用的技术和工具"
                checked={formData.showTechStack}
                onCheckedChange={(checked) =>
                  onFormDataChange({ ...formData, showTechStack: checked })
                }
              />
              <ModuleToggle
                id="showChallenges"
                icon={<Target className="w-4 h-4" />}
                label="挑战与方案"
                description="开发中遇到的挑战"
                checked={formData.showChallenges}
                onCheckedChange={(checked) =>
                  onFormDataChange({ ...formData, showChallenges: checked })
                }
              />
              <ModuleToggle
                id="showTimeline"
                icon={<Calendar className="w-4 h-4" />}
                label="时间线"
                description="项目开发历程"
                checked={formData.showTimeline}
                onCheckedChange={(checked) =>
                  onFormDataChange({ ...formData, showTimeline: checked })
                }
              />
            </div>
          </div>

          {/* 详情页内容 */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <div className="w-1 h-4 bg-primary rounded-full" />
              详情页内容
            </h4>

            <FormSection
              title="概览内容"
              description="详细描述和核心功能"
              enabled={formData.showOverview}
            >
              <div className="space-y-3">
                <div className="space-y-2 min-h-[200px]">
                  <Label htmlFor="detailedDescription">详细描述</Label>
                  <Tabs defaultValue="edit" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-2">
                      <TabsTrigger value="edit">编辑</TabsTrigger>
                      <TabsTrigger value="preview">预览</TabsTrigger>
                    </TabsList>
                    <TabsContent value="edit">
                      <Textarea
                        id="detailedDescription"
                        value={formData.detailedDescription}
                        onChange={(e) =>
                          onFormDataChange({ ...formData, detailedDescription: e.target.value })
                        }
                        placeholder="使用 Markdown 格式编写详细介绍"
                        rows={8}
                      />
                    </TabsContent>
                    <TabsContent value="preview">
                      <ScrollArea className="h-[200px] w-full rounded-md border p-4 bg-muted/20">
                        <div className="prose dark:prose-invert prose-sm max-w-none">
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {formData.detailedDescription || '*(暂无内容)*'}
                          </ReactMarkdown>
                        </div>
                      </ScrollArea>
                    </TabsContent>
                  </Tabs>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="features">核心功能</Label>
                  <Textarea
                    id="features"
                    value={formData.features}
                    onChange={(e) => onFormDataChange({ ...formData, features: e.target.value })}
                    placeholder="用逗号分隔，例如：用户认证, 实时通知, 数据可视化"
                    rows={2}
                  />
                </div>
              </div>
            </FormSection>

            <FormSection
              title="Gallery 截图"
              description="详情页展示的项目截图"
              enabled={formData.showGallery}
            >
              <div className="space-y-2">
                <Label htmlFor="screenshots">截图 URL</Label>
                <Textarea
                  id="screenshots"
                  value={formData.screenshots}
                  onChange={(e) => onFormDataChange({ ...formData, screenshots: e.target.value })}
                  placeholder="用逗号分隔多个 URL"
                  rows={2}
                />
              </div>
            </FormSection>

            <FormSection
              title="开发挑战"
              description="项目中遇到的技术挑战"
              enabled={formData.showChallenges}
            >
              <div className="space-y-2">
                <Label htmlFor="challenges">挑战内容 (JSON)</Label>
                <Textarea
                  id="challenges"
                  value={formData.challenges}
                  onChange={(e) => onFormDataChange({ ...formData, challenges: e.target.value })}
                  placeholder='[{"title": "性能优化", "description": "...", "solution": "..."}]'
                  rows={3}
                  className="font-mono text-xs"
                />
              </div>
            </FormSection>

            <FormSection
              title="项目时间线"
              description="开发历程和里程碑"
              enabled={formData.showTimeline}
            >
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
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
                  <Label htmlFor="timelineData">时间线事件 (JSON)</Label>
                  <Textarea
                    id="timelineData"
                    value={formData.timelineData}
                    onChange={(e) =>
                      onFormDataChange({ ...formData, timelineData: e.target.value })
                    }
                    placeholder='[{"id": "1", "date": "2024-01-15", "title": "项目启动", "description": "...", "type": "milestone"}]'
                    rows={4}
                    className="font-mono text-xs"
                  />
                  <p className="text-xs text-muted-foreground">
                    类型：milestone / feature / bugfix / release
                  </p>
                </div>
              </div>
            </FormSection>
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
