import { MapPin, Zap } from 'lucide-react';
import { GlassCard } from '../../ui/GlassCard';

const LivePositionPanel = ({ position }) => {
  if (!position) {
    return (
      <GlassCard className="h-full flex items-center justify-center">
        <p className="text-gray-500">Initializing position data...</p>
      </GlassCard>
    );
  }

  const positionItems = [
    { label: 'Latitude', value: `${position.latitude}°`, unit: 'N/S' },
    { label: 'Longitude', value: `${position.longitude}°`, unit: 'E/W' },
    { label: 'Altitude', value: position.altitude, unit: 'km' },
    { label: 'Velocity', value: position.velocity, unit: 'km/s' },
    { label: 'Sub-Point Lat', value: `${position.subLatitude}°`, unit: '' },
    { label: 'Sub-Point Lon', value: `${position.subLongitude}°`, unit: '' },
  ];

  return (
    <GlassCard className="h-full p-6">
      <div className="flex items-center gap-2 mb-4 pb-4 border-b border-gray-700">
        <MapPin className="w-5 h-5 text-cyan-400" />
        <h2 className="text-lg font-semibold">Live Position</h2>
      </div>

      <div className="space-y-4 h-full flex flex-col">
        {/* Status Indicator */}
        <div className="p-3 bg-green-500/10 rounded-lg border border-green-500/30 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          <div>
            <p className="text-xs text-gray-400">Status</p>
            <p className="font-semibold text-green-400">Active • Tracking</p>
          </div>
          <p className="text-xs text-gray-500 ml-auto">{position.timestamp}</p>
        </div>

        {/* Position Data Grid */}
        <div className="space-y-3 flex-1">
          {positionItems.map((item, idx) => (
            <div key={idx}>
              <p className="text-xs text-gray-500 uppercase mb-1">{item.label}</p>
              <div className="flex items-baseline justify-between bg-gray-900/30 p-2 rounded border border-gray-800">
                <p className="font-mono text-lg text-cyan-300">{item.value}</p>
                {item.unit && <p className="text-xs text-gray-500">{item.unit}</p>}
              </div>
            </div>
          ))}
        </div>

        {/* Orbital Speed Indicator */}
        <div className="mt-auto pt-4 border-t border-gray-700">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-4 h-4 text-yellow-500" />
            <p className="text-xs text-gray-400 uppercase">Orbital Speed</p>
          </div>
          <div className="w-full bg-gray-900 rounded-full h-2 border border-gray-800 overflow-hidden">
            <div
              className="h-full bg-linear-to-r from-cyan-500 to-purple-500 transition-all"
              style={{ width: '85%' }}
            ></div>
          </div>
          <p className="text-xs text-gray-500 mt-1">7.66 km/s • 27,576 km/h</p>
        </div>
      </div>
    </GlassCard>
  );
};

export default LivePositionPanel;
