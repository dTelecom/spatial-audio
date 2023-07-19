# Spatial Audio with LiveKit

[![Sample Gif](https://user-images.githubusercontent.com/8453967/221318613-861215da-1d71-492e-979f-dc7f18cb5c7f.gif)](https://spatial-audio-demo.livekit.io/)

This is a demo of spatial audio using LiveKit. Users join a little 2D world, and hear other users' audio in stereo, based on their position and distance relative to you.

## Running locally

Clone the repo and install dependencies:

```bash
git clone git@github.com:livekit-examples/spatial-audio.git
cd spatial-audio
npm install
```

Create a new project at <https://test-cloud.dtelecom.org>. Then create a new key in your [project settings](https://test-cloud.dtelecom.org/settings).

Create a new file at `spatial-audio/.env.development` and add your new API key and secret as well as your project's WebSocket URL (found at the top of <http://cloud.livekit.io>):

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

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/dTelecom/spatial-audio&env=API_KEY,API_SECRET&envDescription=Get%20these%20from%20your%20cloud%20livekit%20project.&envLink=https%3A%2F%2Fcloud.livekit.io&project-name=my-spatial-audio-app)

Refer to the [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more about deploying to a production environment.

## Asset credits

This demo uses the following assets:

- [Field of Green](https://guttykreum.itch.io/field-of-green) and boombox sprite by [GuttyKreum](https://twitter.com/GuttyKreum)
- [Dino Characters](https://arks.itch.io/dino-characters) by [Arks](https://arks.digital/)

They're both wonderful artists, check out their work!
