export const interests = ["Museums", "Outdoors", "Culture", "Food & drink", "Architecture", "Music & nightlife", "Family"] as const;
export type Interest = (typeof interests)[number];
export const destinations = ["Manchester", "London", "Edinburgh", "Liverpool", "York"] as const;
export type City = (typeof destinations)[number];
export type Stop = {
  id: string;
  name: string;
  category: Interest;
  note: string;
  closed?: boolean;
};
export type Plan = {
  city: City;
  days: number;
  preferences: Interest[];
  stops: Stop[];
};

const manchesterPlaces: Stop[] = [
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
  { id: "imperial-war-museum-north", name: "Imperial War Museum North", category: "Museums", note: "Explore how conflict has shaped people's lives." },
  { id: "jewish-museum", name: "Manchester Jewish Museum", category: "Museums", note: "Discover Manchester's Jewish history and community." },
  { id: "transport-museum", name: "Museum of Transport Greater Manchester", category: "Museums", note: "See the vehicles and stories behind local transport." },
  { id: "salford-museum", name: "Salford Museum and Art Gallery", category: "Museums", note: "Local history and art in Peel Park." },
  { id: "sale-water-park", name: "Sale Water Park", category: "Outdoors", note: "Lakeside paths and open space in south Manchester." },
  { id: "alexandra-park", name: "Alexandra Park", category: "Outdoors", note: "A Victorian park with tree-lined paths and gardens." },
  { id: "rhs-bridgewater", name: "RHS Garden Bridgewater", category: "Outdoors", note: "Explore landscaped gardens in Worsley." },
  { id: "peel-park", name: "Peel Park", category: "Outdoors", note: "Riverside paths beside Salford Museum and Art Gallery." },
  { id: "central-library", name: "Manchester Central Library", category: "Culture", note: "Visit the landmark library at St Peter's Square." },
  { id: "royal-exchange", name: "Royal Exchange Theatre", category: "Culture", note: "A theatre in the centre's historic Cotton Exchange." },
  { id: "aviva-studios", name: "Aviva Studios", category: "Culture", note: "A venue for arts, music and live performance." },
  { id: "salford-quays", name: "Salford Quays", category: "Culture", note: "Explore the waterfront, media district and public spaces." },
  { id: "mackie-mayor", name: "Mackie Mayor", category: "Food & drink", note: "Browse the independent food hall in a restored market building." },
  { id: "victoria-baths", name: "Victoria Baths", category: "Architecture", note: "See the landmark Edwardian swimming baths and tiled interiors." },
  { id: "band-on-the-wall", name: "Band on the Wall", category: "Music & nightlife", note: "Find live music at the historic Northern Quarter venue." },
  { id: "legoland-discovery", name: "LEGOLAND Discovery Centre", category: "Family", note: "An indoor LEGO attraction at Trafford Palazzo." },
];

const londonPlaces: Stop[] = [
  { id: "london-british-museum", name: "The British Museum", category: "Museums", note: "Explore collections spanning human history and cultures." },
  { id: "london-natural-history", name: "Natural History Museum", category: "Museums", note: "Discover the natural world in South Kensington." },
  { id: "london-tate-modern", name: "Tate Modern", category: "Museums", note: "See modern and contemporary art beside the Thames." },
  { id: "london-v-and-a", name: "Victoria and Albert Museum", category: "Museums", note: "Explore art, design and performance collections." },
  { id: "london-hyde-park", name: "Hyde Park", category: "Outdoors", note: "Walk the paths and lakeside spaces in central London." },
  { id: "london-greenwich-park", name: "Greenwich Park", category: "Outdoors", note: "Explore historic parkland and hilltop city views." },
  { id: "london-regents-park", name: "The Regent's Park", category: "Outdoors", note: "Find gardens, open lawns and walking paths." },
  { id: "london-south-bank", name: "South Bank", category: "Outdoors", note: "Walk the riverside route between landmark bridges." },
  { id: "london-tower", name: "Tower of London", category: "Culture", note: "Visit the historic fortress on the Thames." },
  { id: "london-tower-bridge", name: "Tower Bridge", category: "Culture", note: "See the landmark bridge and its river crossings." },
  { id: "london-st-pauls", name: "St Paul's Cathedral", category: "Culture", note: "Explore the cathedral and its place in the city." },
  { id: "london-globe", name: "Shakespeare's Globe", category: "Culture", note: "Discover theatre on the Bankside riverfront." },
  { id: "london-borough-market", name: "Borough Market", category: "Food & drink", note: "Explore the historic market's food stalls and produce." },
  { id: "london-barbican", name: "Barbican Centre", category: "Architecture", note: "See the arts centre's distinctive post-war architecture." },
  { id: "london-royal-albert-hall", name: "Royal Albert Hall", category: "Music & nightlife", note: "Visit the landmark concert hall and check its live programme." },
  { id: "london-zoo", name: "ZSL London Zoo", category: "Family", note: "Explore the animal habitats in Regent's Park." },
];

