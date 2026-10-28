# @eliseubatista99/react-scaffold-pdf — Package Context

> Main context file for the **pdf** package. Detailed documents live in [context/](context/).

## Summary

| Field | Value |
|---|---|
| npm name | `@eliseubatista99/react-scaffold-pdf` |
| Version | `1.0.1` |
| Location | `src/packages/pdf` |
| Entry | `src/index.ts` → `dist/index.es.js`, `dist/index.cjs.js`, `dist/index.d.ts` (+ copied `cmaps/`, `standard_fonts/`) |
| Peer deps | `@react-pdf/renderer ^4.3.0`, `react ^19.1.0`, `react-dom ^19.1.0`, `react-pdf ^10.0.1`, `react-router-dom ^7.6.3` (unused), `react-to-pdf ^2.0.1` (unused) |
| Depends on other scaffold packages | No |
| Used by | `@eliseubatista99/react-scaffold-cv` (`usePdfGenerator`, `PdfPreview`) |

PDF utilities for React:
- **Generate** a PDF from `@react-pdf/renderer` JSX (or from a base64 string) into a Blob URL, then download or open it.
- **Preview** generated JSX PDFs in an `<iframe>` (with mobile fallback UI).
- **Render** an existing PDF file page-by-page with `react-pdf` (pdf.js).

The README warns that using this library together with other PDF libraries is not recommended.

## Public API (exported from `src/index.ts`)

`src/index.ts` re-exports `./components` and `./hooks`.

| Export | Kind | Details |
|---|---|---|
| `PdfPreview`, `PdfPreviewProps` | Component | [context/components.md](context/components.md) |
| `PdfRenderer`, `PdfRendererProps` | Component | [context/components.md](context/components.md) |
| `usePdfGenerator` | Hook | [context/hooks.md](context/hooks.md) |

Internal (not exported): `usePdfPreviewHelper`, `usePdfRendererHelper`, `PdfPageConfig`, `GeneratePdfOutput`.

## Folder structure

```
src/
├── index.ts
├── pdf.d.ts                         declare module "*.pdf" { const src: string; export default src; }
├── components/
│   ├── pdfPreview/   pdfPreview.tsx, pdfPreview.hook.tsx, stories/ (pdfPreview.stories.tsx, exampleContent.tsx)
│   └── pdfRenderer/  pdfRenderer.tsx, pdfRenderer.hook.tsx, stories/ (pdfRenderer.stories.tsx, setup.tsx, example.pdf)
└── hooks/
    └── usePdfGenerator/  usePdfGenerator.hook.tsx, stories/ (usePdfGenerator.stories.tsx, setup.tsx, exampleContent.tsx)
```

## Quick usage

```tsx
import { Document, Page, Text } from "@react-pdf/renderer";
import { usePdfGenerator, PdfPreview, PdfRenderer } from "@eliseubatista99/react-scaffold-pdf";

const doc = <Document><Page size="A4"><Text>Hello</Text></Page></Document>;

const { generatePdf, downloadPdf, previewPdf } = usePdfGenerator();
const { url, error } = await generatePdf(doc);
if (url) downloadPdf(url, "hello"); // hello.pdf

<PdfPreview content={doc} mobileDownloadDisplay={(u) => <a href={u}>Open</a>} />
<PdfRenderer file="/files/manual.pdf" currentPage={1} onDocumentLoaded={setTotal} />
```

## Detailed context files

| File | Content |
|---|---|
| [context/build-and-conventions.md](context/build-and-conventions.md) | package.json, Vite (static copy of pdf.js assets), TS config, conventions, stories |
| [context/components.md](context/components.md) | `PdfPreview`, `PdfRenderer` and their internal hooks |
| [context/hooks.md](context/hooks.md) | `usePdfGenerator` |
| [context/known-issues.md](context/known-issues.md) | Bugs, quirks and inconsistencies |
