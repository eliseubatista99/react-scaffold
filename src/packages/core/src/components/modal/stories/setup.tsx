import { FeedbackProvider, useFeedback } from "../../../providers";
import { Modal, ModalProps } from "../../modal";

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

export const ModalStoriesSetup = (props: ModalProps) => {
  return (
    <FeedbackProvider {...props}>
      <ModalStoriesSetupInnerContent {...props} />
    </FeedbackProvider>
  );
};
