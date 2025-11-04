import React from "react";
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
  const { currentPath, history, goBack, goTo } = useNavigation();

  const listHistory = React.useCallback(() => {
    let res = "";
    history.forEach((item) => {
      res += item + ", ";
    });

    res = res.slice(0, -2); // Remove the last comma and space

    return res;
  }, [history]);

  const backButton = React.useCallback(() => {
    if (history.length === 0) {
      return <></>;
    }

    if (history.length === 1 && history[0] === "/") {
      return <></>;
    }

    return <button onClick={() => goBack()}>Back</button>;
  }, [goBack, history]);

  const goToButton = React.useCallback(
    (path: string) => {
      return <button onClick={() => goTo(path)}>Go To {path}</button>;
    },
    [goTo]
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
      <div>
        <p>Current path: {currentPath}</p>
        <p>History: {listHistory()}</p>
      </div>
      {backButton()}
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
