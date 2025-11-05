import React from "react";
import { CurriculumVitaeProps } from "../../../components";
import { useCVGenerator } from "../useGenerateCV";

export type UseCVGeneratorStoriesSetupProps = {
  data: CurriculumVitaeProps;
};

export const UseCVGeneratorStoriesSetup = (
  props: UseCVGeneratorStoriesSetupProps
) => {
  const { generateCV, downloadCV } = useCVGenerator();

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
    </div>
  );
};
