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

The navigation hook provides actions such as going to a path, going back, and reading the current path. Navigation history is managed by React Router and the browser.

Let's say we want to go to the about screen when clicking a button, and going to the previous step when clicking another button:

```ts
import { useNavigation } from "@react-scaffold-eliseubatista99/core/providers";

const { currentPath, goBack, goTo } = useNavigation();

// Button to go to the about screen
<button onClick={() => goTo("/about")}> About </button>;

// Button to go to previous screen
<button onClick={() => goBack()}> Back </button>;
```

`goTo` follows React Router path resolution: paths starting with `/` resolve from the router root, while paths without a leading slash resolve relative to the current route. Query-only and hash-only paths follow React Router semantics. `goTo({ path, addToHistory: false })` replaces the current browser history entry. Query values accept strings, numbers, booleans, and arrays of those values; values use JavaScript `String` serialization and `URLSearchParams` URL encoding. Arrays become repeated query keys, and scalar nullish values are skipped. When `params` are supplied, existing query values and hashes in `path` are preserved and merged with `params`. An empty array removes existing values for that key. `goBack({ steps, defaultBackPath })` navigates back by a positive safe integer number of known in-app entries; invalid values throw a `RangeError`. If there are fewer tracked entries than requested, it replaces the current route with `defaultBackPath`. History tracking starts when `NavigationRoutes` mounts, so earlier entries or entries created by a separate router are not known. Without `defaultBackPath`, insufficient tracked history falls through to React Router's normal back behavior.

Use `searchParams.get(key)` for the first string value and `searchParams.getAllValues(key)` for all values associated with a repeated query key. `searchParams.getAll()` returns a flat object where duplicate keys resolve to their last value. Query values are not automatically parsed; convert them explicitly when needed.

## Feedback Provider

The feedback provider main purpose is to facilitate the management of dynamic feedback components that are meant to be hidden and shown, like modals, drawers, or toasts.

To get started, in the file where you place your providers (ex: main.tsx) import and configure the feedback provider. The items parameter is a list of thos dynamic feedback components.

The id is used to identify the component, the type can be used to group that component in a category, and the content is what should be rendered when the component is visible.

```ts
import { FeedbackProvider } from "@react-scaffold-eliseubatista99/core/providers";

<FeedbackProvider
  items={[
    {
      id: "example-modal",
      type: "modal",
      content: exampleModal,
    },
    {
      id: "example-toast",
      type: "toast",
      content: exampleToast,
    },
  ]}
></FeedbackProvider>;
```

The provider comes with an hook to handle the necessary presentation actions. Considering the example above, let's say we want to show the example modal only if there are no other modals visible:

```ts
import { useFeedback } from "@react-scaffold-eliseubatista99/core/providers";

const { showItem, hideItem, isItemVisible, getVisibleItemsOfType } =
  useFeedback();

<>
  //Check if there are any visible modals
  {!getVisibleItemsOfType("drawer").length > 0 && (
    // Show the component with the id "example-modal" on click
    <button onClick={() => showItem("example-modal")}>Show Modal</button>
  )}
</>;
```

This example shows the use of getVisibleItemsOfType and showItem actions, but there are more useful actions on the hook (hideItem, isItemVisible);