const edinburghPlaces: Stop[] = [
  { id: "edinburgh-national-museum", name: "National Museum of Scotland", category: "Museums", note: "Explore Scotland's history, people and natural world." },
  { id: "edinburgh-national-gallery", name: "Scottish National Gallery", category: "Museums", note: "See art collections on the Mound." },
  { id: "edinburgh-surgeons-hall", name: "Surgeons' Hall Museums", category: "Museums", note: "Discover the history of medicine and surgery." },
  { id: "edinburgh-writers", name: "Writers' Museum", category: "Museums", note: "Learn about Robert Burns, Walter Scott and Robert Louis Stevenson." },
  { id: "edinburgh-holyrood", name: "Holyrood Park", category: "Outdoors", note: "Walk the open landscape beneath Arthur's Seat." },
  { id: "edinburgh-botanic", name: "Royal Botanic Garden Edinburgh", category: "Outdoors", note: "Explore the outdoor gardens north of the centre; check access updates before visiting the glasshouses." },
  { id: "edinburgh-calton", name: "Calton Hill", category: "Outdoors", note: "Take in city views among historic monuments." },
  { id: "edinburgh-dean", name: "Dean Village and Water of Leith", category: "Outdoors", note: "Follow the riverside path through the historic village." },
  { id: "edinburgh-castle", name: "Edinburgh Castle", category: "Culture", note: "Visit the landmark above the Old Town." },
  { id: "edinburgh-royal-mile", name: "The Royal Mile", category: "Culture", note: "Explore the historic route through the Old Town." },
  { id: "edinburgh-holyroodhouse", name: "Palace of Holyroodhouse", category: "Culture", note: "See the royal residence at the end of the Royal Mile." },
  { id: "edinburgh-scott-monument", name: "Scott Monument", category: "Culture", note: "Find the Gothic monument in Princes Street Gardens." },
  { id: "edinburgh-stockbridge", name: "Stockbridge Market", category: "Food & drink", note: "Browse the Sunday market's independent food and craft stalls." },
  { id: "edinburgh-parliament", name: "Scottish Parliament Building", category: "Architecture", note: "See the contemporary building at the foot of Arthur's Seat." },
  { id: "edinburgh-usher-hall", name: "Usher Hall", category: "Music & nightlife", note: "Visit the concert hall and check its performance listings." },
  { id: "edinburgh-camera-obscura", name: "Camera Obscura and World of Illusions", category: "Family", note: "Explore interactive optical illusions near the Castle." },
];

