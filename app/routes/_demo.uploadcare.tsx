import { useEffect, useState } from "react"
import { json } from "@remix-run/node"
import type { ActionArgs } from "@remix-run/node"
import { Form, useActionData, useNavigation } from "@remix-run/react"
import { parse } from "@conform-to/zod"
import { ReloadIcon } from "@radix-ui/react-icons"
import type { FileGroup, FileInfo } from "@uploadcare/react-widget"
import { badRequest, serverError } from "remix-utils"
import invariant from "tiny-invariant"
import { z } from "zod"

import { authenticator } from "~/services/auth.server"
import { prisma } from "~/libs"
import { stringify } from "~/utils"
import {
  Anchor,
  Button,
  Card,
  Debug,
  Image,
  Input,
  Label,
  Layout,
  Switch,
  toast,
  UploadcareWidget,
} from "~/components"

/**
 * Demo: Uploadcare
 */

export const schemaUploadcareDemo = z.object({
  multiple: z.string().optional(),
  // These are texts because they were sent as stringified JSON from the client
  fileInfo: z.string().optional(), // Contain one object
  fileGroup: z.string().optional(), //  Contain array of multiple objects
})

export async function action({ request }: ActionArgs) {
  const userSession = await authenticator.isAuthenticated(request)
  const userFirst = await prisma.user.findFirst()
  const userData = userSession || userFirst
  invariant(userData, "User is not available")

  const formData = await request.formData()
  const submission = parse(formData, { schema: schemaUploadcareDemo })
  if (!submission.value || submission.intent !== "submit") {
    return badRequest(submission)
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
      return json({ ...submission, newImages })
    }
  } catch (error) {
    console.error(error)
    return serverError(submission)
  }

  return json(submission)
}

export default function Route() {
  const actionData = useActionData<typeof action>()
  const navigation = useNavigation()
  const isLoading = navigation.state === "submitting"

  const [isMultiple, setIsMultiple] = useState<boolean>(true)
  const [fileInfo, setFileInfo] = useState<FileInfo>()
  const [fileGroup, setFileGroup] = useState<FileGroup>()
  const [fileGroupNumbers, setFileGroupNumbers] = useState<number[]>()

  const isSubmitEnabled =
    (!isMultiple && fileInfo?.cdnUrl) || (isMultiple && fileGroup?.cdnUrl)

  // Keep in mind changing between multiple and not
  // after uploaded some file(s) could cause the expected behaviors
  // for the Uploadcare error:
  // - FileInfo to FileGroup: Can’t create file group
  // - FileGroup to FileInfo: Incorrect value
  function handleChangeMultiple() {
    setIsMultiple(!isMultiple)
  }

  function handleUploaded(file: any) {
    if (!file?.count && !isMultiple) {
      setFileInfo(file as FileInfo)
    }
    if (file?.count && isMultiple) {
      setFileGroup(file as FileGroup)
      setFileGroupNumbers(Array.from(Array(file?.count).keys()))
    }
  }

  // TODO: Use cookie https://jacobparis.com/guides/remix-form-toast
  useEffect(() => {
    if (actionData?.intent === "submit") {
      const mode = isMultiple ? "Multiple files" : "Single file"
      toast({ title: `${mode} uploaded and submitted!` })
    }
  }, [actionData, isMultiple])

  return (
    <Layout className="py-10">
      <div className="mx-auto flex w-full max-w-xl flex-col gap-8">
        <section className="flex items-center gap-4">
          <Switch
            id="uploadcare-multiple"
            onCheckedChange={handleChangeMultiple}
            checked={isMultiple}
          />
          <Label htmlFor="uploadcare-multiple">
            {isMultiple ? "Multiple Upload" : "Single Upload"}
          </Label>
        </section>

        <Form method="POST" className="flex flex-col gap-4">
          <div className="flex flex-col gap-4">
            <Label>Upload image{isMultiple && "s"}:</Label>
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
              name="fileInfo"
              value={stringify(fileInfo)}
              readOnly
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
              {!fileInfo && !fileGroup && (
                <div className="flex h-[inherit] w-full select-none items-center justify-center">
                  <p className="dim">
                    {isMultiple ? "Some images" : "An image"} will be previewed
                    here
                  </p>
                </div>
              )}

              {/* If one file as a FileInfo */}
              {!isMultiple && fileInfo && (
                <Anchor href={String(fileInfo?.cdnUrl)}>
                  <Image
                    src={String(fileInfo?.cdnUrl)}
                    alt={String(fileInfo?.name)}
                    className="max-h-32 max-w-xs object-cover"
                  />
                </Anchor>
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

          <Button
            disabled={!isSubmitEnabled}
            type="submit"
            name="intent"
            value="submit"
            className="flex gap-2"
          >
            {isLoading && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}
            <span>
              {isLoading ? "Saving" : "Save"}{" "}
              {isMultiple ? " Images" : " Image"}
            </span>
          </Button>
        </Form>

        <Debug name="state,actionData" isAlwaysShow={false}>
          {{
            state: { fileInfo, fileGroup, fileGroupNumbers },
            actionData,
          }}
        </Debug>
      </div>
    </Layout>
  )
}
