import React, { useState } from "react";
import {
  NavigationProvider,
  NavigationProviderInputProps,
  useNavigation,
} from "../";

const BasicExampleScreen = ({ children }: { children?: React.ReactNode }) => {
  return (
    <div
      style={{
        width: "100px",
        height: "200px",
        background: "#ffffff",
        zoom: 0.7,
        margin: "auto",
        color: "#000000",
        fontSize: "30px",
      }}
    >
      {children}
    </div>
  );
};

export const NavigationExampleScreen0 = () => {
  return <BasicExampleScreen>Home</BasicExampleScreen>;
};

export const NavigationExampleScreen1 = () => {
  return <BasicExampleScreen>Screen1</BasicExampleScreen>;
};

export const NavigationExampleScreen2 = () => {
  return <BasicExampleScreen>Screen2</BasicExampleScreen>;
};

const NavigationExampleInnerContent = () => {
  const { currentPath, goBack, goTo } = useNavigation();
  const [replaceCurrent, setReplaceCurrent] = useState(false);

  const goToButton = React.useCallback(
    (path: string) => {
      return (
        <button onClick={() => goTo({ path, addToHistory: !replaceCurrent })}>
          Go To {path}
        </button>
      );
    },
    [goTo, replaceCurrent],
  );

  return (
    <div
      data-testid="navigation-example"
      style={{
        width: "100%",
        gap: "12px",
        alignItems: "center",
        padding: "36px",
      }}
    >
      <p>Current path: {currentPath}</p>

      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: "10px",
          width: "100%",
        }}
      >
        <p>Replace current entry</p>
        <input
          type="checkbox"
          name="replaceCurrent"
          checked={replaceCurrent}
          onChange={(event) => setReplaceCurrent(event.target.checked)}
        />
      </div>
      <button onClick={() => goBack()}>Back</button>
      {goToButton("/screen1")}
      {goToButton("/screen2")}
    </div>
  );
};

export const NavigationStoriesSetup = (props: NavigationProviderInputProps) => {
  return (
    <NavigationProvider {...props}>
      <NavigationExampleInnerContent />
    </NavigationProvider>
  );
};
