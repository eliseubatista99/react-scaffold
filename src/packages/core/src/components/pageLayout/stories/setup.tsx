import { useFeedback } from "../../../providers";
import { Modal, ModalProps } from "../../modal";
import { PageLayout, PageLayoutProps } from "../pageLayout";

const ModalStoriesSetupInnerContent = (props: ModalProps) => {
  const { isItemVisible, showItem, hideItem } = useFeedback();

  return (
    <>
      {!isItemVisible(props.id) && (
        <button onClick={() => showItem(props.id)}>Show Modal</button>
      )}

      <Modal {...props} onClickOutsideModal={() => hideItem(props.id)} />
    </>
  );
};

export const PageLayoutStoriesSetup = ({
  children,
  ...props
}: PageLayoutProps) => {
  const header = props.header
    ? {
        ...props.header,
        content: (
          <div
            style={{
              width: "100%",
              padding: "24px",
              minHeight: "50px",
              background: "#120d29ff",
            }}
          ></div>
        ),
      }
    : undefined;

  const footer = props.footer
    ? {
        ...props.footer,
        content: (
          <div
            style={{
              width: "100%",
              padding: "24px",
              minHeight: "75px",
              background: "#211947ff",
            }}
          ></div>
        ),
      }
    : undefined;

  return (
    <PageLayout {...props} header={header} footer={footer}>
      <div
        style={{
          width: "100%",
          gap: "16px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {Array.from({ length: 30 }, (_, i) => i + 1).map((i) => (
          <div
            style={{
              background: `rgba(60, 60, 60, ${100 / i})`,
              width: "300px",
              height: "100px",
              maxWidth: "100%",
            }}
          />
        ))}
      </div>
    </PageLayout>
  );
};
