import React, { useState, useRef, useCallback } from 'react';
import { Upload, X, Image as ImageIcon, Link, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface ImageUploadProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  value,
  onChange,
  className,
}) => {
  const [mode, setMode] = useState<'upload' | 'url'>('upload');
  const [isDragging, setIsDragging] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const processFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) {
      toast({
        title: '文件类型错误',
        description: '请上传图片文件（JPG、PNG、WEBP 等）',
        variant: 'destructive',
      });
      return;
    }

    // 限制文件大小为 5MB
    const MAX_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      toast({
        title: '文件过大',
        description: '图片大小不能超过 5MB',
        variant: 'destructive',
      });
      return;
    }

    setIsUploading(true);
    setProgress(0);

    // Simulate upload progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + 10;
      });
    }, 100);

    const reader = new FileReader();
    reader.onload = (e) => {
      setTimeout(() => {
        clearInterval(interval);
        setProgress(100);
        if (e.target?.result) {
          onChange(e.target.result as string);
        }
        setIsUploading(false);
      }, 1000);
    };
    reader.readAsDataURL(file);
  }, [onChange, toast]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files?.[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  }, [processFile]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      processFile(e.target.files[0]);
    }
  };

  if (value) {
    return (
      <div className={cn("relative rounded-lg overflow-hidden border bg-muted/30 group", className)}>
        <img src={value} alt="Project cover" className="w-full h-48 object-cover transition-opacity group-hover:opacity-90" />
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onChange('')}
            className="gap-2"
          >
            <X className="w-4 h-4" />
            移除图片
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center space-x-2">
        <Button
          type="button"
          variant={mode === 'upload' ? 'secondary' : 'ghost'}
          size="sm"
          onClick={() => setMode('upload')}
          className="gap-2"
        >
          <Upload className="w-4 h-4" />
          上传图片
        </Button>
        <Button
          type="button"
          variant={mode === 'url' ? 'secondary' : 'ghost'}
          size="sm"
          onClick={() => setMode('url')}
          className="gap-2"
        >
          <Link className="w-4 h-4" />
          图片 URL
        </Button>
      </div>

      {mode === 'url' ? (
        <div className="space-y-2">
          <Label htmlFor="image-url">图片链接</Label>
          <Input
            id="image-url"
            placeholder="https://example.com/image.jpg"
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
        </div>
      ) : (
        <div
          className={cn(
            "border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer",
            isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50",
            isUploading && "pointer-events-none opacity-60"
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleFileSelect}
          />

          {isUploading ? (
            <div className="space-y-4">
              <Loader2 className="w-8 h-8 mx-auto animate-spin text-primary" />
              <div className="space-y-2">
                <p className="text-sm font-medium">正在上传...</p>
                <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-primary h-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                <ImageIcon className="w-5 h-5 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium">点击或拖拽上传图片</p>
              <p className="text-xs text-muted-foreground">支持 JPG, PNG, WEBP</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
