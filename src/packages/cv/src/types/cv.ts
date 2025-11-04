import { Translation } from "@eliseubatista99/react-scaffold-core";

/**
 * Interface for personal information data
 */
export interface PersonalInfo {
  /** Full name of the person */
  name: string;
  /** Desired job role or position */
  desiredRole?: Translation;
  /** City of residence */
  city: string;
  /** Postal code */
  postalCode: string;
  /** Email address */
  email: string;
  /** Country code for phone number */
  countryCode: string;
  /** Phone number */
  phone: string;
}

export type LinkType =
  | "linkedin"
  | "github"
  | "portfolio"
  | "email"
  | "phone"
  | "other";

/**
 * Interface for social media and portfolio links
 */
export interface Link {
  /** Type of link (LinkedIn, GitHub, Portfolio, etc.) */
  type: LinkType;
  /** URL or username value */
  value: string;
}

export type Month =
  | "Jan"
  | "Feb"
  | "Mar"
  | "Apr"
  | "May"
  | "Jun"
  | "Jul"
  | "Aug"
  | "Sep"
  | "Oct"
  | "Nov"
  | "Dec";

/**
 * Interface for professional experience entries
 */
export interface Experience {
  /** Job title or role */
  role: Translation;
  /** Company name */
  company: string;
  /** Start month (abbreviated) */
  startMonth: Month;
  /** Start year */
  startYear: string;
  /** End month (abbreviated) */
  endMonth: Month;
  /** End year */
  endYear: string;
  /** Whether this is the current job */
  current: boolean;
  /** Technologies used in this role */
  tech: Translation;
  /** Activities and responsibilities */
  activities: Translation;
  /** Achievements and results with metrics */
  results: Translation;
}

export type EducationType =
  | "secondary"
  | "technical"
  | "bachelor"
  | "postgraduate"
  | "master"
  | "phd";

export type EducationStatus = "completed" | "interrupted" | "progress";

/**
 * Interface for education entries
 */
export interface Education {
  /** Type of education (degree level) */
  type: EducationType;
  /** Status of education (completed, in progress, etc.) */
  status: EducationStatus;
  /** Course or degree name */
  course: Translation;
  /** Educational institution */
  institution: string;
  /** Start month (abbreviated) */
  startMonth: Month;
  /** Start year */
  startYear: string;
  /** End month (abbreviated) */
  endMonth: Month;
  /** End year */
  endYear: string;
  /** Description of education and achievements */
  description: Translation;
}

export type LanguageLevel = "a1" | "a2" | "b1" | "b2" | "c1" | "c2" | "native";

/**
 * Interface for language proficiency entries
 */
export interface Language {
  /** Language name */
  name: Translation;
  /** Proficiency level */
  level: LanguageLevel;
}

/**
 * Interface for certification entries
 */
export interface Certification {
  /** Certification name */
  name: Translation;
  /** Issuing organization or institution */
  issuer: string;
  /** Date of completion */
  completionDate: string;
  /** Hours of study or course duration */
  hours: string;
  /** URL for certificate validation */
  validationLink: string;
  /** Description of certification content */
  description: Translation;
}

/**
 * Interface for project entries
 */
export interface Project {
  /** Project name */
  name: string;
  /** Project description */
  description: Translation;
  /** Project URL or repository link */
  link: string;
  /** Source code repository URL (e.g., GitHub) */
  sourceCode?: string;
  /** Technologies used in the project */
  tech: Translation;
  /** Year of project completion */
  year: string;
}

/**
 * Interface for volunteer work entries
 */
export interface Volunteer {
  /** Organization name */
  organization: string;
  /** Role or position in the organization */
  role: Translation;
  /** Start month (abbreviated) */
  startMonth: Month;
  /** Start year */
  startYear: string;
  /** End month (abbreviated) */
  endMonth: Month;
  /** End year */
  endYear: string;
  /** Whether this is the current volunteer position */
  current: boolean;
  /** Description of volunteer activities and responsibilities */
  description: Translation;
  /** Impact and achievements in the volunteer role */
  impact: Translation;
}

/**
 * Main interface containing all CV data
 */
export interface CvData {
  /** Personal information */
  personalInfo?: PersonalInfo;
  /** Social media and portfolio links */
  links?: Link[];
  /** Professional summary */
  resume?: Translation;
  /** Professional experience entries */
  experiences?: Experience[];
  /** Education entries */
  education?: Education[];
  /** Technical skills */
  skills?: Translation;
  /** Language proficiency entries */
  languages?: Language[];
  /** Certification entries */
  certifications?: Certification[];
  /** Project entries */
  projects?: Project[];
  /** Volunteer work entries */
  volunteers?: Volunteer[];
}
