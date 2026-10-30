import React from "react";
import { useFirebaseAuth } from "../../providers/firebase/useFirebaseAuth";

export const useDidMountWithFirebaseAuth = (
  action: () => void | Promise<void>,
  onError?: (error: unknown) => void,
) => {
  const { currentUser, isInitialized } = useFirebaseAuth();
  const hasRunAction = React.useRef(false);

  React.useEffect(() => {
    if (isInitialized && currentUser && !hasRunAction.current) {
      hasRunAction.current = true;

      const reportError = (error: unknown) => {
        if (onError) {
          onError(error);
          return;
        }

        console.error("useDidMountWithFirebaseAuth action failed.", error);
      };

      try {
        const result = action();
        if (result !== undefined) {
          void Promise.resolve(result).catch(reportError);
        }
      } catch (error) {
        reportError(error);
      }
    }
  }, [action, currentUser, isInitialized, onError]);
};
