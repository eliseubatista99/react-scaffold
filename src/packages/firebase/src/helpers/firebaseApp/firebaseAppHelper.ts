import {
  type FirebaseApp,
  type FirebaseOptions,
  getApps,
  initializeApp,
} from "firebase/app";

export class FirebaseAppHelper {
  static initializeApp = (options: FirebaseOptions): FirebaseApp => {
    const app = this.getApp();
    if (app) {
      const optionsMatch =
        Object.entries(app.options).every(
          ([key, value]) =>
            options[key as keyof FirebaseOptions] === value,
        ) &&
        Object.entries(options).every(
          ([key, value]) =>
            app.options[key as keyof FirebaseOptions] === value,
        );

      if (!optionsMatch) {
        throw new Error(
          "The default Firebase app is already initialized with different options.",
        );
      }

      return app;
    }

    return initializeApp(options);
  };

  static getApp = (): FirebaseApp | null => {
    return getApps().find((app) => app.name === "[DEFAULT]") ?? null;
  };

  static isAppInitialized = (): boolean => {
    return this.getApp() !== null;
  };
}
