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

make sure you are in the `apps/reader` directory of the repository.

to make this run on startup, use pm2's startup command:

```sh
pnpm run pm2
pnpm exec pm2 startup
pnpm exec pm2 save
```

This will automatically start the program on boot.

To restart the program, use:

```sh
pnpm exec pm2 restart "carnival reader"
```

## view logs

to view the logs, use:

```sh
pnpm exec pm2 logs "carnival reader"
```

## faq

### why isn't this a device that could communicate over serial?

we already printed out the 3D casings for the raspberry pis.
if you see this and want to use a different device (arduino, redboard),
feel free to!
