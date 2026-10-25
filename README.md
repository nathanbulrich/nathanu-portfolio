This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Project image performance

Keep original screenshots at `public/images/<project>-<number>.png`. `npm run optimize:images`
generates 384px, 640px, and original-width WebP variants plus the dimensions manifest at
`src/app/lib/project-images.json`. It also runs automatically before development and production
builds. Commit the generated images and manifest with screenshot changes. Generated filenames
include content hashes so they can be cached immutably without serving stale replacements.

Project cards reserve each screenshot's aspect ratio and show a skeleton in that same space.
Once all visible screenshots in a card are decoded, they fade in together over 240ms
(immediately for reduced-motion users). Mobile only waits for its one visible screenshot.
The first card loads eagerly; remaining cards load lazily. Desktop-only screenshots use media
sources so mobile browsers don't download hidden images. Conversion happens before deployment,
avoiding image transformation work on a visitor's first request.

To check loading behavior, start a production build with `npm run build` and
`npm run start -- --port 3001`, then run `npm run check:project-loading` in another terminal.
This requires a Playwright Chromium installation (`npx playwright install chromium`), or set
`PLAYWRIGHT_CHANNEL=chrome` to use installed Chrome. `PLAYWRIGHT_EXECUTABLE_PATH` can select
another existing Chromium executable. `TEST_BASE_URL` overrides the server address.
The check disables caching, throttles the connection, holds image responses to inspect
skeletons, and verifies stable card geometry and mobile image requests at three viewport sizes.
