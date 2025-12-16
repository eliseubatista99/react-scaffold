import { type CSSProperties } from "react";

export type ImageProps = {
  src: string;
  alt?: string;
  onClick?: () => void;
  styles?: CSSProperties;
};

export const Image = ({ src, alt = "", onClick, styles }: ImageProps) => {
  return (
    <img
      src={src}
      alt={alt}
      style={{
        overflow: "hidden",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        objectFit: "cover",
        ...styles,
      }}
      onClick={() => {
        onClick?.();
      }}
    />
  );
};
