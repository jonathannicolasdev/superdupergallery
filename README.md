# 🐈 Super Duper Gallery

> The Contemporarty Artworks Gallery . 

Check out:

- Web: <https://superdupergallery.com>
- Repo: <https://github.com/superdupergallery>

![Super Duper Gallery](public/images/superdupergallery.png)

## Concept

🐈 Super Duper Gallery allow to:

- Discover artworks
- Get to know the artists
- See available pieces on sale

## Getting Started

1. Read the [Remix Docs](https://remix.run/docs) to understand about Remix.
2. If new, focus on Remix basics, don't use the Stacks yet. Read
   [Super Simple Start to Remix](https://kentcdodds.com/blog/super-simple-start-to-remix).
3. If experienced, use various integration such as Prisma ORM and database like
   MySQL. Read
   [Blog Tutorial (short)](http://remix.run/docs/en/main/tutorials/blog) and
   [App Tutorial (long)](http://remix.run/docs/en/main/tutorials/jokes).

## Tech Stack

1. [TypeScript](https://typescriptlang.org): Typed language
   - Related to JavaScript, HTML, CSS
2. [React](https://react.dev): UI library
3. [Remix](https://remix.run): Web framework
   - [React Router](https://reactrouter.com)
4. [Tailwind CSS](https://tailwindcss.com): Styling
5. [Radix UI](https://radix-ui.com): Interactive components
   - [shadcn UI](https://ui.shadcn.com): Styled interactive components
6. [Prisma](https://prisma.io): Database ORM
7. [PlanetScale](https://planetscale.com): MySQL-compatible serverless database
   platform
   - [MySQL](https://mysql.com): Database management system
8. [Vercel](https://vercel.com): App deployment

## Setup

### Environment Variables

Create the `.env` file from the example `.env` file.

```sh
cp -i .env.example .env
```

> This .env file is only for local development, not production

Let's configure the required environment variables in the `.env` file if local,
otherwise in the project settings, for:

- `DATABASE_URL`
- `SESSION_SECRET`

Create a [PlanetScale](https://planetscale.com) account to have a MySQL instance
for development. After the database has been created, "Get the connection
string" and select "Prisma", then copy the full `DATABASE_URL`.

> Keep in mind the free plan only allow for 1 database. So either later keep it,
> delete it when unused, or upgrade the plan.

Generate a random string for the `SESSION_SECRET` using
`openssl rand -base64 32` on the terminal or put any long random text.

```sh
DATABASE_URL="mysql://username:password@aws.connect.psdb.cloud/superdupergallery?sslaccept=strict"
SESSION_SECRET="random_secret_text"
```

### Code Editor

When using VS Code, there are several recommended extensions that can be
installed to improve the workflow. It's nice to accept the recommendations that
listed in [`.vscode/extensions.json`](./.vscode/extensions.json).

Especially (in alphabetical order):

- ESLint
- Inline Fold for CSS
- Markdown All in One
- Prettier
- Prisma
- Remix Forge
- Stylelint
- Tailwind CSS

## Development

### Dependencies

Use [pnpm](https://pnpm.io) to improve productivity, so make sure
[pnpm is installed](https://pnpm.io/installation#using-npm):

```sh
npm i -g pnpm
```

To run the app locally, make sure the project's local dependencies are
installed:

```sh
pnpm install
# or
pnpm i
```

### Code

Format, lint, and build to check if the setup is fine:

```sh
pnpm check
# run: format lint stylelint build typecheck

pnpm check:fix # to fix most cases if there's an issue
# run: format:fix lint:fix stylelint:fix
```

> Note: Ignore non-critical warning about ESLint and TypeScript

### Database

Prisma ORM is used to communicate with the database easily. Since this app is
primarily using PlanetScale, the migration files are not needed. Therefore, push
the schema directly there, then the migration will be handled through the
[deploy requests](https://planetscale.com/docs/concepts/deploy-requests).

Also read:

- [Prisma with PlanetScale](https://prisma.io/docs/guides/database/planetscale)
- [PlanetScale with Prisma](https://planetscale.com/docs/prisma/prisma-quickstart)

If prefer using Docker and Docker Compose for local development,
[follow this guide](docs/database/README.md).

#### Schema to Push

Sync between Prisma schema and the database directly, by making schema changes
with `prisma db push`, which can be done regularly while updating the models:

```sh
pnpm db:push
# prisma db push
```

Even with local development without PlanetScale, this is still okay when
[prototyping the schema](https://prisma.io/docs/concepts/components/prisma-migrate/db-push).
After a success push, then it will automatically run `prisma generate`.

#### Data for Credentials

Create [`users-credentials.json`] in [`app/data`](./app/data/) folder with the
format below. You can focus on certain users who want to be able to login in
development, so it doesn't have to be everyone. For example, only create for
`admin`, `test`, or `yourname` which also available in
[`app/data/users.ts`](./app/data/users.ts)

```json
[
  {
    "username": "username",
    "email": "user1@example.com",
    "password": "set_the_password_1"
  },
  {
    "username": "username2",
    "email": "user2@example.com",
    "password": "set_the_password_2"
  }
  // ...
]
```

#### Data for Seed

Then seed the initial data when needed:

```sh
pnpm db:seed
# prisma db seed
```

Check if the data is fine:

```sh
pnpm db:check
# tsx prisma/check.ts
```

### Build

Check if the build is fine:

```sh
pnpm build
# remix build
```

> This will also run `prisma generate` too before the build

### Develop Locally

If everything works fine, start the Remix development server like so:

```sh
pnpm dev
# remix dev
```

Open up [http://localhost:3000](http://localhost:3000) and it should be ready to
go!

The `vercel dev` command provided by [Vercel CLI](https://vercel.com/cli) can
also be used when necessary.

Regularly, either push or generate the schema when changing the database fields.

```sh
pnpm db:push
# prisma db push

pnpm db:gen
# prisma generate
```

### Checking Dependencies

To keep the dependencies fresh, use [taze](https://github.com/antfu/taze).

```sh
pnpm dlx taze
```

## Deployment

This repo has been setup to autodeploy to Vercel automatically on Git push.

> The `@remix-run/vercel` runtime adapter has been deprecated in favor of out of
> the box Vercel functionality and will be removed in Remix v2. No more using
> the Vercel template & can just use the Remix template instead. Will be changed
> after the upgrade to v2.

After having run the `create-remix` command and selected "Vercel" as a
deployment target, [import the Git repository](https://vercel.com/new) into
Vercel, and it will be deployed.

If want to avoid using a Git repository, deploy the directory by running
[Vercel CLI](https://vercel.com/cli):

```sh
pnpm i -g vercel
vercel
```

It is generally recommended to use a Git repository, because future commits will
then automatically be deployed by Vercel, through its
[Git Integration](https://vercel.com/docs/concepts/git).

## References

- [Artsy](https://artsy.net)
