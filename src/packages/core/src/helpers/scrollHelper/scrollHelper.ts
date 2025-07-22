export class ScrollHelper {
  static isScrollEnabled = () => {
    return (
      document.body.style.overflow === "unset" ||
      document.body.style.overflow === "auto"
    );
  };

  static disableScroll = () => {
    document.body.style.overflow = "hidden";
  };

  static enableScroll = () => {
    document.body.style.overflow = "unset";
  };
}
