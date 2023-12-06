import type { ActionArgs } from "@remix-run/node"
import { json } from "@remix-run/node"
import type { V2_MetaFunction } from "@remix-run/react"

import { formatTitle } from "~/utils"
import { ContactForm, Layout } from "~/components"

export const meta: V2_MetaFunction = () => [
  { title: formatTitle(`Contact`) },
  {
    name: "description",
    content: `Contact Super Duper Gallery.`,
  },
]

export default function RouteComponent() {
  return (
    <Layout className="flex flex-col items-center p-4">
      <div className="w-full max-w-xl space-y-4">
        <h1>Contact</h1>

        <ContactForm />
      </div>
    </Layout>
  )
}

export async function action({ request }: ActionArgs) {
  const body = await request.formData()
  const subject = body.get("subject")
  const description = body.get("description")
  console.log({ subject, description })
  return json({ message: `Hello, ${subject}` })
}
