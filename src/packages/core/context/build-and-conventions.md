# Core — Build, Configuration and Conventions

## package.json

- `name`: `@eliseubatista99/react-scaffold-core`, `version`: `1.2.7`, `private: false`, `publishConfig.access: public`, `license: MIT`, `author: eliseubatista99`.
- `main`: `dist/index.cjs.js`, `module`: `dist/index.es.js`, `types`: `dist/index.d.ts`, `files`: `["dist/"]`.
- Keywords: `react`, `scaffold`. Repository/homepage/bugs → `github.com/eliseubatista99/react-scaffold`.
- Scripts: `dev`/`start` = `vite`, `build` = `rimraf dist && vite build`, `clean` = `rm -rf dist`, `lint` = `eslint .`, `preview` = `vite preview`, `test` = `vitest run --environment jsdom`, `test:package` = build then smoke-test the published CommonJS bundle with the consumer's `MemoryRouter`.
- `peerDependencies`: `react ^19.1.0`, `react-dom ^19.1.0`, `react-router-dom ^7.6.3`, `react-slick ^0.31.0`, `slick-carousel ^1.8.1`, `dayjs ^1.11.19`.
- `devDependencies`: `@emotion/styled ^11.14.1`, `@testing-library/react`, `@eslint/js`, `@types/react ^19.1.8`, `@types/react-dom ^19.1.6`, `@vitejs/plugin-react ^4.6.0`, `eslint ^9.30.1`, `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh`, `globals`, `jsdom`, `rimraf ^3.0.2`, `typescript ~5.8.3`, `typescript-eslint`, `vite ^7.0.4`, `vite-plugin-dts ^4.5.4`, `vitest`.
- No `dependencies` field.

Navigation provider integration tests live in `tests/navigation.test.tsx` and can be run with `npm test` from this package directory.

## vite.config.ts

- Plugins: `@vitejs/plugin-react`, `vite-plugin-dts({ insertTypesEntry: true })`.
- `build.lib`: entry `src/index.ts`, `name: "MyComponentLibrary"`, formats `["es", "cjs"]`, `fileName: (format) => index.${format}.js`.
- `rollupOptions.external`: `["react", "react-dom", "react-router-dom"]` (globals `React`, `ReactDOM`, `ReactRouterDOM`). The React Router peer dependency must stay external so the package and consuming application share the same router context.
- `outDir`: `dist`.

## TypeScript

- `tsconfig.json` (build): `target/module: ESNext`, `jsx: react-jsx`, `declaration: true`, `declarationDir: dist`, `emitDeclarationOnly: true`, `strict: true`, `esModuleInterop: true`, `moduleResolution: Node`, `skipLibCheck: true`, include `src`.
- `tsconfig.app.json`: ES2020, bundler resolution, strict, `noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch`.
- `tsconfig.node.json`: for `vite.config.ts`.

## Folder conventions

```
components/<name>/
├── <name>.tsx            Component + exported <Name>Props
├── <name>.hook.ts        Optional: use<Name>Helper(props) with logic/state
├── index.ts              export * from "./<name>" (the .hook.ts file is NOT re-exported)
└── stories/
    ├── <name>.stories.tsx
    └── setup.tsx         Optional wrapper (*StoriesSetup) for interactive demos
```

- Components with a `.hook.ts`: `drawer`, `form`, `inputField`, `numericInputField`, `pageLayout`.
- Hooks: `hooks/<useName>/<useName>.ts(x)` + `index.ts` (+ optional `stories/`).
- Helpers: `helpers/<name>/<name>Helper.ts` exporting a class with **static arrow-function methods**. Exception: the text helper folder is `helpers/text/textHelper.ts`.
- Providers: `providers/<name>/<name>Provider.tsx`, `<name>Context.ts`, hook(s) (`useFeedback.ts` or `hooks/useNavigation.ts`).
- Every folder has an `index.ts` barrel using `export * from`.

## Naming conventions

