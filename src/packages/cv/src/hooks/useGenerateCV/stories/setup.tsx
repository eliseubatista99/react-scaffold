import React from "react";
import { CurriculumVitaeProps } from "../../../components";
import { useCVGenerator } from "../useGenerateCV";

export type UseCVGeneratorStoriesSetupProps = {
  data: CurriculumVitaeProps;
};

export const UseCVGeneratorStoriesSetup = (
  props: UseCVGeneratorStoriesSetupProps
) => {
  const { generateCV, downloadCV, previewCV } = useCVGenerator();

  const [generatedUrl, setGeneratedUrl] = React.useState<string>("");

  return (
    <div style={{ padding: "20px" }}>
      <button
        onClick={async () => {
          const res = await generateCV(props.data);
          setGeneratedUrl(res.url || "");
        }}
      >
        Generate
      </button>

      {generatedUrl && (
        <button onClick={() => downloadCV(props.data)}>Download</button>
      )}

      {generatedUrl && (
        <button onClick={() => previewCV(props.data)}>Preview</button>
      )}
    </div>
  );
};
