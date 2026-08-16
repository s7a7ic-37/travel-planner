# Ready, Jet Set, Go!

A city itinerary planner built with Next.js, React, TypeScript and Material UI.

**[Try the planner](https://travel-planner-demo.mpasiecki.workers.dev/demo/)** · **[Original team project](https://github.com/lai1372/travel-planner)**

## Plan a city day

The guest demo uses curated places across Manchester, London, Edinburgh, Liverpool and York:

- Choose one to three days and prioritize museums, outdoors or culture.
- Generate two stops per day and change their order.
- Try another plan to explore different places with the same interests.
- Save and load a plan in your browser, or remove the saved copy.
- Download/import a JSON plan or print the itinerary.
- Open place searches on OpenStreetMap.

Plans and imported files stay in the browser. Imports are limited to 6 KB and validated against the sample places. Importing replaces the open itinerary; saving it locally is a separate action.

## Run locally

Requires Node.js 22. From the repository root:

```sh
cd travel-planner-fe
npm ci
npm run dev
```

Open [localhost:3000/demo/](http://localhost:3000/demo/).

`npm test` checks generation, reordering, plan validation, storage and file transfers, plus offline Firebase reference construction. `npm run build` exports static pages to `travel-planner-fe/out/`. Cloudflare hosting is configured in the root `wrangler.jsonc`.

## Integrations and demo limits

The source includes Firebase authentication/itinerary storage and Mapbox integrations. These require separately owned service configuration; the public guest demo does not connect to them. Live backend operations are not verified.

The guest planner uses curated examples, with no live search, bookings, map feed or route optimization. Opening times, accessibility, journey times, availability and prices are not checked. Verify details before travelling.

## Team credit

Originally a four-person Northcoders project. This is Maksymilian Pasiecki's personal fork; the original team history and authorship are preserved. His original contributions included Firebase authentication, itinerary storage/deletion, places API and maps integration.

Original assets and source retain their team provenance. The original team repository and backend are maintained separately.
