import test from "node:test";
import assert from "node:assert/strict";
import { parseDayQuery } from "../lib/itinerary.ts";
test("valid day data preserves zero coordinates and variable place counts", () => {
  const place = {
    name: "Example",
    full_address: "Sample address",
    coordinates: { latitude: 0, longitude: 0 },
    categories: ["museum"],
  };
  assert.equal(
    parseDayQuery(JSON.stringify([place]), "[]", '{"lat":0,"lng":0}').places
      .length,
    1,
  );
});
test("malformed links, unsupported shapes and out-of-range coordinates fail safely", () => {
  for (const coordinates of [
    "null",
    "[]",
    '{"lat":91,"lng":0}',
    '{"lat":0,"lng":"2"}',
  ])
    assert.throws(() => parseDayQuery("[]", "[]", coordinates));
  assert.throws(() => parseDayQuery("bad-json", "[]", "{}"));
  assert.throws(() =>
    parseDayQuery('[{"name":"Incomplete"}]', "[]", '{"lat":0,"lng":0}'),
  );
});
