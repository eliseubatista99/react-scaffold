# Firebase — Hooks

## useFirestore
File: `hooks/useFirestore/useFirestore.hook.tsx`. External: `firebase/firestore` (`getFirestore`, `collection`, `doc`, `getDoc`, `getDocs`, `query`, `QueryConstraint`, `setDoc`, `updateDoc`, `deleteDoc`, `writeBatch`, `UpdateData`).

```ts
export type FirestoreItem<T> = { id: string; data: T };
export type FirestoreDataParser<T> = (value: unknown) => T;
export type FirestoreQueryOptions<T> = {
  constraints?: QueryConstraint[];
  parse: FirestoreDataParser<T>;
  predicate?: (data: T) => boolean;
};

useFirestore(): {
  addItem:         <T extends object>(collectionName: string, path: string, item: T) => Promise<void>;
  getItem:         <T extends object>(collectionName: string, path: string, parse: FirestoreDataParser<T>) => Promise<FirestoreItem<T> | null>;
  getItems:        <T extends object>(collectionName: string, options?: Partial<FirestoreQueryOptions<T>>) => Promise<FirestoreItem<T>[]>;
  updateItem:      <T extends object>(collectionName: string, path: string, newValues: UpdateData<T>) => Promise<void>;
  deleteItem:      (collectionName: string, path: string) => Promise<void>;
  updateManyItems: <T extends object>(collectionName: string, options: FirestoreQueryOptions<T>, newValues: UpdateData<T>) => Promise<number>;
}
```
- Firestore instance: `getFirestore(FirebaseAppHelper.getApp())` on each call; the helper throws a clear error if `FirebaseProvider` has not initialized the app.
- `path` is the **document id** inside the top-level collection (`doc(collection(db, collectionName), path)`).

| Method | Behaviour |
|---|---|
| `addItem` | `setDoc(docRef, { ...item })` — creates or **overwrites** the document with that id |
| `getItem` | Reads with `getDoc`; passes the raw document data to the required `parse` function, then returns `{ id, data }` or `null` |
| `getItems` | Applies `constraints` through Firestore `query()` before `getDocs`; parses each result when `parse` is provided and optionally applies `predicate` in memory. Without options or constraints, the whole collection is read and returned data is trusted as `T` without runtime validation. |
| `updateItem` | `updateDoc(docRef, newValues)` using Firestore's `UpdateData<T>` type; fails if the document does not exist |
| `deleteItem` | `deleteDoc(docRef)` |
| `updateManyItems` | Applies Firestore `constraints` before reading, parses results and optionally filters in memory. Requires a parser and either a predicate or at least one constraint. Commits sequential batches of at most 500 writes; if a later batch fails, earlier batches remain committed. |

```ts
import { limit, where } from "firebase/firestore";

type User = { active: boolean; archived: boolean; name: string };
const parseUser = (value: unknown): User => {
  if (
    typeof value !== "object" ||
    value === null ||
    !("active" in value) ||
    typeof value.active !== "boolean" ||
    !("archived" in value) ||
    typeof value.archived !== "boolean" ||
    !("name" in value) ||
    typeof value.name !== "string"
  ) {
    throw new Error("Invalid user document.");
  }

  return {
    active: value.active,
    archived: value.archived,
    name: value.name,
  };
};

const users = await getItems<User>("users", {
  parse: parseUser,
  constraints: [where("active", "==", true), limit(50)],
});

const updatedCount = await updateManyItems<User>(
  "users",
  {
    parse: parseUser,
    constraints: [where("archived", "==", false)],
  },
  { archived: true },
);
```

- No real-time listeners (`onSnapshot`) or sub-collection helpers. Firestore query constraints such as `where`, `orderBy`, `limit`, and cursor constraints can be passed to collection methods.
- Errors propagate (not caught).

## useDidMountWithFirebaseAuth
File: `hooks/useDidMountWithFirebaseAuth/useDidMountWithFirebaseAuth.ts`. Uses the Auth state exposed by `FirebaseProvider` through `useFirebaseAuth`.

```ts
useDidMountWithFirebaseAuth(
  action: () => void | Promise<void>,
  onError?: (error: unknown) => void,
): void
```
- Requires `FirebaseProvider` and observes the same Auth state as `useFirebaseAuth`.
- If the initial state is unauthenticated, it keeps waiting; on the first non-null user it calls `action()` once. It does nothing after unmount.
- The latest `action` callback is used if it changes before authentication.
- Synchronous errors and rejected promises are sent to `onError`; without a handler, the hook reports them with `console.error`.
- Typical use: load user-specific data once the user is known to be authenticated.
