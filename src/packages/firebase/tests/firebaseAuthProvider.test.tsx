import type { FirebaseApp, FirebaseOptions } from "firebase/app";
import type { Auth, User, UserCredential } from "firebase/auth";
import {
  getAuth,
  updateProfile,
} from "firebase/auth";
import { act as reactAct } from "react";
import { createRoot, type Root } from "react-dom/client";
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";
import { FirebaseAuthProvider } from "../src/providers/firebase/firebaseAuthProvider";
import { FirebaseProvider } from "../src/providers/firebase/firebaseProvider";
import type { FirebaseAuthSignUpResult } from "../src/providers/firebase/firebaseAuthContext";
import { useFirebaseAuth } from "../src/providers/firebase/useFirebaseAuth";

const firebaseAuthMocks = vi.hoisted(() => ({
  createUserWithEmailAndPassword: vi.fn(),
  getAuth: vi.fn(),
  onAuthStateChanged: vi.fn(),
  sendPasswordResetEmail: vi.fn(),
  signInWithEmailAndPassword: vi.fn(),
  signOut: vi.fn(),
  updatePassword: vi.fn(),
  updateProfile: vi.fn(),
  verifyBeforeUpdateEmail: vi.fn(),
}));

const firebaseAppHelperMocks = vi.hoisted(() => ({
  initializeApp: vi.fn(),
}));

vi.mock("firebase/auth", () => firebaseAuthMocks);
vi.mock("../src/helpers", () => ({
  FirebaseAppHelper: firebaseAppHelperMocks,
}));

type AuthStateListener = (user: User | null) => void;
type FirebaseAuthValue = ReturnType<typeof useFirebaseAuth>;

const authListeners = new Map<Auth, AuthStateListener>();
const mountedRoots: Root[] = [];

const createAuth = (currentUser: User | null = null) =>
  ({ currentUser }) as unknown as Auth;

const createUser = (uid: string, displayName: string | null = null) =>
  ({ uid, displayName }) as unknown as User;

const emitAuthState = (auth: Auth, user: User | null) => {
  const listener = authListeners.get(auth);
  if (!listener) {
    throw new Error("No auth-state listener registered for this Auth instance.");
  }

  listener(user);
};

const ContextCapture = ({
  onContext,
}: {
  onContext: (context: FirebaseAuthValue) => void;
}) => {
  onContext(useFirebaseAuth());
  return null;
};

const renderAuthProvider = (
  initialAuth: Auth,
  onContext: (context: FirebaseAuthValue) => void,
) => {
  const root = createRoot(document.createElement("div"));
  mountedRoots.push(root);

  const rerender = (auth: Auth) => {
    reactAct(() => {
      root.render(
        <FirebaseAuthProvider auth={auth}>
          <ContextCapture onContext={onContext} />
        </FirebaseAuthProvider>,
      );
    });
  };

  rerender(initialAuth);
  return { rerender };
};

const renderFirebaseProvider = (
  options: FirebaseOptions,
  onContext: (context: FirebaseAuthValue) => void,
) => {
  const root = createRoot(document.createElement("div"));
  mountedRoots.push(root);
  reactAct(() =>
    root.render(
      <FirebaseProvider options={options}>
        <ContextCapture onContext={onContext} />
      </FirebaseProvider>,
    ),
  );
};

const getContext = (context: FirebaseAuthValue | undefined) => {
  if (!context) {
    throw new Error("Firebase auth context was not rendered.");
  }

  return context;
};

