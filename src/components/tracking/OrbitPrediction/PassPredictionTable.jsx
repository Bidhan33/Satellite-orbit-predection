import { Calendar, Eye } from 'lucide-react';
import { GlassCard } from '../../ui/GlassCard';

const PassPredictionTable = ({ passes }) => {
  const getQualityColor = (quality) => {
    switch (quality) {
      case 'Excellent':
        return 'text-green-400 bg-green-500/10';
      case 'Good':
        return 'text-yellow-400 bg-yellow-500/10';
      default:
        return 'text-orange-400 bg-orange-500/10';
    }
  };

  return (
    <GlassCard className="h-full p-6 flex flex-col">
      <div className="flex items-center gap-2 mb-4 pb-4 border-b border-gray-700">
        <Calendar className="w-5 h-5 text-cyan-400" />
        <h2 className="text-lg font-semibold">Next Passes (24-72h)</h2>
      </div>

      <div className="flex-1 overflow-y-auto space-y-2">
        {passes.map((pass, idx) => (
          <div
            key={pass.id}
            className="p-3 rounded-lg border border-gray-700 bg-gray-900/30 hover:border-purple-500/50 transition-colors"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <p className="text-xs text-gray-500 uppercase">Pass #{idx + 1}</p>
                <p className="text-sm font-mono text-cyan-300">{pass.aos}</p>
              </div>
              <span className={`px-2 py-1 text-xs font-semibold rounded whitespace-nowrap ${getQualityColor(pass.quality)}`}>
                {pass.quality}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <p className="text-gray-500">Max Elevation</p>
                <p className="text-cyan-300 font-mono">{pass.maxElevation}°</p>
              </div>
              <div>
                <p className="text-gray-500">Duration</p>
                <p className="text-cyan-300 font-mono">{pass.duration} min</p>
              </div>
            </div>

            <div className="mt-2 pt-2 border-t border-gray-700 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <Eye className="w-3 h-3" />
                Azimuth: {pass.azimuth}°
              </div>
                 <div className="flex items-center gap-1 mt-1">
                   <span role="img" aria-label="location">📍</span>
                   Location: Helsinki, Finland
                 </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-700 text-xs text-gray-500">
        <p>Green = Elevation &gt;30° | Yellow = 10-30° | Orange &lt; 10°</p>
      </div>
    </GlassCard>
  );
};

export default PassPredictionTable;
