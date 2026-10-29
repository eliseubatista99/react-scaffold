import { NumberHelper } from "../../helpers";

export interface ProgressBarProps
  extends Omit<
    React.HTMLAttributes<HTMLDivElement>,
    | "style"
    | "role"
    | "aria-valuemin"
    | "aria-valuemax"
    | "aria-valuenow"
  > {
  percentage: number;
  min?: number;
  max?: number;
  style?: React.CSSProperties;
  barStyles?: React.CSSProperties;
}

export const ProgressBar = ({
  percentage,
  min = 0,
  max = 100,
  style,
  barStyles,
  ...progressBarProps
}: ProgressBarProps) => {
  const finalPercentage = NumberHelper.clamp(percentage, min, max);

  return (
    <div
      {...progressBarProps}
      role="progressbar"
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuenow={finalPercentage}
      style={{
        width: "90%",
        height: "30px",
        border: "1px solid #000000",
        borderRadius: "3px",
        background: "#ffffff",
        ...style,
      }}
    >
      <div
        aria-hidden="true"
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
