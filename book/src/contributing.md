# Contributing

To contribute, the following tools are recommended:

- [Node.js](https://nodejs.org/en) v20+
- [npm](https://www.npmjs.com/), which should come with Node.js
- [Git](https://git-scm.com/)
- [pnpm](https://pnpm.io/), which you can install with npm: `npm install -g pnpm`

If you are unfamiliar with git, use a git client such as [GitHub Desktop](https://desktop.github.com/) or [GitKraken](https://www.gitkraken.com/).

To get started, clone the repository and install the dependencies:

```sh
git clone https://github.com/LeoDog896/biotrack
cd biotrack
pnpm install
```

## Database

To set up the database, run

```sh
npx prisma generate
npx prisma migrate dev
```

This sets up a [SQLite](https://www.sqlite.org/) database in the `prisma` directory.

Whenever you make changes to `prisma/schema.prisma`, run

```sh
npx prisma migrate dev
```

To reset the database, run

```sh
npx prisma migrate reset
npx prisma migrate dev
```

## Development

To start the server, run

```sh
pnpm run dev
```

This will require setting up the database, as well as an `.env` file
you can get by copying `.env.example` to `.env` and filling in the
values.

## Testing

To run the tests, run

```sh
pnpm test
```
