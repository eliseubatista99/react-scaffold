# Core — Providers

Providers live in `src/providers/<name>/`. Providers that need shared state use a context and a consumer hook.

---

## NavigationProvider
Files: `providers/navigation/navigationProvider.tsx`, `hooks/useNavigation.ts`, `hooks/useNavigationParams.ts`. External: `react-router-dom` v7 (`BrowserRouter`, `Routes`, `Route`, `useNavigate`, `useLocation`, `useSearchParams`).

```ts
interface NavigationProviderRoute { path: string; render: React.ReactNode; }
interface NavigationProviderInputProps {
  isReady?: boolean;                    // default true; when false, routes are not rendered (children still are)
  routes: NavigationProviderRoute[];
  children?: React.ReactNode;           // rendered inside the router, after <Routes> (e.g. global overlays)
}

```
- Renders `BrowserRouter > (isReady && <Routes>{routes}</Routes>) + children`. Each configured route is rendered as a keyed `<Route>`.
- Uses the React Router/browser history directly; the provider does not maintain a second navigation stack.

### useNavigation
```ts
type GoToParams = { path: string; addToHistory?: boolean; params?: Record<string, unknown> };
type GoBackParams = { steps?: number };

useNavigation(): {
  currentPath: string;                       // location.pathname
  searchParams: ReturnType<typeof useNavigationParams>;
  goTo: (data: GoToParams) => void;
  goBack: (data?: GoBackParams) => void;
}
```
- `goTo`: builds `path?query` from `params` (skips `null`/`undefined`, values stringified). By default it pushes a browser history entry; `addToHistory: false` replaces the current entry.
- `goBack`: navigates back by `steps` browser history entries (default `1`). It can navigate outside the app if there is no suitable in-app entry; the React Router public API does not expose a reliable way to inspect or clear the browser history stack.
- Migration: `useNavigation().history`, `clearHistory`, and the conditional `defaultBackPath` fallback have been removed. The React Router public API does not expose the information or operation needed to implement them reliably.

### useNavigationParams (internal, available via `useNavigation().searchParams`)
Wraps `useSearchParams()`:
```ts
{
  getAll: () => Record<string, string>;
  get: <T>(key: string) => T | null;            // plain cast, no parsing
  getMany: (keys: string[]) => Record<string, string | null>;
  set: (key: string, value: any) => void;        // null/undefined deletes
  setMany: (values: Record<string, any>) => void;
  remove: (key: string) => void;
  removeMany: (keys: string[]) => void;
  removeAll: () => void;
}
```

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
