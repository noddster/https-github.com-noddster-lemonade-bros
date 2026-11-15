# The Lemonade Bros

Phone-friendly lemonade stall POS with animated drink cards, a sale popup, shared sales history, a friends' leaderboard, and admin tools.

## Edit and preview

Open this repository in VS Code. The deployed page's HTML, CSS, and JavaScript are currently bundled in `lib/app.mjs` (the `html` template near the bottom). Edit that file for live site changes. The files under `ui/` are reference copies from the mobile redesign; they are not independently built.

Run `npm install` then `npm run build` to generate `public/index.html`. For a standalone local demo, open `EDITABLE-PREVIEW.html`; its test sales stay in that browser and do not reach the live stall. The preview PIN is 1234. This preview is a snapshot and must be regenerated when the production app changes.

## Netlify automatic deployment

Link this repository to the existing Netlify project `lemonade-bros-squeeze`. Use branch `main`, base directory blank, build command `npm run build`, publish directory `public`, functions directory `netlify/functions`. The `netlify.toml` file supplies these build settings. Commits to main will deploy after the repository is linked. Keep the existing Netlify project to retain its site-wide Blobs sales store.

The backend uses Netlify Functions and Netlify Blobs with conditional writes and stable sale IDs for simultaneous sellers and retries. Uploading only `public` will not deploy the backend.

Set `ADMIN_PIN` and a random `SESSION_SECRET` of at least 32 bytes in Netlify's server-side environment variables with Functions scope. Never commit these values. Admin stays locked until configured. No production sales data or secrets are stored in this repository.
