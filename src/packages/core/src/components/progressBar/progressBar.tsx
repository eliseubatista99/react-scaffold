import { NumberHelper } from "../../helpers";

export interface ProgressBarProps {
  percentage: number;
  min?: number;
  max?: number;
  styles?: React.CSSProperties;
  barStyles?: React.CSSProperties;
}

export const ProgressBar = ({
  percentage,
  min = 0,
  max = 100,
  styles,
  barStyles,
}: ProgressBarProps) => {
  const finalPercentage = NumberHelper.clamp(percentage, min, max);

  return (
    <div
      style={{
        width: "90%",
        height: "30px",
        border: "1px solid #000000",
        borderRadius: "3px",
        background: "#ffffff",
        ...styles,
      }}
    >
      <div
        style={{
          width: `${finalPercentage}%`,
          height: "100%",
          background: "#f58b00ff",
          ...barStyles,
        }}
      />
    </div>
  );
};
