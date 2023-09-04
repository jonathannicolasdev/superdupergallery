import { useState } from "react"
import type { ActionArgs, LoaderArgs } from "@remix-run/node"
import { json, redirect } from "@remix-run/node"
import { Form, Link, useActionData, useLoaderData, useNavigation } from "@remix-run/react"
import { conform, parse, useForm } from "@conform-to/react"
import { parse as parseZod } from "@conform-to/zod"
import type { FileInfo } from "@uploadcare/react-widget"
import type { SingleValue } from "react-select"
import ReactSelect from "react-select"
import { badRequest } from "remix-utils"

import type { OptionValueLabel } from "~/types"
import { authenticator } from "~/services/auth.server"
import { prisma } from "~/libs"
import { createArtworkSlug, createTimer, getRedirectTo, stringify } from "~/utils"
import {
  ButtonLoading,
  FormAlert,
  FormDescription,
  FormField,
  FormFieldSet,
  FormLabel,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Switch,
  UploadcarePreview,
  UploadcareWidget,
  useUploadcareConfigs,
} from "~/components"
import { model } from "~/models"
import { schemaArtwork, schemaArtworkImage } from "~/schemas"

export async function loader({ request, params }: LoaderArgs) {
  const [artwork, artists, artworkStatuses] = await prisma.$transaction([
    prisma.artwork.findFirst({
      where: { id: params.id },
      include: { images: true, artist: true, status: true },
    }),

    prisma.artist.findMany({
      include: { image: true },
    }),

    prisma.artworkStatus.findMany({
      select: { symbol: true, name: true, description: true },
    }),
  ])

  if (!artwork || !artists || !artworkStatuses) {
    return redirect("/dashboard/artworks")
  }

  return json({ artwork, artists, artworkStatuses })
}

