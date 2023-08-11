import type { LoaderArgs } from "@remix-run/node"
import { Link, type V2_MetaFunction } from "@remix-run/react"

import { authenticator } from "~/services/auth.server"
import { formatTitle } from "~/utils"
import { Layout, UserAuthForm } from "~/components"

export const meta: V2_MetaFunction = () => {
  return [
    { title: formatTitle("Login") },
    {
      name: "description",
      content: "Login to your 🐈 Super Duper Gallery user account.",
    },
  ]
}

export const loader = async ({ request }: LoaderArgs) => {
  return await authenticator.isAuthenticated(request, {
    successRedirect: "/dashboard",
  })
}

export default function Route() {
  return (
    <Layout hasHeader={false} hasFooter={false}>
      <div className="container relative grid h-screen flex-col items-center justify-center lg:max-w-none lg:grid-cols-2 lg:px-0">
        <section className="lg:p-8">
          <div className="mx-auto flex w-full max-w-sm flex-col space-y-8">
            <div className="flex flex-col space-y-2">
              <h2>Login</h2>
            </div>

            <UserAuthForm />
          </div>
        </section>

        <section className="relative hidden h-full flex-col bg-zinc-950 p-10 text-white lg:flex lg:items-end">
          <Link to="/" className="hidden lg:block">
            <h1 className="flex items-center gap-2 text-2xl">
              <img src="/images/superdupergallery.png" alt="Cat" className="h-10" />
              <span className="text-brand">Super Duper Gallery</span>
            </h1>
          </Link>

          <div className="relative z-20 mt-auto">
            <blockquote className="space-y-2 text-right">
              <p className="text-lg font-semibold">
                &ldquo;The artworks from 🐈 Super Duper Gallery are extraordinary.&rdquo;
              </p>
              <footer>— Art Collector</footer>
            </blockquote>
          </div>
        </section>
      </div>
    </Layout>
  )
}
