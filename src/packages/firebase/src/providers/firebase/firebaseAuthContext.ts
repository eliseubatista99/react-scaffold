import { User, UserCredential } from "firebase/auth";
import React from "react";

export interface FirebaseAuthContextData {
  currentUser: User | null;
  signUp: (
    email: string,
    password: string,
    username: string
  ) => Promise<UserCredential>;
  logIn: (email: string, password: string) => Promise<UserCredential>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<User | null>;
  updateEmail: (email: string) => Promise<User | null>;
  updatePassword: (password: string) => Promise<User | null>;
  updateName: (name: string) => Promise<User | null>;
}

export const FirebaseAuthProviderContext =
  React.createContext<FirebaseAuthContextData>({
    currentUser: null,
    signUp: async (): Promise<UserCredential> => {
      throw new Error("signUp function not implemented");
    },
    logIn: async (): Promise<UserCredential> => {
      throw new Error("signUp function not implemented");
    },
    logout: async (): Promise<void> => {},
    resetPassword: async (): Promise<User | null> => null,
    updateEmail: async (): Promise<User | null> => null,
    updatePassword: async (): Promise<User | null> => null,
    updateName: async (): Promise<User | null> => null,
  });
