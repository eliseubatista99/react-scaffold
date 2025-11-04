import { useFeedback } from "../../providers";

export interface LoaderProps {
  id: string;
  children?: React.ReactNode;
  styles?: React.CSSProperties;
}

export const Loader = ({ id, styles, children }: LoaderProps) => {
  const { isItemVisible } = useFeedback();

  return (
    <>
      {isItemVisible(id) && (
        <div
          style={{
            width: "100%",
            minHeight: "100%",
            left: 0,
            top: 0,
            position: "fixed",
            zIndex: 1000,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            ...styles,
          }}
        >
          {children}
        </div>
      )}
    </>
  );
};
