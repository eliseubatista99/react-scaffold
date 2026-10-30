# Firebase — Build, Configuration and Conventions

## package.json
- `name`: `@eliseubatista99/react-scaffold-firebase`, `version`: `1.0.19`, `private: false`, `publishConfig.access: public`, MIT, author `eliseubatista99`.
- `main`: `dist/index.cjs.js`, `module`: `dist/index.es.js`, `types`: `dist/index.d.ts`, `files`: `["dist/"]`.
- Scripts: `dev` = `tsc && vite`, `start` = `vite`, `build` = `rimraf dist && vite build`, `clean` = `rimraf dist`, `lint` = `eslint .`, `test` = provider and hook tests via Vitest, `preview` = `vite preview`.
- `peerDependencies`: `firebase ^12.19.0`, `react ^19.1.0`, `react-dom ^19.1.0`.
- `devDependencies`: Firebase SDK (matching its peer range), Vitest, jsdom, eslint stack, React types, Vite and TypeScript tooling.
- `test` runs the package's own Vitest/jsdom installation rather than delegating to the sibling `core` package.

## vite.config.ts
- Plugins: `@vitejs/plugin-react`, `vite-plugin-dts({ insertTypesEntry: true })`.
- `build.lib`: entry `src/index.ts`, `name: "ReactScaffoldFirebase"`, formats `["es", "cjs"]`, `index.<format>.js`, `outDir: dist`.
- `rollupOptions.external`: `react`, `react-dom`, both React JSX runtimes, and the modular Firebase modules used by this package. Peer dependencies are not bundled.
- `optimizeDeps.include`: the modular Firebase modules used by this package.

## TypeScript
- `tsconfig.json`: ESNext, `jsx: react-jsx`, `declaration`, `declarationDir: dist`, `emitDeclarationOnly`, `strict`, `esModuleInterop`, `moduleResolution: Node`, `skipLibCheck`.
- `tsconfig.app.json`: ES2020, `lib: [ES2020, DOM, DOM.Iterable]`, bundler mode, strict, unused checks. `tsconfig.node.json`: ES2022 for `vite.config.ts`.

## Conventions
- Uses only the **modular** Firebase API (`getAuth`, `getFirestore`, `getStorage`, `collection`, `doc`, ...).
- Firebase app instance is obtained exclusively through `FirebaseAppHelper.getApp()` (singleton).
- Helpers: static classes in `helpers/<name>/<name>Helper.ts`.
- Hooks: `hooks/<useName>/<useName>.ts` or `<useName>.hook.tsx`.
- Provider pattern identical to core: `<name>Context.ts` (defaults) + `<name>Provider.tsx` + `use<Name>.ts`.
- No Storybook stories. Provider tests use mocked Firebase Auth and do not require a Firebase project or emulator.

## README
- `README.md`: install `npm i @eliseubatista99/react-scaffold-firebase` (duplicated section); lists Providers, Hooks, Helpers.
- `src/providers/README.md` documents the Firebase providers.
