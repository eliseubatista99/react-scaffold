import styled from "@emotion/styled";
import { FeedbackProvider, useFeedback } from "../../../providers";
import { Loader, LoaderProps } from "../loader";

const AnimationSpan = styled.span`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  position: relative;
  animation: rotate 1s linear infinite;

  ::before,
  ::after {
    content: "";
    box-sizing: border-box;
    position: absolute;
    inset: 0px;
    border-radius: 50%;
    border: 5px solid #fff;
    animation: prixClipFix 2s linear infinite;
  }
  ::after {
    inset: 8px;
    transform: rotate3d(90, 90, 0, 180deg);
    border-color: #cd3131;
  }

  @keyframes rotate {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  @keyframes prixClipFix {
    0% {
      clip-path: polygon(50% 50%, 0 0, 0 0, 0 0, 0 0, 0 0);
    }
    50% {
      clip-path: polygon(50% 50%, 0 0, 100% 0, 100% 0, 100% 0, 100% 0);
    }
    75%,
    100% {
      clip-path: polygon(50% 50%, 0 0, 100% 0, 100% 100%, 100% 100%, 100% 100%);
    }
  }
`;

const LoaderStoriesSetupInnerContent = ({
  children,
  styles,
  ...props
}: LoaderProps) => {
  const { isItemVisible, showItem, hideItem } = useFeedback();

  return (
    <>
      {!isItemVisible(props.id) && (
        <button onClick={() => showItem(props.id)}>Show Loader</button>
      )}

      <Loader {...props} styles={{ ...styles, gap: "30px" }}>
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flex: 1,
          }}
          onClick={() => hideItem(props.id)}
        >
          <AnimationSpan />

          {children}
        </div>
      </Loader>
    </>
  );
};

export const LoaderStoriesSetup = (props: LoaderProps) => {
  return (
    <FeedbackProvider {...props}>
      <LoaderStoriesSetupInnerContent {...props} />
    </FeedbackProvider>
  );
};
