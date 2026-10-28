# Core — Providers

Providers live in `src/providers/<name>/`. Each one has a context file (`<name>Context.ts`, with no-op defaults), a provider component and a consumer hook.

---

## NavigationProvider
Files: `providers/navigation/navigationProvider.tsx`, `navigationContext.ts`, `hooks/useNavigation.ts`, `hooks/useNavigationParams.ts`. External: `react-router-dom` v7 (`BrowserRouter`, `Routes`, `Route`, `useNavigate`, `useLocation`, `useSearchParams`).

```ts
interface NavigationProviderRoute { path: string; render: React.ReactNode; }
interface NavigationProviderInputProps {
  isReady?: boolean;                    // default true; when false, routes are not rendered (children still are)
  routes: NavigationProviderRoute[];
  children?: React.ReactNode;           // rendered inside the router, after <Routes> (e.g. global overlays)
}

interface NavigationContextData {       // not exported from the package
  history: string[];
  addToHistory: (entry: string) => void;
  popFromHistory: (count: number) => string;
  replaceHistory: (entries: string[]) => void;
}
```
- Renders `Context.Provider > BrowserRouter > (isReady && <Routes>{routes}</Routes>) + children`. Each route → `<Route path element />` (no `key`).
- Maintains its **own in-app history stack** (`string[]`, ref + state) alongside the browser history. It starts empty, so the initial page is not in the stack.
- `popFromHistory(count)`: returns `"/"` if the stack is shorter than `count`; otherwise removes `count` entries and returns the new last entry.

### useNavigation
```ts
type GoToParams = { path: string; addToHistory?: boolean; params?: Record<string, unknown> };
type GoBackParams = { steps?: number; defaultBackPath?: string; params?: Record<string, unknown> };

useNavigation(): {
  currentPath: string;                       // location.pathname
  history: string[];
  searchParams: ReturnType<typeof useNavigationParams>;
  goTo: (data: GoToParams) => void;
  goBack: (data: GoBackParams) => void;
  clearHistory: () => void;
}
```
- `goTo`: builds `path?query` from `params` (skips `null`/`undefined`, values stringified). `addToHistory !== false` → `navigate(url)` + push to stack. `addToHistory: false` → `navigate(url, { replace: true })` and replaces the last stack entry (only if the stack is not empty).
- `goBack`: if the stack has entries → `navigate(-min(steps ?? 1, stack.length))` and pops. If empty and `defaultBackPath` is given → `goTo({ path: defaultBackPath, addToHistory: false, params })`. Otherwise does nothing.
- `goBack({})` requires an object argument (no default).
- `clearHistory`: `replaceHistory([])`.

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
