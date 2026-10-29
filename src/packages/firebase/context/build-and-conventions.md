# Firebase — Build, Configuration and Conventions

## package.json
- `name`: `@eliseubatista99/react-scaffold-firebase`, `version`: `1.0.16`, `private: false`, `publishConfig.access: public`, MIT, author `eliseubatista99`.
- `main`: `dist/index.cjs.js`, `module`: `dist/index.es.js`, `types`: `dist/index.d.ts`, `files`: `["dist/"]`.
- Scripts: `dev` = `tsc && vite`, `start` = `vite`, `build` = `rimraf dist && vite build`, `clean` = `rm -rf dist`, `lint` = `eslint .`, `test` = provider and hook tests via Vitest, `preview` = `vite preview`.
- `peerDependencies`: `firebase ^12.19.0`, `react ^19.1.0`, `react-dom ^19.1.0`.
- `devDependencies`: eslint stack, `@types/react ^19.1.8`, `@types/react-dom ^19.1.6`, `@vitejs/plugin-react ^4.6.0`, `rimraf`, `typescript ~5.8.3`, `vite ^7.0.4`, `vite-plugin-dts ^4.5.4`.
- `firebase` is not in devDependencies (must be installed separately to build locally); it is also absent from the root workspace `package.json`.

## vite.config.ts
- Plugins: `@vitejs/plugin-react`, `vite-plugin-dts({ insertTypesEntry: true })`.
- `build.lib`: entry `src/index.ts`, `name: "MyComponentLibrary"`, formats `["es", "cjs"]`, `index.<format>.js`, `outDir: dist`.
- `rollupOptions.external`: `react`, `react-dom`, `firebase/app`, `firebase/firestore`, `firebase/auth`, `firebase/storage`, `firebase/functions`, and the `firebase/compat/*` equivalents → the Firebase SDK is never bundled (correctly treated as a peer).
- `optimizeDeps.include`: modular `firebase/*` entries; `optimizeDeps.exclude`: `firebase/compat/*`.

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
- `src/providers/README.md` is a copy of core's providers README (Navigation/Feedback) and does not describe Firebase.
