# Pdf — Known Issues and Quirks

## Packaging
- `react-router-dom` and `react-to-pdf` are declared as peer dependencies but never imported.
- `pdfjs-dist` is used directly (worker URL, cmaps/fonts copy in `vite.config.ts`) but not declared as a dependency/peer.

## PdfRenderer
- Requires `/cmaps/` and `/standard_fonts/` to be served at the site root; otherwise non-Latin text/standard fonts fail.
- Worker configured globally at import time; conflicts with apps configuring their own pdf.js worker.

## PdfPreview
- `tryAgainDisplay` has no retry action.
- Mobile breakpoint (768px) is hard-coded and independent from core's `useResponsive`.

## usePdfGenerator
- Object URLs are never revoked by the hook (memory leak if many PDFs are generated).
- `downloadPdf` always appends `.pdf`.

## Docs
