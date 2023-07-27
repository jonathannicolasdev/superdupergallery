import { useEffect, useState } from "react"
import type { ActionArgs, LoaderArgs } from "@remix-run/node"
import { json, redirect } from "@remix-run/node"
import { Form, useActionData, useNavigation } from "@remix-run/react"
import { conform, useForm } from "@conform-to/react"
import { parse } from "@conform-to/zod"
import type { FileGroup, FileInfo } from "@uploadcare/react-widget"
import { badRequest, serverError } from "remix-utils"

import { authenticator } from "~/services/auth.server"
import { prisma } from "~/libs"
import { createArtworkSlug, stringify } from "~/utils"
import { useRootLoaderData } from "~/hooks"
import {
  Alert,
  Anchor,
  Button,
  Card,
  Debug,
  FormField,
  FormLabel,
  Image,
  Input,
  Layout,
  toast,
  UploadcareWidget,
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
    <Layout className="flex flex-wrap gap-8 p-4 sm:flex-nowrap">
      <section id="artworks-action" className="w-full space-y-8 sm:max-w-3xl">
        <header className="space-y-4">
          <h1 className="flex items-center gap-2 text-4xl text-brand">
            <img src="/images/cat-wood.png" alt="Cat" className="h-10" />
            <span>Add New Artwork</span>
          </h1>
        </header>

        <section className="space-y-4 rounded bg-gray-900 p-4">
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
                  placeholder={`Some Creative Title`}
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
                  placeholder={`Ex: Canvas, Acrylic`}
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

              <ArtworkImageUploader />

              <Button type="submit" name="intent" disabled={isSubmitting}>
                Add New Artwork
              </Button>
            </fieldset>
          </Form>
        </section>
      </section>
    </Layout>
  )
}

export function ArtworkImageUploader() {
  const actionData = useActionData<typeof action>()

  const isMultiple = true
  const [fileGroup, setFileGroup] = useState<FileGroup>()
  const [fileGroupNumbers, setFileGroupNumbers] = useState<number[]>()

  function handleUploaded(file: any) {
    setFileGroup(file as FileGroup)
    setFileGroupNumbers(Array.from(Array(file?.count).keys()))
  }

  useEffect(() => {
    if (actionData?.intent === "submit") {
      toast({ title: `Multiple artwork images are uploaded` })
    }
  }, [actionData, isMultiple])

  return (
    <div className="mx-auto w-full space-y-2">
      <div className="space-y-2">
        <FormLabel>Upload Images</FormLabel>
        <UploadcareWidget
          multiple={isMultiple}
          handleUploaded={handleUploaded}
          isDemo
          isAlwaysShowDebug={false}
        />
        <input
          className="hidden"
          type="checkbox"
          id="multiple"
          name="multiple"
          readOnly
          // checked, not defaultChecked because dynamic value
          checked={isMultiple}
        />
        <Input
          type="hidden"
          name="fileGroup"
          value={stringify(fileGroup)}
          readOnly
        />
      </div>

      <div>
        <Card
          data-id="preview-uploaded-files"
          className="flex min-h-[10rem] w-full items-center p-2"
        >
          {/* If no file/files yet */}
          {!fileGroup && (
            <div className="flex h-[inherit] w-full select-none items-center justify-center">
              <p>Artwork images will be previewed here</p>
            </div>
          )}

          {/* If multiple files as a FileGroup */}
          {isMultiple && Number(fileGroup?.count) > 0 && (
            <div className="flex h-[inherit] w-full items-center">
              {fileGroupNumbers &&
                fileGroupNumbers?.length > 0 &&
                fileGroupNumbers.map(number => {
                  const cdnUrl = `${fileGroup?.cdnUrl}nth/${number}/`
                  return (
                    <Anchor key={cdnUrl} href={cdnUrl}>
                      <Image
                        src={cdnUrl}
                        alt={`Uploaded file: ${number}`}
                        className="max-h-32 max-w-xs object-cover"
                      />
                    </Anchor>
                  )
                })}
            </div>
          )}
        </Card>
      </div>

      <Debug name="state,actionData" isAlwaysShow={false}>
        {{
          state: { fileGroup, fileGroupNumbers },
          actionData,
        }}
      </Debug>
    </div>
  )
}

export async function action({ request }: ActionArgs) {
  const userData = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  })

  const formData = await request.formData()
  const submission = parse(formData, { schema: schemaArtwork })

  if (!submission.value || submission.intent !== "submit") {
    return json(submission, { status: 400 })
  }

  try {
    // Transform checkbox "on" or null value to boolean
    const multiple = submission?.value?.multiple === "on" ? true : false

    // If not multiple, save one file info to database (Image table)
    if (!multiple && submission?.value?.fileInfo) {
      const fileInfo: FileInfo = JSON.parse(String(submission?.value?.fileInfo))
      const newImage = await prisma.artworkImage.create({
        data: {
          url: String(fileInfo.cdnUrl),
          userId: userData.id,
        },
      })
      if (!newImage) {
        return badRequest(submission)
      }
      return json({ ...submission, newImage })
    }

    // If multiple, save multiple files info to database (Image table)
    if (multiple && submission?.value?.fileGroup) {
      const fileGroup: FileGroup = JSON.parse(
        String(submission?.value?.fileGroup),
      )
      const fileGroupNumbers = Array.from(Array(fileGroup?.count).keys())

      if (fileGroup?.count <= 0 && fileGroupNumbers?.length <= 0) {
        return badRequest(submission)
      }

      const files = fileGroupNumbers.map(number => {
        return { cdnUrl: `${fileGroup?.cdnUrl}nth/${number}/` } as FileInfo
      })

      const newImages = await prisma.artworkImage.createMany({
        data: files.map(file => {
          return {
            url: String(file.cdnUrl),
            userId: userData.id,
          }
        }),
      })
      if (!newImages) {
        return badRequest(submission)
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

      return json({ ...submission, newImages })
    }
  } catch (error) {
    console.error(error)
    return serverError(submission)
  }

  return json(submission)
}
