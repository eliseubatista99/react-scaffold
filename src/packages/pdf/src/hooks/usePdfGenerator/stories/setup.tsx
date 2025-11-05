import React from "react";
import { usePdfGenerator } from "../usePdfGenerator.hook";

export type UsePdfGeneratorStoriesSetupProps = {
  content: JSX.Element;
  fileName: string;
};

export const UsePdfGeneratorStoriesSetup = (
  props: UsePdfGeneratorStoriesSetupProps
) => {
  const { generatePdf, downloadPdf, previewPdf } = usePdfGenerator();

  const [generatedUrl, setGeneratedUrl] = React.useState<string>("");

  return (
    <div style={{ padding: "20px" }}>
      <button
        onClick={async () => {
          const res = await generatePdf(props.content);
          setGeneratedUrl(res.url || "");
        }}
      >
        Generate
      </button>

      {generatedUrl && (
        <button onClick={() => downloadPdf(generatedUrl)}>Download</button>
      )}

      {generatedUrl && (
        <button onClick={() => previewPdf(generatedUrl)}>Preview</button>
      )}
    </div>
  );
};
