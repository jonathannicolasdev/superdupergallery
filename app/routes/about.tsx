import type { V2_MetaFunction } from "@remix-run/react"

import { formatTitle } from "~/utils"
import { Layout } from "~/components"

export const meta: V2_MetaFunction = () => [
  { title: formatTitle(`About`) },
  {
    name: "description",
    content: `About Super Duper Gallery.`,
  },
]

export const dataTeamMembers = [
  {
    slug: "jonathan-nicolas",
    name: "Jonathan Nicolas",
    role: "Co-Founder",
    avatarImageURL: "/avatars/jonathan-nicolas.png",
  },
  {
    slug: "alfred-tababa",
    name: "Alfred Tababa",
    role: "Co-Founder",
    avatarImageURL: "/avatars/alfred-tababa.png",
  },
  {
    slug: "jessa-almirol",
    name: "Jessa Almirol",
    role: "Co-Founder",
    avatarImageURL: "/avatars/jessa-almirol.png",
  },
]

export default function RouteComponent() {
  return (
    <Layout className="space-y-8 p-4">
      <section>
        <h1>About</h1>
      </section>

      <section>
        <h2>Our Team Members</h2>

        <ul className="flex flex-wrap gap-10">
          {dataTeamMembers.map(person => {
            return (
              <li key={person.slug} className="space-y-2">
                <img
                  src={person.avatarImageURL}
                  alt={person.name}
                  className="h-80 w-80"
                />
                <h3>{person.name}</h3>
                <p>{person.role}</p>
              </li>
            )
          })}
        </ul>
      </section>
    </Layout>
  )
}
