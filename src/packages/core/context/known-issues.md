# Core — Known Issues, Quirks and Outdated Docs

Use this list before changing behaviour: some quirks may be relied upon by consumers.

## Exports / packaging
- `EmailHelper` is implemented but not exported from `helpers/index.ts`.
- `useNavigationParams` and `FeedbackProviderContext` are not exported (barrels only re-export the provider and main hook).
- `@emotion/styled` is only a devDependency and is not in `rollupOptions.external`, so it (and its emotion runtime) is bundled into `dist`. `@emotion/react` is not declared anywhere in the package.
- `react-slick`, `slick-carousel`, and `dayjs` are peer dependencies but are not externalized in `vite.config.ts`.
- `Carousel` imports slick CSS files as side effects; importing the package requires `slick-carousel` CSS to resolve.
- Library `name` in Vite config is the placeholder `MyComponentLibrary`.

## Components
- `PageLayout.floatingContent` is declared and destructured but never rendered.
- `PageLayout` header/footer `visibility: "fixed"` actually means `position: relative` (in flow), while the default is `sticky` — naming is counter-intuitive. `page.extraHeight` is computed but unused; `calculateExtraHeight` has stale `useCallback` deps.
- `Form`:
  - `exactValueValidation.value` is typed `number` (type named `FormFieldUnknownValueValidation`) but compared with `!==` against the string field value, so it always fails for numbers.
  - Numeric validations cast the string value with `as number`; comparisons rely on JS coercion.
  - `minLengthValidation`/`maxLengthValidation` call `.length` on the value — works only because values are strings.
  - Submission is not blocked when `hasErrors` is true.
  - `handleOnChange` has wrong `useCallback` deps (`[onSubmit, onPreSubmit]`), so a changing `onChange` prop can be stale.
  - Uses `var` in `validateField`.
  - `RadioButton` has no hidden input, so it is not collected by `Form` (unlike `Checkbox`).
- `Toast` timeout is not cleared on unmount; effect deps omit `id`/`durationInSeconds`.
- `Drawer` does not hide itself on swipe; consumer must call `hideItem` inside `onCloseDrawer`.
- `NumericInputField` overwrites any consumer `onInput` prop.

## Hooks
- `useDrag`: un-cancellable `while` polling loop if the ref never resolves; overwrites `onpointerdown`; distances lag one update; coordinate `0` treated as missing; noisy `console.debug` on every move.
- `usePointer` causes a re-render on every global pointer move for every consumer.
- `useTranslations` has no fallback language.

## Helpers
- `TimeHelper.isDateOneAfterDateTwo` is incorrect: uses `getDay()` (weekday) instead of `getDate()`, and returns `false` for a later year with an earlier month.
- `ObjectsHelper.isSameObject` is shallow (docs elsewhere may call it deep).
- `FormsHelper.getFieldValue` treats `0`/`""`/`false` as missing.
- `TimeHelper.waitForCondition*` have no timeout.

## Providers
- `useNavigation.goBack` can still navigate outside the application when no `defaultBackPath` is supplied or when history tracking is unavailable. `NavigationRoutes` only knows entries created after it mounted.

## Outdated documentation
- `src/providers/README.md` contains outdated navigation examples and feedback items with `type`/`content` and `getVisibleItemsOfType` — those feedback APIs do not exist.
- `src/hooks/README.md` shows `await fetch<SomeType>(url)` instead of `useFetch().get<SomeType>(url)`.
- `src/components/README.md` and `src/helpers/README.md` cover only `Drawer` and `TextHelper`.
