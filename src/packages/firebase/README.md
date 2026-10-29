<h1 align="center">Firebase</h1>

---

A React library for Firebase Auth, Firestore, and Storage. `FirebaseProvider` initializes the app and Auth from one configuration object; hooks and helpers use those initialized services.

## Installation

```shell
npm i @eliseubatista99/react-scaffold-firebase
```

@eliseubatista99/react-scaffold-firebase is a React library that provides basic providers, hooks, and helpers to easily integrate your React application with the firebase services and avoid repeating the usual code.

It helps you write applications that behave consistently and are easy to test.

You can use this library together with any other library.

## Quick Start

```tsx
import { FirebaseProvider } from "@eliseubatista99/react-scaffold-firebase";

const firebaseOptions = {
	apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
	authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
	projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
	storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
	appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

<FirebaseProvider options={firebaseOptions}>
	<App />
</FirebaseProvider>;
```

Keep Firebase configuration in environment variables. `FirebaseProvider` is the recommended root wrapper; `FirebaseAuthProvider` remains available for applications that already manage their own `Auth` instance.

## Content

- [Providers](https://github.com/eliseubatista99/react-scaffold/tree/main/src/packages/firebase/src/providers): `FirebaseProvider` initializes the app and Auth; `FirebaseAuthProvider` is available for advanced setups.

- [Hooks](https://github.com/eliseubatista99/react-scaffold/tree/main/src/packages/firebase/src/hooks): Hooks for Firestore operations and auth-gated mount actions.

- [Helpers](https://github.com/eliseubatista99/react-scaffold/tree/main/src/packages/firebase/src/helpers): Storage uploads and low-level app access.

## Change Log

Every release, along with the migration instructions, is documented on the GitHub [Releases](https://github.com/eliseubatista99/react-scaffold/releases) page.
