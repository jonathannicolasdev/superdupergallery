import { useState } from "react"
import type { ActionArgs, LoaderArgs } from "@remix-run/node"
import { json, redirect } from "@remix-run/node"
import { Form, Link, useActionData, useLoaderData, useNavigation } from "@remix-run/react"
import { conform, parse, useForm } from "@conform-to/react"
import { parse as parseZod } from "@conform-to/zod"
import type { FileInfo } from "@uploadcare/react-widget"
import type { MultiValue } from "react-select"
import Select from "react-select"
import { badRequest } from "remix-utils"

import type { OptionValueLabel } from "~/types"
import { prisma } from "~/libs"
import { createExhibitionSlug, createTimer, stringify } from "~/utils"
import {
  Button,
  ButtonLoading,
  DatePicker,
  FormAlert,
  FormDescription,
  FormField,
  FormFieldSet,
  FormLabel,
  Input,
  Switch,
  Textarea,
  UploadcarePreview,
  UploadcareWidget,
  useUploadcareConfigs,
} from "~/components"
import { schemaExhibition, schemaExhibitionImage } from "~/schemas"

export async function loader({ request, params }: LoaderArgs) {
  const [exhibition, artists, artworks] = await prisma.$transaction([
    prisma.exhibition.findFirst({
      where: { id: params.id },
      include: {
        images: true,
        artists: true,
        artworks: {
          include: {
            images: { select: { url: true } },
            artist: true,
          },
        },
      },
    }),

    prisma.artist.findMany({
      select: { id: true, name: true },
    }),

    prisma.artwork.findMany({
      include: {
        images: true,
        artist: true,
      },
    }),
  ])

  if (!exhibition || !artists || !artworks) {
    return redirect("/dashboard/exhibitions")
  }

  return json({ exhibition, artists, artworks })
}

