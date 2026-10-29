# Core — Known Issues, Quirks and Outdated Docs

Use this list before changing behaviour: some quirks may be relied upon by consumers.

## Exports / packaging
- `useNavigationParams` and `FeedbackProviderContext` are not exported (barrels only re-export the provider and main hook).
- `@emotion/styled` is only a devDependency and is not in `rollupOptions.external`, so it (and its emotion runtime) is bundled into `dist`. `@emotion/react` is not declared anywhere in the package.
- `react-slick`, `slick-carousel`, and `dayjs` are peer dependencies but are not externalized in `vite.config.ts`.
- `Carousel` imports slick CSS files as side effects; importing the package requires `slick-carousel` CSS to resolve.
- Library `name` in Vite config is the placeholder `MyComponentLibrary`.

## Components
- `PageLayout.floatingContent` is declared and destructured but never rendered.
- `PageLayout` header/footer `visibility: "fixed"` actually means `position: relative` (in flow), while the default is `sticky` — naming is counter-intuitive. `page.extraHeight` is computed but unused; `calculateExtraHeight` has stale `useCallback` deps.
- `Form` intentionally calls `onSubmit` with `hasErrors` even when validation fails; callers decide whether to proceed. `RadioButton` remains a visual-only control and is not collected by forms.
- `Toast` timeout is not cleared on unmount; effect deps omit `id`/`durationInSeconds`.
- `Drawer` does not hide itself on swipe; consumer must call `hideItem` inside `onCloseDrawer`.
- `NumericInputField` overwrites any consumer `onInput` prop.

## Providers
- `NavigationRoutes` only knows entries created after it mounted; navigation history from before it mounted or from a separate router is not tracked.

## Outdated documentation
- `src/providers/README.md` contains outdated navigation examples and feedback items with `type`/`content` and `getVisibleItemsOfType` — those feedback APIs do not exist.
- `src/hooks/README.md` shows `await fetch<SomeType>(url)` instead of `useFetch().get<SomeType>(url)`.
- `src/components/README.md` covers only `Drawer`.
