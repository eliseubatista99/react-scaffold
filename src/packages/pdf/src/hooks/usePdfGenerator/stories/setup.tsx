import { usePdfGenerator } from "../usePdfGenerator.hook";

export type UsePdfGeneratorStoriesSetupProps = {
  content: React.ReactNode;
  fileName: string;
};

export const UsePdfGeneratorStoriesSetup = (
  props: UsePdfGeneratorStoriesSetupProps
) => {
  const { generateFromContent } = usePdfGenerator();

  return (
    <div style={{ padding: "20px" }}>
      <button
        onClick={() => generateFromContent(props.content, props.fileName)}
      >
        Generate
      </button>
    </div>
  );
};
