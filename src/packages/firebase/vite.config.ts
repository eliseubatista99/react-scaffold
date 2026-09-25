import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  plugins: [
    react(),
    dts({ insertTypesEntry: true }), // Gera ficheiros .d.ts,
  ],
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      name: "MyComponentLibrary",
      formats: ["es", "cjs"],
      fileName: (format) => `index.${format}.js`,
    },
    rollupOptions: {
      external: [
        "react",
        "react-dom",
        "firebase/app",
        "firebase/firestore",
        "firebase/auth",
        "firebase/storage",
        "firebase/functions",
        "firebase/compat/app",
        "firebase/compat/firestore",
        "firebase/compat/auth",
        "firebase/compat/storage",
        "firebase/compat/functions",
      ], // evita que estas libs sejam incluídas no bundle
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
        },
      },
    },
    outDir: "dist",
  },
  optimizeDeps: {
    include: [
      "firebase/app",
      "firebase/firestore",
      "firebase/auth",
      "firebase/storage",
      "firebase/functions",
    ],
    exclude: [
      "firebase/compat/app",
      "firebase/compat/firestore",
      "firebase/compat/auth",
      "firebase/compat/storage",
      "firebase/compat/functions",
    ],
  },
});
