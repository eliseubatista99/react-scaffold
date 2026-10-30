# @eliseubatista99/react-scaffold-pdf

PDF utilities for React applications: generate PDFs from
`@react-pdf/renderer` documents, preview generated documents, and render
existing PDF files.

## Requirements

The package declares these peer dependencies. Install the ones required by your
application and keep them within the supported ranges:

| Peer dependency | Version |
| --- | --- |
| `@react-pdf/renderer` | `^4.3.0` |
| `react` | `^19.1.0` |
| `react-dom` | `^19.1.0` |
| `react-pdf` | `^10.0.1` |
| `react-router-dom` | `^7.6.3` |
| `react-to-pdf` | `^2.0.1` |

## Installation

```sh
npm install @eliseubatista99/react-scaffold-pdf \
  @react-pdf/renderer@^4.3.0 react@^19.1.0 react-dom@^19.1.0 \
  react-pdf@^10.0.1 react-router-dom@^7.6.3 react-to-pdf@^2.0.1
```

## Quick start

`PdfPreview` generates a preview from a `Document` created with
`@react-pdf/renderer`. Provide a mobile fallback because the component uses a
download/open UI instead of an embedded viewer on narrow screens:

```tsx
import { Document, Page, Text } from "@react-pdf/renderer";
import { PdfPreview } from "@eliseubatista99/react-scaffold-pdf";

const document = (
  <Document>
    <Page size="A4">
      <Text>Hello from a PDF.</Text>
    </Page>
  </Document>
);

export function PdfExample() {
  return (
    <PdfPreview
      content={document}
      mobileDownloadDisplay={(url) => (
        <a href={url} download="example.pdf">
          Download PDF
        </a>
      )}
    />
  );
}
```

## Public API

All exports are available from the package root:

- `usePdfGenerator` — generate a PDF or raw-base64 PDF, download it, or open it
  in a new tab.
- `PdfPreview` — generate and preview a PDF document.
- `PdfRenderer` — render pages from an existing PDF URL or asset.

`usePdfGenerator().generatePdf()` returns a Blob object URL. Revoke URLs
created directly by the hook with `URL.revokeObjectURL()` when they are no
longer needed. `PdfPreview` manages and revokes its own URL.

`PdfRenderer` configures PDF.js assets using the package's copied `cmaps/` and
`standard_fonts/` files. If your deployment changes the base path, verify that
the `/cmaps/` and `/standard_fonts/` paths used by PDF.js are served correctly.

## Development

Run these commands from `src/packages/pdf`:

```sh
npm ci
npm run build
npm run lint
```

## License

[MIT](../../../LICENSE)
