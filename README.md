# Ready, Jet Set, Go!

A city itinerary planner built with Next.js, React, TypeScript and Material UI.

**[Try the planner](https://travel.artemislab.co.uk/demo/)** · **[Original team project](https://github.com/lai1372/travel-planner)**

## Plan a city day

The guest demo uses curated places across Manchester, London, Edinburgh, Liverpool and York. Choose among museums, outdoors, culture, food and drink, architecture, music and nightlife, or family activities:

- Choose one to seven days and prioritize any of seven interests.
- Generate two stops per day, mixing your selected interests, and change their order. Other categories fill spare slots when needed.
- Reopen one of the five most recent generated itineraries from the navigation menu.
- Try another plan to explore different places with the same interests.
- Replace an individual stop with an unused place in the same city, keeping the other days and stop order.
- Save and load a plan in your browser, or remove the saved copy.
- Export/import a JSON itinerary file or print the plan.
- Open place searches on OpenStreetMap.

Recent plans, saved copies and imported files stay in the browser. JSON is a plain-text transfer format, so an itinerary can be inspected or moved between devices. Imports are limited to 6 KB and validated against the sample places. Importing replaces the open itinerary; saving it locally is a separate action.

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

New plans skip known closures. Older saved plans still load with updated closure notes. Catalogue access corrections use [Visit Liverpool](https://www.visitliverpool.com/listing/maritime-museum-temporarily-closed/898701/) and [Royal Botanic Garden Edinburgh](https://www.rbge.org.uk/visit/royal-botanic-garden-edinburgh/); live opening times still need checking.

## Team credit

Originally a four-person Northcoders project. This is Maksymilian Pasiecki's personal fork; the original team history and authorship are preserved. His original contributions included Firebase authentication, itinerary storage/deletion, places API and maps integration.

Original assets and source retain their team provenance. The original team repository and backend are maintained separately.
