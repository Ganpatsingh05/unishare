// Common pickup and drop points around the LPU campus. They seed the location
// autocomplete and carry coordinates so the map never needs a lookup for them.
// Campus points are approximate; city points were checked against
// OpenStreetMap (Nominatim / Photon) on 2026-10-02.

export const CAMPUS_PLACES = [
  { value: "LPU Main Gate", area: "Campus", lat: 31.2556, lng: 75.7047 },
  { value: "LPU Law Gate", area: "Campus", lat: 31.2522, lng: 75.6957 },
  { value: "LPU Uni Hospital", area: "Campus", lat: 31.2512, lng: 75.7058 },
  { value: "LPU Block 32", area: "Campus", lat: 31.2549, lng: 75.7008 },
  { value: "Phagwara Bus Stand", area: "Phagwara", lat: 31.2149, lng: 75.7708 },
  { value: "Phagwara Railway Station", area: "Phagwara", lat: 31.2175, lng: 75.7654 },
  { value: "Jalandhar Bus Stand", area: "Jalandhar", lat: 31.3126, lng: 75.5915 },
  { value: "Jalandhar City Railway Station", area: "Jalandhar", lat: 31.3312, lng: 75.5907 },
  { value: "Ludhiana Railway Station", area: "Ludhiana", lat: 30.9128, lng: 75.8482 },
  { value: "Amritsar Airport", area: "Amritsar", lat: 31.7086, lng: 74.8004 },
  { value: "Chandigarh ISBT 43", area: "Chandigarh", lat: 30.7163, lng: 76.7447 },
  { value: "Delhi ISBT Kashmere Gate", area: "Delhi", lat: 28.6687, lng: 77.2304 },
];

const byName = (name) => CAMPUS_PLACES.find((place) => place.value === name);

// Default start when only the To field is filled.
export const CAMPUS_ORIGIN = byName("LPU Main Gate");

// Route the map previews before anything is typed.
export const DEFAULT_PREVIEW = { from: byName("LPU Main Gate"), to: byName("Jalandhar City Railway Station") };

export const SEAT_LIMITS = { min: 1, maxFind: 5, maxPost: 6 };
