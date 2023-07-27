import { z } from "zod"

const userId = z.string().min(1, "User id is required")

const id = z.string().min(1, "Existing id is required").optional()

const title = z.string().max(50, "Title limited to 50 characters")

const medium = z.string().max(50, "Medium limited to 50 characters")

const size = z.string().max(50, "size limited to 50 characters")

export const schemaArtwork = z.object({
  userId,
  id,
  title,
  medium,
  size,
  multiple: z.string().optional(),
  // These are texts because they were sent as stringified JSON from the client
  fileInfo: z.string().optional(), // Contain one object
  fileGroup: z.string().optional(), //  Contain array of multiple objects
})
