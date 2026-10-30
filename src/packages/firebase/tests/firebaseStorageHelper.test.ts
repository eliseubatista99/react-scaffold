import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { FirebaseStorageHelper } from "../src/helpers/firebaseStorage/firebaseStorageHelper";

const storageMocks = vi.hoisted(() => ({
  getDownloadURL: vi.fn(),
  getStorage: vi.fn(),
  ref: vi.fn(),
  uploadBytes: vi.fn(),
}));

const firebaseAppHelperMocks = vi.hoisted(() => ({
  getApp: vi.fn(),
}));

vi.mock("firebase/storage", () => storageMocks);
vi.mock("../src/helpers/firebaseApp", () => ({
  FirebaseAppHelper: firebaseAppHelperMocks,
}));

describe("FirebaseStorageHelper", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  beforeEach(() => {
    vi.clearAllMocks();
    storageMocks.getStorage.mockReturnValue({});
    storageMocks.ref.mockReturnValue({});
    storageMocks.uploadBytes.mockResolvedValue(undefined);
    storageMocks.getDownloadURL.mockResolvedValue("https://example.com/file");
    firebaseAppHelperMocks.getApp.mockReturnValue({});
  });

  it("uses the default image path without mutating the input", async () => {
    const input = {
      file: new File(["image"], "photo.png", { type: "image/png" }),
    };

    await expect(FirebaseStorageHelper.uploadImage(input)).resolves.toBe(
      "https://example.com/file",
    );

    expect(input).not.toHaveProperty("path");
    expect(ref).toHaveBeenCalledWith(
      expect.anything(),
      expect.stringMatching(/^images\/.*-photo\.png$/),
    );
    expect(uploadBytes).toHaveBeenCalledOnce();
    expect(getDownloadURL).toHaveBeenCalledOnce();
    expect(getStorage).toHaveBeenCalledOnce();
  });

  it("rejects non-image files before accessing Firebase Storage", async () => {
    await expect(
      FirebaseStorageHelper.uploadImage({
        file: new File(["text"], "notes.txt", { type: "text/plain" }),
      }),
    ).rejects.toThrow("File must be an image");

    expect(firebaseAppHelperMocks.getApp).not.toHaveBeenCalled();
    expect(getStorage).not.toHaveBeenCalled();
    expect(uploadBytes).not.toHaveBeenCalled();
  });

  it("uses the declared MIME type without inspecting the file contents", async () => {
    const file = new File(["not an image"], "image.png", {
      type: "image/png",
    });

    await expect(FirebaseStorageHelper.uploadImage({ file })).resolves.toBe(
      "https://example.com/file",
    );

    expect(uploadBytes).toHaveBeenCalledWith(expect.anything(), file);
  });

  it("requires an initialized Firebase app", async () => {
    firebaseAppHelperMocks.getApp.mockReturnValue(null);

    await expect(
      FirebaseStorageHelper.uploadFile({
        file: new File(["file"], "file.txt"),
      }),
    ).rejects.toThrow(
      "Wrap the application in FirebaseProvider before using Firebase Storage.",
    );

    expect(getStorage).not.toHaveBeenCalled();
  });

  it("reports when crypto.randomUUID is unavailable", async () => {
    vi.stubGlobal("crypto", {});

    await expect(
      FirebaseStorageHelper.uploadFile({
        file: new File(["file"], "file.txt"),
      }),
    ).rejects.toThrow(
      "File uploads require crypto.randomUUID(), which is only available in secure contexts.",
    );

    expect(ref).not.toHaveBeenCalled();
    expect(uploadBytes).not.toHaveBeenCalled();
  });

  it("allows nested folders and sanitizes file names to one path segment", async () => {
    const input = {
      file: new File(["file"], "original.txt"),
      path: "documents/reports",
      fileName: "../annual\\report\r\n.pdf",
    };

    await FirebaseStorageHelper.uploadFile(input);

    expect(ref).toHaveBeenCalledWith(
      expect.anything(),
      expect.stringMatching(/^documents\/reports\/.*-..-annual-report--\.pdf$/),
    );
    expect(input.fileName).toBe("../annual\\report\r\n.pdf");
  });

  it("propagates upload failures without requesting a download URL", async () => {
    const uploadError = new Error("Upload failed");
    storageMocks.uploadBytes.mockRejectedValue(uploadError);

    await expect(
      FirebaseStorageHelper.uploadFile({
        file: new File(["file"], "file.txt"),
      }),
    ).rejects.toBe(uploadError);

    expect(getDownloadURL).not.toHaveBeenCalled();
  });

  it("propagates download URL failures", async () => {
    const urlError = new Error("Download URL failed");
    storageMocks.getDownloadURL.mockRejectedValue(urlError);

    await expect(
      FirebaseStorageHelper.uploadFile({
        file: new File(["file"], "file.txt"),
      }),
    ).rejects.toBe(urlError);
  });

  it.each([
    "/images",
    "images/",
    "images//thumbnails",
    "../images",
    "images/../private",
    "images\\thumbnails",
  ])("rejects invalid storage paths: %s", async (path) => {
    await expect(
      FirebaseStorageHelper.uploadFile({
        file: new File(["file"], "file.txt"),
        path,
      }),
    ).rejects.toThrow(
      "Storage path must contain non-empty relative folder segments.",
    );

    expect(getStorage).not.toHaveBeenCalled();
  });
});
