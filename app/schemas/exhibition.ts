import { ifNonEmptyString } from "@conform-to/zod"
import { z } from "zod"
import { zfd } from "zod-form-data"

const id = z.string().min(1, "Existing id is required").optional()

const edition = zfd.numeric(
  z.number().min(1, "Edition min. is 1").max(10_000, "Edition min. is 10000"),
)

const title = z.string().max(100, "Title limited to 100 characters")

const date = z.preprocess(
  ifNonEmptyString(value => new Date(value)),
  z
    .date()
    .min(new Date("2020-01-01"), { message: "Too early" })
    .max(new Date("2100-01-01"), { message: "Too far in the future" })
    .optional(),
)

const description = z.string().max(1000, "Description max of 1000 characters").optional()

const isPublished = z
  .string()
  .transform(value => value === "on")
  .optional()

// const exhibitionArtist = z.object({
//   value: id,
//   label: z.string(),
// })
// const exhibitionArtists = z.array(exhibitionArtist).optional()

// const exhibitionArtwork = z.object({
//   value: id,
//   label: z.string(),
// })
// const exhibitionArtworks = z.array(exhibitionArtwork).optional()

export const schemaExhibition = zfd.formData({
  id,
  edition,
  title,
  date,
  description,
  isPublished,
})
