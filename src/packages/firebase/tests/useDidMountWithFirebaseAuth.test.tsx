import type { Auth, User } from "firebase/auth";
import { act } from "react";
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
import { useDidMountWithFirebaseAuth } from "../src/hooks/useDidMountWithFirebaseAuth/useDidMountWithFirebaseAuth";

const firebaseAuthMocks = vi.hoisted(() => ({
  onAuthStateChanged: vi.fn(),
}));

vi.mock("firebase/auth", () => firebaseAuthMocks);

type AuthStateListener = (user: User | null) => void;

const mountedRoots: Root[] = [];

const Hook = ({
  action,
  onError,
}: {
  action: () => void | Promise<void>;
  onError?: (error: unknown) => void;
}) => {
  useDidMountWithFirebaseAuth(action, onError);
  return null;
};

const renderHook = (
  auth: Auth,
  action: () => void | Promise<void>,
  onError?: (error: unknown) => void,
) => {
  const root = createRoot(document.createElement("div"));
  mountedRoots.push(root);
  act(() =>
    root.render(
      <FirebaseAuthProvider auth={auth}>
        <Hook action={action} onError={onError} />
      </FirebaseAuthProvider>,
    ),
  );
  return root;
};

describe("useDidMountWithFirebaseAuth", () => {
  let auth: Auth;
  let authStateListener: AuthStateListener | undefined;
  let unsubscribe: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    (globalThis as typeof globalThis & {
      IS_REACT_ACT_ENVIRONMENT: boolean;
    }).IS_REACT_ACT_ENVIRONMENT = true;
    vi.clearAllMocks();

    auth = {} as Auth;
    authStateListener = undefined;
    unsubscribe = vi.fn();

    firebaseAuthMocks.onAuthStateChanged.mockImplementation(
      (_auth: Auth, listener: AuthStateListener) => {
        authStateListener = listener;
        return unsubscribe;
      },
    );
  });

  afterEach(() => {
    for (const root of mountedRoots.splice(0)) {
      act(() => root.unmount());
    }
  });

  it("waits for authentication, runs once, and unsubscribes", () => {
    const action = vi.fn();
    renderHook(auth, action);

    expect(authStateListener).toBeDefined();
    act(() => authStateListener?.(null));
    expect(action).not.toHaveBeenCalled();
    expect(unsubscribe).not.toHaveBeenCalled();

    act(() => authStateListener?.({ uid: "user-1" } as User));
    expect(action).toHaveBeenCalledTimes(1);
    expect(unsubscribe).not.toHaveBeenCalled();

    act(() => authStateListener?.({ uid: "user-2" } as User));
    expect(action).toHaveBeenCalledTimes(1);
  });

  it("unsubscribes on unmount if no user authenticated", () => {
    const root = renderHook(auth, vi.fn());

    act(() => root.unmount());
    mountedRoots.pop();

    expect(unsubscribe).toHaveBeenCalledTimes(1);
  });

  it("reports rejected async actions to onError", async () => {
    const error = new Error("user data load failed");
    const action = vi.fn().mockRejectedValue(error);
    const onError = vi.fn();
    renderHook(auth, action, onError);

    await act(async () => {
      authStateListener?.({ uid: "user-1" } as User);
      await Promise.resolve();
    });

    expect(action).toHaveBeenCalledTimes(1);
    expect(onError).toHaveBeenCalledWith(error);
  });

  it("reports synchronous action errors to onError", () => {
    const error = new Error("user action failed");
    const action = vi.fn(() => {
      throw error;
    });
    const onError = vi.fn();
    renderHook(auth, action, onError);

    act(() => authStateListener?.({ uid: "user-1" } as User));

    expect(onError).toHaveBeenCalledWith(error);
  });
});