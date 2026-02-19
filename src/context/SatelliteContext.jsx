/**
 * Satellite Context
 * Global state management for selected satellite, satellite list, and observer location
 */

import { createContext, useState, useCallback } from 'react';
import { fetchSatellitesFromCelesTrak, getCurrentPosition, predictPasses } from '../services/apiService.js';

export const SatelliteContext = createContext();

export const SatelliteProvider = ({ children }) => {
  // ==================== STATE ====================
  
  const [satellites, setSatellites] = useState([]);
  const [selectedSatellite, setSelectedSatellite] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Observer location (default: Greenwich)
  const [observerLocation, setObserverLocation] = useState({
    latitude: 51.4769,
    longitude: -0.0,
    altitude: 0, // km
    name: 'Greenwich Observatory',
  });

  // Current position, passes, and orbital elements
  const [currentPosition, setCurrentPosition] = useState(null);
  const [predictedPasses, setPredictedPasses] = useState([]);
  const [orbitalElements, setOrbitalElements] = useState(null);

  // ==================== FUNCTIONS ====================

  /**
   * Fetch satellites from CelesTrak API
   */
  const loadSatellites = useCallback(async (group = 'stations', limit = 30) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchSatellitesFromCelesTrak(group, limit);
      setSatellites(data);
    } catch (err) {
      setError(err.message || 'Failed to load satellites');
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Select a satellite and load its data
   */
  const selectSatellite = useCallback((satellite) => {
    setSelectedSatellite(satellite);
    
    if (satellite?.tle1 && satellite?.tle2) {
      try {
        // Get current position
        const position = getCurrentPosition(satellite.tle1, satellite.tle2);
        setCurrentPosition(position);

        // Get orbital elements (already in satellite object)
        setOrbitalElements({
          inclination: satellite.inclination,
          raan: satellite.raan,
          eccentricity: satellite.eccentricity,
          argumentOfPerigee: satellite.argumentOfPerigee,
          meanAnomaly: satellite.meanAnomaly,
          meanMotion: satellite.meanMotion,
          period: satellite.period,
          altitude: satellite.altitude,
          velocity: satellite.velocity,
        });

        // Predict next passes
        const passes = predictPasses(
          satellite.tle1,
          satellite.tle2,
          observerLocation.latitude,
          observerLocation.longitude,
          observerLocation.altitude,
          10
        );
        setPredictedPasses(passes);
      } catch (err) {
        setError('Failed to calculate satellite data: ' + err.message);
      }
    }
  }, [observerLocation]);

  /**
   * Clear selected satellite
   */
  const clearSelection = useCallback(() => {
    setSelectedSatellite(null);
    setCurrentPosition(null);
    setPredictedPasses([]);
    setOrbitalElements(null);
  }, []);

  /**
   * Update observer location and recalculate passes
   */
  const updateObserverLocation = useCallback((newLocation) => {
    setObserverLocation(newLocation);
    
    // Recalculate passes for new location
    if (selectedSatellite?.tle1 && selectedSatellite?.tle2) {
      try {
        const passes = predictPasses(
          selectedSatellite.tle1,
          selectedSatellite.tle2,
          newLocation.latitude,
          newLocation.longitude,
          newLocation.altitude,
          10
        );
        setPredictedPasses(passes);
      } catch (err) {
        setError('Failed to recalculate passes: ' + err.message);
      }
    }
  }, [selectedSatellite]);

  /**
   * Refresh current position
   */
  const refreshPosition = useCallback(() => {
    if (selectedSatellite?.tle1 && selectedSatellite?.tle2) {
      try {
        const position = getCurrentPosition(selectedSatellite.tle1, selectedSatellite.tle2);
        setCurrentPosition(position);
      } catch (err) {
        setError('Failed to refresh position: ' + err.message);
      }
    }
  }, [selectedSatellite]);

  // ==================== CONTEXT VALUE ====================

  const value = {
    // State
    satellites,
    selectedSatellite,
    loading,
    error,
    observerLocation,
    currentPosition,
    predictedPasses,
    orbitalElements,

    // Actions
    loadSatellites,
    selectSatellite,
    clearSelection,
    updateObserverLocation,
    refreshPosition,
  };

  return (
    <SatelliteContext.Provider value={value}>
      {children}
    </SatelliteContext.Provider>
  );
};
