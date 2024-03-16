# reader

the program that runs on raspberry PIs to extend laptop's NFC reading capabilities.

## installation

the recommended setup is as so:

first, [install nvm](https://github.com/nvm-sh/nvm?tab=readme-ov-file#install--update-script):

```sh
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
```

then, install node:

```sh
nvm install 20
```

install pnpm

```sh
npm install -g pnpm
```

clone the repo:

```sh
git clone https://github.com/LeoDog896/biotrack
cd biotrack
```

install the dependencies:

```sh
pnpm install
```

## startup

to make this run on startup, use pm2's startup command:

```sh
pnpm run pm2
pm2 startup
```

This will automatically start the program on boot.
