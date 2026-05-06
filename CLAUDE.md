# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # start dev server (localhost:5173)
npm run build    # tsc type-check + vite production build
npm run lint     # eslint
```

No test suite yet. Type-checking via `tsc -b` is the main correctness gate.

## Environment

Requires a `.env.local` file (not committed) with:
```
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

Without these the app throws on load. Use placeholder values locally if Supabase isn't configured yet.

## Architecture

### State — `src/context/GameContext.tsx`

Single source of truth. `useReducer` manages `AppData` (stats, habits, log entries, characterName) in memory. `dispatch` is wrapped as `syncDispatch`, which updates local state optimistically then fires the appropriate Supabase write in the background. There is no debounce or batch sync — every mutation hits Supabase immediately.

On mount, `supabase.auth.getSession()` + `onAuthStateChange` drives the auth state. When a session is established, `loadUserData()` fetches all rows and dispatches `LOAD_DATA`. New users get default D&D stats seeded automatically.

`completeHabit()` is the main action — it logs the entry, dispatches `GAIN_XP` per linked stat, upserts updated stats to Supabase, and pushes `XpGainEvent` objects onto `xpQueue`. In `devMode`, logging and Supabase writes are skipped so XP can be triggered repeatedly for testing.

### Animation pipeline

`xpQueue` in context is the bridge between game logic and the animation system. `AnimationOrchestrator` (`src/components/animation/`) drains it one event at a time with a simple state machine (`idle → showing → done`). Each event triggers:
- `XpBar` — animates from `previousFraction` to new fraction after a 350ms delay (waits for modal spring to settle). Level-up overflow: fills to 1.0, snaps to 0, fills to remainder.
- `AnimatedCount` — rAF loop with cubic ease-out, jitters during counting via framer-motion.
- `LevelNumber` — `AnimatePresence` key-change on level value, scale pop keyframe.
- `LevelUpBurst` — tsParticles one-shot emitter. Engine initialized once via module-level `engineInitialized` flag to avoid re-init.
- Camera shake — `triggerShake()` increments `shakeVersion` in context; `Layout` watches it and animates the root `motion.div`.

`layoutId={stat-card-${id}}` is shared between `StatMiniature` (sidebar) and the expanded card in `AnimationOrchestrator`, enabling Framer Motion's cross-tree layout animation. The miniature uses `visibility: hidden` (not `display: none`) while animating to preserve layout.

### Data layer — `src/lib/db.ts`

Handles snake_case ↔ camelCase conversion between Postgres rows and TypeScript types. All functions take a `userId` and include it in every query — RLS on the Supabase side enforces this at the DB level too. The `profiles` table stores `character_name`; `stats`, `habits`, and `log_entries` are the core tables.

### XP formula — `src/lib/xp.ts`

Triangular progression: `xpToReachLevel(n) = n * (n - 1) * 50`. Level 2 = 100 XP, Level 3 = 300, Level 4 = 600, etc. Each habit completion grants `XP_PER_COMPLETION` (10) per linked stat. Character total level = sum of all stat levels.

### Routing + layout

`App.tsx` gates everything behind auth — no session shows `AuthPage`, session shows the main router. `Layout` renders `Sidebar` (desktop, `md+`) or `TopBar` + `BottomNav` (mobile, `< md`). The whole layout is wrapped in a `motion.div` that the camera shake targets.

## Deployment

- **Netlify**: auto-deploys from `master`. Config in `netlify.toml`. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` as environment variables in Netlify dashboard.
- **Supabase schema**: `supabase/schema.sql` — run once in the Supabase SQL editor. Includes table definitions and RLS policies.
- **Supabase free tier**: pauses after 7 days of inactivity. Workaround: add a credit card to the Supabase account and disable pausing in project settings (no charge unless limits are exceeded).
