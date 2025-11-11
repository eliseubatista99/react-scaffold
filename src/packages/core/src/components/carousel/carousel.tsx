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
  gap?: string;
  styles?: CSSProperties;
}

const ContainerDiv = styled.div<{ styles?: React.CSSProperties }>`
  width: 100%;
  height: fit-content;

  ${({ styles }) => styles && { ...styles }}

  .slick-list {
    overflow: visible;
  }
`;

const SlideDiv = styled.div<{ styles?: React.CSSProperties }>`
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  min-width: fit-content;
  position: relative;

  ${({ styles }) => styles && { ...styles }}

  > * {
    box-sizing: border-box;
    display: flex;
  }
`;

export const Carousel = ({
  styles,
  content,
  settings,
  gap = "15px",
}: CarouselProps) => {
  var carouselSettings: Settings = {
    dots: false,
    speed: 500,
    slidesToScroll: 1,
    infinite: false,
    variableWidth: true,
    arrows: false,
    ...settings,
  };

  const slides = content.map((c, index) => (
    <SlideDiv
      styles={{
        paddingLeft: index === 0 ? "0px" : gap,
        // marginLeft: index !== 0 ? "0px" : margin,
        ...c.styles,
      }}
      data-testid="carousel-slide-item"
    >
      {c.content}
    </SlideDiv>
  ));

  return (
    <ContainerDiv styles={{ ...styles }}>
      <Slider {...carouselSettings}>{slides}</Slider>
    </ContainerDiv>
  );
};