export default function Route() {
  const { artwork, artists, artworkStatuses } = useLoaderData<typeof loader>()

  const navigation = useNavigation()
  const isSubmitting = navigation.state === "submitting"

  const lastSubmission = useActionData()
  const [form, { id, title, medium, size, year, price, statusSymbol, isPublished }] = useForm({
    shouldRevalidate: "onInput",
    lastSubmission,
    onValidate({ formData }) {
      return parseZod(formData, { schema: schemaArtwork })
    },
    defaultValue: {
      id: artwork.id,
      title: artwork.title,
      medium: artwork.medium,
      size: artwork.size,
      year: artwork.year,
      price: artwork.price,
      isPublished: artwork.isPublished,
    },
  })

  const artistsOptions = artists.map(artist => ({ value: artist.id, label: artist.name }))

  const [selectedArtist, setSelectedArtist] = useState<SingleValue<OptionValueLabel>>({
    value: artwork.artist?.id || "",
    label: artwork.artist?.name || "",
  })

  const { isMultiple, handleUploaded, fileInfo, setFileInfo } = useUploadcareConfigs({
    isMultiple: false,
    defaultFileInfo: artwork.images[0]?.url
      ? {
          id: artwork.images[0].id,
          cdnUrl: artwork.images[0].url,
          name: "",
        }
      : undefined,
  })

  return (
    <>
      <header>
        <Link to={`/dashboard/artworks/${artwork.id}`}>
          Artwork: <code>{artwork.id}</code>
        </Link>
      </header>

      <section className="max-w-xl">
        <Form method="PUT" {...form.props}>
          <FormFieldSet disabled={isSubmitting}>
            <input type="hidden" {...conform.input(id)} />

            <input type="hidden" name="fileInfo" value={stringify(fileInfo)} readOnly />

            <UploadcareWidget multiple={isMultiple} handleUploaded={handleUploaded} />
            <UploadcarePreview
              isMultiple={isMultiple}
              fileInfo={fileInfo}
              setFileInfo={setFileInfo}
              previewText="Artwork image will be previewed here"
            />

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

            <FormField>
              <FormLabel htmlFor={price.id}>Price</FormLabel>
              <Input {...conform.input(price, { type: "number" })} min={0} max={500_000_000} />
              <FormAlert config={price} />
            </FormField>

            <FormField className="space-y-1">
              <FormLabel>Artist</FormLabel>
              <input
                type="hidden"
                name="artworkArtist"
                defaultValue={JSON.stringify(selectedArtist)}
              />
              <ReactSelect
                classNamePrefix="select"
                options={artistsOptions}
                defaultValue={selectedArtist}
                onChange={value => {
                  setSelectedArtist(value)
                }}
              />
            </FormField>

            <FormField className="space-y-1">
              <FormLabel>Status</FormLabel>
              <Select {...conform.input(statusSymbol)} defaultValue={artwork.status.symbol}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={artwork.status.name} />
                </SelectTrigger>
                <SelectContent position="popper">
                  {artworkStatuses.map(artworkStatus => {
                    return (
                      <SelectItem key={artworkStatus.symbol} value={artworkStatus.symbol}>
                        {artworkStatus.name}
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
            </FormField>

            <FormField className="space-y-1">
              <div className="flex items-center space-x-2">
                <Switch name={isPublished.name} defaultChecked={Boolean(artwork.isPublished)} />
                <FormLabel>Published?</FormLabel>
              </div>
            </FormField>

            <div className="flex gap-2">
              <ButtonLoading
                isSubmitting={isSubmitting}
                submittingText="Saving Artwork..."
                name="intent"
                value="save-artwork"
              >
                Save Artwork
              </ButtonLoading>

              <ButtonLoading
                variant="secondary"
                isSubmitting={isSubmitting}
                submittingText="Saving Artwork..."
                name="intent"
                value="save-artwork-more"
              >
                Save and Add More
              </ButtonLoading>
            </div>
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

  const parsed = parse(formData)
  const { intent } = parsed.payload

  if (intent === "delete-image") {
    const submission = parseZod(formData, { schema: schemaArtworkImage })
    await prisma.artworkImage.delete({ where: { id: submission.payload.imageId } })
    return null
  }

  if (intent === "save-artwork" || intent === "save-artwork-more") {
    const submission = parseZod(formData, { schema: schemaArtwork })
    if (!submission.value || submission.intent !== "submit") {
      return badRequest(submission)
    }

    const artworkStatus = await prisma.artworkStatus.findUnique({
      where: { symbol: submission.value.statusSymbol },
    })
    if (!artworkStatus) return null

    const artist: OptionValueLabel = JSON.parse(submission.payload.artworkArtist)
    const { fileInfo, statusSymbol, ...submissionValue } = submission.value
    const parsedFileInfo: FileInfo | undefined = fileInfo ? JSON.parse(String(fileInfo)) : undefined
    const imageURL = parsedFileInfo?.cdnUrl

    const artwork = await prisma.artwork.update({
      where: { id: submission.value.id },
      data: {
        ...submissionValue,
        userId: userSession?.id,
        slug: createArtworkSlug(submission.value.title, artist.label),
        artistId: artist.value,
        statusId: artworkStatus.id,
        images: imageURL ? { create: { url: imageURL } } : undefined,
        isPublished: Boolean(submissionValue.isPublished),
      },
      include: { artist: { select: { id: true, name: true } } },
    })

    await timer.delay()
    const redirectTo = getRedirectTo(request)

    if (intent === "save-artwork-more") {
      const { artwork } = await model.artwork.mutation.addNewArtwork()
      if (!artwork) return null

      redirectTo
        ? redirect(`/dashboard/artworks/${artwork.id}/edit?redirectTo=${redirectTo}`)
        : redirect(`/dashboard/artworks/${artwork.id}/edit`)
    }

    if (intent === "save-artwork") {
      return redirect(redirectTo || `/dashboard/artworks/${artwork.id}`)
    }

    return null
  }

  return null
}
