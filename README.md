# Spatial audio demo

This example places participants in a 2D world and adjusts stereo audio according to their position and distance. Its server signs participant tokens locally with the older dTelecom server SDK.

For a new Cloud project, use [dTelecom Meet](https://github.com/dTelecom/dtelecom-meet). Its README walks through issuing a Cloud token and connecting to the room.

## Running the historical example locally

Clone the repo and install dependencies:

```bash
git clone git@github.com:dTelecom/spatial-audio.git
cd spatial-audio
npm install
```

The original app expects a registered signing keypair in `API_KEY` and `API_SECRET`. Project keys from dTelecom Cloud use a different token flow.

(Note: this file is in `.gitignore`. Never commit your API secret to git.)

Then run the development server:

```bash
npm run dev
```

You can test it by opening <http://localhost:3000> in a browser.

## Asset credits

This demo uses the following assets:

- [Field of Green](https://guttykreum.itch.io/field-of-green) and boombox sprite by [GuttyKreum](https://twitter.com/GuttyKreum)
- [Dino Characters](https://arks.itch.io/dino-characters) by [Arks](https://arks.digital/)

They're both wonderful artists, check out their work!
