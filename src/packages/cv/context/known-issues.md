# CV — Known Issues and Quirks

## Rendering / data
- **Missing key** `section.skillsAndLanguages.title` (resolved to the raw key; currently unused).
- Incomplete date fields can leave dangling separators or partial ranges in Modern and Classic.
- Modern/Timeline do not show education `type`/`status`.
- `Certification.hours` is never rendered; `languageLevelToPercent` is unused.
- Section order differs between templates (Timeline: Projects before Certifications/Volunteer).
- `skills` is a single `Translation` string split by `,` in Modern/Timeline — commas inside a skill break it.

## Props not honoured
- `CurriculumVitae` does not expose a `styles` passthrough to `PdfPreview`.

## Naming / API
- Folder/file `useGenerateCV` exports `useCVGenerator`; story title uses `useCVGenerator`.
- The CV `Language` interface (name + level) shares its name with core's `Language` (string) type used in `template.ts`.
- `BaseTheme`, `ExampleCvContent`, `CVTemplateBaseI18n`, `BaseCVTemplate`, `useTemplateHelper` are not exported.
- `useGetCVDocument` silently falls back to Modern for unknown template names.

## Packaging
- Unused peer deps: `react-router-dom`, `react-to-pdf`, `react-pdf` (only indirectly via pdf).
- `vite-plugin-static-copy` remains in `devDependencies` although the CV build no longer uses it.
- `types/template.ts` imports from the internal path `@react-pdf/renderer/lib/react-pdf`.
- Core/pdf are consumed from npm (`^1.1.0` / `^1.0.1`), so local changes in those packages are not reflected until published.

## Data
- `resources/exampleCV.ts` holds real personal data (email, phone, postal code) of the author; projects examples are commented out.
