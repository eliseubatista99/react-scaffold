import { FirebaseApp, FirebaseOptions, initializeApp } from "firebase/app";

export class FirebaseAppHelper {
  private static app: FirebaseApp | null = null;

  static initializeApp = (options: FirebaseOptions) => {
    if (this.app === null) {
      this.app = initializeApp(options);
    }
  };

  static getApp = (): FirebaseApp | null => {
    return this.app;
  };

  static isAppInitialized = (): boolean => {
    return this.app !== null;
  };
}
