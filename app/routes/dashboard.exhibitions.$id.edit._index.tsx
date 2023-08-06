import type { ActionArgs, LoaderArgs } from "@remix-run/node"
import { json, redirect } from "@remix-run/node"
import { Form, useLoaderData, useNavigation } from "@remix-run/react"

import { prisma } from "~/libs"
import { ButtonLoading, FormField, FormLabel, Input } from "~/components"

export async function loader({ request, params }: LoaderArgs) {
  const exhibition = await prisma.exhibition.findFirst({
    where: { id: params.id },
    include: {
      images: true,
      artworks: {
        include: {
          images: { select: { url: true } },
          artist: true,
        },
      },
    },
  })
  if (!exhibition) return redirect("/dashboard/exhibitions")
  return json({ exhibition })
}

export default function Route() {
  const { exhibition } = useLoaderData<typeof loader>()
  const navigation = useNavigation()
  const isSubmitting = navigation.state === "submitting"

  return (
    <>
      <header>
        <h1>Exhibition</h1>
        <p>ID: {exhibition.id}</p>
      </header>

      <Form method="PUT">
        <fieldset disabled={isSubmitting} className="space-y-4">
          <input type="hidden" name="id" defaultValue={exhibition.id} />

          <FormField>
            <FormLabel htmlFor="title">Title</FormLabel>
            <Input id="title" name="title" defaultValue={exhibition.title} />
          </FormField>

          <ButtonLoading isSubmitting={isSubmitting} submittingText="Saving Exhibition...">
            Save Exhibition
          </ButtonLoading>
        </fieldset>
      </Form>
    </>
  )
}

export const action = async ({ request }: ActionArgs) => {
  const formData = await request.formData()

  const id = formData.get("id")?.toString() || ""
  const title = formData.get("title")?.toString() || ""

  const dataExhibition = {
    id,
    title,
  }

  const updatedPrisma = await prisma.exhibition.update({
    where: { id },
    data: dataExhibition,
  })
  if (!updatedPrisma) return null

  return redirect(`/dashboard/exhibitions/${id}`)
}
