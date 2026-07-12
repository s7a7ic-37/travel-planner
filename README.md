# Ready, Jet Set, Go! — personal maintenance fork

The original four-person Northcoders project (2023) is at https://github.com/lai1372/travel-planner. This fork preserves all team history and authorship. Maintenance changes are pushed only to s7a7ic-37/travel-planner; upstream is read-only in this checkout. No original team backend or deployment was changed.

Maksymilian's original contributions included Firebase authentication, itinerary storage/deletion, places API and maps integration. The Git history records each collaborator's work; this is not a solo project.

## Guest demo

The personal fork adds /demo/: choose one to three days in a Manchester example, prioritize interests, move stops, save/load a plan in localStorage and print it. Six curated example places make the flow inspectable without accounts or paid APIs. This is not live search, routing or travel advice. Opening times, accessibility, availability and journey times are not checked. Location links open OpenStreetMap searches; no map feed is embedded.

Local save data is validated against known place IDs before loading. No personal fields or account details are requested. Removing the saved copy leaves the open itinerary intact.

## Run

Use Node.js 22. Inside travel-planner-fe:

    npm ci
    npm test
    npm run build
    npm run dev

The build exports static pages to travel-planner-fe/out. Five tests cover plan boundaries, unique stops, reordering, safe persistence and malformed day links. The original pnpm lockfile remains as historical source; npm and the current package-lock.json are used for this maintenance fork.

## Retained integrations and limits

The original Firebase and Mapbox flows remain in the source, optional behind environment configuration. No team keys or credentials are copied into this fork. Unconfigured Firebase no longer crashes module initialization; missing Mapbox configuration shows a guest-demo link. Live integration requires a separately owned Firebase project, reviewed Firestore rules and a restricted Mapbox public token. It has not been validated against the group's backend.

Repairs also stop fractional trip lengths and unintended form submission, encode destination links, handle failed saves/loads, check reset-password results, validate itinerary URL data and replace an obsolete auto-playing carousel with explicit controls. Next.js is upgraded from a 2023 canary to 16.4.3 and React 19, with matching types. No lint pass is claimed; the retained project has legacy lint conventions.

The dependency audit still reports four high advisories through Firebase's Node-side gRPC dependency. The deployed demo is static and has no configured Firebase connection or Node server. Do not repurpose this build as a live service without reviewing those advisories, authentication and backend access rules. No security downgrade or forced vulnerable Firebase rollback was used to silence the audit.

## Hosting and credit

The static guest demo is hosted directly in the owner's Cloudflare account using wrangler.jsonc. Run npm run build in travel-planner-fe, then deploy from the repository root with Wrangler after verifying the account. This fork does not use the team's Vercel deployment or ChatGPT Sites.

Original assets and source retain their existing team provenance; no new license is asserted over collaborators' work. New maintenance is documented as such rather than attributed retroactively.

Verified guest demo: https://travel-planner-demo.mpasiecki.workers.dev/demo/
