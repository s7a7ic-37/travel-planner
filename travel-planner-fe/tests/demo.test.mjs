import test from "node:test";
import assert from "node:assert/strict";
import { createPlan, moveStop, restorePlan, exportPlan, importPlanFile, places, cityPlaces, destinations, interests } from "../lib/demo.ts";

test("alternative plans reach every city catalogue and remain portable", () => {
  assert.equal(destinations.length, 5);
  assert.equal(places.length, 30);
  const allIds = destinations.flatMap(city => cityPlaces[city].map(place => place.id));
  assert.equal(new Set(allIds).size, allIds.length);
  for (const city of destinations) {
    const catalogue = cityPlaces[city];
    assert.ok(catalogue.length >= 12);
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
    assert.deepEqual(createPlan(2, [], catalogue.length, city), createPlan(2, [], 0, city));
  }
  assert.deepEqual(createPlan(2, [], places.length), createPlan(2, []));
  assert.throws(() => createPlan(2, [], -1));
  assert.throws(() => createPlan(2, [], 1.5));
  assert.throws(() => createPlan(2, [], 0, "Paris"));
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
  assert.throws(() => createPlan(4, []));
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
