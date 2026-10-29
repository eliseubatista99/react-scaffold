import type { Property } from "csstype";
import type React from "react";

export type SvgImageProps = Omit<
  React.SVGProps<SVGSVGElement>,
  | "children"
  | "viewBox"
  | "width"
  | "height"
  | "fill"
  | "stroke"
  | "style"
  | "onClick"
  | "onKeyDown"
  | "role"
> & {
  viewBox?: string;
  width?: Property.Width;
  height?: Property.Height;
  fill?: Property.Fill;
  stroke?: Property.Stroke;
  src: React.ReactElement<React.SVGProps<SVGElement>>;
  alt?: string;
  onClick?: () => void;
  style?: React.CSSProperties;
  role?: React.AriaRole;
  tabIndex?: number;
  onKeyDown?: React.KeyboardEventHandler<SVGSVGElement>;
};

export const SvgImage = ({
  src,
  width = "22",
  height = "28",
  stroke,
  viewBox = "0 0 22 28",
  fill = "#000000",
  alt = "",
  onClick,
  style,
  role,
  tabIndex,
  onKeyDown,
  "aria-label": ariaLabel,
  "aria-hidden": ariaHidden,
  ...svgProps
}: SvgImageProps) => {
  const isInteractive = onClick !== undefined;

  return (
    <svg
      {...svgProps}
      width={width}
      height={height}
      viewBox={viewBox}
      fill={fill}
      stroke={stroke}
      xmlns="http://www.w3.org/2000/svg"
      role={role ?? (isInteractive ? "button" : alt ? "img" : undefined)}
      aria-label={ariaLabel ?? (alt || undefined)}
      aria-hidden={
        ariaHidden ?? (!isInteractive && !alt ? true : undefined)
      }
      tabIndex={tabIndex ?? (isInteractive ? 0 : undefined)}
      style={{
        display: "flex",
        ...style,
      }}
      onClick={onClick}
      onKeyDown={(event) => {
        onKeyDown?.(event);

        if (
          isInteractive &&
          !event.defaultPrevented &&
          (event.key === "Enter" || event.key === " ")
        ) {
          event.preventDefault();
          onClick();
        }
      }}
    >
      {src}
    </svg>
  );
};
