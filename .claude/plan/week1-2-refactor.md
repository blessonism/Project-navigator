# Navigator 项目迭代计划 - Week 1-2

## 概述

- **目标**: P0 快速修复 + P1 性能优化 + P2 代码质量（Dialog 组件合并）
- **方案**: 原子组合架构（Strategy A）
- **预估工时**: 8-12 小时

---

## P0 快速修复（1-2 小时）

### 1.1 修复 `key={index}` 反模式（9 处）

| 文件                            | 行号                    | 修复方案                |
| ------------------------------- | ----------------------- | ----------------------- |
| `AdminView/ProjectList.tsx`     | 98                      | `key={tag}`             |
| `ProjectDetailDialog.tsx`       | 102                     | `key={img}`             |
| `ChallengeSection.tsx`          | 39                      | `key={challenge.title}` |
| `PublicView/ProjectGrid.tsx`    | 122                     | `key={tag}`             |
| `ModernProjectDetailDialog.tsx` | 100, 346, 451, 490, 526 | 各自使用稳定标识符      |

### 1.2 合并重复类型定义

- 删除 `ProjectDetailDialog.tsx:137-172` 的本地类型
- 删除 `ModernProjectDetailDialog.tsx:156-193` 的本地类型
- 统一从 `@/types/project` 导入

### 1.3 包装 console 语句

```typescript
// 替换模式
console.log(...) → if (import.meta.env.DEV) console.log(...)
console.warn(...) → if (import.meta.env.DEV) console.warn(...)
console.error(...) → if (import.meta.env.DEV) console.error(...)
```

### 1.4 更新 AGENTS.md

- 更新 App.tsx 行数：1580 → 69
- 更新项目结构反映重构后架构

---

## P1 性能优化（2-4 小时）

### 2.1 React.lazy() 懒加载

```typescript
// App.tsx 或 PublicView/index.tsx
const ProjectDetailDialog = lazy(() => import('@/components/ProjectDetailDialog'));

// 使用
<Suspense fallback={<DialogSkeleton />}>
  {selectedProject && <ProjectDetailDialog ... />}
</Suspense>
```

### 2.2 Vite manualChunks 分包

```typescript
// vite.config.ts
build: {
  rollupOptions: {
    output: {
      manualChunks: {
        'react-vendor': ['react', 'react-dom'],
        'ui-vendor': [
          '@radix-ui/react-dialog',
          '@radix-ui/react-dropdown-menu',
          '@radix-ui/react-tabs',
          '@radix-ui/react-scroll-area'
        ],
        'motion': ['framer-motion'],
      },
    },
  },
}
```

### 2.3 图片懒加载

```tsx
// 所有 <img> 标签添加
<img loading="lazy" ... />
```

---

## P2 代码质量 - Dialog 组件合并（4-8 小时）

### 3.1 新文件结构

```
src/components/ProjectDetail/
├── index.ts              # 导出入口
├── ProjectHero.tsx       # Hero 图片区 + 缩略图
├── ProjectTechStack.tsx  # 技术栈卡片
├── ProjectTimeline.tsx   # 时间线
├── ProjectChallenges.tsx # 挑战与方案
├── ProjectOverview.tsx   # 概览 + 功能特性
└── types.ts              # 组件内部类型（variant 等）
```

### 3.2 原子组件 Props 接口

```typescript
// types.ts
export type ThemeVariant = 'classic' | 'modern';

export interface BaseProjectProps {
  project: Project;
  variant: ThemeVariant;
  className?: string;
}

// ProjectHero.tsx
export interface ProjectHeroProps extends BaseProjectProps {
  activeImage: number;
  onActiveImageChange: (index: number) => void;
}

// ProjectTechStack.tsx
export interface ProjectTechStackProps extends BaseProjectProps {
  showEmptyState?: boolean;
}

// ProjectTimeline.tsx
export interface ProjectTimelineProps extends BaseProjectProps {
  useErrorBoundary?: boolean;
}

// ProjectChallenges.tsx
export interface ProjectChallengesProps extends BaseProjectProps {}

// ProjectOverview.tsx
export interface ProjectOverviewProps extends BaseProjectProps {}
```