- Components: PascalCase (`InputField`). Props: `<Component>Props` (interface or type).
- Logic hooks: `use<Component>Helper` (e.g. `useDrawerHelper`, `useFormHelper`).
- Helper classes: `<Name>Helper`.
- Provider props: `<Name>ProviderInputProps`; context data: `<Name>ContextData`; context object: `<Name>ProviderContext`.

## Styling approach

- Default visual style defined with inline `CSSProperties`; components expose native `style` props for root styling when appropriate, alongside specialised props (`containerStyles`, `inputStyles`, `checkboxStyles`, `checkedStyles`, `barStyles`, `backgroundStyles`, `contentStyles`, `childrenStyles`, `pageStyles`). Overrides are applied **after** defaults.
- `@emotion/styled` is used when pseudo-selectors/nested selectors are required:
  - `Carousel` (`.slick-*` overrides), `InputField` (focus/autofill), `TextAreaField` (scrollbar), `Form` (`SubmitButton`), `PageLayout` (page container).
- Default palette: black borders `#000000`, grey `#969696ff`/`#d6d6d6ff`, overlay backdrop `#00000068`, progress fill `#f58b00ff`, toast `#534a4aff`.
- Overlays use `position: fixed` with `zIndex: 1000` (modal content `1001`, page header `99`).

## Storybook stories

| Title | Location | Notes |
|---|---|---|
| `Core/Components/Button` | components/button/stories | Default, XboxPrimary, XboxSecondary |
| `Core/Components/Carousel` | components/carousel/stories | Default, NoGap, WithDots |
| `Core/Components/Checkbox` | components/checkbox/stories | uses setup.tsx |
| `Core/Components/Drawer` | components/drawer/stories | uses setup.tsx + FeedbackProvider |
| `Core/Components/Form` | components/form/stories | setup.tsx adds pre-submit loader overlay |
| `Core/Components/Input Field` | components/inputField/stories | |
| `Core/Components/Loader` | components/loader/stories | setup.tsx |
| `Core/Components/Modal` | components/modal/stories | setup.tsx |
| `Core/Components/Numeric Input Field` | components/numericInputField/stories | |
| `Core/Components/PageLayout` | components/pageLayout/stories | setup.tsx |
| `Core/Components/ProgressBar` | components/progressBar/stories (`.stories.ts`) | |
| `Core/Components/Radio Button` | components/radioButton/stories | |
| `Core/Components/Text Area` | components/textAreaField/stories | |
| `Core/Components/Toast` | components/toast/stories | setup.tsx |
| `Core/Components/Typography` | components/typography/stories | |
| `Core/Helpers/ScrollHelper` | helpers/scrollHelper/stories | setup.tsx |
| `Core/Helpers/TextHelper` | helpers/text/stories | setup.tsx |
| `Core/Hooks/useFetch` | hooks/useFetch/stories | setup.tsx |
| `Core/Hooks/useResponsive` | hooks/useResponsive/stories | setup.tsx |
| `Core/Hooks/useTranslations` | hooks/useTranslations/stories | setup.tsx |
| `Core/Providers/Feedback Provider` | providers/feedback/stories | setup.tsx |
| `Core/Providers/Navigation Provider` | providers/navigation/stories | setup.tsx |

- Pattern: `const meta = { title, component, parameters: { layout: "fullscreen" }, tags: ["autodocs"], args } satisfies Meta<typeof X>`.
- No story uses MSW or global decorators.
- Components without stories: `Image`, `SvgImage`. Hooks without stories: `useDidMount`, `useDrag`, `useOnScreen`, `usePointer`.

## READMEs

- `README.md` (package): install `npm i @eliseubatista99/react-scaffold-core`; overview of Providers, Hooks, Helpers, Components.
- `src/components/README.md`: documents only `Drawer`.
- `src/helpers/README.md`: documents all exported helpers and their current behavior.
- `src/hooks/README.md`: documents only `useFetch` (outdated usage `await fetch<SomeType>(url)`).
- `src/providers/README.md`: documents Navigation/Feedback providers but is partly outdated (see known-issues).
