import {
  Auth,
  createUserWithEmailAndPassword,
  getAuth,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  updateEmail,
  updatePassword,
  updateProfile,
  User,
} from "firebase/auth";
import React from "react";

import { FirebaseApp } from "firebase/app";
import { FirebaseAppHelper } from "../../helpers";
import { FirebaseAuthProviderContext } from "./firebaseAuthContext";

export interface FirebaseAuthProviderInputProps {
  children?: React.ReactNode;
}

export const FirebaseAuthProvider = ({
  children,
}: FirebaseAuthProviderInputProps) => {
  const app = React.useRef<FirebaseApp | null>(null);
  const auth = React.useRef<Auth | null>(null);
  const currentUser = React.useRef<User | null>(null);

  const signUp = async (email: string, password: string, username: string) => {
    const userCredential = await createUserWithEmailAndPassword(
      auth.current!,
      email,
      password
    );

    await updateProfile(userCredential.user, {
      displayName: username,
    });

    return userCredential;
  };

  const logIn = async (email: string, password: string) => {
    return await signInWithEmailAndPassword(auth.current!, email, password);
  };

  const logout = async () => {
    return auth.current?.signOut();
  };

  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth.current!, email);

    return currentUser.current;
  };

  const updateUserEmail = async (email: string) => {
    if (currentUser.current) {
      await updateEmail(currentUser.current, email);
    }

    return currentUser.current;
  };

  const updateUserPassword = async (password: string) => {
    if (currentUser.current) {
      await updatePassword(currentUser.current, password);
    }

    return currentUser.current;
  };

  const updateUserName = async (name: string) => {
    if (currentUser.current) {
      await updateProfile(currentUser.current, {
        displayName: name,
      });
    }

    return currentUser.current;
  };

  React.useEffect(() => {
    if (!FirebaseAppHelper.isAppInitialized()) {
      throw new Error(
        "Firebase app is not initialized. Please call FirebaseAppHelper.initializeApp() with your Firebase configuration."
      );
    }

    app.current = FirebaseAppHelper.getApp();

    auth.current = getAuth(app.current!);

    if (!auth.current) {
      throw new Error("Firebase Auth is not initialized");
    }

    const unsubscribe = auth.current.onAuthStateChanged((user: User | null) => {
      currentUser.current = user;
    });

    return unsubscribe;
  }, []);

  return (
    <FirebaseAuthProviderContext.Provider
      value={{
        currentUser: currentUser.current,
        signUp,
        logIn,
        logout,
        resetPassword,
        updateEmail: updateUserEmail,
        updatePassword: updateUserPassword,
        updateName: updateUserName,
      }}
    >
      {children}
    </FirebaseAuthProviderContext.Provider>
  );
};
