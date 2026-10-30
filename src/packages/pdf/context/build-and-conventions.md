# Pdf — Build, Configuration and Conventions

## package.json
- `name`: `@eliseubatista99/react-scaffold-pdf`, `version`: `1.0.1`, `private: false`, `publishConfig.access: public`, MIT, author `eliseubatista99`.
- Description: "PDF utilities for React projects."
- `main`: `dist/index.cjs.js`, `module`: `dist/index.es.js`, `types`: `dist/index.d.ts`, `files`: `["dist/"]`.
- Scripts: `dev`/`start` = `vite`, `build` = `rimraf dist && vite build`, `clean` = `rimraf dist`, `lint` = `eslint .`, `preview` = `vite preview`.
- `dependencies`: `{}`.
- `peerDependencies`: `@react-pdf/renderer ^4.3.0`, `react ^19.1.0`, `react-dom ^19.1.0`, `react-pdf ^10.0.1`, `react-router-dom ^7.6.3`, `react-to-pdf ^2.0.1`.
- `devDependencies`: eslint stack, `@types/react ^19.1.8`, `@types/react-dom ^19.1.6`, `@vitejs/plugin-react ^4.6.0`, `rimraf`, `typescript ~5.8.3`, `vite ^7.0.4`, `vite-plugin-dts ^4.5.4`, `vite-plugin-static-copy ^3.1.1`.
- `pdfjs-dist` is not declared; it is resolved transitively through `react-pdf`.

## vite.config.ts
- Resolves the `pdfjs-dist` install folder with `createRequire(import.meta.url).resolve("pdfjs-dist/package.json")`.
- Plugins:
  - `@vitejs/plugin-react`
  - `vite-plugin-dts({ insertTypesEntry: true })`
  - `viteStaticCopy` → copies `pdfjs-dist/cmaps` and `pdfjs-dist/standard_fonts` to the root of `dist/`.
- `assetsInclude: ["**/*.pdf"]` (used by stories importing `example.pdf`).
- `build.lib`: entry `src/index.ts`, `name: "ReactScaffoldPdf"`, formats `["es", "cjs"]`, `index.<format>.js`.
- `rollupOptions.external`: `react`, `react-dom`, `@react-pdf/renderer` and `react-pdf` are externalized; React subpath imports are externalized as well.
- Comments in the config are in Portuguese.

## TypeScript
- `tsconfig.json`: ESNext, `jsx: react-jsx`, `declaration`, `declarationDir: dist`, `emitDeclarationOnly`, `strict`, `esModuleInterop`, `moduleResolution: Node`, `skipLibCheck`.
- `tsconfig.app.json`: ES2020, bundler mode, strict, unused checks. `tsconfig.node.json`: ES2022 for `vite.config.ts`.
- `src/pdf.d.ts` declares `*.pdf` imports as `string` URLs.

## Conventions
- Same layout as other packages: `<name>/<name>.tsx` + `<name>.hook.tsx` (`use<Name>Helper`, internal) + `index.ts` + `stories/`.
- Hook file naming here is `usePdfGenerator.hook.tsx` (folder `usePdfGenerator/`).
- `pdfPreview.hook.tsx` starts with `"use client"`.
- Inline styles only; `styles` prop spread last.
- Components accept `JSX.Element` content (global `JSX` namespace).

## Runtime asset requirements (consumers)
- `PdfRenderer` sets `pdfjs.GlobalWorkerOptions.workerSrc = new URL("pdfjs-dist/build/pdf.worker.min.mjs", import.meta.url)` at module load (side effect on import of the package).
- It loads character maps from `/cmaps/` and standard fonts from `/standard_fonts/` (absolute paths at the site root). The consuming app must serve these folders (e.g. copy them from `pdfjs-dist` into its `public/`).
- `PdfRenderer` imports `react-pdf/dist/Page/AnnotationLayer.css` and `TextLayer.css` (side effects).

## Storybook stories
| Title | Component | Notes |
|---|---|---|
| `Pdf/Components/PdfPreview` | `PdfPreview` | Story `Base`; args use `<PdfPreviewExampleContent />` (A4 `@react-pdf/renderer` doc with two sections); Portuguese UI strings ("Abrir PDF numa nova aba", "Tentar novamente", "Carregando PDF...") |
| `Pdf/Components/PdfRenderer` | `PdfRendererStoriesSetup` | Stories `Base` (`currentPage: undefined`, all pages) and `Paginated` (`currentPage: 1`, arrows `<-`/`->`, counter, dark `#292929ff` background). File: `stories/example.pdf` |
| `Pdf/Hooks/usePdfGenerator` | `UsePdfGeneratorStoriesSetup` | Story `Base`; buttons Generate → Download / Preview; args `fileName: "test.pdf"`, `content: <PdfGeneratorExampleContent />` |

## README
- Install `npm i @eliseubatista99/react-scaffold-pdf` (section duplicated). Lists Components and Hooks folders; warns against mixing with other PDF libraries.
