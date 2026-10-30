import type { Firestore, QueryConstraint } from "firebase/firestore";
import { getDoc } from "firebase/firestore";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useFirestore } from "../src/hooks/useFirestore/useFirestore.hook";

const firestoreMocks = vi.hoisted(() => ({
  collection: vi.fn(),
  deleteDoc: vi.fn(),
  doc: vi.fn(),
  getDoc: vi.fn(),
  getDocs: vi.fn(),
  getFirestore: vi.fn(),
  query: vi.fn(),
  setDoc: vi.fn(),
  updateDoc: vi.fn(),
  writeBatch: vi.fn(),
}));

const firebaseAppHelperMocks = vi.hoisted(() => ({
  getApp: vi.fn(),
}));
const committedBatches: Array<{
  update: ReturnType<typeof vi.fn>;
  commit: ReturnType<typeof vi.fn>;
}> = [];

vi.mock("firebase/firestore", () => firestoreMocks);
vi.mock("../src/helpers", () => ({
  FirebaseAppHelper: firebaseAppHelperMocks,
}));

const parseUserData = (value: unknown): { name: string } => {
  if (
    typeof value !== "object" ||
    value === null ||
    !("name" in value) ||
    typeof value.name !== "string"
  ) {
    throw new Error("Invalid user document.");
  }

  return { name: value.name };
};

const parseActiveUserData = (value: unknown): { active: boolean } => {
  if (
    typeof value !== "object" ||
    value === null ||
    !("active" in value) ||
    typeof value.active !== "boolean"
  ) {
    throw new Error("Invalid user document.");
  }

  return { active: value.active };
};

describe("useFirestore", () => {
  const firestoreInstance = {} as Firestore;
  const collectionReference = {};
  const documentReference = { id: "user-1" };
  const queryReference = {};

  beforeEach(() => {
    vi.clearAllMocks();
    committedBatches.length = 0;
    firebaseAppHelperMocks.getApp.mockReturnValue({});
    firestoreMocks.getFirestore.mockReturnValue(firestoreInstance);
    firestoreMocks.collection.mockReturnValue(collectionReference);
    firestoreMocks.doc.mockReturnValue(documentReference);
    firestoreMocks.query.mockReturnValue(queryReference);
    firestoreMocks.writeBatch.mockImplementation(() => {
      const batch = {
        update: vi.fn(),
        commit: vi.fn().mockResolvedValue(undefined),
      };
      committedBatches.push(batch);
      return batch;
    });
  });

  it("returns the document id and data when the document exists", async () => {
    const userData = { name: "Ada" };
    firestoreMocks.getDoc.mockResolvedValue({
      exists: () => true,
      id: "user-1",
      data: () => userData,
    });

    const { getItem } = useFirestore();

    await expect(getItem("users", "user-1", parseUserData)).resolves.toEqual({
      id: "user-1",
      data: userData,
    });
    expect(getDoc).toHaveBeenCalledWith(documentReference);
  });

  it("returns null when the document does not exist", async () => {
    firestoreMocks.getDoc.mockResolvedValue({
      exists: () => false,
      id: "missing-user",
      data: vi.fn(),
    });

    const { getItem } = useFirestore();

    await expect(
      getItem("users", "missing-user", parseUserData),
    ).resolves.toBeNull();
    expect(getDoc).toHaveBeenCalledWith(documentReference);
  });

  it("rejects documents that fail runtime parsing", async () => {
    firestoreMocks.getDoc.mockResolvedValue({
      exists: () => true,
      id: "user-1",
      data: () => ({ name: 42 }),
    });

    const { getItem } = useFirestore();

    await expect(
      getItem("users", "user-1", parseUserData),
    ).rejects.toThrow("Invalid user document.");
  });

  it("applies Firestore constraints before reading items", async () => {
    const queryConstraint = {} as QueryConstraint;
    const userData = { active: true };
    firestoreMocks.getDocs.mockResolvedValue({
      docs: [
        {
          exists: () => true,
          id: "user-1",
          data: () => userData,
        },
      ],
    });

    const { getItems } = useFirestore();
    const items = await getItems("users", {
      constraints: [queryConstraint],
      parse: parseActiveUserData,
      predicate: (data) => data.active,
    });

    expect(firestoreMocks.query).toHaveBeenCalledWith(
      collectionReference,
      queryConstraint,
    );
    expect(firestoreMocks.getDocs).toHaveBeenCalledWith(queryReference);
    expect(items).toEqual([{ id: "user-1", data: userData }]);
  });

  it("returns raw documents when getItems is called without options", async () => {
    const userData = { name: "Ada" };
    firestoreMocks.getDocs.mockResolvedValue({
      docs: [
        {
          exists: () => true,
          id: "user-1",
          data: () => userData,
        },
      ],
    });

    const { getItems } = useFirestore();
    const items = await getItems<{ name: string }>("users");

    expect(firestoreMocks.getDocs).toHaveBeenCalledWith(collectionReference);
    expect(items).toEqual([{ id: "user-1", data: userData }]);
  });

  it("applies Firestore constraints before updating matching items", async () => {
    const queryConstraint = {} as QueryConstraint;
    const documentReference = { id: "user-1" };
    const update = vi.fn();
    const commit = vi.fn().mockResolvedValue(undefined);
    firestoreMocks.getDocs.mockResolvedValue({
      docs: [
        {
          exists: () => true,
          ref: documentReference,
          data: () => ({ active: true }),
        },
      ],
    });
    firestoreMocks.writeBatch.mockReturnValue({ update, commit });

    const { updateManyItems } = useFirestore();
    const updatedCount = await updateManyItems<{ active: boolean }>(
      "users",
      { constraints: [queryConstraint], parse: parseActiveUserData },
      { active: false },
    );

    expect(firestoreMocks.query).toHaveBeenCalledWith(
      collectionReference,
      queryConstraint,
    );
    expect(firestoreMocks.getDocs).toHaveBeenCalledWith(queryReference);
    expect(updatedCount).toBe(1);
    expect(update).toHaveBeenCalledWith(documentReference, { active: false });
  });

  it("splits updateManyItems into batches of at most 500 writes", async () => {
    firestoreMocks.getDocs.mockResolvedValue({
      docs: Array.from({ length: 501 }, (_, index) => ({
        exists: () => true,
        ref: { id: `user-${index}` },
        data: () => ({ active: true }),
      })),
    });

    const { updateManyItems } = useFirestore();
    const updatedCount = await updateManyItems<{ active: boolean }>(
      "users",
      { parse: parseActiveUserData, predicate: () => true },
      { active: false },
    );

    expect(updatedCount).toBe(501);
    expect(firestoreMocks.writeBatch).toHaveBeenCalledTimes(2);
    expect(committedBatches[0].update).toHaveBeenCalledTimes(500);
    expect(committedBatches[1].update).toHaveBeenCalledTimes(1);
    expect(committedBatches[0].commit).toHaveBeenCalledOnce();
    expect(committedBatches[1].commit).toHaveBeenCalledOnce();
  });
});