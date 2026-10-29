import type React from "react";

export type ImageProps = Omit<
  React.ImgHTMLAttributes<HTMLImageElement>,
  "src" | "alt" | "style" | "onClick" | "onKeyDown" | "role" | "tabIndex"
> & {
  src: string;
  alt?: string;
  onClick?: () => void;
  style?: React.CSSProperties;
  role?: React.AriaRole;
  tabIndex?: number;
  onKeyDown?: React.KeyboardEventHandler<HTMLImageElement>;
};

export const Image = ({
  src,
  alt = "",
  onClick,
  style,
  role,
  tabIndex,
  onKeyDown,
  ...imageProps
}: ImageProps) => {
  const isInteractive = onClick !== undefined;

  return (
    <img
      {...imageProps}
      src={src}
      alt={alt}
      role={role ?? (isInteractive ? "button" : undefined)}
      tabIndex={tabIndex ?? (isInteractive ? 0 : undefined)}
      style={{
        overflow: "hidden",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        objectFit: "cover",
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
    />
  );
};
