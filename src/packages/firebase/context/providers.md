# Firebase — Providers

## FirebaseAuthProvider
File: `providers/firebase/firebaseAuthProvider.tsx`. External: `firebase/auth` (`getAuth`, `createUserWithEmailAndPassword`, `signInWithEmailAndPassword`, `sendPasswordResetEmail`, `updateEmail`, `updatePassword`, `updateProfile`), `firebase/app` (`FirebaseApp` type).

```ts
interface FirebaseAuthProviderInputProps { children?: React.ReactNode; }
```

### Lifecycle
- On mount: throws `Error("Firebase app is not initialized. Please call FirebaseAppHelper.initializeApp() ...")` if the app singleton is missing; otherwise `getAuth(app)` and subscribes to `auth.onAuthStateChanged`.
- Every auth state change: logs with `console.debug`, stores the user in a ref **and** state, sets `isInitialized = true`. Unsubscribes on unmount.
- `currentUser` is `undefined` until Firebase reports the first state, then `User | null`.

### Context value (`FirebaseAuthContextData`, not exported)
```ts
interface FirebaseAuthContextData {
  currentUser: User | null | undefined;
  isInitialized: boolean;
  signUp: (email: string, password: string, username: string) => Promise<UserCredential>;
  logIn: (email: string, password: string) => Promise<UserCredential>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<User | null | undefined>;
  updateEmail: (email: string) => Promise<User | null | undefined>;
  updatePassword: (password: string) => Promise<User | null | undefined>;
  updateName: (name: string) => Promise<User | null | undefined>;
}
```
| Method | Implementation |
|---|---|
| `signUp` | `createUserWithEmailAndPassword` then `updateProfile({ displayName: username })` |
| `logIn` | `signInWithEmailAndPassword` |
| `logout` | `auth.signOut()` |
| `resetPassword` | `sendPasswordResetEmail(auth, email)`; returns current user |
| `updateEmail` | `updateEmail(currentUser, email)` if logged in; returns current user (Firebase may require recent login / email verification) |
| `updatePassword` | `updatePassword(currentUser, password)` if logged in |
| `updateName` | `updateProfile(currentUser, { displayName })` if logged in |

- Context defaults (no provider): `currentUser: null`, `isInitialized: false`, `signUp`/`logIn` throw `"signUp function not implemented"`, others resolve to `null`/no-op.
- The context value object is recreated every render (no memoisation).

## useFirebaseAuth
File: `providers/firebase/useFirebaseAuth.ts`. External: `FirebaseError` from `firebase/app`.

```ts
useFirebaseAuth(): {
  currentUser: User | null | undefined;
  isInitialized: boolean;
  signUp:         (data: { email: string; password: string; username: string }, onError?: (e: FirebaseError) => void) => Promise<UserCredential | null>;
  logIn:          (data: { email: string; password: string },                   onError?: (e: FirebaseError) => void) => Promise<UserCredential | null>;
  logout:         (onError?: (e: FirebaseError) => void) => Promise<void>;
  resetPassword:  (data: { email: string },    onError?) => Promise<User | null | undefined>;
  updateEmail:    (data: { email: string },    onError?) => Promise<User | null | undefined>;
  updatePassword: (data: { password: string }, onError?) => Promise<User | null | undefined>;
  updateName:     (data: { name: string },     onError?) => Promise<User | null | undefined>;
}
```
- Every operation goes through `executeFirebaseAuthOperation`: `try { return await op() } catch (e) { onError?.(e as FirebaseError); return null; }` — errors never propagate; `null` signals failure.
- Use `error.code` (e.g. `auth/invalid-credential`, `auth/email-already-in-use`, `auth/requires-recent-login`) inside `onError` to show messages.

### Example
```tsx
const { logIn, currentUser, isInitialized } = useFirebaseAuth();

if (!isInitialized) return <Loading />;
const cred = await logIn({ email, password }, (e) => setError(e.code));
if (cred) goTo({ path: "/home" });
```
