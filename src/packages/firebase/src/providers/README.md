# Firebase Providers

Providers initialize Firebase services and make them available to package
hooks. In most applications, wrap the app once with `FirebaseProvider`.

## `FirebaseProvider`

Pass Firebase client options at the application root:

```tsx
import { FirebaseProvider } from "@eliseubatista99/react-scaffold-firebase";

<FirebaseProvider options={firebaseOptions}>
  <App />
</FirebaseProvider>;
```

The provider initializes or reuses the default Firebase app and creates its
Auth instance before rendering descendants. Keep `options` stable for the
provider's lifetime. If a default app already exists with conflicting options,
initialization throws.

## `FirebaseAuthProvider`

Use `FirebaseAuthProvider` when your application initializes and owns the
Firebase `Auth` instance. Create Auth from the initialized app:

```tsx
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { FirebaseAuthProvider } from "@eliseubatista99/react-scaffold-firebase";

const app = initializeApp(firebaseOptions);
const auth = getAuth(app);

<FirebaseAuthProvider auth={auth}>
  <App />
</FirebaseAuthProvider>;
```

Both providers expose authentication state and actions through
`useFirebaseAuth`. Call that hook beneath one of these providers. For the hook
API and behavior, see the [Firebase package README](../../README.md) and
[provider reference](../../context/providers.md).
