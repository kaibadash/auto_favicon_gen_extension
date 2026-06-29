A browser extension to generate favicon if it doesn't exist.

![image](https://raw.githubusercontent.com/kaibadash/auto_favicon_gen_extention/master/doc/favicon.png)

## Setup

```
$ yarn
```

## Watch and build

```
yarn dev
```

Load the unpacked extension from the `dist/` directory in `chrome://extensions`.

## Build extension

```
yarn build
```

The built extension is output to the `dist/` directory.

## Package for the store

Build and create a zip for uploading to the Chrome Web Store:

```
yarn zip
```

The zip is created at `storage/extension.zip` (with `manifest.json` at its root).
