export interface PageLayoutHeaderAndFooterProps {
  content: React.ReactNode;
  visibility?: "always" | "fixed";
  styles?: React.CSSProperties;
}

export interface PageLayoutProps {
  header?: PageLayoutHeaderAndFooterProps;
  footer?: PageLayoutHeaderAndFooterProps;
  floatingContent?: React.ReactNode;
  containerStyles?: React.CSSProperties;
  pageStyles?: React.CSSProperties;
  children?: React.ReactNode;
}

export const PageLayout = ({
  header,
  containerStyles,
  pageStyles,
  children,
  footer,
  floatingContent,
}: PageLayoutProps) => {
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
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          boxSizing: "border-box",
        }}
      >
        {header && (
          <div
            // ref={header.ref}
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
            padding: "24px",
            boxSizing: "border-box",
            ...pageStyles,
          }}
        >
          {children}
        </div>
      </div>

      {footer && (
        <div
          // ref={header.ref}
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
