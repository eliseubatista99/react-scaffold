import { CvData } from "../types";

export const ExampleCvContent: CvData = {
  personalInfo: {
    name: "Eliseu Batista",
    desiredRole: {
      en: "Software Developer",
      pt: "Desenvolvedor de Software",
    },
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
    {
      type: "github",
      value: "eliseubatista99",
    },
  ],
  resume: {
    en: `Professional with 2 years of experience in developing React applications with TypeScript and 2 years of experience in building web services with .NET. 
    Served as a team leader for 1.5 years, coordinating projects and ensuring the quality and timely delivery of developments. 
    A versatile and collaborative professional, experienced in training and mentoring interns, technical upskilling of teams, and conducting technical interviews. 
    Capable of addressing the company’s technical and organizational needs, contributing both to software development and to team and project management.`,
    pt: `Profissional com 2 anos de experiência em desenvolvimento de aplicações em React com TypeScript e 2 anos de experiência em serviços web com .NET. 
    Desempenhou funções de líder de equipa durante 1 ano e meio, coordenando projectos e assegurando a qualidade e pontualidade das entregas.
    Apresenta um perfil versátil e colaborativo, com experiência na formação e acompanhamento de estagiários, capacitação técnica de equipas e condução de entrevistas 
    técnicas. Capaz de responder de forma eficaz às necessidades técnicas e organizacionais da empresa, contribuindo tanto para o desenvolvimento de software como para a 
    gestão e evolução das equipas.`,
  },

  experiences: [
    {
      role: {
        en: "Frontend React Developer @MillenniumBcp",
        pt: "Desenvolvedor Frontend React @MillenniumBcp",
      },
      company: "ITSector",
      startMonth: "May",
      startYear: "2022",
      endMonth: "Feb",
      endYear: "2023",
      current: false,
      tech: {
        en: "React, TypeScript, HTML, CSS",
        pt: "React, TypeScript, HTML, CSS",
      },
      activities: {
        en: "Development of a responsive website and maintenance of company design system",
        pt: "Desenvolvimento de um website responsivo e manutenção do repositório de componentes.",
      },
      results: {
        en: "",
        pt: "",
      },
    },
    {
      role: {
        en: "Lead Frontend React Developer @MillenniumBcp",
        pt: "Desenvolvedor Lider Frontend React @MillenniumBcp",
      },
      company: "ITSector",
      startMonth: "Feb",
      startYear: "2023",
      endMonth: "Mar",
      endYear: "2024",
      current: false,
      tech: {
        en: "React, TypeScript, HTML, CSS",
        pt: "React, TypeScript, HTML, CSS",
      },
      activities: {
        en: `Development and maintenance of React applications to be integrated into the Home Banking platform.
            Responsible for a team of 4 members and 2 projects, totaling 9 applications.
            Training of new team members joining the company’s Frontend teams.
            Delivery planning and effort management.
            Technical interviews`,
        pt: `Desenvolvimento e manutenção de aplicações React para serem integrados na aplicação de Home banking.
              Responsável por uma equipa de 4 elementos e por 2 projetos, totalizando 9 aplicações.
              Formação de novos elementos que integravam as equipas de Frontend da empresa.
              Planeamento de entregas e gestão de esforço
              Entrevistas técnicas`,
      },
      results: {
        en: "",
        pt: "",
      },
    },
    {
      role: {
        en: ".NET Backend Developer @MillenniumBcp",
        pt: "Desenvolvedor Backend .NET @MillenniumBcp",
      },
      company: "ITSector",
      startMonth: "Mar",
      startYear: "2024",
      endMonth: "Jan",
      endYear: "",
      current: true,
      tech: {
        en: ".NET, C#, SQL, Web Services",
        pt: ".NET, C#, SQL, Web Services",
      },
      activities: {
        en: `Development of microservices for a homebanking application.
            Complete refactoring of a project composed of four applications.
            Maintenance and evolution of existing projects and workflows.`,
        pt: `Desenvolvimento de microserviços para aplicação de homebanking.
            Refatorização completa de um projeto, composto por 4 aplicações.
            Manutenção e evolução de projetos e fluxos já existentes.`,
      },
      results: {
        en: "",
        pt: "",
      },
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
      course: {
        en: "Computer Science",
        pt: "Engenharia Informática",
      },
      institution: "Universidade da Beira Interior",
      description: {
        en: "",
        pt: "",
      },
    },
    {
      startMonth: "Sep",
      startYear: "2020",
      endMonth: "Jun",
      endYear: "2022",
      type: "master",
      status: "completed",
      course: {
        en: "Digital Game Development",
        pt: "Desenvolvimento de jogos digitais",
      },
      institution: "Universidade da Beira Interior",
      description: {
        en: "",
        pt: "",
      },
    },
  ],
  skills: {
    en: ".NET, C#, SQL, React, Typescript, HTML, CSS, Git, Scrum, Team Leadership",
    pt: ".NET, C#, SQL, React, Typescript, HTML, CSS, Git, Scrum, Liderança de equipa",
  },
  languages: [
    {
      name: {
        en: "Portuguese",
        pt: "Português",
      },
      level: "native",
    },
    {
      name: {
        en: "English",
        pt: "Inglês",
      },
      level: "b2",
    },
    {
      name: {
        en: "Spanish",
        pt: "Espanhol",
      },
      level: "a2",
    },
  ],
  certifications: [],
  projects: [],
  volunteers: [],
};
