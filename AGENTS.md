# PROJECT KNOWLEDGE BASE

**Generated:** 2026-01-15
**Branch:** master

## OVERVIEW

Personal project portfolio SPA built with React 18 + TypeScript + Vite + Tailwind CSS. Hybrid storage: Supabase primary, localStorage fallback. Admin mode via `?admin` URL param or `Ctrl+Shift+A`.

## STRUCTURE

```
navigator/
├── src/
│   ├── App.tsx              # Entry point (69 lines) - orchestrates AdminView/PublicView
│   ├── main.tsx             # React entry point
│   ├── components/
│   │   ├── ui/              # shadcn/ui primitives (DO NOT MODIFY)
│   │   ├── ProjectDetail/   # Atomic components for project detail dialog
│   │   │   ├── index.ts     # Exports
│   │   │   ├── types.ts     # ThemeVariant, BaseProjectProps
│   │   │   ├── ProjectHero.tsx
│   │   │   ├── ProjectTechStack.tsx
│   │   │   ├── ProjectTimeline.tsx
│   │   │   ├── ProjectChallenges.tsx
│   │   │   └── ProjectOverview.tsx
│   │   ├── ProjectDetailDialog.tsx  # Unified dialog (lazy-loaded, theme-aware)
│   │   ├── AdminView/       # Admin feature module
│   │   ├── PublicView/      # Public feature module
│   │   ├── ChallengeSection.tsx
│   │   ├── ThemeSwitcher.tsx
│   │   └── EmptyState.tsx
│   ├── hooks/
│   │   ├── useProjects.ts   # Project state + CRUD (379 lines)
│   │   ├── useAdminAuth.ts  # Auth state management
│   │   ├── useTheme.ts      # Theme persistence
│   │   └── use-toast.ts     # Toast notifications
│   ├── lib/
│   │   ├── storage.ts       # HybridStorage (Supabase + localStorage)
│   │   ├── supabase.ts      # Supabase client
│   │   ├── auth.ts          # SHA-256 password auth
│   │   ├── logger.ts        # Dev-only logging utility
│   │   ├── storageDetector.ts
│   │   ├── themes.ts
│   │   └── utils.ts
│   ├── types/
│   │   └── project.ts       # Project, TechStackItem, Challenge, TimelineEvent
│   └── constants/
│       └── defaultProjects.ts
├── vite.config.ts           # Includes manualChunks for code splitting
├── supabase-init.sql
└── supabase-settings-table.sql
```

## WHERE TO LOOK

| Task | Location | Notes |
|------|----------|-------|
| Add/modify project fields | `src/types/project.ts` | Single source of truth |
| Change storage behavior | `src/lib/storage.ts` | HybridStorage class |
| Modify project detail UI | `src/components/ProjectDetail/*` | Atomic components |
| Add new theme variant | `src/components/ProjectDetail/types.ts` | ThemeVariant type |
| Database schema changes | `supabase-*.sql` files | Run in Supabase SQL editor |
| UI primitives | `src/components/ui/` | shadcn/ui - regenerate, don't edit |

## CONVENTIONS

- **Chinese UI text**: All user-facing strings in Chinese
- **camelCase → snake_case**: Project fields convert between frontend/Supabase
- **Path aliases**: `@/*` maps to `./src/*`
- **CSS theming**: HSL CSS variables via Tailwind
- **Dev-only logging**: Use `logger` from `@/lib/logger` instead of `console`
- **Lazy loading**: Heavy components use `React.lazy()` + `Suspense`

## ANTI-PATTERNS

- **DO NOT** edit `src/components/ui/*` directly
- **DO NOT** add routes - single-page app
- **DO NOT** use `console.log` in production code - use `logger`
- **DO NOT** use `key={index}` - use stable identifiers

## ARCHITECTURE

**Layer Structure** (L1 → L4):
- L1 Entry: `App.tsx` (orchestration only)
- L2 Coordination: `useProjects`, `useAdminAuth` hooks
- L3 Molecular: `AdminView`, `PublicView`, `ProjectDetail/*`
- L4 Atomic: `ui/*` components

**Code Splitting**:
- `react-vendor`: React core
- `ui-vendor`: Radix UI components
- `motion`: Framer Motion
- `ProjectDetailDialog`: Lazy-loaded on demand

## COMMANDS

```bash
npm run dev      # Start Vite dev server
npm run build    # TypeScript check + production build
npm run preview  # Preview production build
```

## ENVIRONMENT

```bash
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
VITE_ADMIN_PASSWORD_HASH=<sha256-hash>
```

## NOTES

- **No tests**: Manual testing via browser console
- **Vercel deployment**: Auto-deploys on push
- **Bundle analysis**: Use `npx vite-bundle-visualizer`
