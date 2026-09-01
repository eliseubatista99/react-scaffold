import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  getFirestore,
  setDoc,
  UpdateData,
  updateDoc,
  writeBatch,
} from "firebase/firestore";
import { FirebaseAppHelper } from "../../helpers";

export type FirestoreItem<T> = {
  id: string;
  data: T;
};

export const useFirestore = () => {
  const firestore = () => {
    const app = FirebaseAppHelper.getApp();

    return getFirestore(app!);
  };

  const addItem = async <TOutput extends object>(
    collectionName: string,
    path: string,
    item: TOutput,
  ) => {
    const collectionRef = collection(firestore(), collectionName);
    const data = doc(collectionRef, path);

    await setDoc(data, { ...item });
  };

  const getItem = async <TOutput extends object>(
    collectionName: string,
    path: string,
  ): Promise<FirestoreItem<TOutput> | null> => {
    const collectionRef = collection(firestore(), collectionName);
    const data = doc(collectionRef, path);

    if (data === null) {
      return null;
    }

    return { id: data.id, data: data as TOutput };
  };

  const getItems = async <TOutput extends object>(
    collectionName: string,
    predicate?: (data: TOutput) => boolean,
  ): Promise<FirestoreItem<TOutput>[]> => {
    const collectionRef = collection(firestore(), collectionName);

    const data = await getDocs(collectionRef);

    const nonNullData = data.docs.filter((doc) => doc.exists());

    let mappedData = nonNullData.map((doc): FirestoreItem<TOutput> => {
      const docData = doc.data() as TOutput;
      return { id: doc.id, data: docData };
    });

    if (predicate) {
      mappedData = mappedData.filter((doc) => predicate(doc.data));
    }

    return mappedData;
  };

  const updateItem = async <TOutput extends object>(
    collectionName: string,
    path: string,
    newValues: Partial<TOutput>,
  ) => {
    const collectionRef = collection(firestore(), collectionName);

    const docRef = doc(collectionRef, path);
    await updateDoc(docRef, newValues as UpdateData<TOutput>);
  };

  const deleteItem = async (collectionName: string, path: string) => {
    const collectionRef = collection(firestore(), collectionName);

    const docRef = doc(collectionRef, path);
    await deleteDoc(docRef);
  };

  const updateManyItems = async <TOutput extends object>(
    collectionName: string,
    predicate: (data: TOutput) => boolean,
    newValues: Partial<TOutput>,
  ) => {
    const db = firestore();
    const collectionRef = collection(db, collectionName);

    const snapshot = await getDocs(collectionRef);

    const docsToUpdate = snapshot.docs.filter((doc) => {
      if (!doc.exists()) return false;
      const data = doc.data() as TOutput;
      return predicate(data);
    });

    const batch = writeBatch(db);

    docsToUpdate.forEach((doc) => {
      batch.update(doc.ref, newValues as UpdateData<TOutput>);
    });

    await batch.commit();

    return docsToUpdate.length;
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
