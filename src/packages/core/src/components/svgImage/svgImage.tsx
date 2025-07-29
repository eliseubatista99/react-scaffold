import type { Property } from "csstype";
import React, { type CSSProperties } from "react";

export type SvgImageProps = {
  viewBox?: string;
  width?: Property.Width;
  height?: Property.Height;
  fill?: Property.Fill;
  stroke?: Property.Stroke;
  src: React.ReactElement<React.SVGProps<SVGElement>>;
  alt?: string;
  onClick?: () => void;
  styles?: CSSProperties;
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
  styles,
}: SvgImageProps) => {
  return (
    <div
      style={{
        width: "fit-content",
        height: "fit-content",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        ...styles,
      }}
      onClick={() => onClick?.()}
    >
      <svg
        width={width}
        height={height}
        viewBox={viewBox}
        fill={fill}
        stroke={stroke}
        xmlns="http://www.w3.org/2000/svg"
        style={{
          display: "flex",
        }}
      >
        {src}
      </svg>
    </div>
  );
};
