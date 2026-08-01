# Ready, Jet Set, Go! — personal maintenance fork

The original four-person Northcoders project (2023) is at https://github.com/lai1372/travel-planner. This fork preserves all team history and authorship. Maintenance changes are pushed only to s7a7ic-37/travel-planner; upstream is read-only in this checkout. No original team backend or deployment was changed.

Maksymilian's original contributions included Firebase authentication, itinerary storage/deletion, places API and maps integration. The Git history records each collaborator's work; this is not a solo project.

## Guest demo

The personal fork adds /demo/: choose one to three days in a Manchester example, prioritize interests, move stops, save/load a plan in localStorage, download/import a plan file and print it. Six curated example places make the flow inspectable without accounts or paid APIs. This is not live search, routing or travel advice. Opening times, accessibility, availability and journey times are not checked. Location links open OpenStreetMap searches; no map feed is embedded.

Downloaded JSON plans can be imported in another browser. Imports are capped at 6 KB before reading, validated against known place IDs and normalized to the curated place text. Invalid files leave the open plan untouched. Import replaces the open plan only; the existing saved browser copy is unchanged until Save locally is chosen. Files are processed locally and never uploaded.

Local save data is validated against known place IDs before loading. No personal fields or account details are requested. Removing the saved copy leaves the open itinerary intact.

## Run

Use Node.js 22. Inside travel-planner-fe:

    npm ci
    npm test
    npm run build
    npm run dev

The build exports static pages to travel-planner-fe/out. Tests cover plan boundaries, unique stops, reordering, safe persistence, file-transfer boundaries and malformed day links. An offline SDK smoke check also constructs Firebase document and query references without network access. The original pnpm lockfile remains as historical source; npm and the current package-lock.json are used for this maintenance fork.

## Retained integrations and limits

The original Firebase and Mapbox flows remain in the source, optional behind environment configuration. No team keys or credentials are copied into this fork. Unconfigured Firebase no longer crashes module initialization; missing Mapbox configuration shows a guest-demo link. Live integration requires a separately owned Firebase project, reviewed Firestore rules and a restricted Mapbox public token. It has not been validated against the group's backend.

Repairs also stop fractional trip lengths and unintended form submission, encode destination links, handle failed saves/loads, check reset-password results, validate itinerary URL data and replace an obsolete auto-playing carousel with explicit controls. Next.js is upgraded from a 2023 canary to 16.4.3 and React 19, with matching types. No lint pass is claimed; the retained project has legacy lint conventions.

Firebase pins an older Node-side gRPC dependency. A scoped override selects @grpc/grpc-js 1.13.7, a patched version identified by the upstream security advisories; npm audit reports no known advisories for this dependency tree at verification. The offline SDK smoke check verifies import and reference construction, not live backend operations. The deployed demo is static and has no configured Firebase connection or Node server. Review authentication and backend access rules before using it as a live service.

## Hosting and credit

The static guest demo is hosted directly in the owner's Cloudflare account using wrangler.jsonc. Run npm run build in travel-planner-fe, then deploy from the repository root with Wrangler after verifying the account. This fork does not use the team's Vercel deployment or ChatGPT Sites.

Original assets and source retain their existing team provenance; no new license is asserted over collaborators' work. New maintenance is documented as such rather than attributed retroactively.

Verified guest demo: https://travel-planner-demo.mpasiecki.workers.dev/demo/

CI runs a pinned Gitleaks container against the exported public files, with network disabled, a read-only mount and fully redacted output.

## Visual identity

The personal fork uses a city field-notes identity: cream paper, navy typography, terracotta controls, an abstract skyline and numbered itinerary cards. The old blurred beach/theme layer and unused theme hooks were removed from this fork; no original team assets or history were re-licensed. A mobile start link jumps to controls, and successful generation scrolls to the result. Imports sit in a native disclosure. Light native form controls match the interface regardless of device colour preference. Absolute SVG/PNG/ICO tab icons and an Apple touch icon work on nested routes. The original group backend remains unconfigured.
