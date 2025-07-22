import { FeedbackProvider, useFeedback } from "../../../providers";
import { Toast, ToastProps } from "../toast";

const ToastStoriesSetupInnerContent = (props: ToastProps) => {
  const { isItemVisible, showItem, hideItem } = useFeedback();

  return (
    <>
      {!isItemVisible(props.id) && (
        <button onClick={() => showItem(props.id)}>Show Toast</button>
      )}

      <Toast {...props} />
    </>
  );
};

export const ToastStoriesSetup = (props: ToastProps) => {
  return (
    <FeedbackProvider {...props}>
      <ToastStoriesSetupInnerContent {...props} />
    </FeedbackProvider>
  );
};
