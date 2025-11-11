import { type CSSProperties } from "react";
import Slider, { Settings } from "react-slick";

import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import "./carousel.css";

export interface CarouselSlideProps {
  content: JSX.Element;
  styles?: React.CSSProperties;
}

export interface CarouselProps {
  content: CarouselSlideProps[];
  settings?: Settings;
  styles?: CSSProperties;
}

export const Carousel = ({ styles, content, settings }: CarouselProps) => {
  var carouselSettings: Settings = {
    dots: false,
    speed: 500,
    slidesToScroll: 1,
    infinite: false,
    variableWidth: true,
    ...settings,
  };

  const slides = content.map((c) => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minWidth: "fit-content",
        position: "relative",
        boxSizing: "border-box",
        ...c.styles,
      }}
      className="carousel-slide-item"
    >
      {c.content}
    </div>
  ));

  return (
    <div style={{ width: "100%", height: "250px", ...styles }}>
      <Slider {...carouselSettings}>{slides}</Slider>
    </div>
  );
};
