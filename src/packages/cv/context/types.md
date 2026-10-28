# CV — Types

`Translation` (from core) = `Record<string, string>`, e.g. `{ en: "Developer", pt: "Programador" }`. Every field typed `Translation` is resolved to a string in the selected language by `useTemplateHelper`; fields typed `string` are rendered as-is in every language.

## `types/cv.ts`

```ts
import { Translation } from "@eliseubatista99/react-scaffold-core";

export type CVTemplateType = "classic" | "modern" | "timeline";

export interface PersonalInfo {
  name: string;
  desiredRole?: Translation;
  city: string;
  postalCode: string;
  email: string;
  countryCode: string;   // e.g. "+351" or "Portugal (+351)" (text inside parentheses is extracted by formatPhone)
  phone: string;
}

export type LinkType = "linkedin" | "github" | "portfolio" | "email" | "phone" | "other";

export interface Link {
  type: LinkType;
  value: string;         // username or URL; converted to a URL by getSocialUrl
}

export type Month = "Jan" | "Feb" | "Mar" | "Apr" | "May" | "Jun" | "Jul" | "Aug" | "Sep" | "Oct" | "Nov" | "Dec";

export interface Experience {
  role: Translation;
  company: string;
  startMonth: Month;
  startYear: string;
  endMonth: Month;
  endYear: string;
  current: boolean;      // true → end date replaced by "Current"/"Present"
  tech: Translation;
  activities: Translation;
  results: Translation;
}

export type EducationType = "secondary" | "technical" | "bachelor" | "postgraduate" | "master" | "phd";
export type EducationStatus = "completed" | "interrupted" | "progress";

export interface Education {
  type: EducationType;
  status: EducationStatus;
  course: Translation;
  institution: string;
  startMonth: Month;
  startYear: string;
  endMonth: Month;
  endYear: string;
  description: Translation;
}

export type LanguageLevel = "a1" | "a2" | "b1" | "b2" | "c1" | "c2" | "native";

export interface Language {     // name clashes with core's `Language` (string) type
  name: Translation;
  level: LanguageLevel;
}

export interface Certification {
  name: Translation;
  issuer: string;
  completionDate: string;  // free text, rendered as-is
  hours: string;           // not rendered by any template
  validationLink: string;
  description: Translation;
}

export interface Project {
  name: string;
  description: Translation;
  link: string;
  sourceCode?: string;
  tech: Translation;
  year: string;
}

export interface Volunteer {
  organization: string;
  role: Translation;
  startMonth: Month;
  startYear: string;
  endMonth: Month;
  endYear: string;
  current: boolean;
  description: Translation;
  impact: Translation;
}

export interface CvData {
  personalInfo?: PersonalInfo;
  links?: Link[];
  resume?: Translation;          // professional summary
  experiences?: Experience[];
  education?: Education[];
  skills?: Translation;          // comma-separated list (Modern/Timeline split on ",")
  languages?: Language[];
  certifications?: Certification[];
  projects?: Project[];
  volunteers?: Volunteer[];
}
```

## `types/template.ts`

```ts
import { Language } from "@eliseubatista99/react-scaffold-core";   // string
import { DocumentProps, PageProps } from "@react-pdf/renderer/lib/react-pdf";

export type BaseCVTemplateProps = {
  documentConfigs?: DocumentProps;  // spread on <Document> (currently not forwarded, see known-issues)
  pageConfigs?: PageProps;          // spread on <Page> (e.g. { wrap: false })
  title?: string;                   // used as download file name by useCVGenerator
  language?: Language;              // "en" | "pt" (default "en")
  children?: React.ReactNode;
};

export type CvTemplateProps = Omit<BaseCVTemplateProps, "children"> & {
  theme?: CvTheme;
  data: CvData;
};

export interface CvTheme {
  color: string;                    // accent color, default "#2563eb"
}
```

## `components/cv/cv.tsx`

```ts
export interface CurriculumVitaeProps extends CvTemplateProps {
  template: CVTemplateType;
}
```
`CurriculumVitaeProps` is the input for `CurriculumVitae`, `useGetCVDocument().getDocument` and all `useCVGenerator` methods.
