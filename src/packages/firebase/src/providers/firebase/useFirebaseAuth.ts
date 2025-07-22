import { FirebaseError } from "firebase/app";
import { useContext } from "react";
import { FirebaseAuthProviderContext } from "./firebaseAuthContext";

export const useFirebaseAuth = () => {
  const firebaseAuthContext = useContext(FirebaseAuthProviderContext);

  const executeFirebaseAuthOperation = async <TOut>(
    operation: () => Promise<TOut>,
    onError?: (error: FirebaseError) => void
  ) => {
    try {
      return await operation();
    } catch (error) {
      if (onError) {
        const firebaseError = error as FirebaseError;
        onError?.(firebaseError);
      }

      return null;
    }
  };

  const signUp = async (
    data: {
      email: string;
      password: string;
      username: string;
    },
    onError?: (error: FirebaseError) => void
  ) => {
    return await executeFirebaseAuthOperation(async () => {
      return await firebaseAuthContext!.signUp(
        data.email,
        data.password,
        data.username
      );
    }, onError);
  };

  const logIn = async (
    data: { email: string; password: string },
    onError?: (error: FirebaseError) => void
  ) => {
    return await executeFirebaseAuthOperation(async () => {
      return await firebaseAuthContext!.logIn(data.email, data.password);
    }, onError);
  };

  const logout = async (onError?: (error: FirebaseError) => void) => {
    await executeFirebaseAuthOperation(async () => {
      return await firebaseAuthContext!.logout();
    }, onError);
  };

  const resetPassword = async (
    data: { email: string },
    onError?: (error: FirebaseError) => void
  ) => {
    return await executeFirebaseAuthOperation(async () => {
      return await firebaseAuthContext!.resetPassword(data.email);
    }, onError);
  };

  const updateEmail = async (
    data: { email: string },
    onError?: (error: FirebaseError) => void
  ) => {
    return await executeFirebaseAuthOperation(async () => {
      return await firebaseAuthContext!.updateEmail(data.email);
    }, onError);
  };

  const updatePassword = async (
    data: { password: string },
    onError?: (error: FirebaseError) => void
  ) => {
    return await executeFirebaseAuthOperation(async () => {
      return await firebaseAuthContext!.updatePassword(data.password);
    }, onError);
  };

  const updateName = async (
    data: { name: string },
    onError?: (error: FirebaseError) => void
  ) => {
    return await executeFirebaseAuthOperation(async () => {
      return await firebaseAuthContext!.updateName(data.name);
    }, onError);
  };

  return {
    currentUser: firebaseAuthContext.currentUser,
    signUp,
    logIn,
    logout,
    resetPassword,
    updateEmail,
    updatePassword,
    updateName,
  };
};
