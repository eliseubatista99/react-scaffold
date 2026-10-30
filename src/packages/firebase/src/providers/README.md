# Firebase Providers

## `FirebaseProvider`

Use `FirebaseProvider` at the application root to initialize or reuse the
default Firebase app and provide its Auth instance to descendants.

```tsx
import { FirebaseProvider } from "@eliseubatista99/react-scaffold-firebase";

<FirebaseProvider options={firebaseOptions}>
  <App />
</FirebaseProvider>;
```

Pass Firebase configuration through `options` and keep it stable for the
provider's lifetime. If a default app already exists with different options,
initialization throws an error.

## `FirebaseAuthProvider`

Use `FirebaseAuthProvider` when the application initializes and manages its
own Firebase `Auth` instance. Most applications should use `FirebaseProvider`.

Both providers expose auth state and actions through `useFirebaseAuth`.
