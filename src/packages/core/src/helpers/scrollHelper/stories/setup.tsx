import React from "react";
import { useDidMount } from "../../../hooks";
import { ScrollHelper } from "../scrollHelper";

export const ScrollHelperStoriesSetup = () => {
  const [isScrollEnabled, setIsScrollEnabled] = React.useState(false);

  const changeScrollStatus = (value: boolean) => {
    if (value) {
      ScrollHelper.enableScroll();
    } else {
      ScrollHelper.disableScroll();
    }

    // setIsScrollEnabled(value);
    setIsScrollEnabled(ScrollHelper.isScrollEnabled());
  };

  useDidMount(() => {
    changeScrollStatus(true);
  });

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
      <div>
        <p>isScrollEnabled: {isScrollEnabled ? "true" : "false"}</p>
        {!isScrollEnabled && (
          <button onClick={() => changeScrollStatus(true)}>
            Enable Scroll
          </button>
        )}
        {isScrollEnabled && (
          <button onClick={() => changeScrollStatus(false)}>
            Disable Scroll
          </button>
        )}
      </div>
      <div
        style={{
          width: "100%",
          gap: "16px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {Array.from({ length: 30 }, (_, i) => i + 1).map((i) => (
          <div
            style={{
              background: `rgba(60, 60, 60, ${100 / i})`,
              width: "300px",
              height: "100px",
              maxWidth: "100%",
            }}
          />
        ))}
      </div>
    </div>
  );
};
