import { z } from "zod"
import { zfd } from "zod-form-data"

const id = z.string().min(1, "Existing id is required")

const title = z.string().max(50, "Title limited to 50 characters")

const medium = z.string().max(50, "Medium limited to 50 characters")

const size = z.string().max(50, "size limited to 50 characters")

const year = zfd.numeric(z.number().min(2020, "Year min. is 2020").max(2100, "Year max. is 2100"))

const price = zfd.numeric(z.number().min(0, "Price min. is 0").max(500_000_000, "Price min. is 0"))

const statusSymbol = z.string().min(1, "Status is required")

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
  price,
  statusSymbol,
  artistArtwork,
  isPublished,
})

export const schemaArtworkImage = zfd.formData({
  imageId: id,
})
