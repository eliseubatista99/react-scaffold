# @eliseubatista99/react-scaffold-firebase

React providers, hooks, and helpers for Firebase Authentication, Cloud
Firestore, and Cloud Storage, using the modular Firebase SDK.

## Requirements

| Peer dependency | Version |
| --- | --- |
| `firebase` | `^12.19.0` |
| `react` | `^19.1.0` |
| `react-dom` | `^19.1.0` |

## Installation

```sh
npm install @eliseubatista99/react-scaffold-firebase \
  firebase@^12.19.0 react@^19.1.0 react-dom@^19.1.0
```

## Quick start

Initialize Firebase once at the application root. In a Vite application,
configuration values can be read from environment variables prefixed with
`VITE_`:

```tsx
import { FirebaseProvider } from "@eliseubatista99/react-scaffold-firebase";

const firebaseOptions = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export function Root() {
  return (
    <FirebaseProvider options={firebaseOptions}>
      <App />
    </FirebaseProvider>
  );
}
```

`FirebaseProvider` initializes or reuses the default Firebase app and makes
Auth available to descendants. Keep the `options` object stable for the
provider's lifetime. If an existing default app has conflicting options,
initialization throws an error.

## Public API

- `FirebaseProvider` — initialize the default app and provide Firebase Auth.
- `FirebaseAuthProvider` — provide an `Auth` instance initialized by your
  application.
- `useFirebaseAuth` — access authentication state and email/password actions.
- `useFirestore` — access typed collection CRUD helpers.
- `useDidMountWithFirebaseAuth` — run an action after an authenticated user is
  available.
- `FirebaseAppHelper` and `FirebaseStorageHelper` — app access and file upload
  helpers.

## Security notes

- Firebase client configuration is included in client-side application code;
  it is not a substitute for Firebase Security Rules.
- Configure and test Authentication, Firestore, and Storage rules for your
  application. The helper APIs do not enforce your authorization policy.
- Storage upload helpers return tokenized download URLs. Anyone who obtains a
  URL may access its file; treat it as a bearer credential.
- Never commit service account credentials or other server-side secrets.

## Development

Run these commands from `src/packages/firebase`:

```sh
npm ci
npm run build
npm test
npm run lint
```

## License

[MIT](../../../LICENSE)
