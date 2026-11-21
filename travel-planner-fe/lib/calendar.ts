import type { Plan } from "./demo";

const utf8 = new TextEncoder();
const escapeText = (value: string) => value
  .replace(/\\/g, "\\\\").replace(/\r\n|\r|\n/g, "\\n").replace(/[,;]/g, "\\$&");

function fold(line: string): string {
  let folded = "";
  let bytes = 0;
  for (const character of line) {
    const size = utf8.encode(character).length;
    if (bytes + size > 75) {
      folded += "\r\n ";
      bytes = 1;
    }
    folded += character;
    bytes += size;
  }
  return folded;
}

export function exportCalendar(plan: Plan, startDate: string, generatedAt = new Date()): string {
  const day = new Date(startDate + "T00:00:00Z");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(startDate) || startDate.startsWith("0000") ||
      !Number.isFinite(day.getTime()) || day.toISOString().slice(0, 10) !== startDate) {
    throw new RangeError("Choose a valid trip start date.");
  }
  const dates = Array.from({ length: plan.days + 1 }, () => {
    const iso = day.toISOString();
    if (iso.length !== 24) throw new RangeError("Choose an earlier trip start date.");
    day.setUTCDate(day.getUTCDate() + 1);
    return iso.slice(0, 10).replaceAll("-", "");
  });
  const stamp = generatedAt.toISOString().slice(0, 19).replace(/[-:]/g, "") + "Z";
  const id = crypto.randomUUID();
  const lines = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Artemis Lab//Travel Planner//EN"];
  for (let index = 0; index < plan.days; index++) {
    const stops = plan.stops.slice(index * 2, index * 2 + 2).map(stop => stop.name);
    lines.push(
      "BEGIN:VEVENT",
      "UID:" + id + "-" + (index + 1) + "@travel.artemislab.co.uk",
      "DTSTAMP:" + stamp,
      "DTSTART;VALUE=DATE:" + dates[index],
      "DTEND;VALUE=DATE:" + dates[index + 1],
      "SUMMARY:" + escapeText(plan.city + " · Day " + (index + 1)),
      "DESCRIPTION:" + escapeText(stops.join("\n")),
      "TRANSP:TRANSPARENT",
      "END:VEVENT",
    );
  }
  return [...lines, "END:VCALENDAR", ""].map(fold).join("\r\n");
}
