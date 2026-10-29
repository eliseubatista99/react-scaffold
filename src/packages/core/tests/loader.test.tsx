import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { FeedbackProvider, useFeedback } from "../src/providers";
import { Loader } from "../src/components/loader";

afterEach(cleanup);

const VisibleLoader = () => {
  const { showItem } = useFeedback();

  return (
    <>
      <button onClick={() => showItem("test-loader")}>Show loader</button>
      <Loader
        id="test-loader"
        style={{ backgroundColor: "rgb(0, 0, 0)" }}
      >
        Loading
      </Loader>
    </>
  );
};

describe("Loader", () => {
  it("applies the native style prop to its overlay", () => {
    render(
      <FeedbackProvider>
        <VisibleLoader />
      </FeedbackProvider>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Show loader" }));

    const loader = screen.getByText("Loading");
    expect((loader as HTMLDivElement).style.backgroundColor).toBe(
      "rgb(0, 0, 0)",
    );
    expect((loader as HTMLDivElement).style.position).toBe("fixed");
  });
});
