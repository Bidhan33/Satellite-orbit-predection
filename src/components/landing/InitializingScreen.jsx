import GlassCard from "../ui/GlassCard";
import NASA3DModel from "../ui/NASA3DModel";

const InitializingScreen = ({ onBack }) => (
  <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
    <GlassCard variant="white" className="p-16 text-center">
      <NASA3DModel className="w-48 h-48 mx-auto mb-8" />
      <h2 className="text-4xl font-black">Initializing</h2>
      <button onClick={onBack} className="mt-8 bg-black text-white px-8 py-3 rounded-full">
        Return to HQ
      </button>
    </GlassCard>
  </div>
);

export default InitializingScreen;
