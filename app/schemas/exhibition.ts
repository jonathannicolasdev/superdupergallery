import { ifNonEmptyString } from "@conform-to/zod"
import { z } from "zod"

const id = z.string().min(1, "Existing id is required").optional()

const edition = z.number().min(1, "Edition min. is 1").max(10_000, "Edition min. is 10000")

const title = z.string().max(100, "Title limited to 100 characters")

const date = z.preprocess(
  ifNonEmptyString(value => new Date(value)),
  z.date({ required_error: "Date is required" }),
)

const description = z.string().max(1000, "Description max of 1000 characters").optional()

const isPublished = z
  .string()
  .optional()
  .transform(value => value === "on")

export const schemaExhibitionUpsert = z.object({
  id,
  edition,
  title,
  date,
  description,
  isPublished,
})
