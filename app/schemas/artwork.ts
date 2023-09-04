import { z } from "zod"
import { zfd } from "zod-form-data"

const id = z.string().min(1, "Existing id is required")

const title = z.string().max(50, "Title limited to 50 characters")

const medium = z.string().max(50, "Medium limited to 50 characters")

const size = z.string().max(50, "size limited to 50 characters")

const year = zfd.numeric(z.number().min(2020, "Year min. is 2020").max(2100, "Year max. is 2100"))

const isPublished = z
  .string()
  .transform(value => value === "on")
  .optional()

const artistArtwork = z
  .object({
    value: id,
    label: z.string(),
  })
  .optional()

export const schemaArtwork = z.object({
  id,
  fileInfo: z.string().optional(),
  title,
  medium,
  size,
  year,
  artistArtwork,
  isPublished,
})

export const schemaArtworkImage = zfd.formData({
  imageId: id,
})