describe("FirebaseAuthProvider", () => {
  beforeEach(() => {
    (globalThis as typeof globalThis & {
      IS_REACT_ACT_ENVIRONMENT: boolean;
    }).IS_REACT_ACT_ENVIRONMENT = true;
    vi.clearAllMocks();
    authListeners.clear();

    firebaseAuthMocks.onAuthStateChanged.mockImplementation(
      (auth: Auth, observer: unknown) => {
        const listener =
          typeof observer === "function"
            ? (observer as AuthStateListener)
            : (observer as { next: AuthStateListener }).next;
        authListeners.set(auth, listener);
        return vi.fn();
      },
    );

    firebaseAuthMocks.createUserWithEmailAndPassword.mockRejectedValue(
      new Error("createUserWithEmailAndPassword was not configured for this test"),
    );
    firebaseAuthMocks.updateProfile.mockImplementation(
      async (
        user: User,
        profile: { displayName?: string | null; photoURL?: string | null },
      ) => {
        Object.assign(user, profile);
      },
    );
  });

  afterEach(() => {
    for (const root of mountedRoots.splice(0)) {
      reactAct(() => root.unmount());
    }
  });

  it("stays uninitialized until the first auth-state event", () => {
    const auth = createAuth();
    let context: FirebaseAuthValue | undefined;
    renderAuthProvider(auth, (value) => {
      context = value;
    });

    expect(context?.isInitialized).toBe(false);
    expect(context?.currentUser).toBeUndefined();

    reactAct(() => emitAuthState(auth, null));

    expect(context?.isInitialized).toBe(true);
    expect(context?.currentUser).toBeNull();
  });

  it("initializes the Firebase app and Auth from consumer configuration", () => {
    const options: FirebaseOptions = {
      apiKey: "test-api-key",
      authDomain: "test.firebaseapp.com",
      projectId: "test-project",
      appId: "test-app-id",
    };
    const app = {} as FirebaseApp;
    const auth = createAuth();
    firebaseAppHelperMocks.initializeApp.mockReturnValue(app);
    firebaseAuthMocks.getAuth.mockReturnValue(auth);
    let context: FirebaseAuthValue | undefined;

    renderFirebaseProvider(options, (value) => {
      context = value;
    });

    expect(firebaseAppHelperMocks.initializeApp).toHaveBeenCalledWith(options);
    expect(getAuth).toHaveBeenCalledWith(app);
    expect(context?.isInitialized).toBe(false);
  });

  it("rejects password and profile updates when no user is signed in", async () => {
    const auth = createAuth();
    let context: FirebaseAuthValue | undefined;
    renderAuthProvider(auth, (value) => {
      context = value;
    });

    reactAct(() => emitAuthState(auth, null));

    await expect(
      getContext(context).updatePassword({ password: "new-password" }),
    ).rejects.toThrow("A signed-in user is required for this operation.");
    await expect(
      getContext(context).updateName({ name: "New name" }),
    ).rejects.toThrow("A signed-in user is required for this operation.");
    expect(updateProfile).not.toHaveBeenCalled();
  });

  it("publishes a new context value after the display name changes", async () => {
    const user = createUser("user-1", "Old name");
    const auth = createAuth(user);
    let context: FirebaseAuthValue | undefined;
    renderAuthProvider(auth, (value) => {
      context = value;
    });

    reactAct(() => emitAuthState(auth, user));
    expect(getContext(context).currentUser?.displayName).toBe("Old name");

    await reactAct(async () => {
      await getContext(context).updateName({ name: "New name" });
    });

    expect(getContext(context).currentUser?.displayName).toBe("New name");
    expect(updateProfile).toHaveBeenCalledWith(user, {
      displayName: "New name",
    });
  });

  it("returns the created credential when only the profile update fails", async () => {
    const user = createUser("user-2");
    const userCredential = { user } as UserCredential;
    const profileError = new Error("profile update failed");
    firebaseAuthMocks.createUserWithEmailAndPassword.mockResolvedValue(
      userCredential,
    );
    firebaseAuthMocks.updateProfile.mockRejectedValue(profileError);

    const auth = createAuth();
    let context: FirebaseAuthValue | undefined;
    renderAuthProvider(auth, (value) => {
      context = value;
    });
    let signUpResult: FirebaseAuthSignUpResult | undefined;

    await reactAct(async () => {
      signUpResult = await getContext(context).signUp({
        email: "user@example.com",
        password: "password",
        username: "New user",
      });
    });

    expect(signUpResult).toEqual({
      userCredential,
      profileUpdate: "failed",
      profileError,
    });
  });

  it("propagates account-creation errors without attempting a profile update", async () => {
    const authError = new Error("account creation failed");
    firebaseAuthMocks.createUserWithEmailAndPassword.mockRejectedValue(
      authError,
    );

    const auth = createAuth();
    let context: FirebaseAuthValue | undefined;
    renderAuthProvider(auth, (value) => {
      context = value;
    });

    await expect(
      getContext(context).signUp({
        email: "user@example.com",
        password: "password",
        username: "New user",
      }),
    ).rejects.toBe(authError);
    expect(updateProfile).not.toHaveBeenCalled();
  });

  it("clears the previous user while a new Auth instance initializes", () => {
    const firstUser = createUser("user-1", "First user");
    const secondUser = createUser("user-2", "Second user");
    const firstAuth = createAuth(firstUser);
    const secondAuth = createAuth(secondUser);
    let context: FirebaseAuthValue | undefined;
    const provider = renderAuthProvider(firstAuth, (value) => {
      context = value;
    });

    const firstListener = authListeners.get(firstAuth);
    if (!firstListener) {
      throw new Error("First auth-state listener was not registered.");
    }
    reactAct(() => firstListener(firstUser));
    expect(getContext(context).currentUser).toBe(firstUser);

    provider.rerender(secondAuth);

    expect(getContext(context).isInitialized).toBe(false);
    expect(getContext(context).currentUser).toBeUndefined();

    reactAct(() => firstListener(null));
    expect(getContext(context).currentUser).toBeUndefined();

    reactAct(() => emitAuthState(secondAuth, secondUser));
    expect(getContext(context).isInitialized).toBe(true);
    expect(getContext(context).currentUser).toBe(secondUser);
  });
});