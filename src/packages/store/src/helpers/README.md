<h1 align="center">Store | Helpers</h1>

Helpers are classes used to help with generic repetitive tasks.

## Store Helper

The store helper offers a easy way to create a zustand store

```js
var baseStore =
  StoreHelper.createStore <
  BaseStoreState >
  ((set: any) => ({
    ...baseStoreInitialState,
    setTheme: (value: Theme) => {
      set(
        produce((state: BaseStoreState) => ({
          ...state,
          theme: value,
        })),
        false,
        "setTheme"
      );
    },
  }),
  "base-store");
```

The TextHelper has the following methods:

- **createStore**: Creates a store with the specified name and state
