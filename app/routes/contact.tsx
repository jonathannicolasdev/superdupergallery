import type { ActionArgs } from "@remix-run/node"
import { json } from "@remix-run/node"
import { useActionData, useNavigation, type V2_MetaFunction } from "@remix-run/react"

import { prisma } from "~/libs"
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
  const actionData = useActionData<typeof action>()
  const navigation = useNavigation()
  let isSubmitting = navigation.state === "submitting"

  return (
    <Layout className="flex flex-col items-center p-4">
      <div className="w-full max-w-xl space-y-4">
        <h1>Contact</h1>
        <ContactForm />
        <p>{actionData && actionData.message}</p>
        <p>{isSubmitting && "waiting..."}</p>
      </div>
    </Layout>
  )
}

export async function action({ request }: ActionArgs) {
  const body = await request.formData()
  const email = String(body.get("email"))
  const name = String(body.get("name"))
  const subject = String(body.get("subject"))
  const description = String(body.get("description"))
  console.log({ subject, description })
  await prisma.contactMessage.create({ data: { subject, description, email, name } })

  return json({ message: `Hello, thank you for sending a message` })
}
