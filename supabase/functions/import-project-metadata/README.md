# import-project-metadata Edge Function

用于管理后台的一键导入能力，接收 `sourceUrl + sourceType + sessionPasscode`，返回结构化项目信息。

## 请求体

```json
{
  "action": "import_project",
  "sourceUrl": "https://github.com/owner/repo",
  "sourceType": "github",
  "sessionPasscode": "your-passcode",
  "aiConfig": {
    "apiKey": "sk-...",
    "baseUrl": "https://api.openai.com/v1",
    "model": "gpt-4.1-mini"
  }
}
```

`aiConfig` 为可选项。  
- 不传：使用函数环境变量（`OPENAI_*`）。  
- 传入：优先使用请求内配置（适合前端临时覆盖）。  

### 拉取模型请求（快速测试）

```json
{
  "action": "list_models",
  "sessionPasscode": "your-passcode",
  "aiConfig": {
    "apiKey": "sk-...",
    "baseUrl": "https://api.openai.com/v1",
    "model": "gpt-4.1-mini"
  }
}
```

## 响应体

```json
{
  "normalizedProject": {
    "title": "项目标题",
    "description": "项目简介",
    "liveUrl": "https://example.com",
    "githubUrl": "https://github.com/owner/repo",
    "tags": ["React", "TypeScript"],
    "category": "web",
    "status": "live"
  },
  "rawMetadata": {},
  "warnings": [],
  "confidence": 0.78
}
```

## 错误码

- `INVALID_URL`
- `UNAUTHORIZED_IMPORT`
- `FETCH_FAILED`
- `AI_PARSE_FAILED`
- `RATE_LIMITED`（预留）

## 环境变量

- `IMPORT_SESSION_PASSCODE`：导入口令（必填）
- `OPENAI_API_KEY`：AI 结构化生成使用（可选，不填则退化为规则抽取）
- `OPENAI_BASE_URL`：可选，默认 `https://api.openai.com/v1`
- `OPENAI_MODEL`：可选，默认 `gpt-4.1-mini`