### 3.3 主控制器重构

```typescript
// ProjectDetailDialog.tsx
function ProjectDetailDialog({ project, open, onOpenChange }: ProjectDetailDialogProps) {
  const { theme } = useTheme();
  const variant: ThemeVariant = theme === 'modern' ? 'modern' : 'classic';

  // 所有 hooks 在顶层调用（保持顺序一致）
  const [activeImage, setActiveImage] = useState(0);
  const timelineData = useMemo(() => ..., [project.timeline]);
  const images = useMemo(() => ..., [project.screenshots, project.image]);

  // 可见性逻辑
  const showOverviewTab = project.showOverview !== false;
  const showTechStackTab = project.showTechStack !== false;
  // ...

  // 根据 variant 选择布局
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={variant === 'modern' ? 'max-w-5xl' : 'max-w-4xl'}>
        <ProjectHero
          project={project}
          variant={variant}
          activeImage={activeImage}
          onActiveImageChange={setActiveImage}
        />
        <Tabs>
          {showOverviewTab && <ProjectOverview project={project} variant={variant} />}
          {showTechStackTab && <ProjectTechStack project={project} variant={variant} />}
          {/* ... */}
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
```

### 3.4 主题差异处理策略

| 组件           | Classic                | Modern               |
| -------------- | ---------------------- | -------------------- |
| **Hero**       | 标准卡片头，独立图片块 | 沉浸式，图片作为背景 |
| **TechStack**  | flex-wrap Badge        | Grid 玻璃卡片        |
| **Timeline**   | 简洁左边框             | 连接节点，脉冲动画   |
| **Challenges** | Accordion 列表         | 卡片网格，展开动画   |
| **Overview**   | 标准 prose             | 大字号，渐变强调     |

### 3.5 动画策略

```typescript
// Classic: 简洁快速
const classicVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
};

// Modern: 流畅表现力
const modernVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: 'spring', stiffness: 300, damping: 24 },
  },
};
```

---

## 实施顺序

1. **P0.1** - 修复 `key={index}`（不影响功能）
2. **P0.2** - 合并类型定义（为 P2 做准备）
3. **P0.3** - 包装 console 语句
4. **P1.1** - 配置 Vite 分包
5. **P1.2** - 添加图片懒加载
6. **P2.1** - 创建原子组件骨架
7. **P2.2** - 迁移 Hero 组件
8. **P2.3** - 迁移 TechStack 组件
9. **P2.4** - 迁移 Timeline 组件
10. **P2.5** - 迁移 Challenges 组件
11. **P2.6** - 迁移 Overview 组件
12. **P2.7** - 重构主控制器
13. **P1.3** - 添加懒加载（依赖 P2 完成）
14. **P0.4** - 更新 AGENTS.md

---

## 风险缓解

| 风险             | 缓解措施                               |
| ---------------- | -------------------------------------- |
| Hooks 顺序不一致 | 所有 useState/useMemo 在主题分支前执行 |
| 类型不匹配       | 显式处理可选字段，添加默认值           |
| UI 回归          | EmptyState variant 与主题匹配          |
| 动画冲突         | AnimatePresence mode="popLayout"       |
| 样式泄漏         | CVA 隔离主题样式                       |

---

## 验收标准

- [ ] 所有 `key={index}` 已替换
- [ ] 无重复类型定义
- [ ] 生产环境无 console 输出
- [ ] Bundle 分析显示正确分包
- [ ] 图片懒加载生效
- [ ] Dialog 组件从 1180 行减少到 ~400 行
- [ ] 两种主题视觉效果与重构前一致
- [ ] `npm run build` 无错误
- [ ] AGENTS.md 已更新
