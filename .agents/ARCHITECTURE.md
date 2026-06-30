# FocusFlow — Architecture Map
> Last updated: 2026-07-01 | v4.9

## Stack
- React 19 + TypeScript 5.8 + Vite 6 + Tailwind CSS 4
- Capacitor 8 (Android wrapper)
- Framer Motion (`motion/react`) for animations
- Firebase (configured but localStorage is primary storage)
- lucide-react for icons

## File Map

### Root Config
| File | Purpose |
|------|---------|
| `index.html` | Entry HTML, SEO meta, loads `main.tsx` |
| `package.json` | Dependencies, scripts (`dev`, `build`, `lint`) |
| `vite.config.ts` | Vite config with React plugin |
| `tsconfig.json` | TS config, excludes `backups/`, `node_modules/`, `dist/` |
| `capacitor.config.ts` | Android app config |

### Source (`src/`)
| File | Lines | Bytes | Responsibility |
|------|-------|-------|---------------|
| `main.tsx` | 8 | 241 | React root mount |
| `index.css` | 164 | ~5KB | Tailwind import, theme tokens, ambient orbs, particles, stagger animations |
| `utils.ts` | 102 | 3.4KB | Storage (localStorage), audio (Web Audio API), date helpers, weight calc |
| `firebase.ts` | ~15 | 409 | Firebase SDK init (not primary storage) |
| `App.tsx` | 730 | ~30KB | **Main orchestrator**: ErrorBoundary, InjectedStyles (design tokens), state management, tab routing, bottom nav, toast, particles |

### Components (`src/components/`)
| File | Lines | Bytes | Responsibility |
|------|-------|-------|---------------|
| `CommonUI.tsx` | 117 | 4.9KB | Shared UI primitives: Badge, SpatialCard, TactileButton, Primary3DButton, SegmentedControl3D, ProgressRing |
| `Onboarding.tsx` | 446 | 29KB | 13-step onboarding flow with name, avatar, directive, habits, goals, deep-dive |
| `DashboardTab.tsx` | 222 | 11KB | Dashboard: avatar header, time-burn rings, execution progress, custom buffs, action queue |
| `TasksTab.tsx` | 167 | 8.5KB | Task CRUD, priority selector, goal linking, deadline/time, clear completed |
| `GoalsTab.tsx` | 209 | 9.8KB | Goal/milestone CRUD, custom frequency (hours/days), progress bars |
| `NotesTab.tsx` | 82 | ~4KB | Notes CRUD with delete, vault metaphor |
| `StatsTab.tsx` | 216 | 12KB | Profile settings, theme picker, avatar upload, data export/import, XP yield charts, habits list |

## Data Model (localStorage key: `focusflow_v1`)
```typescript
{
  version: number,
  profile: {
    booted: boolean,        // false = show onboarding
    codename: string,       // user's display name
    directive: string,      // core goal text
    avatarUrl: string,      // base64 data URL or empty
    score: number,          // total XP
    xpLogs: Record<string, number>,  // "YYYY-MM-DD" → daily XP
    theme: string,          // hex color e.g. "#00f0ff"
    joinedAt: number,       // timestamp
    customBuffs: {
      buff1: { title: string, xp: number, lastClaimed: string },
      buff2: { title: string, xp: number, lastClaimed: string }
    }
  },
  tasks: Array<{ id, title, priority, goalId?, deadline, time?, completed, completedAt? }>,
  goals: Array<{ id, title, timeline, target, current, createdAt, frequencyValue?, frequencyUnit?, lastDone?, lastDoneTime? }>,
  habits: Array<{ id, text }>,   // set during onboarding, displayed in Stats
  notes: Array<{ id, title?, content, date, createdAt? }>
}
```

## Component API Quick Reference

### CommonUI.tsx exports
| Component | Props | Notes |
|-----------|-------|-------|
| `Badge` | `text, icon?, colorClass?` | Pill badge with optional icon |
| `SpatialCard` | `children, className?, padding?, showOrbs?` | Glass card with hover lift |
| `TactileButton` | `children, onClick, className?, disabled?` | Secondary button |
| `Primary3DButton` | `children, onClick, className?, disabled?` | Primary CTA button |
| `SegmentedControl3D` | `options: {id,label}[], selected, onChange` | Animated segmented picker |
| `ProgressRing` | `progress, size?, stroke?, label, gradientId?` | SVG ring progress |

### Tab Components (all receive props from App.tsx)
| Component | Key Props |
|-----------|-----------|
| `DashboardTab` | `userData, tasks, setTasks, addXP, buff1, buff2, claimCustomBuff, timeBurn, dailyProgressPct, goals, setGoals, showToast, executeTask` |
| `TasksTab` | `tasks, setTasks, addXP, goals, executeTask` |
| `GoalsTab` | `goals, setGoals, addXP` |
| `NotesTab` | `notes, setNotes, showToast` |
| `StatsTab` | `userData, habits, showToast, handleExport, fileInputRef, handleImport, currentTheme, changeTheme, yieldRange, setYieldRange, yieldData, maxYieldXP, rgbTheme, updateProfile` |
| `Onboarding` | `onComplete: (data) => void` |

## State Flow
```
App.tsx (appData state)
  ├── updateAppData(mutator) → structuredClone → mutate → saveData → setAppData
  ├── Onboarding → onComplete({ name, directive, avatarUrl, habits, goals })
  └── Tabs receive slices as props:
      ├── DashboardTab: profile, tasks, goals, buffs, timeBurn
      ├── TasksTab: tasks, goals (for linking)
      ├── GoalsTab: goals
      ├── NotesTab: notes
      └── StatsTab: profile, habits, theme, yield data
```

## Design Constraints (User Rules)
- **No glow effects** — strict user rule
- **80/20 rule** — 80% clean/minimal, 20% premium visual moments
- **Animations**: `transform` + `opacity` only (60fps GPU compositing)
- **Dark theme**: bg `#030303`, glass cards with backdrop blur
- **Fonts**: Outfit (body), Space Grotesk (display), Yellowtail (script)
- **Mobile-first**: 428px max container, `100dvh` height

## Key Patterns
- `getLocalDateStr()` for consistent YYYY-MM-DD date keys
- `getTaskWeight()` maps priority → numeric weight (low=1, medium=2, high=3)
- `playSound()` uses Web Audio API oscillators (no audio files)
- `spawnParticles()` creates icon particles on task/buff completion
- Framer Motion `layout`/`AnimatePresence` for list animations
- `structuredClone` for immutable state updates
- All `setX` functions passed to tabs accept either a value or an updater function

## Build & Dev Commands
```bash
npm run dev     # Vite dev server on port 3000
npm run build   # Production build to dist/
npm run lint    # tsc --noEmit
npx cap sync    # Sync web assets to Android
```
