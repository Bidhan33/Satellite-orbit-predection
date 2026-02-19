/**
 * useSatellite Hook
 * Custom hook to access SatelliteContext with error handling
 */

import { useContext } from 'react';
import { SatelliteContext } from './SatelliteContext';

/**
 * Custom hook to use SatelliteContext
 * @returns {Object} SatelliteContext value
 * @throws {Error} If used outside SatelliteProvider
 */
export const useSatellite = () => {
  const context = useContext(SatelliteContext);
  
  if (!context) {
    throw new Error('useSatellite must be used within a SatelliteProvider');
  }
  
  return context;
};
