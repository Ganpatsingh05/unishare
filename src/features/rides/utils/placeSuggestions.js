import { CAMPUS_PLACES } from "../constants/ridePlaces";
import { RIDE_STRINGS } from "../constants/rideStrings";

const MAX_PER_GROUP = 5;

const norm = (value = "") => value.trim().toLowerCase();

function matches(place, query) {
  if (!query) return true;
  return norm(place).includes(norm(query));
}

/**
 * Builds grouped, route-aware suggestions for a location field.
 *
 * - "paired": places that live rides connect to the other field's value
 *   (for "to", destinations of rides leaving `otherValue`, and vice versa).
 * - "live": other places on live rides, ranked by ride count.
 * - "popular": the curated campus list.
 *
 * @param {object} args
 * @param {string} args.query current text in the field
 * @param {"from"|"to"} args.field
 * @param {string} args.otherValue value of the opposite field
 * @param {Array<{from: string, to: string}>} args.rides live rides
 * @returns {Array<{key: string, title: string, items: Array<{value: string, hint: string, count: number}>}>}
 */
export function buildPlaceSuggestions({ query, field, otherValue, rides }) {
  const seen = new Set([norm(otherValue)]);
  const take = (items) =>
    items
      .filter((item) => {
        const key = norm(item.value);
        if (!item.value || seen.has(key) || !matches(item.value, query)) return false;
        seen.add(key);
        return true;
      })
      .slice(0, MAX_PER_GROUP);

  const counts = new Map();
  const paired = new Map();
  for (const ride of rides || []) {
    const self = field === "from" ? ride.from : ride.to;
    const other = field === "from" ? ride.to : ride.from;
    if (!self) continue;
    counts.set(self, (counts.get(self) || 0) + 1);
    if (otherValue && norm(other) === norm(otherValue)) {
      paired.set(self, (paired.get(self) || 0) + 1);
    }
  }
  const byCount = (map) =>
    [...map.entries()]
      .sort((a, b) => b[1] - a[1])
      .map(([value, count]) => ({ value, count, hint: RIDE_STRINGS.hero.ridesOnRoute(count) }));

  const groups = [
    { key: "paired", title: RIDE_STRINGS.hero.suggestionsRoute(otherValue), items: take(byCount(paired)) },
    { key: "live", title: RIDE_STRINGS.hero.suggestionsLive, items: take(byCount(counts)) },
    {
      key: "popular",
      title: RIDE_STRINGS.hero.suggestionsPopular,
      items: take(CAMPUS_PLACES.map((p) => ({ value: p.value, count: 0, hint: p.area }))),
    },
  ];
  return groups.filter((group) => group.items.length > 0);
}