const liverpoolPlaces: Stop[] = [
  { id: "liverpool-museum", name: "Museum of Liverpool", category: "Museums", note: "Explore the city's history and communities on the waterfront." },
  { id: "liverpool-maritime", name: "Merseyside Maritime Museum", category: "Museums", note: "Temporarily closed for redevelopment. Choose another museum before travelling.", closed: true },
  { id: "liverpool-world-museum", name: "World Museum", category: "Museums", note: "Explore collections from natural history to world cultures." },
  { id: "liverpool-tate", name: "Tate Liverpool + RIBA North", category: "Museums", note: "Find art and architecture exhibitions at the waterfront." },
  { id: "liverpool-sefton", name: "Sefton Park", category: "Outdoors", note: "Walk the paths around the lake and Palm House." },
  { id: "liverpool-crosby", name: "Crosby Beach", category: "Outdoors", note: "Walk the shoreline and see Antony Gormley's installation." },
  { id: "liverpool-everton", name: "Everton Park", category: "Outdoors", note: "Explore open parkland with views across the city." },
  { id: "liverpool-clarkes", name: "Clarke Gardens", category: "Outdoors", note: "Take a quiet garden walk in the city's south." },
  { id: "liverpool-albert", name: "Royal Albert Dock", category: "Culture", note: "Explore the dockside warehouses, galleries and public spaces." },
  { id: "liverpool-cathedral", name: "Liverpool Cathedral", category: "Culture", note: "Visit the cathedral overlooking the city." },
  { id: "liverpool-philharmonic", name: "Liverpool Philharmonic Hall", category: "Culture", note: "See the landmark concert hall and its programme." },
  { id: "liverpool-bold-street", name: "Bold Street", category: "Culture", note: "Explore independent shops and cafés in the city centre." },
  { id: "liverpool-baltic-market", name: "Baltic Market", category: "Food & drink", note: "Find independent street food in the Baltic Triangle." },
  { id: "liverpool-st-georges-hall", name: "St George's Hall", category: "Architecture", note: "Explore the neoclassical landmark and its public spaces." },
  { id: "liverpool-cavern-club", name: "The Cavern Club", category: "Music & nightlife", note: "See the Mathew Street live-music venue." },
  { id: "liverpool-eureka", name: "Eureka! Science + Discovery", category: "Family", note: "Explore interactive science exhibits at Seacombe waterfront." },
];

const yorkPlaces: Stop[] = [
  { id: "york-railway", name: "National Railway Museum", category: "Museums", note: "Explore railway engineering and Britain's rail history." },
  { id: "york-castle-museum", name: "York Castle Museum", category: "Museums", note: "Discover everyday life and local history." },
  { id: "york-jorgvik", name: "JORVIK Viking Centre", category: "Museums", note: "Explore York's Viking-age archaeology and stories." },
  { id: "york-art-gallery", name: "York Art Gallery", category: "Museums", note: "See paintings, ceramics and changing exhibitions." },
  { id: "york-museum-gardens", name: "York Museum Gardens", category: "Outdoors", note: "Walk among historic ruins and planted gardens." },
  { id: "york-rowntree", name: "Rowntree Park", category: "Outdoors", note: "Enjoy riverside paths and open green space." },
  { id: "york-homestead", name: "Homestead Park", category: "Outdoors", note: "Explore landscaped gardens and woodland paths." },
  { id: "york-river", name: "River Ouse Walk", category: "Outdoors", note: "Follow the riverside paths through the city." },
  { id: "york-minster", name: "York Minster", category: "Culture", note: "Visit the cathedral at the heart of the city." },
  { id: "york-shambles", name: "The Shambles", category: "Culture", note: "Walk one of York's best-known medieval streets." },
  { id: "york-city-walls", name: "York City Walls", category: "Culture", note: "Walk the historic walls around the centre." },
  { id: "york-clifford", name: "Clifford's Tower", category: "Culture", note: "See the castle keep above the city centre." },
  { id: "york-shambles-market", name: "Shambles Market", category: "Food & drink", note: "Browse the daily market stalls in the city centre." },
  { id: "york-merchants-hall", name: "Merchant Adventurers' Hall", category: "Architecture", note: "Visit the medieval timber-framed guildhall." },
  { id: "york-crescent", name: "The Crescent", category: "Music & nightlife", note: "Catch live music and events at this independent venue." },
  { id: "york-dig", name: "DIG: An Archaeological Adventure", category: "Family", note: "Explore hands-on archaeology in the city centre." },
];

