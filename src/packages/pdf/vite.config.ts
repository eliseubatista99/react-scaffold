import react from "@vitejs/plugin-react";
import path from "path";
import dts from "vite-plugin-dts";

import { createRequire } from "node:module";

import { defineConfig, normalizePath } from "vite";
import { viteStaticCopy } from "vite-plugin-static-copy";

const require = createRequire(import.meta.url);

const pdfjsDistPath = path.dirname(require.resolve("pdfjs-dist/package.json"));
const cMapsDir = normalizePath(path.join(pdfjsDistPath, "cmaps"));
const standardFontsDir = normalizePath(
  path.join(
    path.dirname(require.resolve("pdfjs-dist/package.json")),
    "standard_fonts"
  )
);
const externalPeerDependencies = [
  "@react-pdf/renderer",
  "react",
  "react-dom",
  "react-pdf",
];

export default defineConfig({
  plugins: [
    react(),
    dts({ insertTypesEntry: true }), // Gera ficheiros .d.ts
    viteStaticCopy({
      targets: [
        {
          src: cMapsDir,
          dest: "",
        },
        {
          src: standardFontsDir,
          dest: "",
        },
      ],
    }),
  ],
  assetsInclude: ["**/*.pdf"],
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      name: "ReactScaffoldPdf",
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
