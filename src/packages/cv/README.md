# @eliseubatista99/react-scaffold-cv

Create and preview résumé PDFs from typed CV data. The package includes three
A4 layouts — Classic, Modern, and Timeline — with English and Portuguese
template labels.

## Requirements

The package declares these peer dependencies:

| Peer dependency | Version |
| --- | --- |
| `@eliseubatista99/react-scaffold-core` | `^1.1.0` |
| `@eliseubatista99/react-scaffold-pdf` | `^1.0.1` |
| `@react-pdf/renderer` | `^4.3.0` |
| `react` | `^19.1.0` |
| `react-dom` | `^19.1.0` |
| `react-pdf` | `^10.0.1` |
| `react-router-dom` | `^7.6.3` |
| `react-to-pdf` | `^2.0.1` |

Install compatible Core and PDF versions along with the other peer dependencies
used by your application. The package's peer version ranges are authoritative.

## Installation

```sh
npm install @eliseubatista99/react-scaffold-cv \
  @eliseubatista99/react-scaffold-core@^1.1.0 \
  @eliseubatista99/react-scaffold-pdf@^1.0.1 \
  @react-pdf/renderer@^4.3.0 react@^19.1.0 react-dom@^19.1.0 \
  react-pdf@^10.0.1 react-router-dom@^7.6.3 react-to-pdf@^2.0.1
```

## Quick start

`CurriculumVitae` renders a preview using one of the package's templates:

```tsx
import {
  CurriculumVitae,
  type CvData,
} from "@eliseubatista99/react-scaffold-cv";

const data: CvData = {
  personalInfo: {
    name: "Jane Doe",
    city: "Lisbon",
    postalCode: "1000-001",
    email: "jane@example.com",
    countryCode: "+351",
    phone: "910000000",
    desiredRole: { en: "Software Developer", pt: "Programadora" },
  },
  resume: {
    en: "Software developer focused on accessible web applications.",
    pt: "Programadora focada em aplicações web acessíveis.",
  },
};

export function CVExample() {
  return (
    <CurriculumVitae
      template="modern"
      language="en"
      data={data}
      theme={{ color: "#0f766e" }}
    />
  );
}
```

## Public API

- `CurriculumVitae` — render a CV preview.
- `useCVGenerator` — generate, download, or preview a CV PDF.
- `useGetCVDocument` — create a PDF document from CV data and a template.
- `CvTemplates` — access the Classic, Modern, and Timeline templates.
- `CvData` and related exported types — describe CV content and template
  configuration.

CV fields that support translations accept language-to-string objects, for
example `{ en: "Developer", pt: "Programador" }`. The templates use A4 pages;
layout and PDF document options can be customized through the component and
generator props.

## Development

Run these commands from `src/packages/cv`:

```sh
npm ci
npm run build
npm run lint
```

## License

[MIT](../../../LICENSE)
