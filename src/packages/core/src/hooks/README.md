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
