import { type CSSProperties } from "react";
import Slider, { Settings } from "react-slick";

import styled from "@emotion/styled";
import React from "react";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";

export interface CarouselSlideProps {
  content: JSX.Element;
  styles?: React.CSSProperties;
}

export interface CarouselProps {
  content: CarouselSlideProps[];
  settings?: Settings;
  gap?: number;
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
  gap = 15,
}: CarouselProps) => {
  const [slidesToShow, setSlidesToShow] = React.useState<number>(1);
  const carouselRef = React.useRef<HTMLDivElement>(null);
  const firstSlideRef = React.useRef<HTMLDivElement>(null);

  var carouselSettings: Settings = {
    dots: false,
    speed: 500,
    slidesToScroll: 1,
    infinite: false,
    variableWidth: true,
    arrows: false,
    rows: 1,
    ...settings,
  };

  const slides = content.map((c, index) => (
    <SlideDiv
      ref={index === 0 ? firstSlideRef : undefined}
      styles={{
        paddingRight: `${gap}px`,
        overflow: "visible",
        // marginLeft: index !== 0 ? "0px" : margin,
        ...c.styles,
      }}
      data-testid="carousel-slide-item"
    >
      {c.content}
    </SlideDiv>
  ));

  const calculateSlidesToShow = () => {
    if (carouselSettings.slidesToShow) {
      setSlidesToShow(carouselSettings.slidesToShow);
    }

    const containerWidth = (carouselRef.current?.offsetWidth || 1) + gap;
    const slideWidth = firstSlideRef.current?.offsetWidth || 1;

    const res = Math.floor(containerWidth / slideWidth);
    console.log("Slides to show > ", {
      container: containerWidth,
      slide: slideWidth,
      res,
    });

    setSlidesToShow(res);
  };

  React.useEffect(() => {
    calculateSlidesToShow();
  }, [carouselRef, firstSlideRef]);

  return (
    <ContainerDiv ref={carouselRef} styles={{ ...styles }}>
      <Slider {...carouselSettings} slidesToShow={slidesToShow}>
        {slides}
      </Slider>
    </ContainerDiv>
  );
};
