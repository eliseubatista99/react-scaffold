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
  ref?: React.RefObject<HTMLDivElement | null>;
  onDragStart?: (data: DragData) => void;
  onDrag?: (data: DragData) => void;
  onDragEnd?: (data: DragData) => void;
}
useDrag(input: UseDragInput): void
```
- `pointerdown` on `ref.current` starts the drag (prevents default, stops propagation, stores start position, calls `onDragStart`).
- Global pointer moves (tracked by `usePointer`) call `onDrag` while dragging; pointer up calls `onDragEnd` and clears the start position.
- Attaches lazily once `ref.current` exists (polls every 300 ms with an un-cancellable `while` loop) by **assigning** `ref.current.onpointerdown` (overwrites any existing handler) and sets `ref.current.style.touchAction = "none"`.
- Distances are computed from the previous stored position (one update behind) and the `if (start && pos)` checks treat coordinate `0` as missing.
- Emits `console.debug` logs on every pointer move.
- Used by `Drawer`.

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
- Global `window` listeners for `pointermove` (updates position with `clientX/clientY`), `pointerdown`, `pointerup`. Re-renders on every pointer move.

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
- Size: `<= sm → mobile`, `<= md → tablet`, else `desktop`.
- Starts with a `0 × 0` snapshot so server rendering and the initial hydration render match; reads the actual viewport and listens for resize in an effect.
- Recalculates when the breakpoint configuration changes. Resize updates are immediate (no debounce).

## useTranslations
File: `hooks/useTranslations/useTranslations.tsx`
```ts
type Language = string;
type Translation = Record<Language, string>;          // e.g. { en: "Hello", pt: "Olá" }
type TranslationValues = Record<string, unknown>;
type TranslationList = { [key: string]: Translation };

interface UseTranslationsInput { language: Language; translations: TranslationList; }
interface UseTranslationsOutput {
  t: (key: string, values?: TranslationValues) => string;
  getTranslation: (translation?: Translation, values?: TranslationValues) => string | undefined;
}
useTranslations(input: UseTranslationsInput): UseTranslationsOutput
```
- `getTranslation(translation, values)`: returns `translation[language]`, replacing every `{{key}}` with `values[key]` (`replaceAll`). Returns `undefined` if the translation or the language entry is missing/empty.
- `t(key, values)`: looks up `translations[key]` and resolves it with `getTranslation`; returns the key itself when the key or requested language is missing/empty.
- No fallback language or pluralisation; no React context (language and dictionary are passed per call site).
- These types are re-used by the `cv` package (`Translation`, `TranslationList`, `Language`).
