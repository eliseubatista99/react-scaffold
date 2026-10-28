<h1 align="center">Core | Hooks</h1>

Hooks provide reusable behavior for React components.

## useFetch

`useFetch` returns `get`, `post`, `put`, `patch` and `delete` methods. Each method resolves to a `FetchOutput<T>` with the parsed JSON `result`, HTTP `statusCode`, and an optional parsing `error`.

```tsx
import { useFetch } from "@eliseubatista99/react-scaffold-core";

type User = {
  id: number;
  name: string;
};

function UserExample() {
  const { get, post } = useFetch();

  const loadUser = async () => {
    const response = await get<User>("https://example.com/users/1");
    if (response.statusCode >= 200 && response.statusCode < 300) {
      console.log(response.result?.name);
    }
  };

  const createUser = async () => {
    await post<User>("https://example.com/users", { name: "Ada" });
  };

  return (
    <>
      <button onClick={loadUser}>Load user</button>
      <button onClick={createUser}>Create user</button>
    </>
  );
}
```

`get` and `delete` serialize options as query parameters; array values become repeated parameters. `post`, `put` and `patch` serialize options as a JSON body and default to `Content-Type: application/json`, which can be overridden with the `headers` argument. Existing query strings and URL fragments are preserved.

Responses are parsed as JSON. Empty responses (including `204 No Content`) return `result: undefined` without a parsing error. Non-empty invalid JSON is reported through `error`; network failures reject the promise. HTTP error statuses do not reject automatically—check `statusCode`.

## useResponsive

`useResponsive` reports the viewport width, height, breakpoint and general size. Breakpoint overrides are optional and are merged with the defaults:

```tsx
const viewport = useResponsive({
  breakpointConfiguration: { sm: 480, md: 800 },
});
```

The hook starts with a `0 × 0` snapshot that is consistent between server rendering and the initial hydration render, then reads the actual viewport in an effect. It updates on resize and when breakpoint overrides change.

## useOnScreen

`useOnScreen(ref)` returns whether the referenced element intersects the viewport, using the browser's default `IntersectionObserver` options. It is safe to render on the server and returns `false` if `IntersectionObserver` is unavailable. When `ref.current` changes on a subsequent render, the hook disconnects the old observer and observes the new element.

## useTranslations

`useTranslations({ language, translations })` returns `t` and `getTranslation`. Interpolation accepts strings, numbers, and booleans. Null and undefined values are treated as missing and leave the matching placeholder unchanged; objects are not accepted by the TypeScript API. If the requested language entry is missing, `getTranslation` returns `undefined`, while `t` returns the translation key. Missing keys passed to `t` also return the key; no alternate language is used as a fallback.

## useDidMount

`useDidMount(callback)` runs an effect after the component mounts and accepts an optional cleanup function. It follows React's `useEffect` lifecycle: in development, `StrictMode` performs an extra setup/cleanup cycle, so the callback is not guaranteed to run exactly once. Make the effect safe to repeat and its cleanup safe to call.

## usePointer

`usePointer()` returns `pointerPosition` (`x` and `y`) and `isPointerDown`. It tracks only primary pointer events. Pressed state is tied to the pointer ID that started it and resets on `pointerup` or `pointercancel`; listeners are removed on unmount.
