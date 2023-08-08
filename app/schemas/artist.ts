import { z } from "zod"

const id = z.string().min(1, "Existing id is required").optional()

const name = z.string().max(100, "Name limited to 100 characters")

const bio = z.string().max(1000, "Medium limited to 1000 characters").optional()

export const schemaArtist = z.object({
  id,
  name,
  bio,
})
