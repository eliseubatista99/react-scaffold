# Core Providers

The Core package includes navigation helpers and a feedback context for
controlling dialogs, drawers, toasts, and loaders.

## Navigation

Use `NavigationRoutes` inside a router owned by your application:

```tsx
import { NavigationRoutes, useNavigation } from "@eliseubatista99/react-scaffold-core";
import { BrowserRouter } from "react-router-dom";

function Home() {
  const { goTo } = useNavigation();
  return <button onClick={() => goTo("/about")}>About</button>;
}

export function App() {
  return (
    <BrowserRouter>
      <NavigationRoutes
        routes={[
          { path: "/", render: <Home /> },
          { path: "/about", render: <h1>About</h1> },
        ]}
      />
    </BrowserRouter>
  );
}
```

`NavigationProvider` remains available as a backwards-compatible convenience
wrapper that creates a `BrowserRouter`. `useNavigation` must be called inside a
compatible React Router. Navigation history exposed by the package tracks
in-app entries observed after `NavigationRoutes` mounts; it is not the browser's
complete history stack.

## Feedback

Wrap the components that share visibility state in `FeedbackProvider`. Use the
same ID to show and hide an item:

```tsx
import {
  FeedbackProvider,
  Modal,
  useFeedback,
} from "@eliseubatista99/react-scaffold-core";

function Dialog() {
  const { showItem, hideItem } = useFeedback();
  const id = "confirm";

  return (
    <>
      <button onClick={() => showItem(id)}>Open</button>
      <Modal id={id} aria-label="Confirmation">
        <p>Continue?</p>
        <button onClick={() => hideItem(id)}>Close</button>
      </Modal>
    </>
  );
}

export function App() {
  return (
    <FeedbackProvider>
      <Dialog />
    </FeedbackProvider>
  );
}
```

`useFeedback` must be used under `FeedbackProvider`. `Modal` and `Drawer`
require an accessible name and their close callbacks should call `hideItem(id)`.

For the full API, see the [Core README](../../README.md) and
[provider reference](../../context/providers.md).
