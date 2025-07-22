import { produce } from "immer";
import React from "react";
import { StoreHelper } from "../storeHelper";

type Theme = "Dark" | "Light";

interface BaseStoreState {
  theme: Theme;
}

const baseStoreInitialState: BaseStoreState = {
  theme: "Light",
};

export const CreateStoreHelperStoriesSetup = () => {
  const [message, setMessage] = React.useState("");

  React.useEffect(() => {
    try {
      // var baseStore = StoreHelper.createStore<BaseStoreState>(
      //   "base-store",
      //   { theme: "Light" },
      //   baseStoreReducer
      // );

      // var userInputStore = StoreHelper.createStore(
      //   "user-input-store",
      //   { selectedColor: "blue" },
      //   userInputStoreReducer
      // );

      var baseStore = StoreHelper.createStore<BaseStoreState>(
        (set: any) => ({
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
        "base-store"
      );

      setMessage("Stores created, check Redux devtools in the inspector");
      // store.dispatch("")
    } catch (e) {
      setMessage(`Error creating stores > , ${e}`);
    }
  }, [setMessage]);

  return (
    <div
      style={{
        padding: "20px",
        gap: "8px",
        width: "100%",
        boxSizing: "border-box",
        height: "fit-content",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <p>{message}</p>
    </div>
  );
};
