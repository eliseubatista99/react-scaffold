import type { CSSProperties } from "react";

export interface TypographyProps {
  overflowEllipsis?: boolean;
  maxNumberOfLines?: number;
  children?: React.ReactNode;
  styles?: CSSProperties;
}

export const Typography = ({
  overflowEllipsis,
  maxNumberOfLines,
  children,
  styles,
}: TypographyProps) => {
  return (
    <p
      style={{
        fontFamily: "inherit",
        maxWidth: "100%",
        overflow: "hidden",
        display: "-webkit-box",
        WebkitLineClamp: maxNumberOfLines ? maxNumberOfLines : undefined,
        WebkitBoxOrient: "vertical",
        whiteSpace: "unset",
        textOverflow: overflowEllipsis ? "ellipsis" : undefined,
        fontSize: "16px",
        fontStyle: "normal",
        lineHeight: "normal",
        color: "inherit",
        pointerEvents: "none",
        ...styles,
      }}
    >
      {children}
    </p>
  );
};
