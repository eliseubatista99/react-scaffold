import { CvData } from "../types";

export const ExampleCvContent: CvData = {
  personalInfo: {
    name: "Eliseu Batista",
    desiredRole: "Software Developer",
    city: "Fundão",
    postalCode: "6230-347",
    email: "eliseubatista99@outlook.com",
    countryCode: "+351",
    phone: "934390784",
  },
  links: [
    {
      type: "linkedin",
      value: "eliseubatista",
    },
  ],
  resume:
    "Professional with 2 years of experience in developing React applications with TypeScript and 2 years of experience in building web services with .NET. Served as a team leader for 1.5 years, coordinating projects and ensuring the quality and timely delivery of developments. A versatile and collaborative professional, experienced in training and mentoring interns, technical upskilling of teams, and conducting technical interviews. Capable of addressing the company’s technical and organizational needs, contributing both to software development and to team and project management.",
  experiences: [
    {
      role: "Frontend React Developer @MillenniumBcp",
      company: "ITSector",
      startMonth: "May",
      startYear: "2022",
      endMonth: "Feb",
      endYear: "2023",
      current: false,
      tech: "React, TypeScript, HTML, CSS",
      activities:
        "Development of a responsive website and maintenance of company design system",
      results: "",
    },
    {
      role: "Lead Frontend React Developer @MillenniumBcp",
      company: "ITSector",
      startMonth: "Feb",
      startYear: "2023",
      endMonth: "Mar",
      endYear: "2024",
      current: false,
      tech: "React, TypeScript, HTML, CSS",
      activities: `Development and maintenance of React applications to be integrated into the Home Banking platform.
                            Responsible for a team of 4 members and 2 projects, totaling 9 applications.
                            Training of new team members joining the company’s Frontend teams.
                            Delivery planning and effort management.
                            Technical interviews.`,
      results: "",
    },
    {
      role: ".NET Backend Developer @MillenniumBcp",
      company: "ITSector",
      startMonth: "Mar",
      startYear: "2024",
      endMonth: "Jan",
      endYear: "",
      current: true,
      tech: ".NET, C#, SQL, Web Services",
      activities: `Development of microservices for a homebanking application.
                              Complete refactoring of a project composed of four applications.
                              Maintenance and evolution of existing projects and workflows.`,
      results: "",
    },
  ],
  education: [
    {
      startMonth: "Sep",
      startYear: "2017",
      endMonth: "Jun",
      endYear: "2020",
      type: "bachelor",
      status: "completed",
      course: "Computer Science",
      institution: "Universidade da Beira Interior",
      description: "",
    },
    {
      startMonth: "Sep",
      startYear: "2020",
      endMonth: "Jun",
      endYear: "2022",
      type: "master",
      status: "completed",
      course: "Digital Game Development",
      institution: "Universidade da Beira Interior",
      description: "",
    },
  ],
  skills:
    ".NET, C#, SQL, React, Typescript, HTML, CSS, Git, Scrum, Team Leadership",
  languages: [
    {
      name: "Portuguese",
      level: "native",
    },
    {
      name: "English",
      level: "b2",
    },
    {
      name: "Spanish",
      level: "a2",
    },
  ],
  certifications: [],
  projects: [],
  volunteers: [],
};
