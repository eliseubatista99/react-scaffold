# Firebase — Known Issues and Quirks

## Bugs

## Design quirks
- `getItems` / `updateManyItems` still read the entire collection when called without Firestore constraints.

## Packaging / docs
- `firebase` is a peer dependency but not a devDependency, and not installed at the root.
- `vite.config.ts` externalizes `firebase/functions` and compat modules that are not used.
- Vite library `name` is the placeholder `MyComponentLibrary`.
- `src/providers/README.md` is a copy of core's providers README (Navigation/Feedback, outdated API) and unrelated to Firebase.
- The Firebase test script currently reuses Vitest and jsdom from the sibling `core` package; the Firebase package does not declare these as its own devDependencies.
