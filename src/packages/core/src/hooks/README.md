<h1 align="center">Core | Hooks</h1>

Providers are simple functions that handle simple logic that can cause the DOM to be re-rendered.

## useFetch

The fetch hook makes fetching an endpoint an easy task.

Let's say we want to call the "https://exampleendpoint.com" endpoint, and convert its response to an SomeType type. All we have to do is use the fetch hook, pass the endpoint as a paremeter and the desired type, and the hook will handle the everything

```js
import { useFetch } from "@react-scaffold-eliseubatista99/core/hooks";

const fetch = useFetch();

const fetchSomethingFromApi = () => {
  const result = await fetch<SomeType>("https://exampleendpoint.com");
}
```
