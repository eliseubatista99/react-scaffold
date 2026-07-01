import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";

export class FirebaseStorageHelper {
  static uploadImage = async (file: File, path = "images"): Promise<string> => {
    if (!file.type.startsWith("image/")) {
      throw new Error("File must be an image");
    }

    return await this.uploadFile(file, path);
  };

  static uploadFile = async (file: File, path = "files"): Promise<string> => {
    const storage = getStorage();

    const safeName = file.name
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, "-");

    const fileRef = ref(storage, `${path}/${crypto.randomUUID()}-${safeName}`);

    await uploadBytes(fileRef, file);

    const url = await getDownloadURL(fileRef);

    return url;
  };
}
