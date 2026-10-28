# Firebase — Hooks

## useFirestore
File: `hooks/useFirestore/useFirestore.hook.tsx`. External: `firebase/firestore` (`getFirestore`, `collection`, `doc`, `getDocs`, `setDoc`, `updateDoc`, `deleteDoc`, `writeBatch`, `UpdateData`).

```ts
export type FirestoreItem<T> = { id: string; data: T };

useFirestore(): {
  addItem:         <T extends object>(collectionName: string, path: string, item: T) => Promise<void>;
  getItem:         <T extends object>(collectionName: string, path: string) => Promise<FirestoreItem<T> | null>;
  getItems:        <T extends object>(collectionName: string, predicate?: (data: T) => boolean) => Promise<FirestoreItem<T>[]>;
  updateItem:      <T extends object>(collectionName: string, path: string, newValues: Partial<T>) => Promise<void>;
  deleteItem:      (collectionName: string, path: string) => Promise<void>;
  updateManyItems: <T extends object>(collectionName: string, predicate: (data: T) => boolean, newValues: Partial<T>) => Promise<number>;
}
```
- Firestore instance: `getFirestore(FirebaseAppHelper.getApp()!)` on each call (no guard if the app is not initialised).
- `path` is the **document id** inside the top-level collection (`doc(collection(db, collectionName), path)`).

| Method | Behaviour |
|---|---|
| `addItem` | `setDoc(docRef, { ...item })` — creates or **overwrites** the document with that id |
| `getItem` | **Bug:** builds a `DocumentReference` but never calls `getDoc`; returns `{ id, data: <DocumentReference cast to T> }` and never `null`. Use `getItems` with a predicate as a workaround or fix with `getDoc` + `snapshot.exists()` |
| `getItems` | `getDocs(collection)` → maps existing docs to `{ id, data }`; optional client-side `predicate` filter (reads the **whole** collection) |
| `updateItem` | `updateDoc(docRef, newValues)` — fails if the document does not exist |
| `deleteItem` | `deleteDoc(docRef)` |
| `updateManyItems` | Reads the whole collection, filters with `predicate`, updates matches in a single `writeBatch`, returns the count. Firestore batches are limited to 500 writes |

- No real-time listeners (`onSnapshot`), queries (`where`/`orderBy`/`limit`), pagination or sub-collection helpers.
- Errors propagate (not caught).

## useDidMountWithFirebaseAuth
File: `hooks/useDidMountWithFirebaseAuth/useDidMountWithFirebaseAuth.ts`. External: `firebase/auth` (`getAuth`, `User`).

```ts
useDidMountWithFirebaseAuth(action: () => void): void
```
- On mount: throws if the app is not initialised; subscribes to `getAuth(app).onAuthStateChanged`; calls `action()` **every time** the auth state changes to a non-null user (first resolution, later logins, token-driven re-emissions), not only once. Unsubscribes on unmount.
- Independent of `FirebaseAuthProvider` (creates its own listener).
- Logs each change with `console.debug`.
- Typical use: load user-specific data once the user is known to be authenticated.
