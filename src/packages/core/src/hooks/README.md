# Core Hooks

Import hooks from the Core package entry point and call them at the top level
of a React component or custom hook:

```tsx
import {
  useFetch,
  useOnScreen,
  useResponsive,
  useTranslations,
} from "@eliseubatista99/react-scaffold-core";
```

| Hook | Purpose |
| --- | --- |
| `useDidMount` | Run an effect after mount, with optional cleanup |
| `useDrag` | Add pointer-based dragging to an element |
| `useFetch` | Make typed GET, POST, PUT, PATCH, and DELETE requests |
| `useOnScreen` | Observe whether an element intersects the viewport |
| `usePointer` | Observe primary pointer position and pressed state |
| `useResponsive` | Read viewport dimensions and responsive breakpoints |
| `useTranslations` | Resolve values from a language-specific dictionary |

`useFetch` returns HTTP status codes rather than rejecting for HTTP error
responses, so inspect `statusCode`. Network errors reject the promise.
`useDidMount` follows React's effect lifecycle; development Strict Mode can run
an additional setup/cleanup cycle.

See the [Core README](../../README.md) for installation and the
[hook reference](../../context/hooks.md) for signatures, examples, and
behavioral details.
