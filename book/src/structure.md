# Structure

There are a few different folders and files going on around here. Let's break them down:

There exists two different [SvelteKit](https://kit.svelte.dev/) apps, one in `apps/website`,
which acts as the main dashboard for biotrack, and a testing playground
located in `apps/carnival`, which allows one to test the different features of biotrack
without physical peripherals.

There is this book itself, which is a [mdBook](https://rust-lang.github.io/mdBook/),
located at `/book`.

In `crates` exists two embedded projects: `reader`, which acts as a Serial peripheral
for NFC card scanning and writing, and `scanner`, which acts
as a game scanner to allow players to physically join games.
