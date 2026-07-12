import test from "node:test";
import assert from "node:assert/strict";
import { createPlan, moveStop, restorePlan } from "../lib/demo.ts";

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
});
