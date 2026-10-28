# CV — Known Issues and Quirks

## Rendering / data
- **Education status key mismatch**: `EducationStatus` uses `"progress"`, translations define `education.status.in.progress` → Classic prints `education.status.progress` literally.
- **Missing key** `section.skillsAndLanguages.title` (resolved to the raw key; currently unused).
- **Empty month**: `i18n.global.time.month("")` resolves `t("time.months.")` → the raw key `time.months.` is printed. Classic passes `edu.startMonth || ""`/`exp.endMonth || ""` and Modern does not guard empty fields at all, so incomplete dates can show raw keys or `undefined`.
- Classic shows `Current` as end date for any education whose status is not `completed` (including `interrupted`).
- Modern/Timeline do not show education `type`/`status`.
- `Certification.hours` is never rendered; `languageLevelToPercent` is unused.
- Timeline contact row ignores `formatPhone` and always prints separators even when values are empty.
- Timeline applies `styles.desiredRole` twice (`[styles.desiredRole, styles.desiredRole]`).
- Section order differs between templates (Timeline: Projects before Certifications/Volunteer).
- `skills` is a single `Translation` string split by `,` in Modern/Timeline — commas inside a skill break it.

## Props not honoured
- `title` and `documentConfigs` are never forwarded to `BaseCVTemplate`; PDF metadata title is always "CV". `title` is only used as download file name by `useCVGenerator.downloadCV`.
- `CurriculumVitae` UI strings are hard-coded in Portuguese and ignore `language`; no `styles` passthrough.
- `CurriculumVitae` does not regenerate when props change (inherits `PdfPreview` mount-only generation).

## Naming / API
- Folder/file `useGenerateCV` exports `useCVGenerator`; story title uses `useCVGenerator`.
- The CV `Language` interface (name + level) shares its name with core's `Language` (string) type used in `template.ts`.
- `BaseTheme`, `ExampleCvContent`, `CVTemplateBaseI18n`, `BaseCVTemplate`, `useTemplateHelper`, `GenerateCVOutput` are not exported.
- `useGetCVDocument` silently falls back to Modern for unknown template names.

## Packaging
- `vite.config.ts` copies pdf.js `cmaps`/`standard_fonts` (copied from the pdf package) although cv does not use pdf.js directly.
- Only `react`/`react-dom` externalized → core, pdf and `@react-pdf/renderer` are bundled into cv's `dist` despite being peer deps.
- Unused peer deps: `react-router-dom`, `react-to-pdf`, `react-pdf` (only indirectly via pdf).
- `types/template.ts` imports from the internal path `@react-pdf/renderer/lib/react-pdf`.
- Core/pdf are consumed from npm (`^1.1.0` / `^1.0.1`), so local changes in those packages are not reflected until published.
- README installation section duplicated.

## Data
- `resources/exampleCV.ts` holds real personal data (email, phone, postal code) of the author; projects examples are commented out.
