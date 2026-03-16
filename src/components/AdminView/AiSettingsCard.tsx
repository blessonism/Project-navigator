import React from 'react';
import { Bot, RefreshCw, FlaskConical, Save } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { FrontendAiConfig } from '@/types/project';

interface AiSettingsCardProps {
  importSessionPasscode: string;
  onImportSessionPasscodeChange: (value: string) => void;
  frontendAiConfig: FrontendAiConfig;
  onFrontendAiConfigChange: (next: FrontendAiConfig) => void;
  aiModelOptions: string[];
  isLoadingAiModels: boolean;
  isSavingAiSettings: boolean;
  isAiSettingsDirty: boolean;
  onSaveAiSettings: () => void;
  onLoadAiModels: () => void;
  onTestAiConfig: () => void;
}

export const AiSettingsCard: React.FC<AiSettingsCardProps> = ({
  importSessionPasscode,
  onImportSessionPasscodeChange,
  frontendAiConfig,
  onFrontendAiConfigChange,
  aiModelOptions,
  isLoadingAiModels,
  isSavingAiSettings,
  isAiSettingsDirty,
  onSaveAiSettings,
  onLoadAiModels,
  onTestAiConfig,
}) => {
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-5 w-5" />
          AI 导入设置
        </CardTitle>
        <CardDescription>配置导入口令、模型参数，并支持快速连通测试与云端同步</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="settings-import-passcode">导入口令（会话级，不同步云端）</Label>
          <Input
            id="settings-import-passcode"
            type="password"
            value={importSessionPasscode}
            onChange={(event) => onImportSessionPasscodeChange(event.target.value)}
            placeholder="请输入导入口令"
          />
        </div>

        <div className="flex items-start sm:items-center justify-between gap-3 pt-1">
          <div>
            <Label className="text-sm sm:text-base font-medium">前端 AI 配置覆盖</Label>
            <p className="text-xs sm:text-sm text-muted-foreground">
              开启后优先使用当前浏览器会话中的 API 配置
            </p>
          </div>
          <Switch
            checked={frontendAiConfig.enabled}
            onCheckedChange={(checked) =>
              onFrontendAiConfigChange({
                ...frontendAiConfig,
                enabled: checked,
              })
            }
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            onClick={onSaveAiSettings}
            disabled={isLoadingAiModels || isSavingAiSettings || !isAiSettingsDirty}
          >
            <Save className="h-4 w-4 mr-2" />
            {isSavingAiSettings ? '保存中...' : '保存配置'}
          </Button>
        </div>

        {frontendAiConfig.enabled && (
          <>
            <div className="space-y-2">
              <Label htmlFor="settings-ai-key">AI API Key</Label>
              <Input
                id="settings-ai-key"
                type="password"
                value={frontendAiConfig.apiKey}
                onChange={(event) =>
                  onFrontendAiConfigChange({
                    ...frontendAiConfig,
                    apiKey: event.target.value,
                  })
                }
                placeholder="sk-..."
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="settings-ai-base-url">AI Base URL</Label>
                <Input
                  id="settings-ai-base-url"
                  value={frontendAiConfig.baseUrl}
                  onChange={(event) =>
                    onFrontendAiConfigChange({
                      ...frontendAiConfig,
                      baseUrl: event.target.value,
                    })
                  }
                  placeholder="https://api.openai.com/v1"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="settings-ai-model">AI Model</Label>
                <Input
                  id="settings-ai-model"
                  value={frontendAiConfig.model}
                  onChange={(event) =>
                    onFrontendAiConfigChange({
                      ...frontendAiConfig,
                      model: event.target.value,
                    })
                  }
                  placeholder="gpt-4.1-mini"
                />
              </div>
            </div>

            {aiModelOptions.length > 0 && (
              <div className="space-y-2">
                <Label>从列表选择模型</Label>
                <Select
                  value={frontendAiConfig.model}
                  onValueChange={(model) =>
                    onFrontendAiConfigChange({
                      ...frontendAiConfig,
                      model,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="选择模型" />
                  </SelectTrigger>
                  <SelectContent>
                    {aiModelOptions.map((model) => (
                      <SelectItem key={model} value={model}>
                        {model}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant="secondary"
                onClick={onLoadAiModels}
                disabled={isLoadingAiModels || isSavingAiSettings}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoadingAiModels ? 'animate-spin' : ''}`} />
                拉取模型
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={onTestAiConfig}
                disabled={isLoadingAiModels || isSavingAiSettings}
              >
                <FlaskConical className="h-4 w-4 mr-2" />
                快速测试
              </Button>
            </div>
          </>
        )}

        <p className="text-xs text-amber-600">
          同步策略：点“保存配置”后，AI 开关、API Key、Base URL、模型会同步到 Supabase；导入口令仍仅保存在当前浏览器会话中。
        </p>
      </CardContent>
    </Card>
  );
};
