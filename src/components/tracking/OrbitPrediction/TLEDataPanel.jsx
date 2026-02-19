import { Database } from 'lucide-react';
import { GlassCard } from '../../ui/GlassCard';

const TLEDataPanel = ({ tleData, satellite }) => {
  if (!tleData) return <div>Loading TLE data...</div>;

  const dataItems = [
    { label: 'NORAD ID', value: tleData.noradId },
    { label: 'Inclination', value: `${tleData.inclination}°` },
    { label: 'RAAN', value: `${tleData.raan}°` },
    { label: 'Eccentricity', value: tleData.eccentricity },
    { label: 'Arg of Perigee', value: `${tleData.argumentOfPerigee}°` },
    { label: 'Mean Anomaly', value: `${tleData.meanAnomaly}°` },
    { label: 'Mean Motion', value: `${tleData.meanMotion} rev/day` },
    { label: 'Epoch', value: `20${tleData.epochYear}-${tleData.epochDayOfYear}` },
  ];

  return (
    <GlassCard className="h-full p-6">
      <div className="flex items-center gap-2 mb-4 pb-4 border-b border-gray-700">
        <Database className="w-5 h-5 text-cyan-400" />
        <h2 className="text-lg font-semibold">TLE Data</h2>
      </div>
      
      <div className="space-y-4">
        {/* Satellite Name */}
        <div className="p-3 bg-purple-500/10 rounded-lg border border-purple-500/30">
          <p className="text-xs text-gray-400 uppercase">Satellite</p>
          <p className="font-semibold text-cyan-400">{satellite.name}</p>
        </div>

        {/* TLE Elements */}
        <div className="space-y-2">
          {dataItems.map((item, idx) => (
            <div key={idx} className="grid grid-cols-2 gap-2 text-sm">
              <p className="text-gray-500">{item.label}</p>
              <p className="font-mono text-cyan-300 text-right">{item.value}</p>
            </div>
          ))}
        </div>

        {/* TLE Lines (Raw) */}
        <div className="pt-4 border-t border-gray-700">
          <p className="text-xs text-gray-400 uppercase mb-2">Raw TLE Lines</p>
          <div className="space-y-1 text-xs font-mono text-gray-500 bg-gray-950/50 p-2 rounded border border-gray-800 overflow-x-auto">
            <p>{satellite.tle1}</p>
            <p>{satellite.tle2}</p>
          </div>
        </div>
      </div>
    </GlassCard>
  );
};

export default TLEDataPanel;
