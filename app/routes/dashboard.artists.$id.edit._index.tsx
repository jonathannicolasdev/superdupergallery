import { useState } from "react"
import type { ActionArgs, LoaderArgs } from "@remix-run/node"
import { json, redirect } from "@remix-run/node"
import { Form, useActionData, useLoaderData, useNavigation } from "@remix-run/react"
import { conform, useForm } from "@conform-to/react"
import { parse } from "@conform-to/zod"
import type { MultiValue } from "react-select"
import Select from "react-select"
import { badRequest } from "remix-utils"

import { authenticator } from "~/services/auth.server"
import { prisma } from "~/libs"
import { createArtistSlug, createTimer } from "~/utils"
import {
  ButtonLoading,
  Debug,
  FormAlert,
  FormDescription,
  FormField,
  FormFieldSet,
  FormLabel,
  Input,
  Textarea,
} from "~/components"
import { schemaArtist } from "~/schemas/artist"

export async function loader({ request, params }: LoaderArgs) {
  const [artist, artworks] = await prisma.$transaction([
    prisma.artist.findFirst({
      where: { id: params.id },
      include: {
        image: true,
        artworks: {
          include: {
            images: { select: { url: true } },
            artist: true,
          },
        },
      },
    }),

    prisma.artwork.findMany({
      include: { images: true },
    }),
  ])

  if (!artist || !artworks) {
    return redirect("/dashboard/artists")
  }

  return json({ artist, artworks })
}

export default function Route() {
  const { artist, artworks } = useLoaderData<typeof loader>()

  const navigation = useNavigation()
  const isSubmitting = navigation.state === "submitting"

  const lastSubmission = useActionData()
  const [form, { name, bio }] = useForm({
    shouldRevalidate: "onInput",
    lastSubmission,
    onValidate({ formData }) {
      return parse(formData, { schema: schemaArtist })
    },
    defaultValue: {
      name: artist.name,
      bio: artist.bio,
    },
  })

  const artworksOptions = artworks
    .filter(artwork => !artwork.artistId)
    .map(artwork => ({ value: artwork.id, label: artwork.title }))

  const [selectedArtworks, setSelectedArtworks] = useState<
    MultiValue<{ value: string; label: string }>
  >(
    artist.artworks.map(artwork => ({
      value: artwork.id,
      label: artwork.title,
    })),
  )

  return (
    <>
      <header className="space-y-2">
        <p>Edit Artist: {artist.id}</p>
        <Debug>{{ lastSubmission }}</Debug>
      </header>

      <section className="max-w-xl">
        <Form method="PUT" {...form.props}>
          <FormFieldSet disabled={isSubmitting}>
            <input type="hidden" name="id" defaultValue={artist.id} />

            <FormField>
              <FormLabel htmlFor={name.id}>Name</FormLabel>
              <FormDescription>Limited to 100 characters</FormDescription>
              <Input {...conform.input(name)} type="text" />
              <FormAlert config={name} />
            </FormField>

            <FormField>
              <FormLabel htmlFor={bio.id}>Bio</FormLabel>
              <FormDescription>Limited to 1000 characters</FormDescription>
              <Textarea {...conform.input(bio)} />
              <FormAlert config={bio} />
            </FormField>

            <FormField className="space-y-1">
              <FormLabel>Artworks</FormLabel>
              <input
                type="hidden"
                name="artistArtworks"
                defaultValue={JSON.stringify(selectedArtworks)}
              />
              <Select
                isMulti
                options={artworksOptions}
                className="bg-black"
                classNamePrefix="select"
                defaultValue={selectedArtworks}
                onChange={values => {
                  setSelectedArtworks(values)
                }}
              />
            </FormField>

            <ButtonLoading isSubmitting={isSubmitting} submittingText="Saving Artist...">
              Save Artist
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

  const submission = parse(formData, { schema: schemaArtist })
  if (!submission.value || submission.intent !== "submit") {
    return badRequest(submission)
  }

  const artworks = JSON.parse(submission.payload.artistArtworks).map((artwork: any) => ({
    id: artwork.value,
  }))

  const dataArtist = {
    ...submission.value,
    userId: userSession?.id,
    slug: createArtistSlug(submission.value.name),
    artworks: { connect: artworks },
  }

  await prisma.artist.update({
    where: { id: dataArtist.id },
    data: { artworks: { set: [] } },
  })

  const newArtist = await prisma.artist.upsert({
    where: { id: dataArtist.id },
    create: dataArtist,
    update: dataArtist,
    include: {
      artworks: { select: { id: true, title: true } },
    },
  })

  await timer.delay()
  return redirect(`/dashboard/artists/${newArtist.id || dataArtist.id}`)
}
