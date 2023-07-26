# Spatial Audio

[![Sample Gif](https://user-images.githubusercontent.com/8453967/221318613-861215da-1d71-492e-979f-dc7f18cb5c7f.gif)]

This is a demo of spatial audio. Users join a little 2D world, and hear other users' audio in stereo, based on their position and distance relative to you.

## Running locally

Clone the repo and install dependencies:

```bash
git clone git@github.com:dTelecom/spatial-audio.git
cd spatial-audio
npm install
```

Create a new project at <https://cloud.dtelecom.org>. Then create a new key in your [project settings](https://cloud.dtelecom.org/settings).

Create a new file at `spatial-audio/.env.development` and add your new API key and secret:

```
API_KEY=<your api key>
API_SECRET=<your api secret>
```

(Note: this file is in `.gitignore`. Never commit your API secret to git.)

Then run the development server:

```bash
npm run dev
```

You can test it by opening <http://localhost:3000> in a browser.

## Deploying for production

This demo is a Next.js app. You can deploy to your Vercel account with one click:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/dTelecom/spatial-audio&env=API_KEY,API_SECRET&envDescription=Sign%20up%20for%20an%20account%20at%20https://cloud.dtelecom.org%20and%20create%20an%20API%20key%20in%20the%20Project%20Settings%20UI)

Refer to the [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more about deploying to a production environment.

## Asset credits

This demo uses the following assets:

- [Field of Green](https://guttykreum.itch.io/field-of-green) and boombox sprite by [GuttyKreum](https://twitter.com/GuttyKreum)
- [Dino Characters](https://arks.itch.io/dino-characters) by [Arks](https://arks.digital/)

They're both wonderful artists, check out their work!
