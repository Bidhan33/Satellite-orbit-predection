/**
 * Consolidated API Service (Re-exports)
 * Provides backward compatibility by re-exporting from specialized services
 * 
 * Services organized by domain:
 * - tleService.js: TLE fetching & parsing
 * - propagationService.js: SGP4 propagation & pass prediction
 */

// Re-export TLE Service Functions
export {
  getSatelliteImage,
  parseLaunchDate,
  parseOrbitalElements,
  fetchSatellitesFromCelesTrak,
} from './tleService.js';

// Re-export Propagation Service Functions
export {
  propagateSatellite,
  getCurrentPosition,
  predictPasses,
} from './propagationService.js';
