import { type ActionCodeSettings } from "firebase/auth";
import { useContext } from "react";
import { FirebaseAuthProviderContext } from "./firebaseAuthContext";

export const useFirebaseAuth = () => {
  const firebaseAuthContext = useContext(FirebaseAuthProviderContext);

  if (!firebaseAuthContext) {
    throw new Error("useFirebaseAuth must be used within a FirebaseAuthProvider");
  }

  const signUp = (data: {
    email: string;
    password: string;
    username: string;
  }) =>
    firebaseAuthContext.signUp(data.email, data.password, data.username);

  const logIn = (data: { email: string; password: string }) =>
    firebaseAuthContext.logIn(data.email, data.password);

  const logout = () => firebaseAuthContext.logout();

  const resetPassword = (data: { email: string }) =>
    firebaseAuthContext.resetPassword(data.email);

  const updateEmail = (data: {
    email: string;
    actionCodeSettings?: ActionCodeSettings | null;
  }) =>
    firebaseAuthContext.updateEmail(data.email, data.actionCodeSettings);

  const updatePassword = (data: { password: string }) =>
    firebaseAuthContext.updatePassword(data.password);

  const updateName = (data: { name: string }) =>
    firebaseAuthContext.updateName(data.name);

  return {
    currentUser: firebaseAuthContext.currentUser,
    isInitialized: firebaseAuthContext.isInitialized,
    signUp,
    logIn,
    logout,
    resetPassword,
    updateEmail,
    updatePassword,
    updateName,
  };
};
