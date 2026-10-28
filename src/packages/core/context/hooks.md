# Core — Hooks

All hooks live in `src/hooks/<useName>/` and are exported from the package root.

---

## useDidMount
File: `hooks/useDidMount/useDidMount.ts`
```ts
export const useDidMount = (callback: EffectCallback): void => useEffect(callback, []);
```
- Runs the callback after the component mounts and supports an optional cleanup function.
- Like `useEffect`, development `StrictMode` performs an extra setup/cleanup cycle on initial mount. The callback is therefore not guaranteed to run exactly once; cleanup must safely undo the effect's setup.

## useDrag
File: `hooks/useDrag/useDrag.tsx` — depends on `usePointer`.
```ts
interface DragData {
  startPosX?: number; startPosY?: number;
  posX?: number; posY?: number;
  distanceX?: number;   // startPosX - posX  (positive when dragging LEFT)
  distanceY?: number;   // posY - startPosY  (positive when dragging DOWN)
  isDragging: boolean;
}
interface UseDragInput {
  axis?: "both" | "x" | "y";
  bounds?: boolean; // defaults to true; false allows movement outside the container
  resetOnDragEnd?: boolean;
  onDragStart?: (data: DragData) => void;
  onDrag?: (data: DragData) => void;
  onDragEnd?: (data: DragData) => void;
}
interface UseDragOutput {
  ref: React.RefCallback<HTMLElement>;
  containerRef: React.RefCallback<HTMLElement>;
  handleRef: React.RefCallback<HTMLElement>;
  position: { x: number; y: number } | null;
  isDragging: boolean;
  style: React.CSSProperties;
}
useDrag(input?: UseDragInput): UseDragOutput
```
- Attach `ref` to the movable element and `containerRef` to its bounds container (or omit the container ref to use the element's parent). `handleRef` optionally attaches dragging to a separate handle; otherwise the element itself is the handle.
- Apply the returned `style` to the movable element. The hook uses a CSS transform and owns that transform while active.
- The default bounds keep the element inside the container's visible inner area, excluding borders and accounting for its scroll offset. `bounds: false` permits overflow; `axis: "x"` or `"y"` restricts movement to one axis.
- Position is retained after release by default; `resetOnDragEnd: true` returns the element to its position at the start of the drag.
- Position is measured from the container's top-left and is `null` until the element ref is attached. Callback data includes the current `position`, movement `delta`, and drag state.
- Primary pointer events start dragging; `pointerup`, `pointercancel`, or window blur ends it. The hook restores the handle's previous `touch-action` style on cleanup.
- Used by `Drawer`, which opts into vertical unbounded movement for its swipe-to-close gesture.

## useFetch
File: `hooks/useFetch/useFetch.ts`
```ts
type FetchOutput<TOut> = { result: TOut | undefined; statusCode: number; error?: unknown };
type FetchOptions = object;

const { get, post, put, patch, delete: del } = useFetch();
get<T>(url: string, options?: FetchOptions, headers?: HeadersInit): Promise<FetchOutput<T>>
// post / put / patch / delete have the same signature
```
- `get` and `delete`: `options` become query string (`URLSearchParams`; arrays → repeated keys; `null`/`undefined` skipped). No body.
- `post`, `put`, `patch`: `options` are sent as `JSON.stringify(options)` body with `Content-Type: application/json` (overridable via `headers`).
- Existing query strings and URL fragments are preserved when adding query parameters. `HeadersInit` inputs are normalized with `Headers`.
- Non-empty responses are parsed as JSON; empty responses (including 204) return `{ result: undefined, statusCode }`. Invalid JSON returns `{ result: undefined, statusCode, error }`.
- Network errors from `fetch` itself are **not** caught (the promise rejects). HTTP error statuses do not reject; callers should inspect `statusCode`.
- HTTP error statuses are not thrown; check `statusCode`.

## useOnScreen
File: `hooks/useOnScreen/useOnScreen.tsx`
```ts
useOnScreen(ref: RefObject<HTMLElement | null>): boolean
```
- Returns `false` during server rendering and while `IntersectionObserver` is unavailable. Observes the current `ref.current` with default options, re-observes when the referenced element changes, and disconnects the observer on cleanup.

## usePointer
File: `hooks/usePointer/usePointer.ts`
```ts
type MousePositionData = { x?: number; y?: number };
usePointer(): { pointerPosition: MousePositionData; isPointerDown: boolean }
```
- Tracks primary pointer events only. `pointerPosition` updates from primary `pointermove` coordinates; repeated identical coordinates do not create new state.
- `isPointerDown` tracks the first active primary pointer ID and resets on its `pointerup` or `pointercancel`; events from other pointer IDs are ignored until it ends.
- Registers global `window` listeners in an effect and removes them on unmount.

## useResponsive
File: `hooks/useResponsive/useResponsive.ts`
```ts
type Breakpoint = "xs" | "sm" | "md" | "lg" | "xl" | "xxl";
type Size = "mobile" | "tablet" | "desktop";
type BreakpointConfiguration = Record<Breakpoint, number>;
type BreakpointConfigurationOverrides = Partial<BreakpointConfiguration>;
const defaultBreakpoints = { xs: 0, sm: 420, md: 768, lg: 991, xl: 1200, xxl: 1440 };

interface UseResponsiveInput { breakpointConfiguration?: BreakpointConfigurationOverrides; }
interface UseResponsiveOutput {
  currentWidth: number; currentHeight: number;
  currentBreakpoint: Breakpoint; currentSize: Size;
}
useResponsive(input?: UseResponsiveInput): UseResponsiveOutput
```
- Config is merged over `defaultBreakpoints`; overrides may specify only the breakpoints being changed.
- Breakpoint: `< sm → xs`, `< md → sm`, `< lg → md`, `< xl → lg`, `< xxl → xl`, else `xxl`.
- Size uses the same range boundaries as breakpoint classification: `< sm → mobile`, `sm–<lg → tablet`, `>= lg → desktop`.
- Starts with a `0 × 0` snapshot so server rendering and the initial hydration render match; reads the actual viewport and listens for resize in an effect.
- Recalculates when the breakpoint configuration changes. Resize updates are immediate (no debounce).

## useTranslations
File: `hooks/useTranslations/useTranslations.tsx`
```ts
type Language = string;
type Translation = Record<Language, string>;          // e.g. { en: "Hello", pt: "Olá" }
type TranslationValue = string | number | boolean | null | undefined;
type TranslationValues = Record<string, TranslationValue>;
type TranslationList = { [key: string]: Translation };

interface UseTranslationsInput { language: Language; translations: TranslationList; }
interface UseTranslationsOutput {
  t: (key: string, values?: TranslationValues) => string;
  getTranslation: (translation?: Translation, values?: TranslationValues) => string | undefined;
}
useTranslations(input: UseTranslationsInput): UseTranslationsOutput
```
- `getTranslation(translation, values)`: returns `translation[language]`, replacing every `{{key}}` with the value's string representation. Null, undefined, arrays, and objects therefore appear as `null`, `undefined`, or their normal JavaScript string conversion. Returns `undefined` if the translation or the language entry is missing/empty.
- `t(key, values)`: looks up `translations[key]` and resolves it with `getTranslation`; returns the key itself when the key or requested language is missing/empty.
- No fallback language or pluralisation; no React context (language and dictionary are passed per call site).
- These types are re-used by the `cv` package (`Translation`, `TranslationList`, `Language`).
