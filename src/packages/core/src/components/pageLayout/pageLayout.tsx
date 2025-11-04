import { usePageLayoutHelper } from "./pageLayout.hook";

export interface PageLayoutHeaderAndFooterProps {
  content: React.ReactNode;
  visibility?: "always" | "fixed";
  styles?: React.CSSProperties;
}

export interface PageLayoutProps {
  header?: PageLayoutHeaderAndFooterProps;
  footer?: PageLayoutHeaderAndFooterProps;
  floatingContent?: React.ReactNode;
  allowScroll?: boolean;
  containerStyles?: React.CSSProperties;
  pageStyles?: React.CSSProperties;
  children?: React.ReactNode;
}

export const PageLayout = (props: PageLayoutProps) => {
  const {
    containerStyles,
    pageStyles,
    children,
    allowScroll = true,
    floatingContent,
  } = props;

  const { footer, header } = usePageLayoutHelper(props);
  return (
    <div
      data-testid="page-container"
      style={{
        minHeight: "100vh",
        width: "100%",
        minWidth: "100%",
        overflow: "hidden",
        position: "relative",
        boxSizing: "border-box",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        display: "flex",
        flexDirection: "column",
        ...containerStyles,
      }}
    >
      <div
        data-testid="page-layout"
        style={{
          minHeight: "100%",
          width: "100%",
          overflowY: allowScroll ? "auto" : "hidden",
          display: "flex",
          flexDirection: "column",
          boxSizing: "border-box",
        }}
      >
        {header.visible && (
          <div
            ref={header.ref}
            data-testid="page-header"
            style={{
              width: "100%",
              zIndex: 99,
              position: header.visibility === "fixed" ? "relative" : "fixed",
              top: 0,
              left: 0,
              right: 0,
              display: "flex",
              flexDirection: "row",
              height: "fit-content",
              boxSizing: "border-box",
              ...header.styles,
            }}
          >
            {header.content}
          </div>
        )}
        <div
          style={{
            width: "100%",
            flex: 1,
            minHeight: "fit-content",
            marginTop: `${header.height}px`,
            marginBottom: `${footer.height}px`,
            padding: "12px 24px",
            boxSizing: "border-box",
            overflowY: allowScroll ? undefined : "hidden",
            ...pageStyles,
          }}
        >
          {children}
        </div>
      </div>

      {footer.visible && (
        <div
          ref={footer.ref}
          data-testid="page-footer"
          style={{
            width: "100%",
            zIndex: 99,
            position: footer.visibility === "fixed" ? "relative" : "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            display: "flex",
            flexDirection: "row",
            height: "fit-content",
            boxSizing: "border-box",
            ...footer.styles,
          }}
        >
          {footer.content}
        </div>
      )}
    </div>
  );
};
