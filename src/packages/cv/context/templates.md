# CV — Templates, Styling and Theme

All templates are `@react-pdf/renderer` components producing a single A4 `<Page>` (content wraps to more pages automatically unless `pageConfigs.wrap === false`).

---

## BaseCVTemplate (internal)
File: `templates/baseTemplate.tsx`
```tsx
<Document
  title={title || "CV"}
  author="eliseubatista99"
  style={{ width: "100%", height: "100%", position: "relative", flex: 1 }}
  {...documentConfigs}
>{children}</Document>
```
- Templates forward `title` and `documentConfigs` to `<BaseCVTemplate>`. The document title defaults to `"CV"`; values in `documentConfigs` are spread last and can override the title and other document properties.

## useTemplateHelper (internal)
File: `templates/templates.hook.ts`
```ts
interface TemplateHelperProps extends CvTemplateProps { translations: TranslationList; }
useTemplateHelper({ data, language, translations }) => {
  getTranslation,          // from core useTranslations
  i18n,                    // labels (see below)
  languageLevelToPercent,  // a1 20, a2 35, b1 55, b2 70, c1 85, c2 100, native 100, default 50 (unused by templates)
  getSocialUrl,            // Link → URL
  formatPhone,             // (countryCode, phone) → "code phone"
  data,                    // CvData with every Translation resolved to string | undefined
}
```
- Calls `useTranslations({ language: language || "en", translations })`.
- `i18n.global`: `link(type)`, `time.current`, `time.month(m)`, `education.type(t)`, `education.status(s)`, `language.level(l)`.
- `i18n.sections`: `summary`, `links`, `contacts`, `experience`, `education`, `skills`, `languages`, `certification` (+`action`), `volunteer`, `projects` (+`action`, `source`), `skillsAndLanguages` — each with `title`.
- `getSocialUrl(link)`:
  - `email` → `mailto:value`; `phone` → `tel:value`;
  - no protocol but contains `linkedin.com` / `github.com` / `gitlab.com` → `https://value`;
  - no protocol: `linkedin` → `https://www.linkedin.com/in/value`, `github` → `https://github.com/value`, others → `https://value`;
  - otherwise returned unchanged.
- `formatPhone(countryCode, phone)`: if both exist → `"<text inside parentheses or countryCode> <phone>"`; else `phone`.
- Missing `personalInfo` remains `undefined` in the resolved data; a supplied object has its `desiredRole` translated.
- `formatPhone(countryCode, phone)` uses the supplied arguments and returns the phone unchanged when either is missing.

---

## Theme
- `theme/theme.tsx`: `BaseTheme: CvTheme = { color: "#2563eb" }` (blue-600).
- Each template's `getStyles(theme?: CvTheme)` merges `{ ...BaseTheme, ...theme }` and builds a `StyleSheet.create({...})` where `finalTheme.color` is the accent (desired role, section titles/borders, tech lines, links, timeline nodes, skill pills).
- The only themeable property is `color`; fonts and sizes are fixed.

---

## Classic (`CVTemplateClassic`)
Files: `templates/classic/classic.tsx`, `classic.styles.tsx` (page padding 30, base font 11, Helvetica), `classic.i18n.ts` (base translations only).

Section order:
1. **Header** (only if `personalInfo`): name, desired role, contact row `city | postalCode | email | phone` (pipe separators, empty items filtered), links row `"<Label>: value"` as `<Link>`.
2. **Professional Summary** (`resume`).
3. **Professional Experience**: `role - company` + date range `Mon/YYYY - Mon/YYYY|Current`, tech, `• activities`, `• results`; separators between entries (bottom border only when not last).
4. **Education**: `course - <type label> (<status label>)`, date range (when status ≠ `completed` the end shows `Current`), institution, `• description`.
5. **Skills and Languages** (two columns): skills as plain text; languages `Name (Level)`.
6. **Certifications**: name + `completionDate`, issuer, validation link, `• description`.
7. **Volunteer Work**: role + `Mon YYYY - Mon YYYY|Current`, organization, `• description`, `• impact`.
8. **Projects**: name + year, tech, `• description`, link, source code link.

## Modern (`CVTemplateModern`)
Files: `templates/modern/modern.tsx`, `modern.styles.tsx` (padding 30, base font 10, name 24, Helvetica), `modern.i18n.ts` (overrides `time.current` → en "Present", pt "Atual").

- Header always rendered; contact separator `•`.
- Experience: `role • company`, `Mon YYYY - Mon YYYY|Present` (no guards for empty fields), tech, activities, results (no bullets). Blocks use a colored left border.
- Education: course + `Mon YYYY - Mon YYYY` (type/status not shown).
- Skills split by `,` into tag-like items (`skillsGrid`); Languages `Name (Level)`.
- Certifications with `View Certificate` action link; Volunteer; Projects with `View Project` / `Source Code` links.
- Also the default template for any unknown `template` value.

## Timeline (`CVTemplateTimeline`)
Files: `templates/timeline/timeline.tsx`, `timeline.styles.tsx` (padding 30, base font 10, Helvetica), `timeline.i18n.ts` (overrides section titles: Summary/Resumo, Education/Educação, Experience/Experiência).

- Header: name, desired role, contact row `city • postalCode | countryCode phone | email` (does not use `formatPhone`), links.
- Experience rendered as a vertical timeline: left rail (`railLine` + circular `node`) and content (role, dates, company, tech, `• activities`, `• results`).
- Education: course + dates, institution, `• description` (no type/status).
- Skills as rounded pills (`skillPill`), Languages as a list `Name — Level`.
- Order after languages: **Projects → Certifications → Volunteer** (different from Classic/Modern).

---

## CvTemplates map
`templates/index.ts`:
```ts
export const CvTemplates = { Classic: CVTemplateClassic, Modern: CVTemplateModern, Timeline: CVTemplateTimeline };
```
Use it to render a template inside a custom `@react-pdf/renderer` pipeline (e.g. `pdf(<CvTemplates.Classic data={...} />).toBlob()`).
