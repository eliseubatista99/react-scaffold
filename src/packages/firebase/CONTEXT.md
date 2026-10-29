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
- **App and services**: `FirebaseProvider` initializes or reuses the default Firebase app from consumer configuration and creates Auth before rendering children.
- **Auth**: `useFirebaseAuth` provides email/password sign-up, login, logout, password reset, email/password/display-name updates and current-user state. `useDidMountWithFirebaseAuth` waits for the same provider's authenticated user.
- **Firestore**: `useFirestore` CRUD helpers on top-level collections.
- **Storage**: `FirebaseStorageHelper` uploads files/images using the same initialized app and returns download URLs.

## Public API (exported from `src/index.ts`)

`src/index.ts` re-exports `./helpers`, `./hooks`, and `./providers`.

| Export | Kind | Details |
|---|---|---|
| `FirebaseProvider`, `FirebaseProviderInputProps` | Root provider | Initializes app and Auth from `FirebaseOptions`; [context/providers.md](context/providers.md) |
| `FirebaseAuthProvider`, `FirebaseAuthProviderInputProps` | Advanced provider | Wraps an explicitly supplied `Auth` instance; [context/providers.md](context/providers.md) |
| `FirebaseAuthSignUpResult`, `useFirebaseAuth` | Auth type and hook | [context/providers.md](context/providers.md) |
| `FirebaseAppHelper`, `FirebaseStorageHelper` | Static helpers | [context/helpers.md](context/helpers.md) |
| `useFirestore`, `FirestoreItem<T>`, `FirestoreDataParser<T>`, `FirestoreQueryOptions<T>`, `useDidMountWithFirebaseAuth` | Hooks and types | [context/hooks.md](context/hooks.md) |

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
    ├── README.md
    └── firebase/
        ├── firebaseProvider.tsx
        ├── firebaseAuthContext.ts
        ├── firebaseAuthProvider.tsx
        └── useFirebaseAuth.ts
```

## Setup

```tsx
import { createRoot } from "react-dom/client";
import {
  FirebaseProvider,
  useFirebaseAuth,
  useFirestore,
} from "@eliseubatista99/react-scaffold-firebase";

const firebaseOptions = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

function App() {
  const { currentUser, isInitialized, logIn } = useFirebaseAuth();
  const { getItems, addItem } = useFirestore();

  return null;
}

const root = document.getElementById("root");
if (!root) throw new Error("Root element was not found.");

createRoot(root).render(
  <FirebaseProvider options={firebaseOptions}>
    <App />
  </FirebaseProvider>,
);
```

The consumer supplies Firebase configuration once. `FirebaseProvider` initializes or reuses the default app, creates Auth before rendering children, and lets Firestore and Storage resolve services from that same app. Keep `options` stable for the provider's lifetime. A conflicting configuration for an already-initialized default app throws. Store configuration values in environment variables; never hard-code secrets.

## Detailed context files

| File | Content |
|---|---|
| [context/build-and-conventions.md](context/build-and-conventions.md) | package.json, Vite (Firebase externals), TypeScript and conventions |
| [context/providers.md](context/providers.md) | `FirebaseProvider`, `FirebaseAuthProvider`, context and auth hook |
| [context/hooks.md](context/hooks.md) | `useFirestore`, `useDidMountWithFirebaseAuth` |
| [context/helpers.md](context/helpers.md) | `FirebaseAppHelper`, `FirebaseStorageHelper` |
| [context/known-issues.md](context/known-issues.md) | Bugs, quirks and inconsistencies |
