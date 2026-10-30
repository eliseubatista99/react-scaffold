import react from "@vitejs/plugin-react";
import path from "path";
import dts from "vite-plugin-dts";
import { defineConfig } from "vite";

const externalPeerDependencies = [
  "@eliseubatista99/react-scaffold-core",
  "@eliseubatista99/react-scaffold-pdf",
  "@react-pdf/renderer",
  "react",
  "react-dom",
];

export default defineConfig({
  plugins: [react(), dts({ insertTypesEntry: true })],
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      name: "ReactScaffoldCv",
      formats: ["es", "cjs"],
      fileName: (format) => `index.${format}.js`,
    },
    rollupOptions: {
      external: (id) =>
        externalPeerDependencies.some(
          (dependency) =>
            id === dependency ||
            ((dependency === "react" || dependency === "react-dom") &&
              id.startsWith(`${dependency}/`))
        ),
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
        },
      },
    },
    outDir: "dist",
  },
});
