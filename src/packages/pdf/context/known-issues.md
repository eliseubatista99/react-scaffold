# Pdf — Known Issues and Quirks

## Packaging
- `react-router-dom` and `react-to-pdf` are declared as peer dependencies but never imported.
- `pdfjs-dist` is used directly (worker URL, cmaps/fonts copy in `vite.config.ts`) but not declared as a dependency/peer.
- Only `react`/`react-dom` are externalized; `@react-pdf/renderer` and `react-pdf` are bundled despite being peer deps (possible duplicate copies in consumers).
- Vite library `name` is the placeholder `MyComponentLibrary`.
- Package description typo: "utilites".
- `GeneratePdfOutput` and `PdfPageConfig` types are not exported.

## PdfRenderer
- `PdfPageConfig.heigth` typo (should be `height`).
- Requires `/cmaps/` and `/standard_fonts/` to be served at the site root; otherwise non-Latin text/standard fonts fail.
- Worker configured globally at import time; conflicts with apps configuring their own pdf.js worker.
- Page size is measured once; no resize handling.
- `useEffect(..., [containerRef])` never re-runs (ref object identity is stable).
- Uses `var` in `createPageConfigs`.

## PdfPreview
- PDF is generated only on mount; changing `content` has no effect until remount.
- `tryAgainDisplay` has no retry action, and it flashes on the first render before loading starts.
- Error message always ends with "Unknown" because the helper throws a string instead of an `Error`.
- `result.size!` / `result.url!` non-null assertions are applied before checking `result.error`.
- Mobile breakpoint (768px) is hard-coded and independent from core's `useResponsive`.
- `tryAgainDisplay`, `errorDisplay`, `loadingDisplay` are destructured in the helper but unused there.

## usePdfGenerator
- Object URLs are never revoked by the hook (memory leak if many PDFs are generated).
- `downloadPdf` always appends `.pdf`.

## Docs
- README "Installation" section is duplicated.
