import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  getFirestore,
  setDoc,
  updateDoc,
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
    item: TOutput
  ) => {
    const collectionRef = collection(firestore(), collectionName);
    const data = doc(collectionRef, path);

    await setDoc(data, { ...item });
  };

  const getItem = async <TOutput extends object>(
    collectionName: string,
    path: string
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
    predicate?: (data: TOutput) => boolean
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
    newValues: TOutput
  ) => {
    const collectionRef = collection(firestore(), collectionName);

    const docRef = doc(collectionRef, path);
    await updateDoc(docRef, { ...newValues });
  };

  const deleteItem = async (collectionName: string, path: string) => {
    const collectionRef = collection(firestore(), collectionName);

    const docRef = doc(collectionRef, path);
    await deleteDoc(docRef);
  };

  //   const deleteItemFromCollection = async <TOutput extends object>(
  //     collectionName: string,
  //     path: string,
  //     predicate: (data: TOutput) => boolean
  //   ) => {
  //     const collectionRef = collection(firestore(), collectionName);
  //     const docRef = doc(collectionRef, path);

  //     const items = await getItems<TOutput>(collectionName);

  //     const result = items.filter((doc) => predicate(doc));

  //     updateDoc(collectionRef, { favorites });
  //     return result as TOutput[];
  //   };

  return {
    addItem,
    getItem,
    getItems,
    updateItem,
    deleteItem,
  };
};
