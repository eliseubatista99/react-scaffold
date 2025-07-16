import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  getFirestore,
  updateDoc,
} from "firebase/firestore";
import { FirebaseAppHelper } from "../../helpers";

export const userFirestore = () => {
  const firestore = () => {
    const app = FirebaseAppHelper.getApp();

    return getFirestore(app!);
  };

  const getItem = async <TOutput extends object>(
    collectionName: string,
    path: string
  ) => {
    const collectionRef = collection(firestore(), collectionName);
    const data = doc(collectionRef, path);

    return data as TOutput;
  };

  const getItems = async <TOutput extends object>(
    collectionName: string,
    predicate?: (data: TOutput) => boolean
  ) => {
    const collectionRef = collection(firestore(), collectionName);

    const data = await getDocs(collectionRef);

    let mappedData = data.docs.map((doc) => doc as TOutput);

    if (predicate) {
      mappedData = mappedData.filter((doc) => predicate(doc));
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
    getItem,
    getItems,
    updateItem,
    deleteItem,
  };
};
