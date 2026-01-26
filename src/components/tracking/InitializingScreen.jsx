import GlassCard from "../ui/GlassCard";
import NASA3DModel from "../ui/NASA3DModel";

const InitializingScreen = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-white p-6">
      <GlassCard 
        className="max-w-lg w-full p-16 text-center relative overflow-hidden border-none" 
        variant="white"
      >
        <NASA3DModel className="w-48 h-48 mx-auto mb-8 animate-pulse" />
        
        <h2 className="text-4xl font-black mb-4 tracking-tighter uppercase italic text-black">
          Initializing
        </h2>
        
        <p className="text-gray-400 mb-10 font-bold text-xs tracking-widest uppercase">
          Fetching official NASA assets... <br/>
          Synchronizing TLE orbital data...
        </p>
        
        <button 
          onClick={onBack}
          className="w-full bg-black text-white py-4 rounded-full font-black uppercase tracking-widest hover:bg-[#8b5cf6] transition-all"
        >
          Return to HQ
        </button>
      </GlassCard>
    </div>
  );
};

export default InitializingScreen;