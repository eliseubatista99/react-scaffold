import styled from "@emotion/styled";
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
  reserveSpaceForScrollbar?: boolean;
  containerStyles?: React.CSSProperties;
  pageStyles?: React.CSSProperties;
  children?: React.ReactNode;
}

const PageContainer = styled.div<{ styles?: React.CSSProperties }>`
  min-height: 100%;
  max-height: 100%;
  width: 100%;
  min-width: 100%;
  position: relative;
  box-sizing: border-box;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  flex-direction: column;

  ${({ styles }) => styles && { ...styles }}

  div {
    box-sizing: border-box;
    position: relative;
  }
`;

export const PageLayout = (props: PageLayoutProps) => {
  const {
    containerStyles,
    pageStyles,
    children,
    allowScroll = true,
    floatingContent,
    reserveSpaceForScrollbar,
  } = props;

  const { footer, header, page } = usePageLayoutHelper(props);
  return (
    <PageContainer
      id="page-container"
      styles={{
        ...containerStyles,
      }}
    >
      {header.visible && (
        <div
          ref={header.ref}
          id="page-header"
          style={{
            width: "100%",
            zIndex: 99,
            position: header.visibility === "fixed" ? "relative" : "sticky",
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
        id="page-body"
        style={{
          width: "100%",
          overflow: "hidden",
          display: "flex",
          flex: 1,
          marginTop: `-${header.height}px`,
          marginBottom: `-${footer.height}px`,
        }}
      >
        <div
          id="page-content"
          style={{
            width: "100%",
            overflowX: "hidden",
            overflowY: allowScroll ? "auto" : "hidden",
            display: "flex",
            flexDirection: "column",
            flex: 1,
            minHeight: "100%",
            scrollbarGutter: reserveSpaceForScrollbar ? "stable" : undefined,
            paddingLeft: "0px",
            paddingRight: "0px",
            paddingTop: `${header.height}px`,
            paddingBottom: `${footer.height}px`,
            ...pageStyles,
          }}
        >
          {children}
        </div>
      </div>

      {footer.visible && (
        <div
          ref={footer.ref}
          id="page-footer"
          style={{
            width: "100%",
            zIndex: 99,
            position: footer.visibility === "fixed" ? "relative" : "sticky",
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
    </PageContainer>
  );
};
