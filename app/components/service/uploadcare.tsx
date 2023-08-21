import { useState } from "react"
import { json } from "@remix-run/node"
import type { ActionArgs } from "@remix-run/node"
import { parse } from "@conform-to/zod"
import { Widget } from "@uploadcare/react-widget"
import type { FileGroup, FileInfo, WidgetProps } from "@uploadcare/react-widget"
import { badRequest, serverError } from "remix-utils"
import uploadcareTabEffects from "uploadcare-widget-tab-effects/react-en"
import { z } from "zod"

import { prisma } from "~/libs"
import { useRootLoaderData } from "~/hooks"
import { Alert, Anchor, Button, Card, Debug, Image } from "~/components"

import { uploadcareLocaleTranslations } from "./uploadcare.locale"

/**
 * Uploadcare Service Component
 *
 * - This is using the older uploader widget, as the newest is still in beta
 * - This is implemented using public key, without server-side private key yet
 *
 * Docs:
 * - https://uploadcare.com
 * - https://uploadcare.com/docs/uploads/file-uploader
 */

type ModifiedFileInfo = { cdnUrl: null | string; name: null | string }
type ModifiedFileGroup = { cdnUrl: null | string; count: number }

interface UploadcareWidgetProps extends Partial<WidgetProps> {
  handleUploaded?: (file: FileInfo | FileGroup) => void
  isDemo?: boolean
  isAlwaysShowDebug?: boolean
}

export function UploadcareWidget(props: UploadcareWidgetProps) {
  const {
    // WidgetProps
    publicKey,
    multiple,
    tabs = "file url gdrive instagram",
    previewStep = true,
    effects = ["crop", "sharp", "enhance"],

    // Custom
    handleUploaded,
    isDemo,
    isAlwaysShowDebug = false,
  } = props

  const { ENV } = useRootLoaderData()
  const [widgetFileState, setWidgetFileState] = useState({})

  function handleChange(fileObject: FileInfo | FileGroup) {
    // To set the local state
    setWidgetFileState(fileObject)

    // To send FileInfo or FileGroup to parent component
    if (handleUploaded) {
      handleUploaded(fileObject)
    }
  }

  return (
    <div className="stack-start">
      {!ENV.UPLOADCARE_PUBLIC_KEY && (
        <Alert>Sorry, the upload feature is currently unavailable.</Alert>
      )}

      {ENV.UPLOADCARE_PUBLIC_KEY && (
        <div className="queue-center h-8 w-full">
          <Widget
            publicKey={isDemo ? "demopublickey" : publicKey || ENV.UPLOADCARE_PUBLIC_KEY}
            onChange={handleChange}
            multiple={multiple}
            tabs={tabs}
            previewStep={previewStep}
            effects={effects}
            customTabs={{ preview: uploadcareTabEffects }}
            localeTranslations={uploadcareLocaleTranslations}
            preloader={<Button size="sm" variant="secondary" />}
          />
        </div>
      )}

      {ENV.UPLOADCARE_PUBLIC_KEY && (
        <Debug name="nodeEnv, widgetProps, widgetFileState" isAlwaysShow={isAlwaysShowDebug}>
          {{ ENV, props, widgetFileState }}
        </Debug>
      )}
    </div>
  )
}

interface UploadcarePreviewProps {
  isMultiple: boolean
  fileInfo?: ModifiedFileInfo
  fileGroup?: ModifiedFileGroup
  fileGroupNumbers?: number[]
  previewText?: string
}

export function UploadcarePreview({
  isMultiple,
  fileInfo,
  fileGroup,
  fileGroupNumbers,
  previewText,
}: UploadcarePreviewProps) {
  return (
    <Card
      withBorder
      data-id="preview-uploaded-files"
      className="flex min-h-[10rem] w-full items-center p-2"
    >
      {/* If no file/files yet */}
      {!fileInfo && !fileGroup && (
        <div className="flex h-[inherit] w-full select-none items-center justify-center">
          {previewText ? (
            <p>{previewText}</p>
          ) : (
            <p>{isMultiple ? "Some images" : "An image"} will be previewed here</p>
          )}
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
  )
}

export const schemaUploadcareDemo = z.object({
  fileInfo: z.string().optional(), // Contain one object
  fileGroup: z.string().optional(), //  Contain array of multiple objects
})

export function useUploadcareConfigs({
  isMultiple = false,
  defaultFileInfo,
  defaultFileGroup,
}: {
  isMultiple: boolean
  defaultFileInfo?: ModifiedFileInfo
  defaultFileGroup?: ModifiedFileGroup
}) {
  const [fileInfo, setFileInfo] = useState(defaultFileInfo)
  const [fileGroup, setFileGroup] = useState(defaultFileGroup)
  const [fileGroupNumbers, setFileGroupNumbers] = useState<number[]>()

  function handleUploaded(file: any) {
    if (!file?.count && !isMultiple) {
      setFileInfo(file as FileInfo)
    }

    if (file?.count && isMultiple) {
      setFileGroup(file as FileGroup)
      setFileGroupNumbers(Array.from(Array(file?.count).keys()))
    }
  }

  return {
    isMultiple,
    handleUploaded,
    fileInfo,
    fileGroup,
    fileGroupNumbers,
  }
}

export async function actionExample({ request }: ActionArgs) {
  const formData = await request.formData()
  const submission = parse(formData, { schema: schemaUploadcareDemo })
  if (!submission.value || submission.intent !== "submit") {
    return badRequest(submission)
  }

  try {
    const multiple = true || false

    // If not multiple, save one file info to database (Image table)
    if (!multiple && submission?.value?.fileInfo) {
      const fileInfo: FileInfo = JSON.parse(String(submission?.value?.fileInfo))
      const newImage = await prisma.artworkImage.create({
        data: { url: String(fileInfo.cdnUrl) },
      })
      if (!newImage) return badRequest(submission)
      return json({ ...submission, newImage })
    }

    // If multiple, save multiple files info to database (Image table)
    if (multiple && submission?.value?.fileGroup) {
      const fileGroup: FileGroup = JSON.parse(String(submission?.value?.fileGroup))
      const fileGroupNumbers = Array.from(Array(fileGroup?.count).keys())

      if (fileGroup?.count <= 0 && fileGroupNumbers?.length <= 0) {
        return badRequest(submission)
      }

      const files = fileGroupNumbers.map(number => {
        return { cdnUrl: `${fileGroup?.cdnUrl}nth/${number}/` } as FileInfo
      })

      const newImages = await prisma.artworkImage.createMany({
        data: files.map(file => {
          return { url: String(file.cdnUrl) }
        }),
      })
      if (!newImages) return badRequest(submission)
      return json({ ...submission, newImages })
    }
  } catch (error) {
    console.error(error)
    return serverError(submission)
  }

  return json(submission)
}
