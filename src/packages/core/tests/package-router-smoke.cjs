const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { resolve } = require("node:path");
const React = require("react");
const { renderToString } = require("react-dom/server");
const { MemoryRouter } = require("react-router-dom");
const { NavigationRoutes, useNavigation } = require("../dist/index.cjs.js");

const esmBundle = readFileSync(
  resolve(__dirname, "../dist/index.es.js"),
  "utf8",
);
const cjsBundle = readFileSync(
  resolve(__dirname, "../dist/index.cjs.js"),
  "utf8",
);

assert.match(esmBundle, /from ["']react-router-dom["']/);
assert.match(cjsBundle, /require\(["']react-router-dom["']\)/);

const NavigationPath = () =>
  React.createElement("output", null, useNavigation().currentPath);

const rendered = renderToString(
  React.createElement(
    MemoryRouter,
    { initialEntries: ["/consumer-router-check"] },
    React.createElement(NavigationRoutes, {
      routes: [
        {
          path: "/consumer-router-check",
          render: React.createElement(NavigationPath),
        },
      ],
    }),
  ),
);

assert.match(rendered, /\/consumer-router-check/);
console.log("Built core package shares the consumer MemoryRouter context.");
