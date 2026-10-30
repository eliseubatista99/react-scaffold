import {
  type FirebaseApp,
  type FirebaseOptions,
  getApps,
  initializeApp,
} from "firebase/app";

export class FirebaseAppHelper {
  private static app: FirebaseApp | null = null;

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

    this.app = initializeApp(options);
    return this.app;
  };

  static getApp = (): FirebaseApp | null => {
    if (this.app === null) {
      this.app = getApps().find((app) => app.name === "[DEFAULT]") ?? null;
    }

    return this.app;
  };

  static isAppInitialized = (): boolean => {
    return this.getApp() !== null;
  };
}
