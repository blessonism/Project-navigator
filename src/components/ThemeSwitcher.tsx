import React from 'react';
import { Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useTheme } from '@/hooks/useTheme';
import { themes, ThemeName } from '@/lib/themes';
import { useToast } from '@/hooks/use-toast';

export const ThemeSwitcher: React.FC = () => {
  const { toast } = useToast();
  const { theme: currentTheme, setTheme } = useTheme(
    () => toast({ title: "主题已保存" }),
    (error) => toast({ title: "保存失败", description: error, variant: "destructive" })
  );

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Palette className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>选择主题</DialogTitle>
          <DialogDescription>
            选择您喜欢的主题样式，更改会立即生效
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 mt-4">
          {themes.map((theme) => (
            <Card
              key={theme.name}
              className={`cursor-pointer transition-all hover:shadow-lg ${
                currentTheme === theme.name
                  ? 'border-primary ring-2 ring-primary/20'
                  : 'hover:border-primary/50'
              }`}
              onClick={() => setTheme(theme.name as ThemeName)}
            >
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {theme.label}
                  {currentTheme === theme.name && (
                    <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded">
                      当前
                    </span>
                  )}
                </CardTitle>
                <CardDescription>{theme.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <div className="w-8 h-8 rounded bg-background border" />
                    <div className="w-8 h-8 rounded bg-primary" />
                    <div className="w-8 h-8 rounded bg-secondary" />
                    <div className="w-8 h-8 rounded bg-muted" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};
