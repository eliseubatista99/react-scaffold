import { useContext } from "react";
import { FirebaseAuthProviderContext } from "./firebaseAuthContext";

export const useFirebaseAuth = () => {
  const firebaseAuthContext = useContext(FirebaseAuthProviderContext);

  const signUp = async (email: string, password: string, username: string) => {
    return await firebaseAuthContext!.signUp(email, password, username);
  };

  const logIn = async (email: string, password: string) => {
    return await firebaseAuthContext!.logIn(email, password);
  };

  const logout = async () => {
    return await firebaseAuthContext!.logout();
  };

  const resetPassword = async (email: string) => {
    return await firebaseAuthContext!.resetPassword(email);
  };

  const updateEmail = async (email: string) => {
    return await firebaseAuthContext!.updateEmail(email);
  };

  const updatePassword = async (password: string) => {
    return await firebaseAuthContext!.updatePassword(password);
  };

  const updateName = async (name: string) => {
    return await firebaseAuthContext!.updateName(name);
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
