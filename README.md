# The Lemonade Bros

Phone-friendly T-shirt shop, a private animated lemonade till, individual staff accounts, merchandise order management, and a Super Admin financial panel.

## Edit and preview

Open this repository in VS Code. Public shop: `public/shop.html`, `public/shop.css`, `public/shop.js`. Staff till markup/styles and legacy ledger API: `lib/app.mjs`. Till and Super Admin logic: `ui/sales.js` and `ui/admin.js`, assembled with `public/staff/session.js` by the build. Commerce and account API: `lib/commerce.mjs`. Merchandise/account screens: `public/staff/manage.*`.

Run `npm install`, `npm test`, then `npm run build`. The build generates the public shop at `public/index.html` and the private till at `public/staff/index.html`. `npm run dev` serves an isolated in-memory preview; it never connects to live sales. `EDITABLE-PREVIEW.html` is an older POS-only snapshot, not the current shop or staff authentication flow.

## Netlify automatic deployment

Link this repository to the existing Netlify project `lemonade-bros-squeeze`. Use branch `main`, base directory blank, build command `npm run build`, publish directory `public`, functions directory `netlify/functions`. The `netlify.toml` file supplies these build settings. Commits to main will deploy after the repository is linked. Keep the existing Netlify project to retain its site-wide Blobs sales store.

The backend uses Netlify Functions and Netlify Blobs with conditional writes and stable sale IDs for simultaneous sellers and retries. Uploading only `public` will not deploy the backend.

Keep the existing `ADMIN_PIN` and `SESSION_SECRET` in Netlify's server-side environment variables with Functions scope. Never commit these values. On first staff visit, the existing PIN authorizes creation of the first individual Super Admin account. After that, staff use individual usernames and passwords. See `docs/merch/OPERATIONS.md` for setup, stock, payment verification, role permissions and accounting details. No customer orders or account credentials are committed to this repository.

