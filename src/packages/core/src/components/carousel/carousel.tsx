import { type CSSProperties } from "react";

export type CarouselProps = {
  styles?: CSSProperties;
};

export const Carousel = ({ styles }: CarouselProps) => {
  return <div style={{ width: "100%", ...styles }}></div>;
};
