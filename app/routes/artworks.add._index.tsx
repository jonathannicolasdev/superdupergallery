import type { ActionArgs, LoaderArgs } from "@remix-run/node"
import { json, redirect } from "@remix-run/node"
import { Form, useActionData, useNavigation } from "@remix-run/react"
import { conform, useForm } from "@conform-to/react"
import { parse } from "@conform-to/zod"

import { authenticator } from "~/services/auth.server"
import { prisma } from "~/libs"
import { createArtworkSlug } from "~/utils"
import { useRootLoaderData } from "~/hooks"
import {
  Alert,
  Button,
  FormField,
  FormLabel,
  Input,
  Layout,
} from "~/components"
import { schemaArtwork } from "~/schemas"

export const loader = async ({ request }: LoaderArgs) => {
  await authenticator.isAuthenticated(request, { failureRedirect: "/login" })
  return null
}

export default function ArtworksAddRoute() {
  const { userData } = useRootLoaderData()
  const lastSubmission = useActionData<typeof action>()
  const navigation = useNavigation()
  const isSubmitting = navigation.state === "submitting"

  const [form, { userId, title, medium, size }] = useForm({
    lastSubmission,
    onValidate({ formData }) {
      return parse(formData, { schema: schemaArtwork })
    },
  })

  if (!userData?.id) return null

  return (
    <Layout className="flex flex-wrap gap-8 px-4 py-4 sm:flex-nowrap">
      <section id="artworks-action" className="w-full space-y-8 sm:max-w-3xl">
        <header className="space-y-4">
          <h1 className="flex items-center gap-2 text-4xl text-brand">
            <img src="/images/cat-wood.png" alt="Cat" className="h-10" />
            <span>Add New Artwork</span>
          </h1>
        </header>

        <section
          id="create-artwork"
          className="space-y-4 rounded bg-gray-900 p-4"
        >
          <header>
            <h3>Add Artwork</h3>
          </header>

          <Form {...form.props} replace method="PUT" className="space-y-6">
            <fieldset
              disabled={isSubmitting}
              className="space-y-4 disabled:opacity-80"
            >
              <input
                hidden
                {...conform.input(userId)}
                defaultValue={userData.id}
              />

              <FormField>
                <FormLabel htmlFor={title.id}>Title</FormLabel>
                <Input
                  {...conform.input(title)}
                  type="text"
                  placeholder="Some Creative Title"
                />
                {title.error && (
                  <Alert variant="destructive" id={title.errorId}>
                    {title.error}
                  </Alert>
                )}
              </FormField>

              <FormField>
                <FormLabel htmlFor={medium.id}>Medium</FormLabel>
                <Input
                  {...conform.input(medium)}
                  type="text"
                  placeholder="Ex: Canvas, Acrylic"
                />
                {medium.error && (
                  <Alert variant="destructive" id={medium.errorId}>
                    {medium.error}
                  </Alert>
                )}
              </FormField>

              <FormField>
                <FormLabel htmlFor={size.id}>Size</FormLabel>
                <Input
                  {...conform.input(size)}
                  type="text"
                  placeholder={`Ex: 10" x 10" x 10"`}
                />
                {size.error && (
                  <Alert variant="destructive" id={size.errorId}>
                    {size.error}
                  </Alert>
                )}
              </FormField>

              <Button type="submit" name="intent" disabled={isSubmitting}>
                Add
              </Button>
            </fieldset>
          </Form>
        </section>
      </section>
    </Layout>
  )
}

export async function action({ request }: ActionArgs) {
  await authenticator.isAuthenticated(request, { failureRedirect: "/login" })

  const formData = await request.formData()
  const submission = parse(formData, { schema: schemaArtwork })

  if (!submission.value || submission.intent !== "submit") {
    return json(submission, { status: 400 })
  }

  const createdArtwork = await prisma.artwork.create({
    data: {
      userId: submission.value.userId,
      slug: createArtworkSlug(submission.value.title),
      title: submission.value.title,
      medium: submission.value.medium,
      size: submission.value.size,
    },
  })

  if (createdArtwork) {
    return redirect("/artworks")
  }

  return json(submission)
}
