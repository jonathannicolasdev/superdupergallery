import type { ActionArgs, LoaderArgs } from "@remix-run/node"
import { json, redirect } from "@remix-run/node"
import { Form, useActionData, useLoaderData, useNavigation } from "@remix-run/react"
import { conform, useForm } from "@conform-to/react"
import { parse } from "@conform-to/zod"
import { badRequest } from "remix-utils"

import { authenticator } from "~/services/auth.server"
import { prisma } from "~/libs"
import { createExhibitionSlug, createTimer } from "~/utils"
import {
  ButtonLoading,
  DatePicker,
  Debug,
  FormAlert,
  FormDescription,
  FormField,
  FormFieldSet,
  FormLabel,
  Input,
  Textarea,
} from "~/components"
import { schemaExhibitionUpsert } from "~/schemas/exhibition"

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

  const lastSubmission = useActionData()
  const [form, { edition, title, description, date }] = useForm({
    shouldRevalidate: "onInput",
    lastSubmission,
    // constraint: getFieldsetConstraint(schemaExhibitionUpsert),
    onValidate({ formData }) {
      return parse(formData, { schema: schemaExhibitionUpsert })
    },
    defaultValue: {
      ...exhibition,
    },
  })

  return (
    <>
      <header className="space-y-2">
        <p>Edit Exhibition</p>
        <p>
          <b>ID: </b>
          {exhibition.id}
        </p>
        <Debug>{exhibition}</Debug>
      </header>

      <section className="max-w-xl">
        <Form method="PUT" {...form.props}>
          <FormFieldSet disabled={isSubmitting}>
            <input type="hidden" name="id" defaultValue={exhibition.id} />

            <FormField>
              <FormLabel htmlFor={edition.id}>Edition Number</FormLabel>
              <Input {...conform.input(edition, { type: "number" })} />
              <FormAlert config={edition} />
            </FormField>

            <FormField>
              <FormLabel htmlFor={title.id}>Title</FormLabel>
              <FormDescription>Limited to 100 characters</FormDescription>
              <Input {...conform.input(title)} type="text" />
              <FormAlert config={title} />
            </FormField>

            <FormField>
              <FormLabel htmlFor={description.id}>Description</FormLabel>
              <FormDescription>Limited to 1000 characters</FormDescription>
              <Textarea {...conform.input(description)} />
              <FormAlert config={description} />
            </FormField>

            <FormField>
              <FormLabel htmlFor={date.id}>Date</FormLabel>
              <DatePicker
                name={date.name}
                defaultValue={date.defaultValue}
                required
                //
              />
              <FormAlert config={date} />
            </FormField>

            <ButtonLoading isSubmitting={isSubmitting} submittingText="Saving Exhibition...">
              Save Exhibition
            </ButtonLoading>
          </FormFieldSet>
        </Form>
      </section>
    </>
  )
}

export const action = async ({ request }: ActionArgs) => {
  const timer = createTimer()

  const clonedRequest = request.clone()
  const userSession = await authenticator.isAuthenticated(request)
  const formData = await clonedRequest.formData()

  const submission = parse(formData, { schema: schemaExhibitionUpsert })
  if (!submission.value || submission.intent !== "submit") {
    return badRequest(submission)
  }

  const dataExhibition = {
    ...submission.value,
    userId: userSession?.id,
    slug: createExhibitionSlug(submission.value.edition, submission.value.title),
    // images: JSON.parse(images)
    // artists: JSON.parse(artists)
    // artworks: JSON.parse(artworks)
  }

  const upsertedExhibition = await prisma.exhibition.upsert({
    where: { id: dataExhibition.id },
    create: dataExhibition,
    update: dataExhibition,
  })

  await timer.delay()
  return redirect(`/dashboard/exhibitions/${upsertedExhibition.id || dataExhibition.id}`)
}
