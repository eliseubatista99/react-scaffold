import React from "react";
import { FeedbackProvider } from "../feedbackProvider";
import { useFeedback } from "../useFeedback";

const FeedbackExampleInnerContent = () => {
  const { showItem, hideItem, isItemVisible, visibleItems } = useFeedback();

  const interactionButton = React.useCallback(
    (id: string) => {
      const visible = isItemVisible(id);

      const onClick = () => {
        showItem(id);
        setTimeout(() => {
          hideItem(id);
        }, 3000);
      };

      return (
        <button
          style={{
            width: "80%",
            maxWidth: "200px",
            opacity: visible ? 0 : 1,
            pointerEvents: visible ? "none" : "auto",
          }}
          onClick={onClick}
        >
          <p>Show {id}</p>
        </button>
      );
    },
    [hideItem, isItemVisible, showItem]
  );

  const listVisibleItems = React.useCallback(() => {
    let res = "";
    visibleItems.forEach((item) => {
      res += item.id + ", ";
    });

    res = res.slice(0, -2); // Remove the last comma and space

    return res;
  }, [visibleItems]);

  return (
    <div
      data-testid="feedback-example"
      style={{ width: "100%", gap: "12px", alignItems: "center" }}
    >
      <div>
        <p>Visible Items: {listVisibleItems()}</p>
      </div>
      {interactionButton("example-modal")}
      {interactionButton("example-toast")}
    </div>
  );
};

export const FeedbackExample = () => {
  const exampleModal = (
    <div
      style={{
        width: "80%",
        maxWidth: "800px",
        height: "250px",
        background: "#ffffff",
        color: "#000000",
        borderRadius: "8px",
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <p>Example Modal</p>
    </div>
  );

  const exampleToast = (
    <div
      style={{
        width: "150px",
        height: "60px",
        background: "#af4d1d",
        color: "#ffffff",
        borderRadius: "24px",
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <p>Example Toast</p>
    </div>
  );

  return (
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
    >
      <FeedbackExampleInnerContent />
    </FeedbackProvider>
  );
};
