# Art Conservator

A static SvelteKit restoration game. Enter a display name, use the clues to
restore Golden Valley, and view your session result.

- [Play Art Conservator](https://shreek3724.github.io/IS218CreativeGameSlice2/)
- [Game planning repository](https://github.com/shreek3724/IS218-Review-1-Plan-Creative-Game)
- [Game project record](https://github.com/shreek3724/IS218-Review-1-Plan-Creative-Game/blob/main/project_record.md)

## Run locally

Use Node.js 22.13 or later on the Node 22 release line.

```sh
npm ci
npm run dev
```

## Verify the production build

```sh
npx playwright install chromium
npm run format:check
npm run lint
npm run check
npm run test:unit
npm run build
npm run test:e2e
npm run test:a11y
```

Run `npm run preview` to open the production build at
`http://localhost:4173/IS218CreativeGameSlice2/`. Start from this page so
the game and results views share the same session. Refreshing or signing out
clears the session.

## Publish on GitHub Pages

In the repository's **Settings → Pages**, select **GitHub Actions** as the source.
The workflow verifies pull requests and publishes the checked static artifact
from `main`. It defaults to the repository path for a project site and to
`/` for a user or organization site. For a custom domain, set the repository
Actions variable `PAGES_BASE` to `/`. To test an override locally, set the same
environment variable for the build and Playwright runs.
