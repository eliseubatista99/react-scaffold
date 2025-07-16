import { TextHelper } from "../textHelper";

export interface TextHelperStoriesSetupProps {
  text1: string;
  text2: string;
}

export const TextHelperStoriesSetup = (props: TextHelperStoriesSetupProps) => {
  return (
    <div style={{ padding: "20px", gap: "8px" }}>
      <p>
        <b>getPascalCase(text1):</b> {TextHelper.getPascalCase(props.text1)}
      </p>
      <p>
        <b>getPascalCase(text2):</b> {TextHelper.getPascalCase(props.text2)}
      </p>
      <p>
        <b>isEqual(text1, text2, false):</b>
        {TextHelper.isEqual(props.text1, props.text2, false) ? "true" : "false"}
      </p>
      <p>
        <b>isEqual(text1, text2, true):</b>
        {TextHelper.isEqual(props.text1, props.text2) ? "true" : "false"}
      </p>
    </div>
  );
};
