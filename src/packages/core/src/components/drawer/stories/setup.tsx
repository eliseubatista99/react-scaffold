import { FeedbackProvider, useFeedback } from "../../../providers";
import { Drawer, DrawerProps } from "../drawer";

const DrawerStoriesSetupInnerContent = (props: DrawerProps) => {
  const { isItemVisible, showItem, hideItem } = useFeedback();

  return (
    <>
      {!isItemVisible(props.id) && (
        <button onClick={() => showItem(props.id)}>Show Drawer</button>
      )}

      <Drawer {...props} onCloseDrawer={() => hideItem(props.id)} />
    </>
  );
};

export const DrawerStoriesSetup = (props: DrawerProps) => {
  return (
    <FeedbackProvider {...props}>
      <DrawerStoriesSetupInnerContent {...props} />
    </FeedbackProvider>
  );
};
