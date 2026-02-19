import { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import SatelliteSelector from './OrbitPrediction/SatelliteSelector';
import TLEDataPanel from './OrbitPrediction/TLEDataPanel';
import LivePositionPanel from './OrbitPrediction/LivePositionPanel';
import PassPredictionTable from './OrbitPrediction/PassPredictionTable';
import OrbitVisualization from './OrbitPrediction/OrbitVisualization';
import { getCurrentPosition, predictPasses } from '../../services/apiService';

const OrbitPredictionPage = ({ onBack }) => {
  // Hardcoded 2 satellites: ISS and CSS Tianhe
  const satellites = [
    {
      id: 'ISS',
      name: 'ISS (ZARYA)',
      noradId: 25544,
      type: 'Space Station',
      tle1: '1 25544U 98067A   26046.59141667  .00012607  00000-0  22546-3 0  9992',
      tle2: '2 25544  51.6416 332.2411 0002569  34.5857 120.4689 15.54456957428651',
    },
    {
      id: 'CSS',
      name: 'CSS Tianhe',
      noradId: 48274,
      type: 'Space Station',
      tle1: '1 48274U 21035A   26046.52605278  .00002269  00000-0  14821-3 0  9998',
      tle2: '2 48274  41.4758 193.6453 0003253  78.8542 281.3246 15.55176156226897',
    },
  ];

  const [selectedSatelliteId, setSelectedSatelliteId] = useState(satellites[0].id);
  const [livePosition, setLivePosition] = useState(null);
  const [passes, setPasses] = useState([]);
  const [observerLat, setObserverLat] = useState(60.1695);
  const [observerLng, setObserverLng] = useState(24.9354);

  const selectedSatellite = satellites.find(sat => sat.id === selectedSatelliteId);

  // Parse TLE data
  const tleData = selectedSatellite ? {
    noradId: selectedSatellite.noradId,
    inclination: parseFloat(selectedSatellite.tle2.substring(8, 16).trim()).toFixed(4),
    raan: parseFloat(selectedSatellite.tle2.substring(17, 25).trim()).toFixed(4),
    eccentricity: parseFloat('0.' + selectedSatellite.tle2.substring(26, 33).trim()).toFixed(7),
    argumentOfPerigee: parseFloat(selectedSatellite.tle2.substring(34, 42).trim()).toFixed(4),
    meanAnomaly: parseFloat(selectedSatellite.tle2.substring(43, 51).trim()).toFixed(4),
    meanMotion: parseFloat(selectedSatellite.tle2.substring(52, 63).trim()).toFixed(8),
    epochYear: selectedSatellite.tle1.substring(18, 20),
    epochDayOfYear: parseFloat(selectedSatellite.tle1.substring(20, 32).trim()).toFixed(3),
  } : null;

  // Real live position updates using satellite propagation
  useEffect(() => {
    const updatePosition = () => {
      if (selectedSatellite) {
        try {
          const position = getCurrentPosition(selectedSatellite.tle1, selectedSatellite.tle2);
          const now = new Date();
          setLivePosition({
            latitude: position.latitude.toFixed(3),
            longitude: position.longitude.toFixed(3),
            altitude: (position.altitude / 1000).toFixed(1), // meters to km
            velocity: (position.velocity / 1000).toFixed(2), // m/s to km/s
            timestamp: now.toLocaleTimeString(),
            // For subpoint, approximate as same for now
            subLatitude: position.latitude.toFixed(3),
            subLongitude: position.longitude.toFixed(3),
          });
        } catch (error) {
          console.error('Propagation error:', error);
        }
      }
    };

    updatePosition(); // Initial update
    const interval = setInterval(updatePosition, 1000);

    return () => clearInterval(interval);
  }, [selectedSatellite]);

  // Generate real pass predictions when satellite or location changes
  useEffect(() => {
    const updatePasses = () => {
      if (selectedSatellite) {
        try {
          const passes = predictPasses(selectedSatellite.tle1, selectedSatellite.tle2, observerLat, observerLng, 0, 10);
          const passData = passes.map((pass, index) => ({
            id: index,
            aos: pass.riseTime.toLocaleString(),
            los: pass.setTime.toLocaleString(),
            maxElevation: pass.maxElevation,
            duration: pass.duration,
            azimuth: 'N/A',
            quality: parseFloat(pass.maxElevation) > 30 ? 'Excellent' : parseFloat(pass.maxElevation) > 10 ? 'Good' : 'Poor',
          }));
          setPasses(passData);
        } catch (error) {
          console.error('Pass prediction error:', error);
          setPasses([]);
        }
      }
    };
    updatePasses();
  }, [selectedSatellite, observerLat, observerLng]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-800 bg-linear-to-r from-purple-900/20 to-cyan-900/20">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-400 hover:text-cyan-400 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
          <h1 className="text-3xl font-black uppercase tracking-widest">
            <span className="text-cyan-400">◆</span> ORBIT PREDICTION <span className="text-cyan-400">◆</span>
          </h1>
          <div></div>
        </div>
      </div>

      {/* Satellite Selector */}
      <div className="p-6 border-b border-gray-800">
        <SatelliteSelector
          satellites={satellites}
          selectedId={selectedSatelliteId}
          onSelect={setSelectedSatelliteId}
        />
      </div>

      {/* Observer Location */}
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-semibold text-cyan-400">Observer Location</h2>
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-300">Lat:</label>
            <input
              type="number"
              value={observerLat}
              onChange={(e) => setObserverLat(parseFloat(e.target.value) || 0)}
              className="bg-gray-800 border border-gray-600 rounded px-2 py-1 text-white w-20"
              step="0.01"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-300">Lng:</label>
            <input
              type="number"
              value={observerLng}
              onChange={(e) => setObserverLng(parseFloat(e.target.value) || 0)}
              className="bg-gray-800 border border-gray-600 rounded px-2 py-1 text-white w-20"
              step="0.01"
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 grid grid-rows-2 gap-0 overflow-hidden bg-[#0a0a0a]">
        {/* Top Row: 3 Panels */}
        <div className="grid grid-cols-3 gap-6 p-6 overflow-y-auto border-b border-gray-800">
          {/* Left: TLE Data */}
          <div className="min-h-0">
            <TLEDataPanel tleData={tleData} satellite={selectedSatellite} />
          </div>

          {/* Center: Live Position */}
          <div className="min-h-0">
            <LivePositionPanel position={livePosition} />
          </div>

          {/* Right: Pass Predictions */}
          <div className="min-h-0">
            <PassPredictionTable passes={passes} />
          </div>
        </div>

        {/* Bottom Row: Orbit Visualization */}
        <div className="p-6 overflow-hidden flex">
          <OrbitVisualization position={livePosition} tle1={selectedSatellite.tle1} tle2={selectedSatellite.tle2} observerLat={observerLat} observerLng={observerLng} />
        </div>
      </div>
    </div>
  );
};

export default OrbitPredictionPage;
