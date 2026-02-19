/**
 * TLE Service
 * Handles fetching and parsing satellite TLE data from CelesTrak API
 */

const CELESTRAK_BASE_URL = 'https://celestrak.org/NORAD/elements/gp.php';

/**
 * Get satellite image URL using dicebear API
 * @param {string} satelliteName - Name of the satellite
 * @returns {string} URL to satellite image
 */
export const getSatelliteImage = (satelliteName) => {
  return `https://api.dicebear.com/7.x/pixel-art/svg?seed=${encodeURIComponent(satelliteName)}&scale=80&backgroundColor=1e293b,334155,475569`;
};

/**
 * Parse launch date from TLE line 1
 * @param {string} tle1 - First line of TLE
 * @returns {string} Launch date in YYYY-MM-DD format
 */
export const parseLaunchDate = (tle1) => {
  const launchYearStr = tle1.substring(9, 11);
  const launchDayStr = tle1.substring(11, 14);
  const launchYear = parseInt(launchYearStr, 10);
  const launchDay = parseInt(launchDayStr, 10);

  // TLE year: if >= 57, 1900 + year, else 2000 + year
  const fullYear = launchYear >= 57 ? 1900 + launchYear : 2000 + launchYear;

  // Create date from year and day of year
  const date = new Date(fullYear, 0, launchDay);
  return date.toISOString().split('T')[0]; // YYYY-MM-DD
};

/**
 * Parse orbital elements from TLE data
 * @param {string} tle1 - First line of TLE
 * @param {string} tle2 - Second line of TLE
 * @returns {Object} Orbital elements object
 */
export const parseOrbitalElements = (tle1, tle2) => {
  const inclination = parseFloat(tle2.substring(8, 16).trim());
  const raan = parseFloat(tle2.substring(17, 25).trim());
  const eccentricity = parseFloat('0.' + tle2.substring(26, 33).trim());
  const argumentOfPerigee = parseFloat(tle2.substring(34, 42).trim());
  const meanAnomaly = parseFloat(tle2.substring(43, 51).trim());
  const meanMotion = parseFloat(tle2.substring(52, 63).trim());

  // Approximate altitude (semi-major axis - Earth radius)
  const earthRadius = 6371; // km
  const semiMajorAxis = Math.pow(398600.4418 / (meanMotion * 2 * Math.PI / 86400) ** 2, 1 / 3); // km
  const altitude = semiMajorAxis - earthRadius;

  // Approximate velocity (circular orbit)
  const velocity = Math.sqrt(398600.4418 / semiMajorAxis); // km/s

  // Period in minutes
  const period = 1440 / meanMotion;

  return {
    inclination: inclination.toFixed(4),
    raan: raan.toFixed(4),
    eccentricity: eccentricity.toFixed(7),
    argumentOfPerigee: argumentOfPerigee.toFixed(4),
    meanAnomaly: meanAnomaly.toFixed(4),
    meanMotion: meanMotion.toFixed(8),
    altitude: altitude.toFixed(0),
    velocity: velocity.toFixed(2),
    period: period.toFixed(0),
  };
};

/**
 * Fetch satellites from CelesTrak API
 * @param {string} group - Satellite group (stations, starlink, weather, etc.)
 * @param {number} limit - Maximum number of satellites to fetch
 * @returns {Promise<Array>} Array of satellite objects
 */
export const fetchSatellitesFromCelesTrak = async (group = 'stations', limit = 30) => {
  const response = await fetch(`${CELESTRAK_BASE_URL}?GROUP=${group}&FORMAT=tle`);

  if (!response.ok) {
    throw new Error('Failed to fetch satellites');
  }

  const text = await response.text();
  const lines = text.split('\n').filter((line) => line.trim());

  const satellites = [];
  for (let i = 0; i < lines.length && satellites.length < limit; i += 3) {
    if (i + 2 < lines.length) {
      const name = lines[i].trim();
      const tle1 = lines[i + 1].trim();
      const tle2 = lines[i + 2].trim();

      const noradId = parseInt(tle1.substring(2, 7), 10);
      const launchDate = parseLaunchDate(tle1);
      const orbitalElements = parseOrbitalElements(tle1, tle2);

      satellites.push({
        noradId,
        name,
        group,
        image: getSatelliteImage(name),
        launchDate,
        ...orbitalElements,
      });
    }
  }

  return satellites;
};
