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
    en:
      "Professional with 2 years of experience in developing React applications with TypeScript and 2 years of experience in building web services with .NET." +
      "\nServed as a team leader for 1.5 years, coordinating projects and ensuring the quality and timely delivery of developments. " +
      "\nA versatile and collaborative professional, experienced in training and mentoring interns, technical upskilling of teams, and conducting technical interviews." +
      "Capable of addressing the company’s technical and organizational needs, contributing both to software development and to team and project management." +
      "Professional with 2 years of experience in developing React applications with TypeScript and 2 years of experience in building web services with .NET." +
      "\nServed as a team leader for 1.5 years, coordinating projects and ensuring the quality and timely delivery of developments. " +
      "\nA versatile and collaborative professional, experienced in training and mentoring interns, technical upskilling of teams, and conducting technical interviews." +
      "Capable of addressing the company’s technical and organizational needs, contributing both to software development and to team and project management." +
      "Professional with 2 years of experience in developing React applications with TypeScript and 2 years of experience in building web services with .NET." +
      "\nServed as a team leader for 1.5 years, coordinating projects and ensuring the quality and timely delivery of developments. " +
      "\nA versatile and collaborative professional, experienced in training and mentoring interns, technical upskilling of teams, and conducting technical interviews." +
      "Capable of addressing the company’s technical and organizational needs, contributing both to software development and to team and project management.",
    pt:
      "Profissional com 2 anos de experiência em desenvolvimento de aplicações em React com TypeScript e 2 anos de experiência em serviços web com .NET." +
      "\nDesempenhou funções de líder de equipa durante 1 ano e meio, coordenando projectos e assegurando a qualidade e pontualidade das entregas." +
      "\nApresenta um perfil versátil e colaborativo, capaz de responder de forma eficaz às necessidades técnicas e organizacionais da empresa, " +
      "contribuindo tanto para o desenvolvimento de software como para a gestão e evolução das equipas.",
  },

  experiences: [
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
        en:
          "Development of microservices for a homebanking application." +
          "\nComplete refactoring of a project composed of four applications." +
          "\nMaintenance and evolution of existing projects and workflows.",
        pt:
          "Desenvolvimento de microserviços para aplicação de homebanking." +
          "\nRefatorização completa de um projeto, composto por 4 aplicações." +
          "\nManutenção e evolução de projetos e fluxos já existentes.",
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
        en:
          "Development and maintenance of React applications to be integrated into the Home Banking platform." +
          "\nResponsible for a team of 4 members and 2 projects, totaling 9 applications." +
          "\nTraining of new team members joining the company’s Frontend teams." +
          "\nDelivery planning and effort management." +
          "\nTechnical interviews",
        pt:
          "Desenvolvimento e manutenção de aplicações React para serem integrados na aplicação de Home banking." +
          "\nResponsável por uma equipa de 4 elementos e por 2 projetos, totalizando 9 aplicações." +
          "\nFormação de novos elementos que integravam as equipas de Frontend da empresa." +
          "\nPlaneamento de entregas e gestão de esforço" +
          "\nEntrevistas técnicas",
      },
      results: {
        en: "",
        pt: "",
      },
    },
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
  ],
  education: [
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
  projects: [
    // {
    //   name: "Overforged",
    //   description: {
    //     pt: "Jogo multijogador local, inspirado no Overforged, desenvolvido com a ferramenta Unity, na linguagem C#.",
    //     en: "Local multiplayer game, inspired by Overforged, developed with the Unity tool and the C# language.",
    //   },
    //   link: "https://eliseubatista99.itch.io/overforged",
    //   year: "2022",
    //   tech: {
    //     en: "C#, Unity, Blender, Game Design, Local Co-Op",
    //     pt: "C#, Unity, Blender, Design de Jogos, Local Co-Op",
    //   },
    // },
    // {
    //   name: "Pokedex",
    //   description: {
    //     pt: "Pokedex desenvolvida em React + Typescript, fazendo uso da PokeApi para obter os dados dos pokemons, e da firebase para armazenar os perfis dos treinadores",
    //     en: "Pokedex developed in React + Typescript, using PokeApi to retrieve pokemon data  and firebase to store trainer profiles",
    //   },
    //   link: "https://pokedex-by-eliseu.netlify.app/",
    //   sourceCode: "https://github.com/eliseubatista99/pokedex-by-eliseu",
    //   year: "2023",
    //   tech: {
    //     en: "React, Typescript, Redux, HTML, CSS, Firebase",
    //     pt: "React, Typescript, Redux, HTML, CSS, Firebase",
    //   },
    // },
    // {
    //   name: "Elideus Dot Net Framework",
    //   description: {
    //     pt: "Um pacote NuGet utilizado nos meus projetos pessoais",
    //     en: "A NuGet package used in my personal projects.",
    //   },
    //   link: "https://www.nuget.org/profiles/eliseubatista99",
    //   sourceCode: "https://github.com/eliseubatista99/Elideus-DotNet-Framework",
    //   year: "2023",
    //   tech: {
    //     en: "C#, .NET, JWT, RPC Api, Unit Tests",
    //     pt: "C#, .NET, JWT, RPC Api, Unit Tests",
    //   },
    // },
  ],
  volunteers: [],
};
