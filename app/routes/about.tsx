import type { V2_MetaFunction } from "@remix-run/react"

import { Layout } from "~/components"

export const meta: V2_MetaFunction = () => [
  // your meta here
]

export default function RouteComponent() {
  return (
    <Layout>
      <h1>About</h1>
    </Layout>
  )
}
