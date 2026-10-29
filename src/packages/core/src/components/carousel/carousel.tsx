import styled from "@emotion/styled";
import React, { useEffect, useRef, useState } from "react";
import Slider from "react-slick";
import type { Settings } from "react-slick";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";

export interface CarouselSlideProps {
  id?: React.Key;
  content: React.ReactNode;
  style?: React.CSSProperties;
}

export interface CarouselProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "content"> {
  content: CarouselSlideProps[];
  settings?: Settings;
  gap?: number;
}

const ContainerDiv = styled.div`
  width: 100%;
  height: fit-content;
  box-sizing: border-box;

  .slick-list {
    overflow: visible;
  }

  .slick-slider.slick-dotted {
    margin-bottom: 25px;
  }

  .slick-dots {
    position: absolute;
    bottom: -25px;
    display: flex !important;
    align-items: center;
    justify-content: center;
    text-align: center;
    width: 100%;
    padding: 0;
    margin: 0 auto;
    list-style: none;
    gap: 5px;
  }

  .slick-dots li {
    position: relative;
    display: flex !important;
    align-items: center;
    justify-content: center;
    text-align: center;
    width: 20px;
    height: 20px;
    margin: 0;
  }

  .slick-dots li button {
    position: relative;
    display: flex !important;
    align-items: center;
    justify-content: center;
    text-align: center;
    width: 20px;
    height: 20px;
    padding: 0;
    cursor: pointer;
    color: transparent;
    border: 0;
    border-radius: 50%;
    background: transparent;
  }

  .slick-dots li button:focus-visible {
    outline: 2px solid #000;
    outline-offset: 2px;
  }

  .slick-dots li button:before {
    display: flex !important;
    align-items: center;
    justify-content: center;
    text-align: center;
    font-family: "slick";
    font-size: 10px;
    line-height: 20px;
    position: absolute;
    top: 0;
    left: 0;
    width: 20px;
    content: "•";
    opacity: 0.25;
    color: black;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  .slick-dots li.slick-active button:before {
    opacity: 0.75;
    color: black;
  }
`;

const SlideDiv = styled.div`
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  min-width: fit-content;
  position: relative;

  > * {
    box-sizing: border-box;
    display: flex;
  }
`;

const getPositiveInteger = (value: number | undefined): number | undefined => {
  if (value === undefined || !Number.isFinite(value)) {
    return undefined;
  }

  return Math.max(1, Math.floor(value));
};

export const Carousel = ({
  content,
  settings,
  gap = 15,
  style,
  ...containerProps
}: CarouselProps) => {
  const configuredSlidesToShow = getPositiveInteger(settings?.slidesToShow);
  const slideGap = Number.isFinite(gap) ? Math.max(0, gap) : 15;
  const [slidesToShow, setSlidesToShow] = useState(configuredSlidesToShow ?? 1);
  const carouselRef = useRef<HTMLDivElement>(null);
  const firstSlideRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = carouselRef.current;
    const firstSlide = firstSlideRef.current;

    const calculateSlidesToShow = () => {
      if (configuredSlidesToShow !== undefined) {
        setSlidesToShow(configuredSlidesToShow);
        return;
      }

      const containerWidth = container?.getBoundingClientRect().width ?? 0;
      const slideWidth = firstSlide?.getBoundingClientRect().width ?? 0;

      if (containerWidth <= 0 || slideWidth <= 0) {
        setSlidesToShow(1);
        return;
      }

      const visibleSlides = Math.floor(containerWidth / slideWidth);
      setSlidesToShow(
        Math.min(content.length || 1, Math.max(1, visibleSlides)),
      );
    };

    calculateSlidesToShow();

    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", calculateSlidesToShow);
      return () => window.removeEventListener("resize", calculateSlidesToShow);
    }

    const observer = new ResizeObserver(calculateSlidesToShow);
    if (container) observer.observe(container);
    if (firstSlide) observer.observe(firstSlide);

    return () => observer.disconnect();
  }, [configuredSlidesToShow, content, slideGap]);

  const carouselSettings: Settings = {
    dots: false,
    speed: 500,
    slidesToScroll: 1,
    infinite: false,
    variableWidth: true,
    arrows: false,
    rows: 1,
    ...settings,
    slidesToShow,
  };

  return (
    <ContainerDiv
      {...containerProps}
      ref={carouselRef}
      style={style}
    >
      {content.length > 0 && (
        <Slider {...carouselSettings}>
          {content.map((slide, index) => (
            <SlideDiv
              key={slide.id ?? index}
              ref={index === 0 ? firstSlideRef : undefined}
              style={{
                paddingRight: `${slideGap}px`,
                overflow: "visible",
                ...slide.style,
              }}
              data-testid="carousel-slide-item"
            >
              {slide.content}
            </SlideDiv>
          ))}
        </Slider>
      )}
    </ContainerDiv>
  );
};
