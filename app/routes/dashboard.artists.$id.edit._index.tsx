import { useState } from "react"
import type { ActionArgs, LoaderArgs } from "@remix-run/node"
import { json, redirect } from "@remix-run/node"
import { Form, useActionData, useLoaderData, useNavigation } from "@remix-run/react"
import { conform, useForm } from "@conform-to/react"
import { parse } from "@conform-to/zod"
import type { MultiValue } from "react-select"
import Select from "react-select"
import { badRequest } from "remix-utils"

import type { OptionValueLabel } from "~/types"
import { authenticator } from "~/services/auth.server"
import { createAvatarImageURL, prisma } from "~/libs"
import { createArtistSlug, createTimer, getNameInitials, getRedirectTo } from "~/utils"
import {
  AvatarAuto,
  Button,
  ButtonLoading,
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
  const [form, { id, name, bio }] = useForm({
    shouldRevalidate: "onInput",
    lastSubmission,
    onValidate({ formData }) {
      return parse(formData, { schema: schemaArtist })
    },
    defaultValue: {
      id: artist.id,
      name: artist.name,
      bio: artist.bio,
    },
  })

  const artworksOptions = artworks
    .filter(artwork => !artwork.artistId)
    .map(artwork => ({ value: artwork.id, label: artwork.title }))

  const [selectedArtworks, setSelectedArtworks] = useState<MultiValue<OptionValueLabel>>(
    artist.artworks.map(artwork => ({
      value: artwork.id,
      label: artwork.title,
    })),
  )

  // TODO: redirectTo get from URL instead of /dashboard/artists/${artist.id}/edit

  return (
    <>
      <header className="space-y-2">
        <p>
          Edit Artist: <code>{artist.id}</code>
        </p>
      </header>

      <section className="max-w-xl">
        <Form method="PUT" {...form.props}>
          <FormFieldSet disabled={isSubmitting}>
            <input type="hidden" {...conform.input(id)} />

            <AvatarAuto
              src={artist.image?.url}
              alt={`${artist.name}`}
              fallback={getNameInitials(artist.name)}
              className="h-20 w-20"
            />

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
              <div className="flex items-center justify-between gap-2">
                <FormLabel>Artworks</FormLabel>
                <Form method="POST" action="/dashboard/artworks">
                  <input
                    hidden
                    name="redirectTo"
                    defaultValue={`/dashboard/artists/${artist.id}/edit`}
                  />
                  <Button type="submit" size="xs">
                    Add New Artwork
                  </Button>
                </Form>
              </div>
              <input
                type="hidden"
                name="artistArtworks"
                defaultValue={JSON.stringify(selectedArtworks)}
              />
              <Select
                isMulti
                options={artworksOptions}
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

  const artworks: { id: string }[] = JSON.parse(submission.payload.artistArtworks).map(
    (artwork: any) => ({
      id: artwork.value,
    }),
  )

  const slug = createArtistSlug(submission.value.name)

  await prisma.artist.update({
    where: { id: submission.value.id },
    data: { artworks: { set: [] } },
  })

  const artist = await prisma.artist.update({
    where: { id: submission.value.id },
    data: {
      ...submission.value,
      userId: userSession?.id,
      slug: slug,
      artworks: { connect: artworks },
      image: { create: { url: createAvatarImageURL(slug) } },
    },
    include: { artworks: { select: { id: true, title: true } } },
  })
  if (!artist) return null

  await timer.delay()

  const redirectTo = getRedirectTo(request)
  return redirect(redirectTo || `/dashboard/artists/${artist.id}`)
}
