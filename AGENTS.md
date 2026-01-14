# PROJECT KNOWLEDGE BASE

**Generated:** 2026-01-09
**Commit:** b19ca21
**Branch:** master

## OVERVIEW

Personal project portfolio SPA built with React 18 + TypeScript + Vite + Tailwind CSS. Hybrid storage: Supabase primary, localStorage fallback. Admin mode via `?admin` URL param or `Ctrl+Shift+A`.

## STRUCTURE

```
navigator/
├── src/
│   ├── App.tsx              # Monolithic main component (1580 lines) - ALL app logic here
│   ├── main.tsx             # React entry point
│   ├── components/          # UI components
│   │   ├── ui/              # shadcn/ui primitives (DO NOT MODIFY)
│   │   ├── ProjectDetailDialog.tsx   # Project detail modal (theme-aware)
│   │   ├── ModernProjectDetailDialog.tsx  # Modern theme variant
│   │   ├── Timeline.tsx     # Project timeline display
│   │   ├── ChallengeSection.tsx  # Challenge cards
│   │   ├── ThemeSwitcher.tsx    # Theme selector
│   │   └── EmptyState.tsx   # Empty state placeholder
│   ├── lib/                 # Utilities and services
│   │   ├── storage.ts       # HybridStorage class (Supabase + localStorage)
│   │   ├── supabase.ts      # Supabase client config
│   │   ├── auth.ts          # SHA-256 password auth (session-based)
│   │   ├── storageDetector.ts  # Safe storage access wrappers
│   │   ├── useTheme.ts      # Theme hook (misplaced - should be in hooks/)
│   │   ├── themes.ts        # Theme definitions
│   │   └── utils.ts         # cn() utility
│   └── hooks/
│       └── use-toast.ts     # Toast notification hook
├── supabase-init.sql        # Projects table schema
├── supabase-settings-table.sql  # User settings schema
└── scripts/
    └── generate-hash.js     # Admin password hash generator
```

## WHERE TO LOOK

| Task | Location | Notes |
|------|----------|-------|
| Add/modify project fields | `src/App.tsx` | `Project` interface + form handling |
| Change storage behavior | `src/lib/storage.ts` | `HybridStorage` class |
| Modify project detail UI | `src/components/ProjectDetailDialog.tsx` | Theme-conditional rendering |
| Add new theme | `src/lib/themes.ts` + `useTheme.ts` | CSS variables in `index.css` |
| Database schema changes | `supabase-*.sql` files | Run in Supabase SQL editor |
| UI primitives | `src/components/ui/` | shadcn/ui - regenerate, don't edit |

## CONVENTIONS

- **Chinese UI text**: All user-facing strings in Chinese (管理员, 项目, 设置...)
- **camelCase → snake_case**: Project fields convert between frontend/Supabase formats
- **Path aliases**: `@/*` maps to `./src/*`
- **CSS theming**: HSL CSS variables via Tailwind (`--background`, `--foreground`, etc.)
- **No ESLint/Prettier**: TypeScript strict mode only

## ANTI-PATTERNS (THIS PROJECT)

- **DO NOT** edit `src/components/ui/*` directly - regenerate via shadcn/ui CLI
- **DO NOT** add routes - single-page app, use dialogs/modals
- **DO NOT** store sensitive data in localStorage - use sessionStorage for auth state
- **AVOID** adding to App.tsx - already 1580 lines, extract components instead

## UNIQUE STYLES

- **Admin access**: Hidden via URL param `?admin` or keyboard shortcut `Ctrl+Shift+A`
- **Hybrid storage pattern**: Always save to localStorage first (fast), then sync to Supabase
- **Theme-conditional components**: `ProjectDetailDialog` renders different component based on theme
- **Default projects**: Hardcoded fallback data when storage is empty

## COMMANDS

```bash
npm run dev      # Start Vite dev server (localhost:5173)
npm run build    # TypeScript check + Vite production build
npm run preview  # Preview production build locally
```

## ENVIRONMENT

```bash
# .env (required for cloud features)
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
VITE_ADMIN_PASSWORD_HASH=<sha256-hash>  # Generate via: node scripts/generate-hash.js
```

## NOTES

- **No tests**: Manual testing only via `storageTest.ts` and browser console
- **Vercel deployment**: Auto-deploys on push, SPA routing configured in `vercel.json`
- **Large file warning**: `App.tsx` is monolithic - consider refactoring before adding features
- **Theme hook location**: `useTheme.ts` is in `lib/` not `hooks/` (historical)
