import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";

type UploadFileInput = {
  file: File;
  path?: string;
  fileName?: string;
};

export class FirebaseStorageHelper {
  static uploadImage = async (input: UploadFileInput): Promise<string> => {
    if (!input.file.type.startsWith("image/")) {
      throw new Error("File must be an image");
    }

    input.path = input.path ?? "images";

    return await this.uploadFile(input);
  };

  static uploadFile = async (input: UploadFileInput): Promise<string> => {
    const storage = getStorage();
    const fileName = input.fileName ?? input.file.name;
    const path = input.path ?? "files";

    const safeName = fileName
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, "-");

    const fileRef = ref(storage, `${path}/${crypto.randomUUID()}-${safeName}`);

    await uploadBytes(fileRef, input.file);

    const url = await getDownloadURL(fileRef);

    return url;
  };
}
