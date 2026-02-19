/**
 * Propagation Service
 * Handles satellite position propagation and pass prediction using SGP4
 */

import * as satellite from 'satellite.js';

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
