# Core — Providers

Providers live in `src/providers/<name>/`. Providers that need shared state use a context and a consumer hook.

---

## Navigation
Files: `providers/navigation/navigationProvider.tsx`, `hooks/useNavigation.ts`, `hooks/useNavigationParams.ts`. External: `react-router-dom` v7 (`BrowserRouter`, `Routes`, `Route`, `useNavigate`, `useLocation`, `useSearchParams`).

```ts
interface NavigationProviderRoute { path: string; render: React.ReactNode; }
interface NavigationProviderInputProps {
  isReady?: boolean;
  routes: NavigationProviderRoute[];
  children?: React.ReactNode;
}
type NavigationRoutesProps = NavigationProviderInputProps;
```
- `NavigationRoutes` renders the configured routes and children inside an existing React Router. It supports `BrowserRouter`, `MemoryRouter`, and other compatible routers.
- `NavigationProvider` is the backwards-compatible convenience wrapper that creates a `BrowserRouter` around `NavigationRoutes`. Its existing props and behavior remain unchanged in this release. Prefer `NavigationRoutes` when the application owns router setup; remove the compatibility wrapper only in a future major release.
- Each configured route is rendered as a keyed `<Route>`. Navigation history is owned by React Router and the browser; this package does not maintain a second stack.

Composable setup:
```tsx
import { BrowserRouter } from "react-router-dom";
import { NavigationRoutes } from "@eliseubatista99/react-scaffold-core";

function App() {
  return (
    <BrowserRouter>
      <NavigationRoutes routes={[{ path: "/", render: <Home /> }]} />
    </BrowserRouter>
  );
}
```

### useNavigation
```ts
type NavigationParamValue = string | number | boolean | null | undefined;
type NavigationParamInput =
  | NavigationParamValue
  | readonly NavigationParamValue[];
type GoToParams = { path: string; addToHistory?: boolean; params?: Record<string, NavigationParamInput> };
type GoBackParams = { steps?: number; defaultBackPath?: string };

useNavigation(): {
  currentPath: string;                       // location.pathname
  searchParams: ReturnType<typeof useNavigationParams>;
  goTo: (data: GoToParams) => void;
  goBack: (data?: GoBackParams) => void;
}
```
- `goTo`: delegates path resolution to React Router. Paths starting with `/` resolve from the router root; paths without a leading slash resolve relative to the current route. Query-only and hash-only destinations follow React Router navigation semantics. When `params` are provided, the path's relative or absolute pathname and hash are preserved while query values are merged. Values in `params` are serialized with JavaScript `String` and encoded by `URLSearchParams`: strings are unchanged before URL encoding, numbers use their JavaScript string representation, and booleans become `"true"` or `"false"`. Scalar `null`/`undefined` values are skipped, leaving any same-named query values already in `path` unchanged. Scalar values replace any existing query values for that key. Array values replace that key and append one query entry per non-null item, preserving array order; an empty array removes the existing key. By default navigation pushes a browser history entry; `addToHistory: false` replaces the current entry.
- `goBack`: navigates back by `steps` known in-app history entries (default `1`). `steps` must be a positive safe integer; invalid values throw a `RangeError`. If fewer tracked in-app entries are available than requested, `defaultBackPath` is navigated to with `replace`. The tracker observes entries while `NavigationRoutes` is mounted; entries created before it mounted or by a different router are not known. Without a `defaultBackPath`, the hook preserves the native React Router back behavior.
- Migration: `useNavigation().history`, `clearHistory`, and the conditional `defaultBackPath` fallback have been removed. The React Router public API does not expose the information or operation needed to implement them reliably.
- `useNavigation` works inside any compatible React Router; it does not require the legacy `NavigationProvider` when the app already provides a router.

### useNavigationParams (internal, available via `useNavigation().searchParams`)
Wraps `useSearchParams()`:
```ts
{
  getAll: () => Record<string, string>;
  getAllValues: (key: string) => string[];
  get: (key: string) => string | null;
  getMany: (keys: readonly string[]) => Record<string, string | null>;
  set: (key: string, value: NavigationParamInput) => void;
  setMany: (values: Record<string, NavigationParamInput>) => void;
  remove: (key: string) => void;
  removeMany: (keys: readonly string[]) => void;
  removeAll: () => void;
}
```
- `get` and `getMany` return the first value for a query key as a string; they do not parse or coerce it. Missing keys return `null`.
- `getAllValues(key)` returns every value for that key in URL order. `getAll()` returns a backwards-compatible flat object containing only the last value for each key; use `getAllValues` when duplicate keys matter.
- `set` and `setMany` accept strings, numbers, booleans, `null`/`undefined`, or readonly arrays of those values. Scalars replace all values for the key; arrays replace the key with repeated entries, skipping nullish array items. `null`/`undefined` scalar values remove the key.
- The `get<T>` generic was removed because it previously only cast a string without converting it. Convert explicitly at the call site when a number, boolean, or other type is needed.

---

## FeedbackProvider
Files: `providers/feedback/feedbackProvider.tsx`, `feedbackContext.ts`, `useFeedback.ts`.

```ts
interface FeedbackProviderInputProps { children?: React.ReactNode; }
interface FeedbackContextData {          // not exported from the package
  visibleItems: string[];
  isItemVisible: (id: string) => boolean;
  showItem: (id: string) => void;
  hideItem: (id: string) => void;
}
```
- Keeps a list of visible item ids (ref for synchronous reads + state for re-renders). `showItem` adds the id if absent; `hideItem` removes it.
- Generic: any UI can use ids. Built-in consumers: `Modal`, `Drawer`, `Toast`, `Loader`.

### useFeedback
```ts
useFeedback(): {
  visibleItems: string[];
  isItemVisible: (id: string) => boolean;   // computed from state (render-safe)
  showItem: (id: string) => void;
  hideItem: (id: string) => void;
}
```
- Outside a provider the context defaults are no-ops (nothing is ever visible), without throwing.

### Typical usage
```tsx
const { showItem, hideItem } = useFeedback();

<Button onClick={() => showItem("delete-modal")}>Delete</Button>
<Modal id="delete-modal" onClickOutsideModal={() => hideItem("delete-modal")}>...</Modal>
<Toast id="saved-toast" durationInSeconds={2}>Saved</Toast>  // auto-hides
```
