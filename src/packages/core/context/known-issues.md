# Core — Known Issues, Quirks and Outdated Docs

Use this list before changing behaviour: some quirks may be relied upon by consumers.

## Exports / packaging
- `useNavigationParams` and `FeedbackProviderContext` are not exported (barrels only re-export the provider and main hook).
- Consumers must import `dist/react-scaffold-core.css` once to apply the bundled Slick styles used by `Carousel`.
- `react-slick` and `dayjs` are external peer dependencies and must be available to consuming applications.
- `@emotion/styled` is bundled to keep the CommonJS build compatible; `slick-carousel` is a development dependency whose CSS is bundled into the package stylesheet.

## Components
- `PageLayout` header/footer `visibility: "fixed"` means `position: relative` (in flow), while the default is `sticky` — the name is counter-intuitive.
- `Form` intentionally calls `onSubmit` with `hasErrors` even when validation fails; callers decide whether to proceed. `RadioButton` remains a visual-only control and is not collected by forms.
- `Drawer` does not hide itself on swipe; consumer must call `hideItem` inside `onCloseDrawer`.

## Providers
- `NavigationRoutes` only knows entries created after it mounted; navigation history from before it mounted or from a separate router is not tracked.

## Outdated documentation
- `src/providers/README.md` contains outdated navigation examples and feedback items with `type`/`content` and `getVisibleItemsOfType` — those feedback APIs do not exist.
- `src/components/README.md` covers only `Drawer`.
