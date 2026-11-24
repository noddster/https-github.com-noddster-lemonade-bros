# Lemonade Bros merch

Self-authored implementation decisions under the user's instruction to proceed; known brand and supplied requirements take precedence.

- Vibe: playful, light, flat yellow and navy, illustrated lemons. Preserve existing staff sale animations.
- Journey: meet the tee; inspect front/back/detail gallery; choose kids or adult size; check size guide; choose delivery or pickup; place order by cash on delivery or transfer.
- Energy: joyful opening, quiet factual controls, satisfying selection, clear checkout.
- Feeling curve: recognition from familiar lemon branding; curiosity from gallery; confidence from sizing and price; delight as the selected size appears on the tee's hangtag; reassurance from a complete order receipt.
- Peak: "The little tag on the tee changed to my size, then became my bag tag." Product selection is the largest visual surface and remains directly usable.
- Tell-someone sentence: It's the site where your size becomes the tag on the Lemonade Bros tee.
- Signature: a live hangtag follows the selected size and bag count, including mobile and reduced motion.
- Range: playful, not luxury-minimal. Short copy and large mobile controls.
- Structure: gallery/catalog, no pinned marketing argument, video, forced scroll journey or filler. A single object with factual labels, gallery rail and order sheet.
- Assets: supplied brand reference; final tee photo/materials pending. Clearly label the interim illustration as a preview. No invented product photographs, materials, prices or size measurements.
- Ordering: cash on delivery or transfer to Ulduz; address required for delivery; same-day delivery. Account number, price, fee and service area pending configuration. Disable checkout until required settings are present.
- Size guide: dedicated dialog and editable measurements; explicit pending state until the real chart is supplied.
- Authority: super admin controls catalogue, stock, accounts, finances; admin manages merch orders and stock; employee uses existing private lemonade POS and their own name.
- Migration: retain original Netlify ledger. Record missing cash privately through an authenticated Super Admin form, without inventing a cup count or publishing the amount in source code.
- Seller contribution: revenue share and estimated allocation of net result, proportional to revenue. Negative net result is labelled an allocated loss, never profit. Cup race continues to rank cups independently.

## Layer contract
Background: large lemon slice, restrained rotation on natural scroll. Subject: illustrated tee (preview only), separate restrained translate/rotation. Foreground: live size hangtag, anchored to the shirt. Copy: stable readable object labels and controls. Mobile uses stacked content and a smaller scene with no occlusion of controls.

## Score and fingerprint
Object composition: parallax; gallery: pan rail and reveal; purchase controls and logistics: flow. No repeated slow animation, no video, no added scroll length. Empty prior local registry: first build has no historical comparisons. Other grammars lose because this is a direct single-product shop, not a film, editorial argument, operating demo, journey, poster, comparison, or rapid cutlist.

## Validation
Run backend authorization, atomic stock/idempotency and accounting tests with isolated data. Inspect desktop, 390px and 360px, reduced motion, drawers, login, order/stock management and console errors. Real iPhone delivery cannot be certified by headless Chromium.
