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
        <fieldset disabled={isSubmitting}>
          <FormField>
            <FormLabel htmlFor="title">Title</FormLabel>
            <Input id="title" name="title" />
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

  const title = formData.get("title")

  const updatedExhibition = {
    title,
  }

  console.log({ updatedExhibition })

  return null
}
