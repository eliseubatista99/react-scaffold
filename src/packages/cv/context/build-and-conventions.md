# CV — Build, Configuration and Conventions

## package.json
- `name`: `@eliseubatista99/react-scaffold-cv`, `version`: `1.0.1`, `private: false`, `publishConfig.access: public`, MIT, author `eliseubatista99`. Description: "A library of cv templates."
- `main`: `dist/index.cjs.js`, `module`: `dist/index.es.js`, `types`: `dist/index.d.ts`, `files`: `["dist/"]`.
- Scripts: `dev`/`start` = `vite`, `build` = `rimraf dist && vite build`, `clean` = `rm -rf dist`, `lint` = `eslint .`, `preview` = `vite preview`.
- `dependencies`: `{}`.
- `peerDependencies`: `@eliseubatista99/react-scaffold-core ^1.1.0`, `@eliseubatista99/react-scaffold-pdf ^1.0.1`, `@react-pdf/renderer ^4.3.0`, `react ^19.1.0`, `react-dom ^19.1.0`, `react-pdf ^10.0.1`, `react-router-dom ^7.6.3`, `react-to-pdf ^2.0.1`.
- `devDependencies`: same tooling as other packages (`vite ^7.0.4`, `vite-plugin-dts ^4.5.4`, `vite-plugin-static-copy ^3.1.1`, `typescript ~5.8.3`, eslint stack, `@types/react ^19.1.8`, `rimraf`) plus `@eliseubatista99/react-scaffold-core ^1.1.0` and `@eliseubatista99/react-scaffold-pdf ^1.0.1` (installed from npm, not linked to local sources).

## vite.config.ts
- **Copied from the pdf package**: resolves `pdfjs-dist` and uses `viteStaticCopy` to copy `cmaps/` and `standard_fonts/` into `dist/`; `assetsInclude: ["**/*.pdf"]`. The cv source does not use pdf.js directly.
- Plugins: `@vitejs/plugin-react`, `vite-plugin-dts({ insertTypesEntry: true })`, `viteStaticCopy`.
- `build.lib`: entry `src/index.ts`, `name: "MyComponentLibrary"`, formats `["es", "cjs"]`, `index.<format>.js`, `outDir: dist`.
- `rollupOptions.external`: `["react", "react-dom"]` only → `@eliseubatista99/react-scaffold-core`, `@eliseubatista99/react-scaffold-pdf` and `@react-pdf/renderer` are bundled into the output.

## TypeScript
- `tsconfig.json`: ESNext, `jsx: react-jsx`, `declaration`, `declarationDir: dist`, `emitDeclarationOnly`, `strict`, `esModuleInterop`, `moduleResolution: Node`, `skipLibCheck`, include `src`.
- `tsconfig.app.json`: ES2020, bundler mode, strict, unused checks. `tsconfig.node.json`: ES2022.
- `types/template.ts` imports `DocumentProps`/`PageProps` from the deep path `@react-pdf/renderer/lib/react-pdf`.

## Conventions
- Template folder: `<name>/<name>.tsx` (component `CVTemplate<Name>`), `<name>.styles.tsx` (`getStyles(theme?)` using `StyleSheet.create`), `<name>.i18n.ts` (`templateI18n: TranslationList` = base + overrides), `index.ts`.
- All templates call `useTemplateHelper({ ...props, translations: templateI18n })` and render `<BaseCVTemplate><Page size="A4" style={styles.page} {...props.pageConfigs}>…</Page></BaseCVTemplate>`.
- Only `@react-pdf/renderer` primitives (`Document`, `Page`, `View`, `Text`, `Link`, `StyleSheet`) may be used inside templates — no DOM elements.
- Font: built-in `Helvetica` (no custom font registration).
- Hooks folder name `useGenerateCV` exports `useCVGenerator`.

## Adding a new template (checklist)
1. Create `templates/<name>/` with `<name>.tsx`, `<name>.styles.tsx`, `<name>.i18n.ts`, `index.ts`.
2. Add the key to `CVTemplateType` in `types/cv.ts`.
3. Add a `case` in `useGetCVDocument.getDocument` (default currently falls back to Modern).
4. Add it to `CvTemplates` in `templates/index.ts`.
5. Add stories in `components/cv/stories/cv.stories.tsx` and `hooks/useGenerateCV/stories/useGenerateCV.stories.tsx`.

## Storybook stories
| Title | Component | Stories |
|---|---|---|
| `CV/Components/CurriculumVitae` | `CurriculumVitae` | `Classic`, `Modern`, `Timeline`, `WithoutWrap` (`template: "modern"`, `pageConfigs: { wrap: false }`). Default args: `data: ExampleCvContent`, `language: "en"`, `template: "classic"` |
| `CV/Hooks/useCVGenerator` | `UseCVGeneratorStoriesSetup` (`hooks/useGenerateCV/stories/setup.tsx`) | `Classic`, `Modern`, `Timeline`. Setup renders Generate / Download / Preview buttons; args `{ data: { template, data: ExampleCvContent } }` |

## README
- Install `npm i @eliseubatista99/react-scaffold-cv` (section duplicated). States it must be used together with `@eliseubatista99/react-scaffold-pdf`. Lists Components, Hooks, Templates.
