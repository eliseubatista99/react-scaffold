# Firebase — Providers

## FirebaseProvider
File: `providers/firebase/firebaseProvider.tsx`. External: `firebase/app` (`FirebaseOptions`) and `firebase/auth` (`getAuth`).

```ts
interface FirebaseProviderInputProps {
  options: FirebaseOptions;
  children?: React.ReactNode;
}
```

- Recommended root provider. Initializes or reuses the default Firebase app from `options`, creates Auth, and wraps children in `FirebaseAuthProvider`.
- The consumer supplies Firebase configuration once; hooks and helpers resolve services from the initialized app.
- Uses one default app per runtime. Keep `options` stable for the provider's lifetime.

## FirebaseAuthProvider
Advanced provider for applications that already own an `Auth` instance. Most consumers should use `FirebaseProvider` instead.
File: `providers/firebase/firebaseAuthProvider.tsx`. External: `firebase/auth` (`Auth`, `onAuthStateChanged`, `createUserWithEmailAndPassword`, `signInWithEmailAndPassword`, `signOut`, `sendPasswordResetEmail`, `verifyBeforeUpdateEmail`, `updatePassword`, `updateProfile`, `ActionCodeSettings` type).

```ts
interface FirebaseAuthProviderInputProps {
  auth: Auth;
  children?: React.ReactNode;
}
```

### Lifecycle
- The application initializes Firebase Auth and passes the `Auth` instance to the provider before rendering.
- On mount, subscribes with `onAuthStateChanged(auth, ...)`; unsubscribes on unmount.
- `currentUser` is `undefined` until Firebase reports the first state, then `User | null`.
- `isInitialized` is derived from whether `currentUser` has been set by the first auth event.
- If the `auth` instance changes, `currentUser` returns to `undefined` until the new instance reports its first state; events from the previous subscription are ignored.

### Context value (`FirebaseAuthContextData`, not exported)
`FirebaseAuthSignUpResult` is exported from the package.

```ts
interface FirebaseAuthContextData {
  currentUser: User | null | undefined;
  isInitialized: boolean;
  signUp: (email: string, password: string, username: string) => Promise<FirebaseAuthSignUpResult>;
  logIn: (email: string, password: string) => Promise<UserCredential>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateEmail: (email: string, actionCodeSettings?: ActionCodeSettings | null) => Promise<void>;
  updatePassword: (password: string) => Promise<User>;
  updateName: (name: string) => Promise<User>;
}
```
| Method | Implementation |
|---|---|
| `signUp` | Creates the account, then updates the profile. Account-creation errors reject; profile-update failures return the created credential with `profileUpdate: "failed"`. |
| `logIn` | `signInWithEmailAndPassword` |
| `logout` | `signOut(auth)` |
| `resetPassword` | Sends a password-reset email with `sendPasswordResetEmail(auth, email)`; resolves with no value |
| `updateEmail` | Sends a verification email with `verifyBeforeUpdateEmail`; the address changes only after the user completes verification. Requires a signed-in user and may require recent login. |
| `updatePassword` | `updatePassword(currentUser, password)`; throws if Auth is initializing or no user is signed in |
| `updateName` | `updateProfile(currentUser, { displayName })`; throws if Auth is initializing or no user is signed in |

- The context value and its actions are memoized until the Auth instance, current user state, or user profile changes.

## useFirebaseAuth
File: `providers/firebase/useFirebaseAuth.ts`.

```ts
useFirebaseAuth(): {
  currentUser: User | null | undefined;
  isInitialized: boolean;
  signUp:         (data: { email: string; password: string; username: string }) => Promise<FirebaseAuthSignUpResult>;
  logIn:          (data: { email: string; password: string }) => Promise<UserCredential>;
  logout:         () => Promise<void>;
  resetPassword:  (data: { email: string }) => Promise<void>;
  updateEmail:    (data: { email: string; actionCodeSettings?: ActionCodeSettings | null }) => Promise<void>;
  updatePassword: (data: { password: string }) => Promise<User>;
  updateName:     (data: { name: string }) => Promise<User>;
}
```
- `useFirebaseAuth` must be called under `FirebaseAuthProvider`; otherwise it throws an explicit error.
- Operation errors propagate to the caller. Handle rejected promises with `try/catch`; Firebase errors expose a `code` such as `auth/invalid-credential`, `auth/email-already-in-use`, or `auth/requires-recent-login`.
- `updateEmail` resolves when Firebase sends the verification email; it does not mean the user's email has changed yet. `actionCodeSettings` is optional.
- When sign-up returns `profileUpdate: "failed"`, the account was created and `userCredential` is valid; `profileError` contains the profile update failure.

```tsx
const result = await signUp({ email, password, username });
if (result.profileUpdate === "failed") {
  setWarning("Account created, but the display name was not saved.");
}
```

### Example
```tsx
import { FirebaseError } from "firebase/app";

const { logIn, currentUser, isInitialized } = useFirebaseAuth();

if (!isInitialized) return <Loading />;
try {
  await logIn({ email, password });
  goTo({ path: "/home" });
} catch (error) {
  setError(error instanceof FirebaseError ? error.code : "unknown-error");
}
```
