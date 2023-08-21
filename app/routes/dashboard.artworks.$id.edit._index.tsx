import { useState } from "react"
import type { ActionArgs, LoaderArgs } from "@remix-run/node"
import { json, redirect } from "@remix-run/node"
import { Form, useActionData, useLoaderData, useNavigation } from "@remix-run/react"
import { conform, useForm } from "@conform-to/react"
import { parse } from "@conform-to/zod"
import type { SingleValue } from "react-select"
import Select from "react-select"
import { badRequest } from "remix-utils"

import type { OptionValueLabel } from "~/types"
import { authenticator } from "~/services/auth.server"
import { prisma } from "~/libs"
import { createArtworkSlug, createTimer, getRedirectTo } from "~/utils"
import {
  ButtonLoading,
  FormAlert,
  FormDescription,
  FormField,
  FormFieldSet,
  FormLabel,
  Input,
} from "~/components"
import { schemaArtwork } from "~/schemas/artwork"

export async function loader({ request, params }: LoaderArgs) {
  const [artwork, artists] = await prisma.$transaction([
    prisma.artwork.findFirst({
      where: { id: params.id },
      include: {
        images: true,
        artist: true,
      },
    }),

    prisma.artist.findMany({
      include: {
        image: true,
      },
    }),
  ])

  if (!artwork || !artists) {
    return redirect("/dashboard/artworks")
  }

  return json({ artwork, artists })
}

export default function Route() {
  const { artwork, artists } = useLoaderData<typeof loader>()

  const navigation = useNavigation()
  const isSubmitting = navigation.state === "submitting"

  const lastSubmission = useActionData()
  const [form, { id, title, medium, size, year }] = useForm({
    shouldRevalidate: "onInput",
    lastSubmission,
    onValidate({ formData }) {
      return parse(formData, { schema: schemaArtwork })
    },
    defaultValue: {
      id: artwork.id,
      title: artwork.title,
      medium: artwork.medium,
      size: artwork.size,
      year: artwork.year,
    },
  })

  const artistsOptions = artists.map(artist => ({ value: artist.id, label: artist.name }))

  const [selectedArtist, setSelectedArtist] = useState<SingleValue<OptionValueLabel>>({
    value: artwork.artist?.id || "",
    label: artwork.artist?.name || "",
  })

  return (
    <>
      <header className="space-y-2">
        <p>
          Edit Artwork: <code>{artwork.id}</code>
        </p>
      </header>

      <section className="max-w-xl">
        <Form method="PUT" {...form.props}>
          <FormFieldSet disabled={isSubmitting}>
            <input type="hidden" {...conform.input(id)} />

            <FormField>
              <FormLabel htmlFor={title.id}>Title</FormLabel>
              <FormDescription>Limited to 100 characters</FormDescription>
              <Input {...conform.input(title)} />
              <FormAlert config={title} />
            </FormField>

            <FormField>
              <FormLabel htmlFor={medium.id}>Medium</FormLabel>
              <FormDescription>Limited to 100 characters</FormDescription>
              <Input {...conform.input(medium)} />
              <FormAlert config={medium} />
            </FormField>

            <FormField>
              <FormLabel htmlFor={size.id}>Size</FormLabel>
              <FormDescription>Limited to 100 characters</FormDescription>
              <Input {...conform.input(size)} />
              <FormAlert config={size} />
            </FormField>

            <FormField>
              <FormLabel htmlFor={year.id}>Year</FormLabel>
              <Input {...conform.input(year, { type: "number" })} min={2020} max={2100} />
              <FormAlert config={year} />
            </FormField>

            <FormField className="space-y-1">
              <FormLabel>Artist</FormLabel>
              <input
                type="hidden"
                name="artworkArtist"
                defaultValue={JSON.stringify(selectedArtist)}
              />
              <Select
                classNamePrefix="select"
                options={artistsOptions}
                defaultValue={selectedArtist}
                onChange={value => {
                  setSelectedArtist(value)
                }}
              />
            </FormField>

            <ButtonLoading isSubmitting={isSubmitting} submittingText="Saving Artwork...">
              Save Artwork
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

  const submission = parse(formData, { schema: schemaArtwork })
  if (!submission.value || submission.intent !== "submit") {
    return badRequest(submission)
  }

  const artist: OptionValueLabel = JSON.parse(submission.payload.artworkArtist)

  const statuses = await prisma.artworkStatus.findMany()
  const AVAILABLE = statuses.find(status => status.symbol === "AVAILABLE")
  const SOLD = statuses.find(status => status.symbol === "SOLD")
  const PULLED_OUT = statuses.find(status => status.symbol === "PULLED-OUT")
  const RESERVED = statuses.find(status => status.symbol === "RESERVED")
  const UNKNOWN = statuses.find(status => status.symbol === "UNKNOWN")
  if (!AVAILABLE || !SOLD || !PULLED_OUT || !RESERVED || !UNKNOWN) return null

  const artwork = await prisma.artwork.update({
    where: { id: submission.value.id },
    data: {
      ...submission.value,
      userId: userSession?.id,
      slug: createArtworkSlug(submission.value.title, artist.label),
      artistId: artist.value,
      statusId: AVAILABLE.id,
    },
    include: { artist: { select: { id: true, name: true } } },
  })

  await timer.delay()

  const redirectTo = getRedirectTo(request)
  return redirect(redirectTo || `/dashboard/artworks/${artwork.id}`)
}
