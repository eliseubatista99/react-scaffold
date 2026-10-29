# Firebase — Helpers

## FirebaseAppHelper
File: `helpers/firebaseApp/firebaseAppHelper.ts`. External: `firebase/app` (`initializeApp`, `FirebaseApp`, `FirebaseOptions`).

```ts
class FirebaseAppHelper {
  private static app: FirebaseApp | null = null;
  static initializeApp(options: FirebaseOptions): FirebaseApp; // initializes or reuses the default app
  static getApp(): FirebaseApp | null;
  static isAppInitialized(): boolean;
}
```
- Process-wide singleton for the default Firebase app. `FirebaseProvider` calls `initializeApp` before rendering children; consumers do not need to call it directly.
- `initializeApp` reuses an existing default app when its options match, and throws if they conflict.
- Uses `this` inside static arrow functions (refers to the class).

## FirebaseStorageHelper
File: `helpers/firebaseStorage/firebaseStorageHelper.ts`. External: `firebase/storage` (`getStorage`, `ref`, `uploadBytes`, `getDownloadURL`).

```ts
type UploadFileInput = {   // not exported
  file: File;
  path?: string;           // folder; default "images" (uploadImage) or "files" (uploadFile)
  fileName?: string;       // default file.name
};

class FirebaseStorageHelper {
  static uploadImage(input: UploadFileInput): Promise<string>; // throws "File must be an image" unless file.type starts with "image/"
  static uploadFile(input: UploadFileInput): Promise<string>;  // returns the public download URL
}
```
- Object path: `${path}/${crypto.randomUUID()}-${safeName}` where `safeName` = NFD-normalised name without diacritics and with whitespace replaced by `-` (other special characters are kept).
- Uses `getStorage(FirebaseAppHelper.getApp())` so uploads use the same app initialized by `FirebaseProvider`.
- `uploadImage` mutates `input.path` when it is undefined.
- No delete/list helpers, no progress reporting (`uploadBytes`, not `uploadBytesResumable`), no size/type validation beyond the image MIME check.
- `crypto.randomUUID()` requires a secure context (HTTPS or localhost).
- Access control must be enforced with Firebase Storage Security Rules; the helper does not check authentication.
