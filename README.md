# React Scaffold

Reusable React and TypeScript libraries for common application UI, navigation,
PDF generation, CV templates, and Firebase workflows.

This repository contains four independently published npm packages. The
repository root is a development workspace for their Storybook stories; it is
not itself an application starter or published package.

## Packages

| Package | What it provides | Documentation |
| --- | --- | --- |
| `@eliseubatista99/react-scaffold-core` | UI components, hooks, helpers, forms, feedback, and navigation | [Core README](src/packages/core/README.md) |
| `@eliseubatista99/react-scaffold-pdf` | PDF generation, preview, and rendering | [PDF README](src/packages/pdf/README.md) |
| `@eliseubatista99/react-scaffold-cv` | CV data types, templates, preview, and PDF generation | [CV README](src/packages/cv/README.md) |
| `@eliseubatista99/react-scaffold-firebase` | React providers and helpers for Firebase Auth, Firestore, and Storage | [Firebase README](src/packages/firebase/README.md) |

Install only the package or packages your application needs. The CV package
builds on the Core and PDF packages; see its README for the compatible peer
dependency versions.

## Requirements

- React 19
- A package manager that supports the dependencies listed by the package you
  use
- Compatible peer dependencies for that package (documented in its README)

## Installation

For example, to add the Core package to an existing React application:

```sh
npm install @eliseubatista99/react-scaffold-core
```

Follow the selected package's README for its complete peer dependency list,
setup instructions, and usage examples.

## Development

The root workspace uses Yarn 4.10.3. From the repository root:

```sh
corepack enable
yarn install
yarn storybook
```

Storybook runs at `http://localhost:6006` and includes stories from the
packages. The root-level Vite application is retained as workspace boilerplate;
the library stories are the main showcase.

Useful root scripts:

```sh
yarn typecheck             # Type-check the root app and Vite configuration
yarn typecheck:packages    # Type-check all four package projects
yarn build                 # Build the root Vite app and Storybook
yarn build-storybook       # Build Storybook only
```

Each package is also a standalone project with its own `package.json` and
lockfile. To work on one package, change to its directory, install its
dependencies, and run the scripts declared in that package:

```sh
cd src/packages/core
npm ci
npm run build
npm test
```

The Core and Firebase packages define test scripts. Check the package
`package.json` before running a script in another package.

## Contributing

1. Fork the repository and create a branch for your change.
2. Make changes in the relevant package and update its documentation or stories
   when behavior or public APIs change.
3. Run the relevant type checks, tests, and build.
4. Open a pull request with a concise summary and verification details.

For questions or bug reports, use
[GitHub Issues](https://github.com/eliseubatista99/react-scaffold/issues).

## License

This project is distributed under the [MIT License](LICENSE).
