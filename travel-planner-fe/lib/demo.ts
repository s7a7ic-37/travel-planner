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
  // Place names checked against Visit Manchester; this is a curated catalogue, not a live feed.
  { id: "whitworth", name: "The Whitworth", category: "Museums", note: "Art and design collections beside Whitworth Park." },
  { id: "whitworth-park", name: "Whitworth Park", category: "Outdoors", note: "Green space along the Oxford Road corridor." },
  { id: "home", name: "HOME", category: "Culture", note: "A centre for contemporary art, cinema and theatre." },
  { id: "history", name: "People's History Museum", category: "Museums", note: "Stories of democracy and working lives." },
  { id: "islington", name: "New Islington Marina", category: "Outdoors", note: "Waterside paths near Ancoats and Cotton Field Park." },
  { id: "cathedral", name: "Manchester Cathedral", category: "Culture", note: "Historic architecture in the medieval quarter." },
  { id: "football", name: "National Football Museum", category: "Museums", note: "The history and culture of football at Urbis." },
  { id: "heaton", name: "Heaton Park", category: "Outdoors", note: "A larger park north of the city centre." },
  { id: "ancoats", name: "Ancoats", category: "Culture", note: "Industrial architecture around Cutting Room Square." },
  { id: "manchester-museum", name: "Manchester Museum", category: "Museums", note: "Natural history and cultural collections on Oxford Road." },
  { id: "fletcher-moss", name: "Fletcher Moss Botanical Garden", category: "Outdoors", note: "Gardens and woodland paths in Didsbury." },
  { id: "castlefield-gallery", name: "Castlefield Gallery", category: "Culture", note: "Contemporary visual art near the canal district." },
];

export function createPlan(days: number, preferences: Interest[], variation = 0): Plan {
  if (
    !Number.isInteger(days) ||
    days < 1 ||
    days > 3 ||
    !Number.isSafeInteger(variation) || variation < 0 ||
    preferences.some((value) => !interests.includes(value))
  ) {
    throw new Error("Choose one to three whole days and supported interests.");
  }
  const unique = [...new Set(preferences)];
  const offset = variation % places.length;
  const ranked = [...places.slice(offset), ...places.slice(0, offset)].sort(
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

export function exportPlan(plan: Plan): string {
  return JSON.stringify(restorePlan(JSON.stringify(plan)), null, 2);
}

export async function importPlanFile(file: Pick<File, "size" | "text">): Promise<Plan> {
  if (file.size > 6000) throw new Error("Plan files must be no larger than 6 KB.");
  return restorePlan(await file.text());
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
