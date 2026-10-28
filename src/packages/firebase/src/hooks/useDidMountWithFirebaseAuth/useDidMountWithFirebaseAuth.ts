import { getAuth, User } from "firebase/auth";
import React from "react";
import { FirebaseAppHelper } from "../../helpers";

export const useDidMountWithFirebaseAuth = (action: () => void) => {
  React.useEffect(() => {
    if (!FirebaseAppHelper.isAppInitialized()) {
      throw new Error(
        "useDidMountWithFirebaseAuth > Firebase app is not initialized.",
      );
    }

    const firebaseApp = FirebaseAppHelper.getApp();
    const auth = getAuth(firebaseApp!);

    if (!auth) {
      throw new Error(
        "useDidMountWithFirebaseAuth > Firebase Auth is not initialized",
      );
    }

    const unsubscribe = auth.onAuthStateChanged((user: User | null) => {
      console.debug("useDidMountWithFirebaseAuth > AuthStateChanged > ", {
        user,
      });

      if (user) {
        action();
      }
    });

    return unsubscribe;
  }, []);
};
