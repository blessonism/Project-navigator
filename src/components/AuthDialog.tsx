import React from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  password: string;
  onPasswordChange: (password: string) => void;
  showPassword: boolean;
  onShowPasswordChange: (show: boolean) => void;
  authError: string;
  onSubmit: () => void;
  onCancel: () => void;
}

export const AuthDialog: React.FC<AuthDialogProps> = ({
  open,
  onOpenChange,
  password,
  onPasswordChange,
  showPassword,
  onShowPasswordChange,
  authError,
  onSubmit,
  onCancel,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>管理员身份验证</DialogTitle>
          <DialogDescription>
            请输入管理员密码以访问项目管理功能
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="admin-password">密码</Label>
            <div className="relative">
              <Input
                id="admin-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => onPasswordChange(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    onSubmit();
                  }
                }}
                placeholder="请输入密码"
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                onClick={() => onShowPasswordChange(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            </div>
            {authError && (
              <p className="text-sm text-destructive">{authError}</p>
            )}
          </div>
          <div className="text-xs text-muted-foreground">
            <p>提示：您可以通过以下方式访问管理功能：</p>
            <ul className="list-disc list-inside mt-1 space-y-1">
              <li>在 URL 后添加 ?admin 参数</li>
              <li>按下快捷键 Ctrl+Shift+A</li>
            </ul>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>
            取消
          </Button>
          <Button onClick={onSubmit}>
            验证
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
