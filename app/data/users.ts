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
    name: "Jonathan Nicolas",
    username: "jo",
    nick: "Jo",
    tags: ["COLLABORATOR"],
  },
  {
    name: "M Haidar Hanif",
    username: "haidar",
    nick: "Haidar",
    tags: ["COLLABORATOR"],
  },
]
