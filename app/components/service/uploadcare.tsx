import { useState } from "react"
import { Widget } from "@uploadcare/react-widget"
import type { FileGroup, FileInfo, WidgetProps } from "@uploadcare/react-widget"
import uploadcareTabEffects from "uploadcare-widget-tab-effects/react-en"

import { useRootLoaderData } from "~/hooks"
import { Alert, Button, Debug } from "~/components"

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
    tabs = "file url",
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
