import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { FirebaseAppHelper } from "../firebaseApp";

export type FirebaseStorageUploadInput = {
  file: File;
  path?: string;
  fileName?: string;
};

export class FirebaseStorageHelper {
  static uploadImage = async (
    input: FirebaseStorageUploadInput,
  ): Promise<string> => {
    if (!input.file.type.startsWith("image/")) {
      throw new Error("File must be an image");
    }

    return await this.uploadFile({
      ...input,
      path: input.path ?? "images",
    });
  };

  static uploadFile = async (
    input: FirebaseStorageUploadInput,
  ): Promise<string> => {
    const path = input.path ?? "files";
    const pathSegments = path.split("/");
    if (
      path.startsWith("/") ||
      path.endsWith("/") ||
      path.includes("\\") ||
      pathSegments.some(
        (segment) => segment === "" || segment === "." || segment === "..",
      )
    ) {
      throw new Error(
        "Storage path must contain non-empty relative folder segments.",
      );
    }

    const app = FirebaseAppHelper.getApp();
    if (!app) {
      throw new Error(
        "Wrap the application in FirebaseProvider before using Firebase Storage.",
      );
    }

    const storage = getStorage(app);
    const fileName = input.fileName ?? input.file.name;

    const safeName = fileName
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[\\/\u0000-\u001f\u007f]/g, "-")
      .replace(/\s+/g, "-");

    const webCrypto = globalThis.crypto;
    if (!webCrypto?.randomUUID) {
      throw new Error(
        "File uploads require crypto.randomUUID(), which is only available in secure contexts.",
      );
    }

    const fileRef = ref(
      storage,
      `${path}/${webCrypto.randomUUID()}-${safeName}`,
    );

    await uploadBytes(fileRef, input.file);

    const url = await getDownloadURL(fileRef);

    return url;
  };
}
