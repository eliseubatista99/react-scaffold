<h1 align="center">Core | Providers</h1>

Providers are components that are instantiated in the root of the application, and everything inside this provider will have acess to the provider context and actions.

## Navigation Provider

The navigation provider allows a easy configuration of your screens and also the actions related to the navigation.
This provider is built upon the [react-router-dom](https://www.npmjs.com/package/react-router-dom)

To get started, in the file where you place your providers (ex: main.tsx) import and configure the navigation provider. The routes parameter is a list of key-content pairs, were the key is the path to that screen, and the content is a ReactNode.

```js
import { NavigationProvider } from "@react-scaffold-eliseubatista99/core/providers";

<NavigationProvider
  routes={[
    {
      path: "/home",
      render: <HomeScreen />,
    },
    {
      path: "/about",
      render: <AboutScreen />,
    },
  ]}
>
  {
    // The provider handles the rendering of the screens,
    // and supports anything as children
  }
</NavigationProvider>;
```

The provider comes with an hook to handle the necessary navigation actions, like going to a path, going back, getting the current path and even replacing the entire history with something else.

Let's say we want to go to the about screen when clicking a button, and going to the previous step when clicking another button:

```ts
import { useNavigation } from "@react-scaffold-eliseubatista99/core/providers";

const { currentPath, goBack, goTo, replaceHistory } = useNavigation();

// Button to go to the about screen
<button onClick={() => goTo("/about")}> About </button>;

// Button to go to previous screen
<button onClick={() => goBack()}> Back </button>;
```

## Feedback Provider

The feedback provider main purpose is to facilitate the management of dynamic feedback components that are meant to be hidden and shown, like modals, drawers, or toasts.

To get started, in the file where you place your providers (ex: main.tsx) import and configure the feedback provider. The items parameter is a list of thos dynamic feedback components.

The id is used to identify the component, the type can be used to group that component in a category, and the content is what should be rendered when the component is visible.

```ts
import { FeedbackProvider } from "@react-scaffold-eliseubatista99/core/providers";

<FeedbackProvider
  items={[
    {
      id: "example-modal",
      type: "modal",
      content: exampleModal,
    },
    {
      id: "example-toast",
      type: "toast",
      content: exampleToast,
    },
  ]}
></FeedbackProvider>;
```

The provider comes with an hook to handle the necessary presentation actions. Considering the example above, let's say we want to show the example modal only if there are no other modals visible:

```ts
import { useFeedback } from "@react-scaffold-eliseubatista99/core/providers";

const { showItem, hideItem, isItemVisible, getVisibleItemsOfType } =
  useFeedback();

<>
  //Check if there are any visible modals
  {!getVisibleItemsOfType("drawer").length > 0 && (
    // Show the component with the id "example-modal" on click
    <button onClick={() => showItem("example-modal")}>Show Modal</button>
  )}
</>;
```

This example shows the use of getVisibleItemsOfType and showItem actions, but there are more useful actions on the hook (hideItem, isItemVisible);
