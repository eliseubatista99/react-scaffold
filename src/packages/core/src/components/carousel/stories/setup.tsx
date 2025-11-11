import { Carousel, CarouselProps } from "../carousel";

export const CarouselStoriesSetup = (props: CarouselProps) => {
  return (
    <div style={{ width: "100%", padding: "24px" }}>
      <div
        style={{
          width: "calc(100% + 48px)",
          margin: "0 -24px 0 -24px",
          left: 0,
          alignItems: "center",
        }}
      >
        <Carousel {...props} />
      </div>
    </div>
  );
};
