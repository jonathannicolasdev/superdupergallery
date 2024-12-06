import type { User, UserProfile } from "@prisma/client"

import type { DataUserTagSymbol } from "~/data"

import usersCredentialsJSON from "./users-credentials.json"

export type DataUser = Pick<User, "name" | "username"> & {
  nick?: User["nick"]
  tags?: DataUserTagSymbol[]
  isAdmin?: boolean
} & {
  profiles?: { create: DataUserProfile | DataUserProfile[] }
}

export type DataUserProfile = Pick<UserProfile, "headline" | "bio" | "modeName"> & {
  isPrimary?: UserProfile["isPrimary"]
  sequence?: UserProfile["sequence"]
}

export const dataUsers: DataUser[] = usersCredentialsJSON.map(user => {
  return {
    ...user,
    tags: ["TEAM"],
  }
})
