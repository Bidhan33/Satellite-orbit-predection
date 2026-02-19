const SatelliteSelector = ({ satellites, selectedId, onSelect }) => {
  return (
    <div>
      <h2 className="text-sm font-semibold text-gray-400 uppercase mb-4">Select Target Satellite</h2>
      <div className="flex gap-2 border-b border-gray-700">
        {satellites.map(sat => (
          <button
            key={sat.id}
            onClick={() => onSelect(sat.id)}
            className={`px-6 py-3 font-medium text-sm transition-all border-b-2 ${
              selectedId === sat.id
                ? 'border-cyan-400 text-cyan-400 bg-cyan-400/5'
                : 'border-transparent text-gray-400 hover:text-gray-300'
            }`}
          >
            <div className="flex flex-col items-center gap-1">
              <p className="font-semibold">{sat.name}</p>
              <p className="text-xs text-gray-500">{sat.type}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default SatelliteSelector;
