import type { User, UserProfile } from "@prisma/client"

import type { DataUserTagSymbol } from "~/data"

export type DataUser = Pick<User, "name" | "username"> & {
  nick?: User["nick"]
  tags?: DataUserTagSymbol[]
  isAdmin?: boolean
} & {
  profiles?: { create: DataUserProfile | DataUserProfile[] }
}

export type DataUserProfile = Pick<
  UserProfile,
  "headline" | "bio" | "modeName"
> & {
  isPrimary?: UserProfile["isPrimary"]
  sequence?: UserProfile["sequence"]
}

export const dataUsers: DataUser[] = [
  {
    name: "Administrator",
    username: "admin",
    nick: "Admin",
    tags: ["COLLABORATOR"],
    profiles: {
      create: { headline: "The Ruler", bio: "I'm Admin.", modeName: "Admin" },
    },
  },
  {
    name: "Test",
    username: "test",
    nick: "Test",
    tags: ["COLLABORATOR"],
    profiles: {
      create: { headline: "The Tester", bio: "I'm Tester.", modeName: "Test" },
    },
  },
  {
    name: "Bearmentor",
    username: "bearmentor",
    nick: "Bear",
    tags: ["COLLABORATOR"],
    profiles: {
      create: { headline: "The Bear", bio: "I'm the Bear.", modeName: "Bear" },
    },
  },
  {
    name: "M Haidar Hanif",
    username: "haidar",
    nick: "Haidar",
    tags: ["COLLABORATOR", "FOUNDER", "MENTOR", "DEVELOPER", "DESIGNER"],
    profiles: {
      create: [
        {
          modeName: "Mentor",
          headline: "Software Engineering Mentor",
          bio: `Helping you to learn and build something for good on the web. Especially software, since 2010.

  Topic: Modern career, professional life, interface and experience design, web development, software engineering, human-computer interaction, also project and product management
  
  Technical: UI, UX, Figma, Git, GitHub, GitLab, Markdown, HTML, CSS, Tailwind CSS, JavaScript, TypeScript, Node.js, React, Remix, Next.js, Vite, Redux, Express, NestJS, Vitest, Playwright, REST API, GraphQL, Pothos GraphQL Schema, Prisma ORM, Sequelize ORM, Mongoose ORM, TypeORM, PostgreSQL, MySQL/MariaDB, MongoDB, Redis, Vercel, Netlify, Render, Heroku, Railway.app, Fly.io, Digital Ocean, Linode, Google Cloud Platform (GCP), Amazon Web Services (AWS), and other modern stacks.`,
        },
        {
          modeName: "Developer",
          headline: "Full Stack Web Developer",
          bio: "Building web applications to solve your problems.",
          sequence: 2,
          isPrimary: false,
        },
      ],
    },
  },
  {
    name: "Maya Asmara",
    username: "maya",
    nick: "maya",
    tags: ["COLLABORATOR", "MENTOR", "WRITER"],
    profiles: {
      create: {
        headline: "Writer and Speaker",
        bio: "Writing for public speaking.",
        modeName: "Writer",
      },
    },
  },
  {
    name: "Latifah Dhia I",
    username: "ifa",
    nick: "ifa",
    tags: ["COLLABORATOR", "ARTIST", "MENTEE"],
    profiles: {
      create: {
        headline: "Graphic Artist",
        bio: "Drawing for illustration.",
        modeName: "Artist",
      },
    },
  },
  {
    name: "Thoriq Nur Faizal",
    username: "thoriq",
    nick: "Thoriq",
    tags: ["COLLABORATOR", "MENTOR", "DEVELOPER"],
    profiles: {
      create: [
        {
          headline: "Software Engineering Instructor at Sea Labs",
          bio: "Mentoring future engineers.",
          modeName: "Mentor",
        },
        {
          headline: "Full Stack Web Developer",
          bio: "Developing web applications.",
          modeName: "Developer",
          sequence: 2,
          isPrimary: false,
        },
      ],
    },
  },
  {
    name: "Muhammad Haekal",
    username: "haekal",
    nick: "haekal",
    tags: ["MENTOR", "DEVELOPER"],
    profiles: {
      create: [
        {
          headline: "Senior Frontend Engineer at Ajaib",
          bio: "👋👋👋",
          modeName: "Engineer",
        },
      ],
    },
  },
  {
    name: "Zain Fathoni",
    username: "zain",
    nick: "Zain",
    tags: ["COLLABORATOR", "MENTOR", "DEVELOPER"],
    profiles: {
      create: [
        {
          headline: "Software Engineer at Ninja Van",
          bio: "An Indonesian 🇮🇩 Developer Living in Singapore 🇸🇬",
          modeName: "Engineer",
        },
        {
          headline: "Pejuang Kode",
          bio: "Berjuang untuk kode dan masyarakat",
          modeName: "Pejuan",
        },
      ],
    },
  },
  {
    name: "Naufaldi Rafif",
    username: "faldi",
    nick: "Faldi",
    tags: ["COLLABORATOR", "MENTOR", "DEVELOPER"],
    profiles: {
      create: {
        headline: "Frontend Developer at eFishery",
        bio: "Ningen (人間) in Tech @F2aldi",
        modeName: "Developer",
      },
    },
  },
  {
    name: "Kenneth Mahakim",
    username: "kenneth",
    nick: "Kenneth",
    tags: ["COLLABORATOR", "MENTOR", "DESIGNER"],
    profiles: {
      create: {
        headline: "UI and UX Designer",
        bio: "Bridging interface and experience",
        modeName: "Designer",
      },
    },
  },
  {
    name: "Bagus Juang Wiantoro",
    username: "bagusjuang",
    nick: "Bagus/Juang",
    tags: ["COLLABORATOR", "MENTOR", "DEVELOPER"],
    profiles: {
      create: [
        {
          headline: "Software Engineering Teacher",
          bio: "Teaching future engineers.",
          modeName: "Mentor",
        },
        {
          headline: "Software Engineer",
          bio: "Engineering applications.",
          modeName: "Engineer",
          sequence: 2,
          isPrimary: false,
        },
      ],
    },
  },
  {
    name: "Jonathan Nicolas",
    username: "jo",
    nick: "jo",
    tags: ["MENTEE", "DEVELOPER", "ARTIST"],
    profiles: {
      create: [
        {
          headline: "Web Developer",
          bio: "Developing web applications.",
          modeName: "Developer",
        },
        {
          headline: "Contemporary Artist",
          bio: "Making some artworks.",
          modeName: "Artist",
          sequence: 2,
          isPrimary: false,
        },
      ],
    },
  },
  {
    name: "Ahmad Marzuki",
    username: "amadzuki",
    nick: "Marzuki",
    tags: ["MENTEE", "DEVELOPER"],
    profiles: {
      create: {
        headline: "Frontend Engineer",
        bio: "Implementing UI",
        modeName: "Engineer",
      },
    },
  },
  {
    name: "Krishna Rowter",
    username: "krowter",
    nick: "Krishna",
    tags: ["MENTEE", "DEVELOPER"],
    profiles: {
      create: {
        headline: "Frontend Engineer at Vidio.com",
        bio: "Building Websites",
        modeName: "Engineer",
      },
    },
  },
  {
    name: "Rizky Zhang",
    username: "rizkyzhang",
    nick: "Rizky",
    tags: ["MENTEE", "DEVELOPER"],
    profiles: {
      create: {
        headline: "Sofware Engineer at Ubersnap",
        bio: "I have worked in complex applications such as e-commerce and event management service",
        modeName: "Engineer",
      },
    },
  },
  {
    name: "Dicky Muhamad Rizky",
    username: "dickymr",
    nick: "Dicky MR",
    tags: ["MENTEE", "DEVELOPER"],
    profiles: {
      create: {
        headline: "Associate Frontend Engineer at Garena",
        bio: "I am a Frontend Web Developer",
        modeName: "Engineer",
      },
    },
  },
  {
    name: "Ali Reza Yahya",
    username: "alileza",
    nick: "Ali",
    tags: ["MENTEE", "DEVELOPER"],
    profiles: {
      create: {
        headline: "Sofware Engineer at SadaPay",
        bio: "Working as a Senior Software Engineer (Infrastructure)",
        modeName: "Engineer",
      },
    },
  },
  {
    name: "Arsyad Ramadhan",
    username: "arsyad",
    tags: ["MENTEE", "DEVELOPER"],
  },
  {
    name: "Aunuun Jeffry Mahbuubi",
    username: "jeffry",
    tags: ["MENTEE", "DEVELOPER"],
  },
  {
    name: "Bernhard Hustomo",
    username: "berry.sg",
    tags: ["MENTEE", "DEVELOPER"],
  },
  {
    name: "Calvin Wong",
    username: "calvinwong",
    tags: ["FOUNDER"],
  },
  {
    name: "Dzaki Fadhlurrohman",
    username: "dzaki",
    tags: ["MENTEE", "DEVELOPER"],
  },
  {
    name: "Ega Radiegtya",
    username: "radiegtya",
    tags: ["FOUNDER"],
  },
  {
    name: "Ego Maragustaf",
    username: "ego",
    tags: ["MENTEE", "DEVELOPER"],
  },
  {
    name: "Eric Pradana",
    username: "eric",
    tags: ["MENTEE", "DEVELOPER"],
  },
  {
    name: "Ersan Karimi",
    username: "ersan",
    tags: ["MENTEE", "DEVELOPER"],
  },
  {
    name: "Fikri Alwan Ramadhan",
    username: "fikri",
    tags: ["MENTEE", "DEVELOPER"],
  },
  {
    name: "Guntur Kurniawan Heryanto",
    username: "guntur",
    tags: ["MENTEE", "DEVELOPER"],
  },
  {
    name: "Kresna Galuh",
    username: "kresnagaluh",
    tags: ["FOUNDER", "DEVELOPER"],
    profiles: {
      create: {
        headline: "CEO at CodePolitan",
        bio: "Build something with tech.",
        modeName: "CEO",
      },
    },
  },
  {
    name: "Ahmad Oriza",
    username: "ahmadoriza",
    tags: ["FOUNDER", "DEVELOPER", "MENTOR"],
    profiles: {
      create: {
        headline: "CTO at CodePolitan",
        bio: "Curious about Tech World.",
        modeName: "CTO",
      },
    },
  },
  {
    name: "Hadyan Palupi",
    username: "hadyanpalupi",
    tags: ["MARKETER"],
    profiles: {
      create: {
        headline: "COO at CodePolitan",
        bio: "Operating tech company.",
        modeName: "COO",
      },
    },
  },
  {
    name: "Irsan Sebastian",
    username: "sanoncode",
    tags: ["MENTEE", "DEVELOPER"],
  },
  {
    name: "Ismal Zikri Damani",
    username: "ismalzikri",
    tags: ["MENTEE", "DEVELOPER"],
  },
  {
    name: "M Faris Gibran",
    username: "mfarisgibran",
    tags: ["MENTEE", "MARKETER"],
  },
  {
    name: "M Suryadi Triputra",
    username: "suryadi",
    tags: ["MENTEE", "DEVELOPER"],
  },
  {
    name: "Maruf Hasan",
    username: "maruf",
    tags: ["MENTEE", "DEVELOPER"],
  },
  {
    name: "Muhammad Farkhan Syafii",
    username: "farkhan",
    tags: ["MENTEE", "DEVELOPER"],
  },
  {
    name: "Reymond Julio",
    username: "reymond",
    tags: ["MENTEE", "DEVELOPER"],
  },
  {
    name: "Reza Radityo",
    username: "radityo",
    tags: ["MENTEE", "DEVELOPER"],
  },
  {
    name: "Rofiq Ahmad Mubarok",
    username: "rofiq",
    tags: ["MENTEE", "DEVELOPER"],
  },
  {
    name: "Dandi Rizky Eko Saputro",
    username: "dandirizky",
    tags: ["MENTEE", "DEVELOPER"],
  },
  {
    name: "Yosua Halim",
    username: "yosua",
    tags: ["DEVELOPER"],
  },
  {
    name: "Haidar Dzaky",
    username: "haidardzaky",
    tags: ["MENTEE", "DEVELOPER"],
  },
  {
    name: "Ahyana Rizky Pratama",
    username: "ahyanarizky",
    tags: ["MENTEE", "DEVELOPER"],
  },
  {
    name: "R Adysurya Agus",
    username: "r17x",
    tags: ["MENTOR", "DEVELOPER"],
  },
  {
    name: "Irsyad A. Panjaitan",
    username: "irsyadadl",
    tags: ["COLLABORATOR", "MENTOR", "DEVELOPER"],
  },
  {
    name: "Sahbana Lubis",
    username: "sahbanagold",
    tags: ["MENTEE", "DEVELOPER"],
  },
  {
    name: "Septhianto Diga Chandra",
    username: "digachandra",
    tags: ["MENTEE", "DEVELOPER"],
  },
  {
    name: "Ari Adiprana",
    username: "ariadiprana",
    tags: ["MENTEE", "DEVELOPER"],
  },
  {
    name: "Ivan Gerard",
    username: "ivangerard",
    tags: ["MENTEE", "DEVELOPER"],
  },
  {
    name: "Mutia Anggraini",
    username: "mutia",
    tags: ["MENTEE", "DEVELOPER"],
  },
]
