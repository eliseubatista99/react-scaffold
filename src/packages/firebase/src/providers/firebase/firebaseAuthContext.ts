import { type ActionCodeSettings, User, UserCredential } from "firebase/auth";
import React from "react";

export type FirebaseAuthSignUpResult =
  | { userCredential: UserCredential; profileUpdate: "success" }
  | {
      userCredential: UserCredential;
      profileUpdate: "failed";
      profileError: unknown;
    };

export interface FirebaseAuthContextData {
  currentUser: User | null | undefined;
  isInitialized: boolean;
  signUp: (
    email: string,
    password: string,
    username: string,
  ) => Promise<FirebaseAuthSignUpResult>;
  logIn: (email: string, password: string) => Promise<UserCredential>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateEmail: (
    email: string,
    actionCodeSettings?: ActionCodeSettings | null,
  ) => Promise<void>;
  updatePassword: (password: string) => Promise<User>;
  updateName: (name: string) => Promise<User>;
}

export const FirebaseAuthProviderContext =
  React.createContext<FirebaseAuthContextData | null>(null);
