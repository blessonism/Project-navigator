import React from 'react';
import { Image as ImageIcon } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';

interface SettingsCardProps {
  showImages: boolean;
  onShowImagesChange: (show: boolean) => void;
}

export const SettingsCard: React.FC<SettingsCardProps> = ({
  showImages,
  onShowImagesChange,
}) => {
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>显示设置</CardTitle>
        <CardDescription>配置项目展示的显示选项</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5 text-muted-foreground" />
            <div>
              <Label htmlFor="admin-image-toggle" className="text-base font-medium">
                显示项目图片
              </Label>
              <p className="text-sm text-muted-foreground">在项目卡片中显示封面图片</p>
            </div>
          </div>
          <Switch
            id="admin-image-toggle"
            checked={showImages}
            onCheckedChange={onShowImagesChange}
          />
        </div>

        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex-1">
            <Label className="text-base font-medium">主题样式</Label>
            <p className="text-sm text-muted-foreground">选择您喜欢的主题样式</p>
          </div>
          <ThemeSwitcher />
        </div>
      </CardContent>
    </Card>
  );
};
