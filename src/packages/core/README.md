# @eliseubatista99/react-scaffold-core

Reusable React components, hooks, providers, and utilities for common application
needs. The package is written in TypeScript, ships its type declarations, and
keeps React and router dependencies external so your application can share its
own React and routing context.

## Requirements

| Peer dependency | Supported version | Used for |
| --- | --- | --- |
| `react` | `^19.1.0` | Components and hooks |
| `react-dom` | `^19.1.0` | React DOM rendering |
| `react-router-dom` | `^7.6.3` | Navigation provider and hook |
| `react-slick` | `^0.31.0` | `Carousel` |
| `dayjs` | `^1.11.19` | `TimeHelper` |

Install compatible peer dependencies in your application. `lodash` is installed
as a package dependency. The package bundles the styles it needs from
`slick-carousel`; you do not need to add `slick-carousel` to your application.

## Installation

```sh
npm install @eliseubatista99/react-scaffold-core \
  react@^19.1.0 react-dom@^19.1.0 \
  react-router-dom@^7.6.3 react-slick@^0.31.0 dayjs@^1.11.19
```

Import the package stylesheet once from your application entry point. It
provides the Slick styles used by `Carousel`.

```ts
import "@eliseubatista99/react-scaffold-core/dist/react-scaffold-core.css";
```

## Quick start

Wrap the application in `FeedbackProvider` to use `Modal`, `Drawer`, `Toast`,
`Loader`, or `useFeedback`. Use `NavigationRoutes` inside the router your
application already owns.

```tsx
import {
  Button,
  FeedbackProvider,
  Modal,
  NavigationRoutes,
  useFeedback,
} from "@eliseubatista99/react-scaffold-core";
import { BrowserRouter } from "react-router-dom";

function Home() {
  const { showItem, hideItem } = useFeedback();

  return (
    <>
      <Button onClick={() => showItem("welcome")}>Open dialog</Button>
      <Modal
        id="welcome"
        aria-label="Welcome"
        onClickOutsideModal={() => hideItem("welcome")}
      >
        <p>Welcome to the app.</p>
        <Button onClick={() => hideItem("welcome")}>Close</Button>
      </Modal>
    </>
  );
}

export function App() {
  return (
    <FeedbackProvider>
      <BrowserRouter>
        <NavigationRoutes routes={[{ path: "/", render: <Home /> }]} />
      </BrowserRouter>
    </FeedbackProvider>
  );
}
```

`NavigationProvider` is also available as a convenience wrapper that creates a
`BrowserRouter`. Prefer `NavigationRoutes` when router setup belongs to your
application, or when using a router such as `MemoryRouter`.

## API overview

All public exports are available from the package root:

```ts
import { Button, useFetch, TimeHelper } from "@eliseubatista99/react-scaffold-core";
```

### Components

`Button`, `Carousel`, `Checkbox`, `Drawer`, `Form`, `Image`, `InputField`,
`Loader`, `Modal`, `NumericInputField`, `PageLayout`, `ProgressBar`,
`RadioButton`, `SvgImage`, `TextAreaField`, `Toast`, and `Typography`.

Components export their associated prop types, including `CarouselSlideProps`,
`DrawerHandleProps`, `FormSubmitButton`, `FormSubmitSection`, and
`PageLayoutHeaderAndFooterProps`.

### Hooks

- `useDidMount` — effect helper for mount-time setup and cleanup.
- `useDrag` — pointer-based element dragging.
- `useFetch` — typed `get`, `post`, `put`, `patch`, and `delete` methods.
- `useOnScreen` — observe an element with `IntersectionObserver`.
- `usePointer` — observe primary pointer position and pressed state.
- `useResponsive` — read viewport dimensions and a configurable breakpoint.
- `useTranslations` — resolve a translation from a supplied language and dictionary.

Call the hook at the top level of a component or custom hook, then use its
methods from an event handler or effect:

```tsx
function UsersButton() {
  const { get } = useFetch();

  const loadUsers = async () => {
    const response = await get<User[]>("/api/users", { active: true });
    // Handle response.result, response.statusCode, and response.error.
  };

  return <Button onClick={loadUsers}>Load users</Button>;
}
```

`useFetch` returns HTTP status codes rather than rejecting for HTTP error
responses. Network errors reject the promise; check `statusCode` and `error`
when handling the result.

### Providers and navigation

- `FeedbackProvider`, `useFeedback`, and `useFeedbackActions` manage visibility
  by string ID. `useFeedback` and `useFeedbackActions` must be called beneath
  `FeedbackProvider`.
- `NavigationRoutes` declares routes inside an existing React Router and
  observes navigation history after it mounts.
- `NavigationProvider` provides the legacy convenience setup with a
  `BrowserRouter`.
- `useNavigation` provides `currentPath`, observed `history`, `goTo`, `goBack`,
  and `searchParams`. Call it inside a compatible React Router.

Feedback overlays are controlled by their ID: call `showItem(id)` and
`hideItem(id)` to open and close them. `Modal` and `Drawer` require an
accessible name via `aria-label` or `aria-labelledby`. They invoke their
close callbacks but do not hide themselves; the callback should call
`hideItem(id)`. `Toast` hides itself after its configured duration.

### Helpers

- `EmailHelper` — email masking.
- `FormsHelper` — look up and read values from form output.
- `NumberHelper` — numeric clamping.
- `ObjectsHelper` — deep equality comparison.
- `ScrollHelper` — inspect, disable, and restore document scrolling.
- `TextHelper` — common string checks and formatting.
- `TimeHelper` — date/time helpers and asynchronous waits.

### Shared types

The package exports `FormFieldConfiguration`, `FormFieldInputData`, and
`FormFieldOutputData`, plus public component, hook, and provider types.
TypeScript declaration files are included in the published package.

## Accessibility and usage notes

- Give `Modal` and `Drawer` an accessible name with `aria-label` or
  `aria-labelledby`.
- Use `Button` for actions; it defaults to `type="button"`. Set `type="submit"`
  explicitly when submitting a native form.
- `Form` collects named native inputs, textareas, and selects. Validation
  reports `hasErrors` to `onSubmit`; it does not prevent the callback from
  running, so check that argument before continuing with a submission.
- `RadioButton` is a visual button control, not a native radio input, and is
  not collected by `Form`.
- `NavigationRoutes` can only track navigation observed after it mounts. Its
  `history` is not a copy of the browser's complete history stack.

## API reference

The focused package references document component props and behavior, hook
signatures, helper methods, providers, shared types, and build conventions:

- [Components](./context/components.md)
- [Hooks](./context/hooks.md)
- [Helpers](./context/helpers.md)
- [Providers](./context/providers.md)
- [Shared types](./context/types.md)
- [Build and development conventions](./context/build-and-conventions.md)
- [Known behavior and limitations](./context/known-issues.md)

## Development

Run these commands from `src/packages/core`:

```sh
npm install
npm run build
npm test
npm run typecheck
npm run lint
```

`npm run build` generates ESM and CommonJS bundles, TypeScript declarations,
and the package stylesheet in `dist/`. `npm run test:package` builds the package
and runs a smoke test against its published-style bundles and router
integration.

## License

[MIT](../../../LICENSE)
