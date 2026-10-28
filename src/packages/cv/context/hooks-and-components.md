# CV — Hooks and Components

---

## CurriculumVitae
File: `components/cv/cv.tsx`. Depends on `PdfPreview` from `@eliseubatista99/react-scaffold-pdf`.

```ts
interface CurriculumVitaeProps extends CvTemplateProps { template: CVTemplateType; }
const CurriculumVitae: (props: CurriculumVitaeProps) => JSX.Element;
```
- Builds the template document via `useGetCVDocument().getDocument(props)` and passes it to `PdfPreview` as `content`.
- Hard-coded Portuguese UI strings (not translated with `language`):
  - mobile: `<a href={pdfUrl} target="_blank" rel="noopener noreferrer">Abrir PDF numa nova aba</a>`
  - try again: `Tentar novamente`
  - error: `<div>{message}</div>`
  - loading: `Carregando PDF...`
- No `styles` prop is forwarded to `PdfPreview`.
- Inherits `PdfPreview` behaviour: generates once on mount (prop changes need a remount, e.g. change `key`), iframe on desktop, link on mobile (< 768px).

## useGetCVDocument
File: `hooks/useGetCVDocument/useGetCVDocument.tsx`
```ts
useGetCVDocument(): { getDocument: (data: CurriculumVitaeProps) => JSX.Element }
```
- `switch (data.template)`: `"classic"` → `<CVTemplateClassic {...data} />`, `"timeline"` → `<CVTemplateTimeline {...data} />`, anything else → `<CVTemplateModern {...data} />`.
- Note: templates call React hooks (`useTemplateHelper` → `useTranslations`). They work because `@react-pdf/renderer` renders them as components; `getDocument` only creates elements.

## useCVGenerator
File: `hooks/useGenerateCV/useGenerateCV.tsx` (folder named `useGenerateCV`, exported hook named `useCVGenerator`). Depends on `usePdfGenerator` from `@eliseubatista99/react-scaffold-pdf`.

```ts
interface GenerateCVOutput { error?: string; url?: string; size?: number; }  // not exported

useCVGenerator(): {
  generateCV: (data: CurriculumVitaeProps) => Promise<GenerateCVOutput>;
  downloadCV: (data: CurriculumVitaeProps) => Promise<void>;
  previewCV:  (data: CurriculumVitaeProps) => Promise<void>;
}
```
- `generateCV`: `getDocument(data)` → `generatePdf(doc)` → `{ error, size, url }` (Blob object URL).
- `downloadCV`: generates, then `downloadPdf(url, data.title ?? "CV")` → file `<title>.pdf`.
- `previewCV`: generates, then `previewPdf(url)` (opens in new tab).
- Errors are swallowed by `downloadCV`/`previewCV` (nothing happens when `url` is undefined). Object URLs are not revoked.

### Story setup
`hooks/useGenerateCV/stories/setup.tsx` → `UseCVGeneratorStoriesSetup({ data: CurriculumVitaeProps })` renders a "Generate" button that stores the URL, then "Download" / "Preview" buttons.
