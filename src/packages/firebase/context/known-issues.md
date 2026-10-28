# Firebase — Known Issues and Quirks

## Bugs
- `useFirestore.getItem` never reads the document (no `getDoc`): it returns the `DocumentReference` cast as data and never returns `null`.
- `FirebaseAuthContextData` default `logIn` throws the message `"signUp function not implemented"` (copy-paste).
- `useDidMountWithFirebaseAuth` runs `action` on every non-null auth emission, not only once on mount; its `action` is captured once (stale closure).

## Design quirks
- `FirebaseStorageHelper` uses `getStorage()` (default app) instead of `FirebaseAppHelper.getApp()`.
- `useFirestore` and `getAuth` calls use `FirebaseAppHelper.getApp()!` non-null assertions (crash with an obscure Firebase error if not initialised).
- `getItems` / `updateManyItems` load entire collections and filter client-side (cost and performance concerns on large collections); `updateManyItems` does not split batches above 500 writes.
- `addItem` overwrites existing documents (`setDoc` without `merge`).
- Provider throws inside `useEffect` when the app is not initialised (surfaces as an uncaught error, not an error boundary-friendly render error).
- `useFirebaseAuth` swallows all errors and returns `null`; without `onError` failures are silent. It casts any error to `FirebaseError`.
- Context value not memoised → all consumers re-render on every provider render.
- `updateEmail` from `firebase/auth` is deprecated in favour of `verifyBeforeUpdateEmail` (and may fail when email enumeration protection is enabled).
- `console.debug` of the full `User` object on each auth change (may expose user data in logs).

## Packaging / docs
- `firebase` is a peer dependency but not a devDependency, and not installed at the root.
- `vite.config.ts` externalizes `firebase/functions` and compat modules that are not used.
- Vite library `name` is the placeholder `MyComponentLibrary`.
- `src/providers/README.md` is a copy of core's providers README (Navigation/Feedback, outdated API) and unrelated to Firebase.
- README installation section duplicated; README says "authentication and database utilities" but also storage exists.
- No stories, no tests.
