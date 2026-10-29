<h1 align="center">Core | Providers</h1>

Providers are components that are instantiated in the root of the application, and everything inside this provider will have acess to the provider context and actions.

## Navigation Provider

The navigation helpers are built upon [react-router-dom](https://www.npmjs.com/package/react-router-dom).
`NavigationRoutes` renders configured screens inside a router owned by the application. `NavigationProvider` remains available as a backwards-compatible wrapper that creates a `BrowserRouter`.

To get started, in the file where you place your providers (ex: main.tsx) import and configure the navigation provider. The routes parameter is a list of key-content pairs, were the key is the path to that screen, and the content is a ReactNode.

```js
import { BrowserRouter } from "react-router-dom";
import { NavigationRoutes } from "@eliseubatista99/react-scaffold-core";

<BrowserRouter>
  <NavigationRoutes
    routes={[
      { path: "/home", render: <HomeScreen /> },
      { path: "/about", render: <AboutScreen /> },
    ]}
  />
</BrowserRouter>;
```

Existing applications can continue using `NavigationProvider` with the same `routes`, `isReady`, and `children` props. The wrapper remains available for compatibility and should only be removed in a future major release. New applications can use `NavigationRoutes` with `BrowserRouter`, `MemoryRouter`, or another compatible router.

The navigation hook provides actions such as going to a path, going back, and reading the current path and observed app navigation history.

Let's say we want to go to the about screen when clicking a button, and going to the previous step when clicking another button:

```ts
import { useNavigation } from "@eliseubatista99/react-scaffold-core";

const { currentPath, history, goBack, goTo } = useNavigation();

// Button to go to the about screen
<button onClick={() => goTo("/about")}> About </button>;

// Button to go to previous screen
<button onClick={() => goBack()}> Back </button>;
```

`history` is an array of observed `pathname + search + hash` strings. It starts when `NavigationRoutes` mounts, tracks pushes, replacements, and known back/forward destinations, and trims forward entries after a new push. Without `NavigationRoutes`, it contains only the current location. It is not the browser's complete history stack.

`goTo` follows React Router path resolution: paths starting with `/` resolve from the router root, while paths without a leading slash resolve relative to the current route. Query-only and hash-only paths follow React Router semantics. `goTo({ path, addToHistory: false })` replaces the current browser history entry. Query values accept strings, numbers, booleans, and arrays of those values; values use JavaScript `String` serialization and `URLSearchParams` URL encoding. Arrays become repeated query keys, and scalar nullish values are skipped. When `params` are supplied, existing query values and hashes in `path` are preserved and merged with `params`. An empty array removes existing values for that key. `goBack({ steps, defaultBackPath })` navigates back by a positive safe integer number of known in-app entries; invalid values throw a `RangeError`. If there are fewer tracked entries than requested, it uses `defaultBackPath` when provided, otherwise it only goes back as far as the observed in-app history allows. History tracking starts when `NavigationRoutes` mounts, so earlier entries or entries created by a separate router are not known. Without `NavigationRoutes`, `goBack` uses `defaultBackPath` when provided and otherwise does nothing, since the router's previous entry cannot be confirmed as part of the application.

Use `searchParams.get(key)` for the first string value and `searchParams.getAllValues(key)` for all values associated with a repeated query key. `searchParams.getAll()` returns a flat object where duplicate keys resolve to their last value; its function reference stays stable until the query changes. Query values are not automatically parsed; convert them explicitly when needed.

Sequential `searchParams` updates made during the same event are composed in call order. Use `setMany` or `removeMany` when the changes form a single batch.

## Feedback Provider

`FeedbackProvider` tracks visible item IDs for feedback UI such as modals, drawers, toasts, and loaders. It accepts `children`; it does not take an `items` registry or render feedback content itself. The feedback components render their own content and use the shared IDs to determine visibility.

Wrap the part of the application that needs feedback state:

```tsx
import { FeedbackProvider } from "@eliseubatista99/react-scaffold-core";

function App() {
  return (
    <FeedbackProvider>
      <FeedbackControls />
    </FeedbackProvider>
  );
}
```

Use `useFeedback` in a descendant to show or hide an item and check its visibility:

`useFeedback` must be called inside a `FeedbackProvider`; it throws an error if no provider is present above the component.

```tsx
import { useFeedback } from "@eliseubatista99/react-scaffold-core";

function FeedbackControls() {
  const { visibleItems, isItemVisible, showItem, hideItem } = useFeedback();
  const itemId = "example-modal";

  return (
    <>
      <button onClick={() => showItem(itemId)}>Show modal</button>
      {isItemVisible(itemId) && (
        <button onClick={() => hideItem(itemId)}>Hide modal</button>
      )}
      <p>Visible items: {visibleItems.join(", ")}</p>
    </>
  );
}
```

`showItem(id)` adds an ID only if it is not already visible; `hideItem(id)` removes it. `isItemVisible(id)` reads the current visibility synchronously, including changes made immediately before the call. `visibleItems` is exposed as a readonly array and is the React state snapshot used for rendering; it updates on the next render. Consumers that only need to show or hide items can use `useFeedbackActions()` to avoid re-rendering when visibility changes. Built-in components such as `Modal`, `Drawer`, `Toast`, and `Loader` use this provider state; render them with the same ID used by `showItem` and `hideItem`.
