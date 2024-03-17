# Structure

There are a few different folders and files going on around here. Let's break them down:

There exists two different [SvelteKit](https://kit.svelte.dev/) apps, one in `apps/website`,
which acts as the main dashboard for biotrack, and a testing playground
located in `apps/carnival`, which allows one to test the different features of biotrack
without physical peripherals.

There is also a standalone [TypeScript](https://www.typescriptlang.org/) server,
located at `apps/reader`. This is meant to run on a [Raspberry PI](https://www.raspberrypi.com/),
and hosts a [tRPC](https://trpc.io/) server that the client can communicate with
the client's browser.

There is this book itself, which is a [mdBook](https://rust-lang.github.io/mdBook/),
located at `/book`.