export const cityPlaces: Record<City, Stop[]> = {
  Manchester: manchesterPlaces,
  London: londonPlaces,
  Edinburgh: edinburghPlaces,
  Liverpool: liverpoolPlaces,
  York: yorkPlaces,
};
export const places = cityPlaces.Manchester;

export function availablePlaces(city: City): Stop[] {
  return cityPlaces[city].filter(place => !place.closed);
}

export type RecentItinerary = { id: string; createdAt: number; plan: Plan };
export const HISTORY_KEY = "travel-planner-recent-v1";
export function readRecentItineraries(text: string | null): RecentItinerary[] {
  if (!text || text.length > 30000) return [];
  try {
    const rows = JSON.parse(text);
    if (!Array.isArray(rows)) return [];
    return rows.slice(0, 5).flatMap((row) => {
      if (typeof row?.id !== "string" || !Number.isSafeInteger(row.createdAt) || !Number.isFinite(new Date(row.createdAt).getTime())) return [];
      try {
        return [{ id: row.id, createdAt: row.createdAt, plan: restorePlan(JSON.stringify(row.plan)) }];
      } catch { return []; }
    });
  } catch { return []; }
}
export function rememberItinerary(history: RecentItinerary[], plan: Plan, createdAt = Date.now()): RecentItinerary[] {
  const safePlan = restorePlan(JSON.stringify(plan));
  let id = `${createdAt}-${safePlan.city}-${safePlan.stops.map((stop) => stop.id).join("-")}`;
  while (history.some((item) => item.id === id)) id += "-1";
  return [{ id, createdAt, plan: safePlan }, ...history].slice(0, 5);
}

export function createPlan(days: number, preferences: Interest[], variation = 0, city: City = "Manchester"): Plan {
  if (
    !Number.isInteger(days) ||
    days < 1 ||
    days > 7 ||
    !Number.isSafeInteger(variation) || variation < 0 ||
    preferences.some((value) => !interests.includes(value)) ||
    !destinations.includes(city)
  ) {
    throw new Error("Choose one to seven whole days and supported interests.");
  }
  const unique = [...new Set(preferences)];
  const catalogue = availablePlaces(city);
  const offset = variation % catalogue.length;
  const categories = unique.length ? unique : [...interests];
  const categoryOffset = offset % categories.length;
  const groups = [...categories.slice(categoryOffset), ...categories.slice(0, categoryOffset)].map(category => {
    const choices = catalogue.filter(place => place.category === category);
    const start = offset % choices.length;
    return [...choices.slice(start), ...choices.slice(0, start)];
  });
  const ranked: Stop[] = [];
  for (let round = 0; groups.some(group => round < group.length); round++) {
    for (const group of groups) {
      if (group[round]) ranked.push(group[round]);
    }
  }
  if (unique.length) {
    ranked.push(...[...catalogue.slice(offset), ...catalogue.slice(0, offset)]
      .filter(place => !unique.includes(place.category)));
  }
  return {
    city,
    days,
    preferences: unique,
    stops: ranked.slice(0, days * 2),
  };
}

export function restorePlan(text: string): Plan {
  if (text.length > 6000) throw new Error("Saved plan is too large.");
  const raw = JSON.parse(text);
  if (
    !destinations.includes(raw?.city) ||
    !Array.isArray(raw.preferences) ||
    !Array.isArray(raw.stops)
  ) {
    throw new Error("Unrecognized saved plan.");
  }
  const plan = createPlan(raw.days, raw.preferences, 0, raw.city);
  const ids = raw.stops.map((stop: { id?: unknown }) => stop?.id);
  if (
    ids.length !== plan.days * 2 ||
    new Set(ids).size !== ids.length ||
    ids.some((id: unknown) => !cityPlaces[plan.city].some((place) => place.id === id))
  ) {
    throw new Error("Saved stops are invalid.");
  }
  return {
    ...plan,
    stops: ids.map((id: string) => cityPlaces[plan.city].find((place) => place.id === id)!),
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
