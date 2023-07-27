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

export default function RouteComponent() {
  return (
    <Layout>
      <h1>About</h1>
    </Layout>
  )
}
