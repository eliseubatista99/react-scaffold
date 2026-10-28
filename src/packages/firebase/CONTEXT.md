# @eliseubatista99/react-scaffold-firebase — Package Context

> Main context file for the **firebase** package. Detailed documents live in [context/](context/).

## Summary

| Field | Value |
|---|---|
| npm name | `@eliseubatista99/react-scaffold-firebase` |
| Version | `1.0.16` |
| Location | `src/packages/firebase` |
| Entry | `src/index.ts` → `dist/index.es.js`, `dist/index.cjs.js`, `dist/index.d.ts` |
| Peer deps | `firebase ^12.19.0`, `react ^19.1.0`, `react-dom ^19.1.0` |
| Depends on other scaffold packages | No |
| Storybook stories | None |

Thin React wrappers around the Firebase modular SDK (v12):
- **App**: singleton initialisation (`FirebaseAppHelper`).
- **Auth**: `FirebaseAuthProvider` + `useFirebaseAuth` (email/password sign-up, login, logout, reset password, update email/password/display name, current user state) and `useDidMountWithFirebaseAuth`.
- **Firestore**: `useFirestore` CRUD helpers on top-level collections.
- **Storage**: `FirebaseStorageHelper` uploads files/images and returns download URLs.

## Public API (exported from `src/index.ts`)

`src/index.ts` re-exports `./helpers`, `./hooks`, `./providers`.

| Export | Kind | Details |
|---|---|---|
| `FirebaseAppHelper` | Static class | [context/helpers.md](context/helpers.md) |
| `FirebaseStorageHelper` | Static class | [context/helpers.md](context/helpers.md) |
| `useFirestore`, `FirestoreItem<T>` | Hook + type | [context/hooks.md](context/hooks.md) |
| `useDidMountWithFirebaseAuth` | Hook | [context/hooks.md](context/hooks.md) |
| `FirebaseAuthProvider`, `FirebaseAuthProviderInputProps` | Provider | [context/providers.md](context/providers.md) |
| `useFirebaseAuth` | Hook | [context/providers.md](context/providers.md) |

Not exported: `FirebaseAuthProviderContext`, `FirebaseAuthContextData`, `UploadFileInput`.

## Folder structure

```
src/
├── index.ts
├── helpers/
│   ├── firebaseApp/firebaseAppHelper.ts
│   └── firebaseStorage/firebaseStorageHelper.ts
├── hooks/
│   ├── useDidMountWithFirebaseAuth/useDidMountWithFirebaseAuth.ts
│   └── useFirestore/useFirestore.hook.tsx
└── providers/
    ├── README.md                    (copy of core's providers README — not about Firebase)
    └── firebase/ firebaseAuthContext.ts, firebaseAuthProvider.tsx, useFirebaseAuth.ts
```

## Required setup order

```tsx
import { FirebaseAppHelper, FirebaseAuthProvider } from "@eliseubatista99/react-scaffold-firebase";

// 1. Once, before rendering anything that uses Firebase (module scope / main.tsx)
FirebaseAppHelper.initializeApp({ apiKey: "...", authDomain: "...", projectId: "...", storageBucket: "...", appId: "..." });

// 2. Wrap the app
createRoot(root).render(
  <FirebaseAuthProvider>
    <App />
  </FirebaseAuthProvider>
);

// 3. Use hooks
const { currentUser, isInitialized, logIn } = useFirebaseAuth();
const { getItems, addItem } = useFirestore();
```
`FirebaseAuthProvider`, `useDidMountWithFirebaseAuth` **throw** if `FirebaseAppHelper.initializeApp` was not called first. Firebase config values must come from environment variables (e.g. `import.meta.env.VITE_FIREBASE_*`), never hard-coded secrets in the repo.

## Detailed context files

| File | Content |
|---|---|
| [context/build-and-conventions.md](context/build-and-conventions.md) | package.json, Vite (firebase externals), TS config, conventions |
| [context/providers.md](context/providers.md) | `FirebaseAuthProvider`, context, `useFirebaseAuth` |
| [context/hooks.md](context/hooks.md) | `useFirestore`, `useDidMountWithFirebaseAuth` |
| [context/helpers.md](context/helpers.md) | `FirebaseAppHelper`, `FirebaseStorageHelper` |
| [context/known-issues.md](context/known-issues.md) | Bugs, quirks and inconsistencies |
