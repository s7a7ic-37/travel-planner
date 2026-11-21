import assert from "node:assert/strict";
import test from "node:test";
import { exportCalendar } from "../lib/calendar.ts";
import { createPlan, moveStop } from "../lib/demo.ts";

const unfold = calendar => calendar.replace(/\r\n[ \t]/g, "");

test("exports a unique, all-day event per itinerary day across a new year", () => {
  const plan = moveStop(createPlan(2, [], 0, "Edinburgh"), 0, 1);
  const calendar = exportCalendar(plan, "2026-12-31", new Date("2026-11-21T12:34:56Z"));
  assert.ok(calendar.startsWith("BEGIN:VCALENDAR\r\nVERSION:2.0\r\n"));
  assert.ok(calendar.endsWith("\r\nEND:VCALENDAR\r\n"));
  const events = unfold(calendar).match(/BEGIN:VEVENT[\s\S]*?END:VEVENT/g);
  assert.equal(events.length, 2);
  const days = ["20261231", "20270101", "20270102"];
  events.forEach((event, index) => {
    assert.ok(event.includes("DTSTART;VALUE=DATE:" + days[index] + "\r\n"));
    assert.ok(event.includes("DTEND;VALUE=DATE:" + days[index + 1] + "\r\n"));
    assert.ok(event.includes("DTSTAMP:20261121T123456Z\r\n"));
    assert.ok(event.includes("SUMMARY:Edinburgh · Day " + (index + 1) + "\r\n"));
    assert.ok(event.includes("DESCRIPTION:" + plan.stops.slice(index * 2, index * 2 + 2).map(stop => stop.name).join("\\n") + "\r\n"));
  });
  const ids = events.map(event => event.match(/^UID:(.+)$/m)?.[1]);
  assert.equal(new Set(ids).size, 2);
  assert.ok(ids.every(id => id?.endsWith("@travel.artemislab.co.uk")));
});

test("validates actual ISO dates and the exclusive end date", () => {
  const plan = createPlan(2, []);
  for (const badDate of ["", "0000-01-01", "2026-2-10", "2026-02-29", "2026-04-31", "2026-13-01", "9999-12-30"]) {
    assert.throws(() => exportCalendar(plan, badDate), RangeError, badDate);
  }
  assert.match(exportCalendar(plan, "2028-02-29"), /DTEND;VALUE=DATE:20280301/);
});

test("escapes iCalendar text and folds UTF-8 without corrupting characters", () => {
  const plan = structuredClone(createPlan(1, []));
  plan.stops[0].name = "Café, gallery; north\\west\r\n" + "🎨é".repeat(30);
  const calendar = exportCalendar(plan, "2026-11-21");
  assert.match(calendar, /\r\n /);
  assert.ok(calendar.split("\r\n").every(line => Buffer.byteLength(line, "utf8") <= 75));
  assert.ok(unfold(calendar).includes("DESCRIPTION:Café\\, gallery\\; north\\\\west\\n" +
    "🎨é".repeat(30) + "\\n" + plan.stops[1].name + "\r\n"));
});
