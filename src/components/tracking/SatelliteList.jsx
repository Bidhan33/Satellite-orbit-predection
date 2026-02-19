import { useState, useEffect, useCallback } from 'react';
import {
  Satellite,
  ArrowLeft,
  Search,
  Radio,
  Globe2,
  Activity,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import GlassCard from '../ui/GlassCard';
import Badge from '../ui/Badge';
import StatisticsPanel from './StatisticsPanel';
import { fetchSatellitesFromCelesTrak } from '../../services/apiService';
import '../styles/satelliteListAnimations.css';

const SatelliteList = ({ onBack, onSelectSatellite }) => {
  const [satellites, setSatellites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [imageErrors, setImageErrors] = useState({});
  const [hoveredSatelliteId, setHoveredSatelliteId] = useState(null);

  const fetchSatellites = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      let group = 'stations';

      if (selectedCategory === 'communication') group = 'starlink';
      if (selectedCategory === 'weather') group = 'weather';
      if (selectedCategory === 'navigation') group = 'gps-ops';
      if (selectedCategory === 'telescope') group = 'science';
      if (selectedCategory === 'earth-observation') group = 'resource';

      // ❗ NEVER fetch "all" from API
      const rawData = await fetchSatellitesFromCelesTrak(group, 30);

      // ✅ Data now includes real launch dates and orbital elements
      const enriched = rawData.map((sat) => ({
        ...sat,
        category: selectedCategory === 'all' ? 'other' : selectedCategory,
        status: 'active',
      }));

      setSatellites(enriched);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch satellite data.');
      loadMockData();
    } finally {
      setLoading(false);
    }
  }, [selectedCategory]);

  useEffect(() => {
    fetchSatellites();
  }, [fetchSatellites]);

  const handleImageError = (noradId) => {
    setImageErrors((prev) => ({
      ...prev,
      [noradId]: true,
    }));
  };

  const loadMockData = () => {
    setSatellites([
      {
        noradId: 25544,
        name: 'ISS (ZARYA)',
        category: 'space-station',
        altitude: 408,
        velocity: 7.66,
        period: 92,
        inclination: 51.64,
        status: 'active',
        launchDate: '1998-11-20',
        image: 'https://api.dicebear.com/7.x/shapes/svg?seed=ISS&scale=80&backgroundColor=3b82f6,6366f1,8b5cf6',
      },
    ]);
  };

  const categories = [
    { id: 'all', label: 'All Satellites', icon: <Globe2 /> },
    { id: 'space-station', label: 'Space Stations', icon: <Radio /> },
    { id: 'communication', label: 'Communication', icon: <Activity /> },
    { id: 'telescope', label: 'Telescopes', icon: <Satellite /> },
    { id: 'weather', label: 'Weather', icon: <Activity /> },
    { id: 'navigation', label: 'Navigation', icon: <Radio /> },
    { id: 'earth-observation', label: 'Earth Observation', icon: <Globe2 /> },
  ];

  const filteredSatellites = satellites.filter((sat) => {
    const matchesSearch = sat.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === 'all' ||
      sat.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
          <h1 className="text-2xl font-bold">Satellite Tracker</h1>
          <div></div> {/* Spacer */}
        </div>

        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search satellites..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500"
          />
        </div>

        {/* Category Filters */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                selectedCategory === category.id
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              {category.icon}
              {category.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content - Two Column Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Satellite List (40%) */}
        <div className="w-2/5 border-r border-gray-800 overflow-y-auto">
          {/* Loading */}
          {loading && (
            <div className="flex justify-center py-20">
              <Loader2 className="w-12 h-12 text-[#8b5cf6] animate-spin" />
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="p-6">
              <GlassCard className="p-8 text-center">
                <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-4" />
                <p className="text-red-400">{error}</p>
              </GlassCard>
            </div>
          )}

          {/* Satellite List */}
          {!loading && !error && (
            <div className="p-6 space-y-2">
              {filteredSatellites.map((sat) => (
                <div
                  key={sat.noradId}
                  className="relative"
                  onMouseEnter={() => setHoveredSatelliteId(sat.noradId)}
                  onMouseLeave={() => setHoveredSatelliteId(null)}
                >
                  {/* Satellite Name List Item */}
                  <div
                    className={`px-6 py-4 rounded-lg transition-all duration-300 cursor-pointer ${
                      hoveredSatelliteId === sat.noradId
                        ? 'bg-[#1a1a1a] satellite-glow'
                        : 'bg-[#141414] hover:bg-[#1a1a1a]'
                    }`}
                  >
                    <div
                      className={`text-lg font-black uppercase italic transition-all duration-300 ${
                        hoveredSatelliteId === sat.noradId
                          ? 'text-purple-400 satellite-pulse'
                          : 'text-white'
                      }`}
                    >
                      {sat.name}
                    </div>
                  </div>

                  {/* Hover Details Popup */}
                  {hoveredSatelliteId === sat.noradId && (
                    <div className="absolute top-full left-0 right-0 mt-2 z-50 satellite-detail-appear">
                      <GlassCard className="p-6 border border-purple-500/50">
                        <div className="space-y-4">
                          {/* Image and Basic Info */}
                          <div className="flex gap-4">
                            <div className="w-24 h-24 shrink-0 bg-linear-to-br from-purple-900 to-blue-900 rounded-xl flex items-center justify-center overflow-hidden">
                              {imageErrors[sat.noradId] ? (
                                <div className="text-center">
                                  <Satellite className="w-8 h-8 text-purple-400" />
                                </div>
                              ) : (
                                <img
                                  src={sat.image}
                                  alt={sat.name}
                                  className="h-full w-full object-cover opacity-80"
                                  onError={() => handleImageError(sat.noradId)}
                                />
                              )}
                            </div>

                            <div className="flex-1">
                              <h3 className="text-sm font-black uppercase tracking-wide text-gray-400 mb-1">
                                NORAD ID
                              </h3>
                              <p className="text-xl font-black text-white mb-3">
                                {sat.noradId}
                              </p>
                              <div className="flex gap-2 flex-wrap">
                                <span className="px-3 py-1 bg-purple-900/30 border border-purple-500/50 rounded-full text-xs font-bold text-purple-300">
                                  {sat.category}
                                </span>
                                <span className="px-3 py-1 bg-green-900/30 border border-green-500/50 rounded-full text-xs font-bold text-green-300">
                                  {sat.status}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Orbital Data */}
                          <div className="grid grid-cols-2 gap-3">
                            <Info label="Altitude" value={`${sat.altitude} km`} />
                            <Info label="Velocity" value={`${sat.velocity} km/s`} />
                            <Info label="Period" value={`${sat.period} min`} />
                            <Info label="Inclination" value={`${sat.inclination}°`} />
                          </div>

                          {/* Launch Date */}
                          <div className="bg-[#141414] rounded-lg p-3">
                            <div className="text-xs text-gray-500 uppercase font-bold">
                              Launch Date
                            </div>
                            <div className="text-lg font-black text-white">
                              {sat.launchDate}
                            </div>
                          </div>

                          {/* Select Button */}
                          <button
                            onClick={() => onSelectSatellite?.(sat)}
                            className="w-full mt-2 px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white font-black uppercase rounded-lg transition-colors duration-200"
                          >
                            View Details
                          </button>
                        </div>
                      </GlassCard>
                    </div>
                  )}
                </div>
              ))}

              {filteredSatellites.length === 0 && (
                <div className="text-center py-12">
                  <Satellite className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">No satellites found</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Panel - Statistics (60%) */}
        <div className="w-3/5 bg-linear-to-b from-purple-900/5 via-transparent to-cyan-900/5">
          {!loading && !error && <StatisticsPanel />}
        </div>
      </div>
    </div>
  );
};

const Info = ({ label, value }) => (
  <div className="bg-[#141414] rounded-xl p-3">
    <div className="text-xs text-gray-500 uppercase">{label}</div>
    <div className="text-lg font-black">{value}</div>
  </div>
);

export default SatelliteList;
