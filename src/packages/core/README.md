# @eliseubatista99/react-scaffold-core

Reusable React components, hooks, providers, and utilities for common
application needs. The package is written in TypeScript and includes declaration
files.

## Requirements

The following peer dependencies must be available in the consuming application:

| Peer dependency | Version | Used for |
| --- | --- | --- |
| `react` | `^19.1.0` | Components and hooks |
| `react-dom` | `^19.1.0` | React DOM rendering |
| `react-router-dom` | `^7.6.3` | Navigation |
| `react-slick` | `^0.31.0` | `Carousel` |
| `dayjs` | `^1.11.19` | `TimeHelper` |

`lodash` is installed as a package dependency. The package bundles the Slick
styles it uses, so your application does not need to install
`slick-carousel` separately.

## Installation

```sh
npm install @eliseubatista99/react-scaffold-core \
  react@^19.1.0 react-dom@^19.1.0 \
  react-router-dom@^7.6.3 react-slick@^0.31.0 dayjs@^1.11.19
```

Import the stylesheet once from your application entry point:

```ts
import "@eliseubatista99/react-scaffold-core/dist/react-scaffold-core.css";
```

## Quick start

Use `FeedbackProvider` for feedback UI and render `NavigationRoutes` inside the
router owned by your application:

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
`BrowserRouter`. Prefer `NavigationRoutes` when your application owns router
setup or uses another compatible router.

## API overview

Import public APIs from the package root:

```ts
import { Button, useFetch, TimeHelper } from "@eliseubatista99/react-scaffold-core";
```

- **Components:** `Button`, `Carousel`, `Checkbox`, `Drawer`, `Form`, `Image`,
  `InputField`, `Loader`, `Modal`, `NumericInputField`, `PageLayout`,
  `ProgressBar`, `RadioButton`, `SvgImage`, `TextAreaField`, `Toast`, and
  `Typography`.
- **Hooks:** `useDidMount`, `useDrag`, `useFetch`, `useOnScreen`, `usePointer`,
  `useResponsive`, and `useTranslations`.
- **Providers:** `FeedbackProvider`, `NavigationRoutes`, and the
  backwards-compatible `NavigationProvider`, plus `useFeedback` and
  `useNavigation`.
- **Helpers:** `EmailHelper`, `FormsHelper`, `NumberHelper`, `ObjectsHelper`,
  `ScrollHelper`, `TextHelper`, and `TimeHelper`.
- **Shared types:** form field types and public component, hook, and provider
  types.

### Usage notes

- Call `useFeedback` beneath `FeedbackProvider`; it throws if the provider is
  missing.
- `Modal` and `Drawer` require an accessible name via `aria-label` or
  `aria-labelledby`. Their close callbacks do not hide them automatically; call
  `hideItem(id)` in the callback.
- `Form` reports validation errors to `onSubmit` but still calls the handler.
  Check `hasErrors` before continuing with submission.
- `useFetch` resolves for HTTP error statuses. Check `statusCode`; network
  failures reject the promise.

For detailed API behavior and examples, see the
[Core context documentation](context/).

## Development

Run these commands from `src/packages/core`:

```sh
npm ci
npm run build
npm test
npm run typecheck
npm run lint
```

`npm run build` generates ESM and CommonJS bundles, TypeScript declarations,
and the package stylesheet in `dist/`. `npm run test:package` additionally
builds the package and runs a smoke test against its published-style bundles
and router integration.

## License

[MIT](../../../LICENSE)
