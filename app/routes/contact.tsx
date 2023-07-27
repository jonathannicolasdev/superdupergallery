import type { V2_MetaFunction } from "@remix-run/react"

import { formatTitle } from "~/utils"
import { Layout } from "~/components"

export const meta: V2_MetaFunction = () => [
  { title: formatTitle(`Contact`) },
  {
    name: "description",
    content: `Contact Super Duper Gallery.`,
  },
]

export default function RouteComponent() {
  return (
    <Layout>
      <h1>Contact</h1>
    </Layout>
  )
}
