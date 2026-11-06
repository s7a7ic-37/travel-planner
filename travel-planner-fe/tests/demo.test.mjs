import test from "node:test";
import assert from "node:assert/strict";
import { createPlan, moveStop, restorePlan, exportPlan, importPlanFile, places, cityPlaces, availablePlaces, destinations, interests, readRecentItineraries, rememberItinerary } from "../lib/demo.ts";

test("short plans mix selected interests and the next variation changes the stops", () => {
  const first = createPlan(1, ["Outdoors", "Culture"], 0, "Edinburgh");
  assert.deepEqual(first.stops.map(stop => stop.category), ["Outdoors", "Culture"]);
  const next = createPlan(1, ["Outdoors", "Culture"], 1, "Edinburgh");
  assert.notDeepEqual(next.stops.map(stop => stop.id), first.stops.map(stop => stop.id));
  assert.equal(new Set(next.stops.map(stop => stop.category)).size, 2);
});

test("plans without preferences offer more than one category", () => {
  const plan = createPlan(1, [], 0, "London");
  assert.equal(new Set(plan.stops.map(stop => stop.category)).size, 2);
});

test("alternative plans reach every city catalogue and remain portable", () => {
  assert.equal(destinations.length, 5);
  assert.equal(places.length, 34);
  const allIds = destinations.flatMap(city => cityPlaces[city].map(place => place.id));
  assert.equal(new Set(allIds).size, allIds.length);
  for (const city of destinations) {
    const catalogue = availablePlaces(city);
    assert.ok(catalogue.length >= 12);
    assert.ok(interests.every(interest => catalogue.some(place => place.category === interest)));
    const reached = new Set();
    for (let variation = 0; variation < catalogue.length; variation++) {
      for (const preference of [[], ...interests.map(interest => [interest])]) {
        const plan = createPlan(3, preference, variation, city);
        assert.equal(plan.city, city);
        assert.equal(new Set(plan.stops.map(stop => stop.id)).size, 6);
        if (preference.length) {
          const preferredCount = catalogue.filter(place => place.category === preference[0]).length;
          assert.ok(plan.stops.slice(0, Math.min(6, preferredCount)).every(stop => stop.category === preference[0]));
        }
        else plan.stops.forEach(stop => reached.add(stop.id));
        const text = exportPlan(plan);
        assert.ok(Buffer.byteLength(text) <= 6000);
        assert.deepEqual(restorePlan(text), plan);
      }
    }
    assert.equal(reached.size, catalogue.length);
    const week = createPlan(7, [], 0, city);
    assert.equal(week.stops.length, 14);
    assert.equal(new Set(week.stops.map(stop => stop.id)).size, 14);
    assert.deepEqual(createPlan(2, [], catalogue.length, city), createPlan(2, [], 0, city));
  }
  assert.deepEqual(createPlan(2, [], places.length), createPlan(2, []));
  assert.throws(() => createPlan(2, [], -1));
  assert.throws(() => createPlan(2, [], 1.5));
  assert.throws(() => createPlan(2, [], 0, "Paris"));
});

test("new plans skip known closures while saved itineraries retain their stops and updated notes", () => {
  for (let variation = 0; variation < cityPlaces.Liverpool.length; variation++) {
    const plan = createPlan(7, ["Museums"], variation, "Liverpool");
    assert.equal(plan.stops.length, 14);
    assert.ok(plan.stops.every(stop => !stop.closed));
  }
  const saved = createPlan(1, [], 0, "Liverpool");
  saved.stops[0] = cityPlaces.Liverpool.find(stop => stop.id === "liverpool-maritime");
  const restored = restorePlan(JSON.stringify(saved));
  assert.equal(restored.stops[0].id, "liverpool-maritime");
  assert.equal(restored.stops[0].closed, true);
  assert.match(restored.stops[0].note, /Temporarily closed/);
  assert.deepEqual(restorePlan(exportPlan(restored)), restored);
});

test("portable plans preserve the reordered itinerary and only use known place text", async () => {
  const plan = moveStop(createPlan(3, ["Culture"]), 1, -1);
  const text = exportPlan(plan);
  assert.deepEqual(await importPlanFile({ size: Buffer.byteLength(text), text: async () => text }), plan);
  const altered = structuredClone(plan);
  altered.stops[0].name = "Injected name";
  assert.equal(JSON.parse(exportPlan(altered)).stops[0].name, plan.stops[0].name);
});

test("imports reject oversized files before reading and reject malformed plans", async () => {
  await assert.rejects(importPlanFile({ size: 6001, text: () => { throw new Error("Must not read"); } }), /6 KB/);
  await assert.rejects(importPlanFile({ size: 2, text: async () => "{}" }), /Unrecognized/);
  await assert.rejects(importPlanFile({ size: 8, text: async () => "not json" }));
});

test("plans have two unique stops per day, with preferred categories first", () => {
  const plan = createPlan(3, ["Outdoors"]);
  assert.equal(plan.stops.length, 6);
  assert.equal(new Set(plan.stops.map((stop) => stop.id)).size, 6);
  assert.equal(plan.stops[0].category, "Outdoors");
  assert.equal(plan.stops[1].category, "Outdoors");
  assert.throws(() => createPlan(1.5, []));
  assert.throws(() => createPlan(8, []));
  assert.throws(() => createPlan(1, ["Unknown"]));
});
test("reordering preserves the original and persists safely", () => {
  const original = createPlan(2, []);
  const moved = moveStop(original, 1, -1);
  assert.equal(moved.stops[0].id, original.stops[1].id);
  assert.notDeepEqual(moved.stops, original.stops);
  assert.equal(moveStop(original, 0, -1), original);
  assert.deepEqual(restorePlan(JSON.stringify(moved)), moved);
});
test("saved data cannot inject unknown places, text or duplicate stops", () => {
  const original = createPlan(1, []);
  const altered = JSON.parse(JSON.stringify(original));
  altered.stops[0].name = "<script>injected</script>";
  assert.equal(
    restorePlan(JSON.stringify(altered)).stops[0].name,
    original.stops[0].name,
  );
  altered.stops[0].id = "unknown";
  assert.throws(() => restorePlan(JSON.stringify(altered)));
  altered.stops = [original.stops[0], original.stops[0]];
  assert.throws(() => restorePlan(JSON.stringify(altered)));
  assert.throws(() => restorePlan("bad-json"));
  altered.city = "London";
  assert.throws(() => restorePlan(JSON.stringify(altered)));
});

test("recent itineraries are validated, newest-first and limited to five", () => {
  let history = [];
  for (let i = 0; i < 7; i++) {
    history = rememberItinerary(history, createPlan(2, [], i, destinations[i % destinations.length]), 1000 + i);
  }
  assert.equal(history.length, 5);
  assert.equal(history[0].createdAt, 1006);
  assert.deepEqual(readRecentItineraries(JSON.stringify(history)), history);
  const invalid = structuredClone(history);
  invalid[0].plan.city = "Paris";
  assert.equal(readRecentItineraries(JSON.stringify(invalid)).length, 4);
  assert.deepEqual(readRecentItineraries("x".repeat(30001)), []);
});
