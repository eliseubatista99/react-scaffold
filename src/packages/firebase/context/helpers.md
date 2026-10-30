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
- `initializeApp` reuses an existing default app only when all defined options match; partial options conflict if they omit values configured on the existing app.
- Uses `this` inside static arrow functions (refers to the class).

## FirebaseStorageHelper
File: `helpers/firebaseStorage/firebaseStorageHelper.ts`. External: `firebase/storage` (`getStorage`, `ref`, `uploadBytes`, `getDownloadURL`).

```ts
type FirebaseStorageUploadInput = {
  file: File;
  path?: string;           // folder; default "images" (uploadImage) or "files" (uploadFile)
  fileName?: string;       // default file.name
};

class FirebaseStorageHelper {
  static uploadImage(input: FirebaseStorageUploadInput): Promise<string>; // throws "File must be an image" unless file.type starts with "image/"
  static uploadFile(input: FirebaseStorageUploadInput): Promise<string>;  // returns a tokenized download URL
}
```
- `FirebaseStorageUploadInput` is exported from the package entry point for consumers that want to type upload inputs.
- Object path: `${path}/${crypto.randomUUID()}-${safeName}`. Nested folders are supported; empty path segments, absolute paths, `.`/`..` segments, and backslashes are rejected. The file name is kept to a single segment by replacing slashes and control characters with `-`, removing diacritics, and replacing whitespace with `-` (other special characters are kept).
- Uses `getStorage(FirebaseAppHelper.getApp())` so uploads use the same app initialized by `FirebaseProvider`.
- `uploadImage` uses the `images` default path without mutating the input.
- `uploadImage` only checks the browser-provided `file.type` value for an `image/` prefix; it does not inspect the file contents. Do not rely on this check for security or to guarantee the uploaded bytes are an image. Validate file contents in a trusted server-side process when that guarantee is required.
- The returned download URL is tokenized: anyone who obtains it can access the file. Treat it as a bearer credential and avoid exposing it in logs or unintended public locations. Storage rules govern upload access and URL retrieval, but do not make a shared download URL private.
- No delete/list helpers, no progress reporting (`uploadBytes`, not `uploadBytesResumable`), no size/type validation beyond the image MIME check.
- Uploads require `crypto.randomUUID()`, available in secure contexts; without it, the helper throws an explicit error rather than using a weaker identifier.
- Access control for uploads and download URL retrieval must be enforced with Firebase Storage Security Rules; the helper does not check authentication.
