/**
 * Consolidated API Service
 * Centralizes all API calls and data processing for the satellite tracker application
 */

import * as satellite from 'satellite.js';

// ============================================================================
// CELESTRAK API CONFIGURATION
// ============================================================================

const CELESTRAK_BASE_URL = 'https://celestrak.org/NORAD/elements/gp.php';

// ============================================================================
// SATELLITE DATA FETCHING FUNCTIONS
// ============================================================================

/**
 * Get satellite image URL using dicebear API
 * @param {string} satelliteName - Name of the satellite
 * @returns {string} URL to satellite image
 */
const getSatelliteImage = (satelliteName) => {
  return `https://api.dicebear.com/7.x/pixel-art/svg?seed=${encodeURIComponent(satelliteName)}&scale=80&backgroundColor=1e293b,334155,475569`;
};

/**
 * Parse launch date from TLE line 1
 * @param {string} tle1 - First line of TLE
 * @returns {string} Launch date in YYYY-MM-DD format
 */
const parseLaunchDate = (tle1) => {
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
const parseOrbitalElements = (tle1, tle2) => {
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

// ============================================================================
// SATELLITE PROPAGATION FUNCTIONS
// ============================================================================

/**
 * Propagate satellite position using TLE data
 * @param {string} tle1 - First line of TLE
 * @param {string} tle2 - Second line of TLE
 * @param {Date} date - Date for propagation (default: now)
 * @returns {Object} Position object with latitude, longitude, altitude, velocity
 */
export const propagateSatellite = (tle1, tle2, date = new Date()) => {
  const satrec = satellite.twoline2satrec(tle1, tle2);
  const positionAndVelocity = satellite.propagate(satrec, date);

  if (positionAndVelocity.position === false) {
    throw new Error('Propagation failed');
  }

  const positionEci = positionAndVelocity.position;
  const gmst = satellite.gstime(date);
  const positionGd = satellite.eciToGeodetic(positionEci, gmst);

  return {
    latitude: satellite.degreesLat(positionGd.latitude),
    longitude: satellite.degreesLong(positionGd.longitude),
    altitude: positionGd.height * 1000, // km to meters
    velocity: Math.sqrt(
      positionAndVelocity.velocity.x ** 2 +
        positionAndVelocity.velocity.y ** 2 +
        positionAndVelocity.velocity.z ** 2
    ) * 1000, // km/s to m/s
  };
};

/**
 * Get current satellite position
 * @param {string} tle1 - First line of TLE
 * @param {string} tle2 - Second line of TLE
 * @returns {Object} Current position object
 */
export const getCurrentPosition = (tle1, tle2) => {
  return propagateSatellite(tle1, tle2, new Date());
};

// ============================================================================
// PASS PREDICTION FUNCTIONS
// ============================================================================

/**
 * Find the next satellite pass starting from a given time
 * @param {Object} satrec - Satellite record from satellite.js
 * @param {number} obsLat - Observer latitude in degrees
 * @param {number} obsLng - Observer longitude in degrees
 * @param {number} obsAlt - Observer altitude in km
 * @param {Date} startTime - Start time for search
 * @returns {Object|null} Pass data or null if no pass found
 */
const findNextPass = (satrec, obsLat, obsLng, obsAlt, startTime) => {
  const observerGd = {
    latitude: satellite.degreesToRadians(obsLat),
    longitude: satellite.degreesToRadians(obsLng),
    height: obsAlt,
  };

  let time = new Date(startTime);
  let lastElevation = -90;
  let riseTime = null;
  let maxElevation = -90;
  let maxTime = null;
  let setTime = null;

  // Search for next 24 hours in 1-minute intervals
  for (let minutes = 0; minutes < 1440; minutes++) {
    const currentTime = new Date(time.getTime() + minutes * 60000);
    const positionAndVelocity = satellite.propagate(satrec, currentTime);

    if (positionAndVelocity.position === false) continue;

    const positionEci = positionAndVelocity.position;
    const gmst = satellite.gstime(currentTime);
    const positionEcf = satellite.eciToEcf(positionEci, gmst);

    const lookAngles = satellite.ecfToLookAngles(observerGd, positionEcf);

    const elevation = satellite.radiansToDegrees(lookAngles.elevation);

    if (elevation > 0) {
      if (riseTime === null) {
        riseTime = new Date(currentTime);
      }
      if (elevation > maxElevation) {
        maxElevation = elevation;
        maxTime = new Date(currentTime);
      }
    } else if (riseTime !== null && setTime === null) {
      setTime = new Date(currentTime);
      break; // Found the pass
    }

    lastElevation = elevation;
  }

  if (riseTime && maxTime && setTime) {
    return {
      riseTime,
      maxTime,
      setTime,
      maxElevation: maxElevation.toFixed(1),
      duration: Math.round((setTime - riseTime) / 1000 / 60), // minutes
    };
  }

  return null;
};

/**
 * Predict satellite passes for a given observer location
 * @param {string} tle1 - First line of TLE
 * @param {string} tle2 - Second line of TLE
 * @param {number} observerLat - Observer latitude in degrees
 * @param {number} observerLng - Observer longitude in degrees
 * @param {number} observerAlt - Observer altitude in km (default 0)
 * @param {number} numPasses - Number of passes to predict (default 10)
 * @returns {Array} Array of pass objects
 */
export const predictPasses = (
  tle1,
  tle2,
  observerLat = 0,
  observerLng = 0,
  observerAlt = 0,
  numPasses = 10
) => {
  const satrec = satellite.twoline2satrec(tle1, tle2);
  const passes = [];

  // Start from current time
  let startTime = new Date();

  for (let i = 0; i < numPasses; i++) {
    const pass = findNextPass(satrec, observerLat, observerLng, observerAlt, startTime);
    if (pass) {
      passes.push(pass);
      // Start next search after this pass ends
      startTime = new Date(pass.setTime.getTime() + 60000); // 1 minute after set
    } else {
      break;
    }
  }

  return passes;
};
