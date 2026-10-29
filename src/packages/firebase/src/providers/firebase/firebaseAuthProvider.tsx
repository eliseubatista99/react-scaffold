import {
  type ActionCodeSettings,
  type Auth,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updatePassword,
  updateProfile,
  type User,
  verifyBeforeUpdateEmail,
} from "firebase/auth";
import React from "react";

import {
  FirebaseAuthProviderContext,
  type FirebaseAuthContextData,
} from "./firebaseAuthContext";

export interface FirebaseAuthProviderInputProps {
  auth: Auth;
  children?: React.ReactNode;
}

export const FirebaseAuthProvider = ({
  auth,
  children,
}: FirebaseAuthProviderInputProps) => {
  const [authSnapshot, setAuthSnapshot] = React.useState<
    { auth: Auth; user: User | null } | undefined
  >(undefined);
  const [userProfileRevision, setUserProfileRevision] = React.useState(0);
  const currentUser =
    authSnapshot?.auth === auth ? authSnapshot.user : undefined;

  React.useEffect(() => {
    let isActive = true;
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (isActive) {
        setAuthSnapshot({ auth, user });
      }
    });

    return () => {
      isActive = false;
      unsubscribe();
    };
  }, [auth]);

  const value = React.useMemo<FirebaseAuthContextData>(() => {
    const isInitialized = currentUser !== undefined;

    const requireCurrentUser = () => {
      const user = auth.currentUser;
      if (user) {
        return user;
      }

      if (!isInitialized) {
        throw new Error("Firebase Auth is still initializing.");
      }

      throw new Error("A signed-in user is required for this operation.");
    };

    const signUp = async (
      email: string,
      password: string,
      username: string,
    ) => {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );

      try {
        await updateProfile(userCredential.user, {
          displayName: username,
        });
        setUserProfileRevision((revision) => revision + 1);
      } catch (profileError) {
        return {
          userCredential,
          profileUpdate: "failed" as const,
          profileError,
        };
      }

      return { userCredential, profileUpdate: "success" as const };
    };

    const logIn = (email: string, password: string) =>
      signInWithEmailAndPassword(auth, email, password);

    const logout = () => signOut(auth);

    const resetPassword = (email: string) =>
      sendPasswordResetEmail(auth, email);

    const updateUserEmail = async (
      email: string,
      actionCodeSettings?: ActionCodeSettings | null,
    ): Promise<void> => {
      await verifyBeforeUpdateEmail(
        requireCurrentUser(),
        email,
        actionCodeSettings,
      );
    };

    const updateUserPassword = async (password: string) => {
      const user = requireCurrentUser();
      await updatePassword(user, password);

      return user;
    };

    const updateUserName = async (name: string) => {
      const user = requireCurrentUser();
      await updateProfile(user, {
        displayName: name,
      });
      setUserProfileRevision((revision) => revision + 1);

      return user;
    };

    return {
      currentUser,
      isInitialized,
      signUp,
      logIn,
      logout,
      resetPassword,
      updateEmail: updateUserEmail,
      updatePassword: updateUserPassword,
      updateName: updateUserName,
    };
  }, [auth, currentUser, userProfileRevision]);

  return (
    <FirebaseAuthProviderContext.Provider
      value={value}
    >
      {children}
    </FirebaseAuthProviderContext.Provider>
  );
};
