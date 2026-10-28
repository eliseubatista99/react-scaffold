# Pdf — Components

---

## PdfPreview
Files: `components/pdfPreview/pdfPreview.tsx`, `pdfPreview.hook.tsx` (`usePdfPreviewHelper`, internal).

```ts
interface PdfPreviewProps {
  content: JSX.Element;                               // a @react-pdf/renderer <Document>
  mobileDownloadDisplay: (pdfUrl: string) => JSX.Element; // UI shown on mobile instead of the iframe
  tryAgainDisplay?: JSX.Element;
  errorDisplay?: (message: string) => JSX.Element;
  loadingDisplay?: JSX.Element;
  styles?: React.CSSProperties;                       // root container
}
```

### Behaviour
- On mount, `usePdfPreviewHelper` calls `usePdfGenerator().generatePdf(content)` **once** (empty deps — changing `content` does not regenerate).
- State machine rendered by the component:

| Condition | Rendered |
|---|---|
| `loading` | `loadingDisplay` |
| `!loading && error` | `errorDisplay(error)` |
| `!loading && !error && pdfUrl` | mobile → `mobileDownloadDisplay(pdfUrl)`; desktop → `<iframe src={pdfUrl} title="PDF Preview" minHeight 600px>` |
| `!loading && !error && !pdfUrl` | `tryAgainDisplay` (also shown on the very first render before the effect starts) |

- Mobile detection: `window.innerWidth < 768`, updated on `resize`.
- iframe `onError` sets the error to `"Error loading PDF on iframe"`.
- Root `div` (100%×100%, flex column, centered, `overflow: hidden`) stops click propagation (safe inside modals).
- Blob URL is revoked with `URL.revokeObjectURL` when the URL changes or on unmount.
- `tryAgainDisplay` has no retry callback; the component exposes no way to regenerate.

### usePdfPreviewHelper (internal)
Returns `{ pdfUrl: string | null, loading: boolean, error: string | null, setError, isMobile: boolean, pdfSize: number }`.
- Error messages are prefixed with `"Error generating PDF: "`. Because `generatePdf` returns `error` as a string and the helper rethrows it (not an `Error`), the message ends up as `"Error generating PDF: Unknown"`.

---

## PdfRenderer
Files: `components/pdfRenderer/pdfRenderer.tsx`, `pdfRenderer.hook.tsx` (`usePdfRendererHelper`, internal). External: `react-pdf` (`Document`, `Page`, `pdfjs`).

```ts
interface PdfRendererProps {
  file: string;                                       // URL of the PDF (imported asset, public path, blob URL)
  currentPage?: number;                               // when set, only this page is rendered (1-based)
  onDocumentLoaded?: (numberOfPages: number) => void;
  styles?: React.CSSProperties;
}
```

### Behaviour
- Module side effects: sets the pdf.js worker (`pdfjs-dist/build/pdf.worker.min.mjs` via `import.meta.url`) and imports react-pdf annotation/text layer CSS.
- `<Document file options={{ cMapUrl: "/cmaps/", standardFontDataUrl: "/standard_fonts/" }} onLoadSuccess>` with one `<Page pageNumber width height />` per configured page.
- Page `width`/`height` = container `clientWidth`/`clientHeight` at the time configs are created (not updated on resize).
- Root `div` has `data-testid="pdf-renderer-file"`, `width/height: 100%`.
- Pagination is controlled externally: the parent keeps `currentPage` state and uses `onDocumentLoaded` to know the total (see `stories/setup.tsx`). Out-of-range `currentPage` falls back to page 1.

### usePdfRendererHelper (internal)
```ts
type PdfPageConfig = { pageNum: number; width?: number; heigth?: number }; // "heigth" typo
returns { containerRef, pages: PdfPageConfig[], onDocumentLoadSuccess: ({ numPages }) => void }
```
- Recreates page configs on document load and whenever `currentPage` changes.
