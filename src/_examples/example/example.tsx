import React from "react";

export type ExampleItem = {
  title: string;
  content: React.ReactNode;
};

export interface ExampleProps {
  item: ExampleItem;
}

export const Example = ({ item }: ExampleProps) => {
  const [expanded, setExpanded] = React.useState(false);

  return (
    <div
      data-testid="example-component"
      style={{ width: "100%", border: "1px solid #ccc", alignItems: "center" }}
    >
      <div
        style={{
          width: "100%",
          padding: "12px 24px",
          alignItems: "center",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
        onClick={() => setExpanded((prev) => !prev)}
      >
        <p>{item.title}</p>
        <p>{expanded ? "⮝" : "⮟"}</p>
      </div>
      <div
        style={{
          width: "100%",
          display: expanded ? "flex" : "none",
        }}
      >
        <div
          style={{ height: "1px", width: "98%", background: "#ffffff" }}
        ></div>

        <div style={{ width: "100%", padding: "24px" }}>{item.content}</div>
      </div>
    </div>
  );
};
