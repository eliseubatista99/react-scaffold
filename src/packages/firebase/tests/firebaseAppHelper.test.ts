import type { FirebaseApp } from "firebase/app";
import { beforeEach, describe, expect, it, vi } from "vitest";

const firebaseAppMocks = vi.hoisted(() => ({
  getApps: vi.fn(),
  initializeApp: vi.fn(),
}));

vi.mock("firebase/app", () => firebaseAppMocks);

describe("FirebaseAppHelper", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
  });

  it("reuses the default app when all options match", async () => {
    const options = { apiKey: "api-key", projectId: "project-id" };
    const app = {
      name: "[DEFAULT]",
      options,
    } as FirebaseApp;
    firebaseAppMocks.getApps.mockReturnValue([app]);

    const { FirebaseAppHelper } = await import(
      "../src/helpers/firebaseApp/firebaseAppHelper"
    );

    expect(FirebaseAppHelper.initializeApp(options)).toBe(app);
    expect(firebaseAppMocks.initializeApp).not.toHaveBeenCalled();
  });

  it("rejects partial options when the existing app has omitted values", async () => {
    const app = {
      name: "[DEFAULT]",
      options: { apiKey: "api-key", projectId: "project-id" },
    } as FirebaseApp;
    firebaseAppMocks.getApps.mockReturnValue([app]);

    const { FirebaseAppHelper } = await import(
      "../src/helpers/firebaseApp/firebaseAppHelper"
    );

    expect(() =>
      FirebaseAppHelper.initializeApp({ apiKey: "api-key" }),
    ).toThrow(
      "The default Firebase app is already initialized with different options.",
    );
    expect(firebaseAppMocks.initializeApp).not.toHaveBeenCalled();
  });

  it("rejects conflicting options", async () => {
    const app = {
      name: "[DEFAULT]",
      options: { apiKey: "existing-key", projectId: "project-id" },
    } as FirebaseApp;
    firebaseAppMocks.getApps.mockReturnValue([app]);

    const { FirebaseAppHelper } = await import(
      "../src/helpers/firebaseApp/firebaseAppHelper"
    );

    expect(() =>
      FirebaseAppHelper.initializeApp({
        apiKey: "different-key",
        projectId: "project-id",
      }),
    ).toThrow(
      "The default Firebase app is already initialized with different options.",
    );
  });

  it("does not return a default app after Firebase has removed it", async () => {
    const app = {
      name: "[DEFAULT]",
      options: { apiKey: "api-key", projectId: "project-id" },
    } as FirebaseApp;
    firebaseAppMocks.getApps.mockReturnValue([app]);

    const { FirebaseAppHelper } = await import(
      "../src/helpers/firebaseApp/firebaseAppHelper"
    );

    expect(FirebaseAppHelper.getApp()).toBe(app);

    firebaseAppMocks.getApps.mockReturnValue([]);

    expect(FirebaseAppHelper.getApp()).toBeNull();
  });

  it("initializes a new default app after the previous app was removed", async () => {
    const oldApp = {
      name: "[DEFAULT]",
      options: { apiKey: "api-key", projectId: "project-id" },
    } as FirebaseApp;
    const newApp = {
      name: "[DEFAULT]",
      options: { apiKey: "api-key", projectId: "project-id" },
    } as FirebaseApp;
    const options = { apiKey: "api-key", projectId: "project-id" };
    firebaseAppMocks.getApps.mockReturnValue([oldApp]);

    const { FirebaseAppHelper } = await import(
      "../src/helpers/firebaseApp/firebaseAppHelper"
    );

    expect(FirebaseAppHelper.getApp()).toBe(oldApp);

    firebaseAppMocks.getApps.mockReturnValue([]);
    firebaseAppMocks.initializeApp.mockReturnValue(newApp);

    expect(FirebaseAppHelper.initializeApp(options)).toBe(newApp);
    expect(firebaseAppMocks.initializeApp).toHaveBeenCalledWith(options);
  });
});
