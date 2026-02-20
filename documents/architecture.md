# Architecture

Project follows a layered, feature-oriented structure. UI lives in `src/screens/*` and feature UI components in `src/features/*/presentation/*`. Business rules stay in `src/features/*/application/*` as pure functions (e.g. validation/normalization) and domain constants/types in `src/features/*/domain/*`. Data access is isolated in `src/features/*/data/*` and uses a single Supabase client from `src/lib/supabase.ts`.

State management uses React Context for cross-cutting concerns: authentication/user role (`src/context/AuthContext.tsx`), theming (`src/context/ThemeContext.tsx`) and location tracking (`src/context/LocationContext.tsx`). Screens keep local UI state with hooks and call application/data functions for side effects.

Background work uses Expo TaskManager + Location to persist last known location across app lifecycle (`src/location/backgroundTask.ts` + `LocationContext`). Notifications support both in-app records and push token registration (`src/features/notifications/push.ts`).
