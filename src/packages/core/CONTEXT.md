# @eliseubatista99/react-scaffold-core — Package Context

> Main context file for the **core** package. Detailed documents live in [context/](context/).

## Summary

| Field | Value |
|---|---|
| npm name | `@eliseubatista99/react-scaffold-core` |
| Version | `2.0.1` |
| Location | `src/packages/core` |
| Entry | `src/index.ts` → `dist/index.es.js`, `dist/index.cjs.js`, `dist/index.d.ts` |
| Peer deps | `react ^19.1.0`, `react-dom ^19.1.0`, `react-router-dom ^7.6.3`, `react-slick ^0.31.0`, `dayjs ^1.11.19` |
| Runtime dependency | `lodash` |
| Styling dependency | `@emotion/styled` (bundled into the output) |
| Styling | Import `dist/react-scaffold-core.css` once; it contains the bundled Slick styles used by `Carousel` |
| Depends on other scaffold packages | No |
| Used by | `@eliseubatista99/react-scaffold-cv` (`Translation`, `TranslationList`, `Language`, `useTranslations`) |

The base library of the scaffold: generic UI components, utility hooks, static helper classes, React Router navigation helpers, the feedback/overlay context provider, and form-validation types.

## Public API (exported from `src/index.ts`)

`src/index.ts` re-exports `./components`, `./helpers`, `./hooks`, `./providers`, `./types`.

| Area | Exports | Details |
|---|---|---|
| Components | `Button`, `Carousel`, `Checkbox`, `Drawer`, `Form`, `Image`, `InputField`, `Loader`, `Modal`, `NumericInputField`, `PageLayout`, `ProgressBar`, `RadioButton`, `SvgImage`, `TextAreaField`, `Toast`, `Typography` (+ everything exported from each `<name>.tsx`, e.g. `*Props` types). The `use*Helper` logic hooks in `*.hook.ts` files are **internal** (not re-exported). | [context/components.md](context/components.md) |
| Hooks | `useDidMount`, `useDrag`, `useFetch`, `useOnScreen`, `usePointer`, `useResponsive`, `useTranslations` (+ types such as `DragData`, `FetchOutput`, `Breakpoint`, `Size`, `Translation`, `TranslationList`, `Language`, `defaultBreakpoints`) | [context/hooks.md](context/hooks.md) |
| Helpers | `EmailHelper`, `FormsHelper`, `NumberHelper`, `ObjectsHelper`, `ScrollHelper`, `TextHelper`, `TimeHelper` | [context/helpers.md](context/helpers.md) |
| Providers | `NavigationProvider` (backwards-compatible `BrowserRouter` wrapper), `NavigationRoutes` (route composition inside an existing router), `NavigationProviderRoute`, `NavigationProviderInputProps`, `NavigationRoutesProps`, `useNavigation` (including observed `history`), `GoToParams`, `GoBackParams`, `NavigationParamValue`, `NavigationParamInput`, `NavigationParams`, `FeedbackProvider`, `FeedbackProviderInputProps`, `useFeedback`. **Not exported:** `useNavigationParams` (reachable only through `useNavigation().searchParams`), `FeedbackProviderContext` | [context/providers.md](context/providers.md) |
| Types | `FormFieldConfiguration`, `FormFieldInputData`, `FormFieldOutputData` | [context/types.md](context/types.md) |

## Folder structure

```
src/
├── index.ts
├── components/   17 components, one folder each (+ README.md)
├── helpers/      formsHelper, numberHelper, objectsHelper, scrollHelper, text, timeHelper, emailHelper (+ README.md)
├── hooks/        useDidMount, useDrag, useFetch, useOnScreen, usePointer, useResponsive, useTranslations (+ README.md)
├── providers/    navigation/ (router wrapper, route composition, hooks/), feedback/ (provider, context, useFeedback) (+ README.md)
└── types/        types.ts (form types)
```

## Typical application setup

```tsx
import {
  FeedbackProvider,
  NavigationProvider,
  NavigationRoutes,
  Modal,
  useFeedback,
} from "@eliseubatista99/react-scaffold-core";
import { BrowserRouter } from "react-router-dom";

<FeedbackProvider>
  <BrowserRouter>
    <NavigationRoutes routes={[{ path: "/", render: <Home /> }]}>
      <Modal id="confirm-modal">...</Modal>
    </NavigationRoutes>
  </BrowserRouter>
</FeedbackProvider>;
```

- `Modal`, `Drawer`, `Toast`, `Loader` **require** a `FeedbackProvider` ancestor.
- `NavigationProvider` remains available as a backwards-compatible wrapper that creates a `BrowserRouter`. `NavigationRoutes` tracks in-app entries observed after mounting to support `goBack` fallback behavior.
- For application-owned routers, render `NavigationRoutes` inside `BrowserRouter`, `MemoryRouter`, or another compatible router. `useNavigation` and `useNavigationParams` must be called inside a router.
- `useFeedback` can be called in any descendant of `FeedbackProvider`.

## Detailed context files

| File | Content |
|---|---|
| [context/build-and-conventions.md](context/build-and-conventions.md) | package.json, Vite/TS config, folder & naming conventions, styling approach, Storybook stories |
| [context/components.md](context/components.md) | Every component: props, defaults, behaviour, dependencies |
| [context/hooks.md](context/hooks.md) | Every hook: signature, return value, behaviour |
| [context/helpers.md](context/helpers.md) | Every static helper class and method |
| [context/providers.md](context/providers.md) | Navigation and Feedback providers, contexts and hooks |
| [context/types.md](context/types.md) | Form validation types and other shared types |
| [context/known-issues.md](context/known-issues.md) | Bugs, quirks, inconsistencies and outdated docs |
