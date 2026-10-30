import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  setDoc,
  type QueryConstraint,
  type UpdateData,
  updateDoc,
  writeBatch,
} from "firebase/firestore";
import { FirebaseAppHelper } from "../../helpers";

const MAX_FIRESTORE_BATCH_SIZE = 500;

export type FirestoreItem<T> = {
  id: string;
  data: T;
};

export type FirestoreDataParser<T> = (value: unknown) => T;

export type FirestoreQueryOptions<T> = {
  constraints?: QueryConstraint[];
  parse: FirestoreDataParser<T>;
  predicate?: (data: T) => boolean;
};

const applyConstraints = (
  collectionRef: ReturnType<typeof collection>,
  constraints?: QueryConstraint[],
) =>
  constraints?.length ? query(collectionRef, ...constraints) : collectionRef;

export const useFirestore = () => {
  const firestore = () => {
    const app = FirebaseAppHelper.getApp();
    if (!app) {
      throw new Error(
        "Wrap the application in FirebaseProvider before using Firestore.",
      );
    }

    return getFirestore(app);
  };

  const addItem = async <TOutput extends object>(
    collectionName: string,
    path: string,
    item: TOutput,
  ) => {
    const collectionRef = collection(firestore(), collectionName);
    const documentRef = doc(collectionRef, path);

    await setDoc(documentRef, { ...item });
  };

  const getItem = async <TOutput extends object>(
    collectionName: string,
    path: string,
    parse: FirestoreDataParser<TOutput>,
  ): Promise<FirestoreItem<TOutput> | null> => {
    const collectionRef = collection(firestore(), collectionName);
    const documentRef = doc(collectionRef, path);
    const snapshot = await getDoc(documentRef);

    if (!snapshot.exists()) {
      return null;
    }

    return { id: snapshot.id, data: parse(snapshot.data()) };
  };

  const getItems = async <TOutput extends object>(
    collectionName: string,
    options?: Partial<FirestoreQueryOptions<TOutput>>,
  ): Promise<FirestoreItem<TOutput>[]> => {
    const { constraints, parse, predicate } = options ?? {};
    const collectionRef = collection(firestore(), collectionName);
    const snapshot = await getDocs(applyConstraints(collectionRef, constraints));
    const parseData = parse ?? ((value: unknown) => value as TOutput);

    const items = snapshot.docs
      .filter((document) => document.exists())
      .map((document): FirestoreItem<TOutput> => ({
        id: document.id,
        data: parseData(document.data()),
      }));

    return predicate
      ? items.filter((item) => predicate(item.data))
      : items;
  };

  const updateItem = async <TOutput extends object>(
    collectionName: string,
    path: string,
    newValues: UpdateData<TOutput>,
  ) => {
    const collectionRef = collection(firestore(), collectionName);
    const documentRef = doc(collectionRef, path);

    await updateDoc(documentRef, newValues);
  };

  const deleteItem = async (collectionName: string, path: string) => {
    const collectionRef = collection(firestore(), collectionName);
    const documentRef = doc(collectionRef, path);

    await deleteDoc(documentRef);
  };

  const updateManyItems = async <TOutput extends object>(
    collectionName: string,
    options: FirestoreQueryOptions<TOutput>,
    newValues: UpdateData<TOutput>,
  ) => {
    const { constraints, parse, predicate } = options;
    if (!predicate && !constraints?.length) {
      throw new Error(
        "updateManyItems requires a predicate or at least one Firestore query constraint.",
      );
    }

    const db = firestore();
    const collectionRef = collection(db, collectionName);
    const snapshot = await getDocs(applyConstraints(collectionRef, constraints));
    const documentsToUpdate = snapshot.docs.filter((document) => {
      if (!document.exists()) {
        return false;
      }

      const data = parse(document.data());
      return predicate ? predicate(data) : true;
    });

    for (
      let offset = 0;
      offset < documentsToUpdate.length;
      offset += MAX_FIRESTORE_BATCH_SIZE
    ) {
      const batch = writeBatch(db);
      const batchDocuments = documentsToUpdate.slice(
        offset,
        offset + MAX_FIRESTORE_BATCH_SIZE,
      );

      batchDocuments.forEach((document) => {
        batch.update(document.ref, newValues);
      });

      await batch.commit();
    }

    return documentsToUpdate.length;
  };

  return {
    addItem,
    getItem,
    getItems,
    updateItem,
    deleteItem,
    updateManyItems,
  };
};
