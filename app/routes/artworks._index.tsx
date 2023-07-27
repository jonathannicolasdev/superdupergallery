import type { ActionArgs, LoaderArgs } from "@remix-run/node"
import { json } from "@remix-run/node"
import {
  Form,
  Link,
  useActionData,
  useLoaderData,
  useNavigation,
} from "@remix-run/react"
import { conform, useForm } from "@conform-to/react"
import { parse } from "@conform-to/zod"

import { authenticator } from "~/services/auth.server"
import { prisma } from "~/libs"
import { createCacheHeaders, formatPluralItems, log } from "~/utils"
import { useRootLoaderData } from "~/hooks"
import {
  Alert,
  Button,
  Card,
  CardHeader,
  CardTitle,
  FormField,
  FormLabel,
  Input,
  Layout,
  SearchForm,
  Textarea,
} from "~/components"
import { schemaArtwork } from "~/schemas"

export async function loader({ request }: LoaderArgs) {
  const url = new URL(request.url)
  const query = url.searchParams.get("q")

  if (!query) {
    const artworks = await prisma.artwork.findMany({
      orderBy: { updatedAt: "asc" },
    })

    return json(
      { query, count: artworks.length, artworks },
      { headers: createCacheHeaders(request, 60) },
    )
  }

  const artworks = await prisma.artwork.findMany({
    orderBy: { updatedAt: "asc" },
    where: {
      OR: [{ title: { contains: query } }],
    },
  })

  return json({ query, count: artworks.length, artworks })
}

export default function ArtworksRoute() {
  const { userData } = useRootLoaderData()

  const { query, count, artworks } = useLoaderData<typeof loader>()

  const lastSubmission = useActionData<typeof action>()
  const navigation = useNavigation()
  const isSubmitting = navigation.state === "submitting"

  const [form, { title, description, body }] = useForm({
    lastSubmission,
    onValidate({ formData }) {
      return parse(formData, { schema: schemaArtwork })
    },
  })

  return (
    <Layout className="flex flex-wrap gap-8 px-4 py-4 sm:flex-nowrap">
      <section id="artworks-action" className="w-full space-y-8 sm:max-w-sm">
        <header className="space-y-4">
          <h1 className="text-4xl text-brand">
            <Link to="/artworks" className="hover-opacity">
              Artworks
            </Link>
          </h1>
        </header>

        {!userData?.id && (
          <section>
            <Button asChild>
              <Link to="/login">Add new artwork</Link>
            </Button>
          </section>
        )}

        {userData?.id && (
          <section
            id="create-artwork"
            className="space-y-4 rounded bg-gray-900 p-4"
          >
            <header>
              <h3>Quick Artwork</h3>
              <p className="text-sm text-muted-foreground">
                Quickly add new artwork to ask or offer
              </p>
            </header>

            <Form {...form.props} replace method="PUT" className="space-y-6">
              <fieldset
                disabled={isSubmitting}
                className="space-y-4 disabled:opacity-80"
              >
                <FormField>
                  <FormLabel htmlFor={title.id}>Title</FormLabel>
                  <Input
                    {...conform.input(title)}
                    type="text"
                    placeholder="Ex: Need mentor to help learning JavaScript"
                  />
                  {title.error && (
                    <Alert variant="destructive" id={title.errorId}>
                      {title.error}
                    </Alert>
                  )}
                </FormField>

                <FormField>
                  <FormLabel htmlFor={description.id}>Description</FormLabel>
                  <Input
                    {...conform.input(description)}
                    type="text"
                    placeholder="Ex: Want to build a job-ready and portfolio-worthy project"
                  />
                  {description.error && (
                    <Alert variant="destructive" id={description.errorId}>
                      {description.error}
                    </Alert>
                  )}
                </FormField>

                <FormField>
                  <FormLabel htmlFor={body.id}>Details</FormLabel>
                  <Textarea
                    {...conform.input(body)}
                    placeholder="Ex: Here are some more details about the mentorship request or service to offer..."
                    className="min-h-[200px]"
                  />
                  {body.error && (
                    <Alert variant="destructive" id={body.errorId}>
                      {body.error}
                    </Alert>
                  )}
                </FormField>

                <Button type="submit" name="intent" disabled={isSubmitting}>
                  Send
                </Button>
              </fieldset>
            </Form>
          </section>
        )}
      </section>

      <section id="artworks" className="w-full max-w-3xl space-y-4">
        <SearchForm
          action="/artworks"
          placeholder="Search artworks with keyword..."
        />
        {!query && count > 0 && (
          <p className="text-muted-foreground">{count} artworks</p>
        )}
        {query && count <= 0 && (
          <p className="text-muted-foreground">
            No artwork found with keyword "{query}"
          </p>
        )}
        {query && count > 0 && (
          <p className="text-muted-foreground">
            Found {formatPluralItems("artwork", count)} with keyword "{query}"
          </p>
        )}

        {count > 0 && (
          <section>
            <ul className="space-y-4">
              {artworks.map(artwork => {
                return (
                  <li key={artwork.id} className="w-full">
                    <Link to={`/artworks/${artwork.slug}`}>
                      <Card className="hover-opacity space-y-2">
                        <CardHeader className="space-y-2 p-4">
                          <div>
                            <CardTitle className="text-2xl">
                              {artwork.title}
                            </CardTitle>
                          </div>
                        </CardHeader>
                      </Card>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </section>
        )}
      </section>
    </Layout>
  )
}

export async function action({ request }: ActionArgs) {
  await authenticator.isAuthenticated(request, { failureRedirect: "/login" })

  const formData = await request.formData()
  const submission = parse(formData, { schema: schemaArtwork })

  if (!submission.value || submission.intent !== "submit") {
    return json(submission, { status: 400 })
  }

  log(submission.value)

  return json(submission)
}
