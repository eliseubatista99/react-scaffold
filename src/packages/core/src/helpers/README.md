<h1 align="center">Core | Helpers</h1>

Helpers are classes used to help with generic repetitive tasks.

## Text Helper

The text helper offers methods that perform actions upon strings. To use any of those actions, simply import the TextHelper class and call the method;

```js
import { TextHelper } from "@react-scaffold-eliseubatista99/core/helpers";

const processMyString = () => {
  return TextHelper.getPascalCase("i am a text");
};
```

The TextHelper has the following methods:

- **getPascalCase**: Transforms the string into pascal case. Ex:

      i am text => I Am Text

- **isEqual**: Checks if to strings are the same, can be case sensitive or not.

## Objects Helper

`ObjectsHelper.isSameObject` compares values deeply, including nested objects and arrays. It uses lodash `isEqual`; `null` and `undefined` are treated as equivalent for backward compatibility.

```ts
import { ObjectsHelper } from "@eliseubatista99/react-scaffold-core";

ObjectsHelper.isSameObject(
  { user: { name: "Ada" } },
  { user: { name: "Ada" } },
);
```
