export type ItineraryPlace = {
  name: string;
  full_address: string;
  coordinates: { latitude: number; longitude: number };
  categories: string[];
};

export function parseDayQuery(
  placesText: string | null,
  restaurantsText: string | null,
  coordinatesText: string | null,
) {
  function parse(text: string | null) {
    if (!text || text.length > 24000)
      throw new Error("Missing or oversized itinerary data.");
    return JSON.parse(text);
  }
  function validCoordinates(value: { lat?: unknown; lng?: unknown }) {
    return (
      value &&
      typeof value.lat === "number" &&
      Number.isFinite(value.lat) &&
      Math.abs(value.lat) <= 90 &&
      typeof value.lng === "number" &&
      Number.isFinite(value.lng) &&
      Math.abs(value.lng) <= 180
    );
  }
  function validatePlaces(value: unknown): ItineraryPlace[] {
    if (
      !Array.isArray(value) ||
      value.length > 3 ||
      value.some(
        (place) =>
          !place ||
          typeof place.name !== "string" ||
          place.name.length > 300 ||
          typeof place.full_address !== "string" ||
          place.full_address.length > 1000 ||
          !Array.isArray(place.categories) ||
          !place.categories.every(
            (category: unknown) => typeof category === "string",
          ) ||
          !validCoordinates({
            lat: place.coordinates?.latitude,
            lng: place.coordinates?.longitude,
          }),
      )
    ) {
      throw new Error("Invalid places in itinerary.");
    }
    return value;
  }
  const places = validatePlaces(parse(placesText));
  const restaurants = validatePlaces(parse(restaurantsText));
  const coordinates = parse(coordinatesText);
  if (!validCoordinates(coordinates))
    throw new Error("Invalid itinerary coordinates.");
  return {
    places,
    restaurants,
    coordinates: coordinates as { lat: number; lng: number },
  };
}
