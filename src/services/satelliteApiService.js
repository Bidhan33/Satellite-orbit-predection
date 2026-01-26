/**
 * Lightweight Satellite API Service
 * Fetches ONLY essential fields to avoid crashes
 */

const CELESTRAK_BASE_URL =
  'https://celestrak.org/NORAD/elements/gp.php';

// Function to get satellite image URL
const getSatelliteImage = (satelliteName) => {
  // Generate a unique satellite-themed placeholder image
  // Using dicebear pixel-art style for consistent appearance
  return `https://api.dicebear.com/7.x/pixel-art/svg?seed=${encodeURIComponent(satelliteName)}&scale=80&backgroundColor=1e293b,334155,475569`;
};

export const fetchSatellitesFromCelesTrak = async (
  group = 'stations',
  limit = 30
) => {
  const response = await fetch(
    `${CELESTRAK_BASE_URL}?GROUP=${group}&FORMAT=json`
  );

  if (!response.ok) {
    throw new Error('Failed to fetch satellites');
  }

  const data = await response.json();

  // ✅ RETURN ONLY 3 REAL FIELDS + IMAGE
  return data.slice(0, limit).map((sat) => ({
    noradId: sat.NORAD_CAT_ID,
    name: sat.OBJECT_NAME,
    group,
    image: getSatelliteImage(sat.OBJECT_NAME),
  }));
};
