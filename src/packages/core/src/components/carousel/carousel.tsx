import { type CSSProperties } from "react";
import Slider, { Settings } from "react-slick";

import styled from "@emotion/styled";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";

export interface CarouselSlideProps {
  content: JSX.Element;
  styles?: React.CSSProperties;
}

export interface CarouselProps {
  content: CarouselSlideProps[];
  settings?: Settings;
  styles?: CSSProperties;
}

const SlideDiv = styled.div`
  box-sizing: border-box;
  display: flex;

  * {
    box-sizing: border-box;
    display: flex;
  }
`;

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
    <SlideDiv
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
    </SlideDiv>
  ));

  return (
    <div style={{ width: "100%", height: "250px", ...styles }}>
      <Slider {...carouselSettings}>{slides}</Slider>
    </div>
  );
};
