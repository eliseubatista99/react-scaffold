# Pdf — Hooks

## usePdfGenerator
File: `hooks/usePdfGenerator/usePdfGenerator.hook.tsx`. External: `pdf` from `@react-pdf/renderer`.

```ts
export interface GeneratePdfOutput {
  error?: string;
  url?: string;   // Blob object URL (blob:...)
  size?: number;  // bytes
}

usePdfGenerator(): {
  generatePdf: (content: JSX.Element) => Promise<GeneratePdfOutput>;
  generateBase64Pdf: (content: string) => Promise<GeneratePdfOutput>;
  downloadPdf: (url: string, name?: string) => Promise<void>;
  previewPdf: (url: string) => Promise<void>;
}
```

| Method | Behaviour |
|---|---|
| `generatePdf(content)` | `await pdf(content).toBlob()` → `URL.createObjectURL(blob)`; returns `{ url, size }`. On exception returns `{ error: err.message \| "Unknown" }`. `content` must be a `@react-pdf/renderer` `<Document>`. |
| `generateBase64Pdf(base64)` | `atob` → `Uint8Array` → `Blob({ type: "application/pdf" })` → object URL. Same error shape. Input must be raw base64 (no `data:` prefix). |
| `downloadPdf(url, name?)` | Creates an `<a href download="${name ?? "file"}.pdf">` and clicks it. Passing a name that already ends with `.pdf` produces `x.pdf.pdf`. |
| `previewPdf(url)` | Creates an `<a href target="_blank" rel="noopener noreferrer">` and clicks it (may be blocked by pop-up blockers if not triggered by a user gesture). |

Notes:
- The hook is stateless; its methods have stable identities between renders.
- Object URLs created by `generatePdf`/`generateBase64Pdf` are **not** revoked by the hook; the caller is responsible (`URL.revokeObjectURL`). `PdfPreview` revokes its own URL.
- Used by `cv`'s `useCVGenerator` and by `PdfPreview`.