export default function Route() {
  const { exhibition, artists, artworks } = useLoaderData<typeof loader>()

  const navigation = useNavigation()
  const isSubmitting = navigation.state === "submitting"

  const lastSubmission = useActionData()
  const [form, { edition, title, date, description, isPublished }] = useForm({
    shouldRevalidate: "onInput",
    lastSubmission,
    // constraint: getFieldsetConstraint(schemaExhibition),
    onValidate({ formData }) {
      return parseZod(formData, { schema: schemaExhibition })
    },
    defaultValue: {
      edition: exhibition.edition,
      title: exhibition.title,
      date: exhibition.date,
      description: exhibition.description,
      isPublished: exhibition.isPublished,
    },
  })

  const artistsOptions = artists.map(artist => ({ value: artist.id, label: artist.name }))
  const artworksOptions = artworks.map(artwork => ({
    value: artwork.id,
    label: artwork.artist?.name ? `${artwork.title} (${artwork.artist.name})` : artwork.title,
  }))

  const [selectedArtists, setSelectedArtists] = useState<MultiValue<OptionValueLabel>>(
    exhibition.artists.map(artist => ({
      value: artist.id,
      label: artist.name,
    })),
  )

  const [selectedArtworks, setSelectedArtworks] = useState<MultiValue<OptionValueLabel>>(
    exhibition.artworks.map(artwork => ({
      value: artwork.id,
      label: `${artwork.title} (${artwork.artist?.name})`,
    })),
  )

  const { isMultiple, handleUploaded, fileInfo, setFileInfo } = useUploadcareConfigs({
    isMultiple: false,
    defaultFileInfo: exhibition.images[0]?.url
      ? {
          id: exhibition.images[0].id,
          cdnUrl: exhibition.images[0].url,
          name: "",
        }
      : undefined,
  })

  return (
    <>
      <header>
        <Link to={`/dashboard/exhibitions/${exhibition.id}`}>
          Exhibition: <code>{exhibition.id}</code>
        </Link>
      </header>

      <section className="max-w-xl">
        <Form method="PUT" {...form.props}>
          <FormFieldSet disabled={isSubmitting}>
            <input type="hidden" name="id" defaultValue={exhibition.id} readOnly />

            <input type="hidden" name="fileInfo" value={stringify(fileInfo)} readOnly />

            <UploadcareWidget multiple={isMultiple} handleUploaded={handleUploaded} />
            <UploadcarePreview
              isMultiple={isMultiple}
              fileInfo={fileInfo}
              setFileInfo={setFileInfo}
              previewText="Exhibition poster will be previewed here"
            />

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

            <FormField className="space-y-1">
              <div className="flex items-center justify-between gap-2">
                <FormLabel>Artists</FormLabel>
                <Form method="POST" action="/dashboard/artists">
                  <input
                    hidden
                    name="redirectTo"
                    defaultValue={`/dashboard/exhibitions/${exhibition.id}/edit`}
                  />
                  <Button type="submit" size="xs">
                    Add New Artist
                  </Button>
                </Form>
              </div>
              <input
                type="hidden"
                name="exhibitionArtists"
                defaultValue={JSON.stringify(selectedArtists)}
              />
              <Select
                isMulti
                classNamePrefix="select"
                options={artistsOptions}
                defaultValue={selectedArtists}
                onChange={values => {
                  setSelectedArtists(values)
                }}
              />
            </FormField>

            <FormField className="space-y-1">
              <div className="flex items-center justify-between gap-2">
                <FormLabel>Artworks</FormLabel>
                <Form method="POST" action="/dashboard/artworks">
                  <input
                    hidden
                    name="redirectTo"
                    defaultValue={`/dashboard/exhibitions/${exhibition.id}/edit`}
                  />
                  <Button type="submit" size="xs">
                    Add New Artwork
                  </Button>
                </Form>
              </div>
              <input
                type="hidden"
                name="exhibitionArtworks"
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

            <FormField className="space-y-1">
              <div className="flex items-center space-x-2">
                <Switch name={isPublished.name} defaultChecked={Boolean(exhibition.isPublished)} />
                <FormLabel>Published?</FormLabel>
              </div>
            </FormField>

            <ButtonLoading
              isSubmitting={isSubmitting}
              submittingText="Saving Exhibition..."
              name="intent"
              value="save-exhibition"
            >
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
  const formData = await clonedRequest.formData()

  const parsed = parse(formData)
  const { intent } = parsed.payload

  if (intent === "delete-image") {
    const submission = parseZod(formData, { schema: schemaExhibitionImage })
    await prisma.exhibitionImage.delete({ where: { id: submission.payload.imageId } })
    return null
  }

  if (intent === "save-exhibition") {
    const submission = parseZod(formData, { schema: schemaExhibition })
    if (!submission.value || submission.intent !== "submit") {
      return badRequest(submission)
    }

    const artists: { id: string }[] = JSON.parse(submission.payload.exhibitionArtists).map(
      (artist: any) => ({ id: artist.value }),
    )

    const artworks: { id: string }[] = JSON.parse(submission.payload.exhibitionArtworks).map(
      (artwork: any) => ({ id: artwork.value }),
    )

    await prisma.exhibition.update({
      where: { id: submission.value.id },
      data: { artists: { set: [] }, artworks: { set: [] } },
    })

    const { fileInfo, ...submissionValue } = submission.value
    const parsedFileInfo: FileInfo | undefined = fileInfo ? JSON.parse(String(fileInfo)) : undefined
    const imageURL = parsedFileInfo?.cdnUrl

    const exhibition = await prisma.exhibition.update({
      where: { id: submission.value.id },
      data: {
        ...submissionValue,
        slug: createExhibitionSlug(submission.value.edition, submission.value.title),
        artists: { connect: artists },
        artworks: { connect: artworks },
        images: imageURL ? { create: { url: imageURL } } : undefined,
        isPublished: Boolean(submissionValue.isPublished),
      },
      include: {
        artists: { select: { id: true, name: true } },
        artworks: { select: { id: true, title: true } },
      },
    })

    await timer.delay()
    return redirect(`/dashboard/exhibitions/${exhibition.id}`)
  }

  return null
}
