export const interests = ["Museums", "Outdoors", "Culture"] as const;
export type Interest = (typeof interests)[number];
export type Stop = {
  id: string;
  name: string;
  category: Interest;
  note: string;
};
export type Plan = {
  city: "Manchester";
  days: number;
  preferences: Interest[];
  stops: Stop[];
};

export const places: Stop[] = [
  {
    id: "art",
    name: "Manchester Art Gallery",
    category: "Museums",
    note: "An art-focused stop in the city centre.",
  },
  {
    id: "castlefield",
    name: "Castlefield",
    category: "Outdoors",
    note: "Leave time to explore the canals and old industrial landscape.",
  },
  {
    id: "library",
    name: "John Rylands Library",
    category: "Culture",
    note: "A short architecture and history stop.",
  },
  {
    id: "science",
    name: "Science and Industry Museum",
    category: "Museums",
    note: "Explore Manchester's industrial story.",
  },
  {
    id: "mayfield",
    name: "Mayfield Park",
    category: "Outdoors",
    note: "An outdoor break between indoor activities.",
  },
  {
    id: "northern",
    name: "Northern Quarter",
    category: "Culture",
    note: "Explore independent shops, street art and nearby cafés.",
  },
];

export function createPlan(days: number, preferences: Interest[]): Plan {
  if (
    !Number.isInteger(days) ||
    days < 1 ||
    days > 3 ||
    preferences.some((value) => !interests.includes(value))
  ) {
    throw new Error("Choose one to three whole days and supported interests.");
  }
  const unique = [...new Set(preferences)];
  const ranked = [...places].sort(
    (a, b) =>
      Number(unique.includes(b.category)) - Number(unique.includes(a.category)),
  );
  return {
    city: "Manchester",
    days,
    preferences: unique,
    stops: ranked.slice(0, days * 2),
  };
}

export function restorePlan(text: string): Plan {
  if (text.length > 6000) throw new Error("Saved plan is too large.");
  const raw = JSON.parse(text);
  if (
    raw?.city !== "Manchester" ||
    !Array.isArray(raw.preferences) ||
    !Array.isArray(raw.stops)
  ) {
    throw new Error("Unrecognized saved plan.");
  }
  const plan = createPlan(raw.days, raw.preferences);
  const ids = raw.stops.map((stop: { id?: unknown }) => stop?.id);
  if (
    ids.length !== plan.days * 2 ||
    new Set(ids).size !== ids.length ||
    ids.some((id: unknown) => !places.some((place) => place.id === id))
  ) {
    throw new Error("Saved stops are invalid.");
  }
  return {
    ...plan,
    stops: ids.map((id: string) => places.find((place) => place.id === id)!),
  };
}

export function moveStop(plan: Plan, index: number, delta: -1 | 1): Plan {
  const next = index + delta;
  if (
    !Number.isInteger(index) ||
    index < 0 ||
    next < 0 ||
    index >= plan.stops.length ||
    next >= plan.stops.length
  )
    return plan;
  const stops = [...plan.stops];
  [stops[index], stops[next]] = [stops[next], stops[index]];
  return { ...plan, stops };
}
