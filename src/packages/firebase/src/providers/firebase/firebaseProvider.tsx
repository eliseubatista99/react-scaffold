import type { FirebaseOptions } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import React from "react";
import { FirebaseAppHelper } from "../../helpers";
import { FirebaseAuthProvider } from "./firebaseAuthProvider";

export interface FirebaseProviderInputProps {
  options: FirebaseOptions;
  children?: React.ReactNode;
}

export const FirebaseProvider = ({
  options,
  children,
}: FirebaseProviderInputProps) => {
  const [auth] = React.useState<Auth>(() =>
    getAuth(FirebaseAppHelper.initializeApp(options)),
  );

  return (
    <FirebaseAuthProvider auth={auth}>
      {children}
    </FirebaseAuthProvider>
  );
};