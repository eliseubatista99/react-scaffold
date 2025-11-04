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
      name: "MyComponentLibrary",
      formats: ["es", "cjs"],
      fileName: (format) => `index.${format}.js`,
    },
    rollupOptions: {
      external: ["react", "react-dom"], // evita que estas libs sejam incluídas no bundle
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
