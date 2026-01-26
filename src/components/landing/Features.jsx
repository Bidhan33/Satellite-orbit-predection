import { Globe2, Radio, MapPin, Clock, Activity, Shield, ChevronRight } from "lucide-react";
import GlassCard from "../ui/GlassCard";

const Features = () => {
  const features = [
    { icon: <Globe2 />, title: "3D Rendering", desc: "Interactive glTF visualization of hardware." },
    { icon: <Radio />, title: "Pass Predict", desc: "High-precision AOS/LOS scheduling." },
    { icon: <MapPin />, title: "Ground Trace", desc: "Sub-satellite point projection." },
    { icon: <Clock />, title: "Temporal Warp", desc: "Simulate decay or future conjunctions." },
    { icon: <Activity />, title: "NASA Assets", desc: "Official NASA GLTF model integration." },
    { icon: <Shield />, title: "Collision", desc: "Proximity alerts via covariance analysis." }
  ];

  return (
    <div id="features" className="bg-[#0a0a0a] py-32 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
          <div className="max-w-xl text-left">
            <h2 className="text-5xl font-black text-white mb-6 uppercase italic tracking-tighter">
              Capabilities
            </h2>
            <p className="text-gray-500 font-bold uppercase tracking-tight">
              Everything you need to manage satellite constellations.
            </p>
          </div>
          <button className="text-[#8b5cf6] text-xs font-black uppercase tracking-[0.3em] flex items-center gap-2 hover:text-white transition-all">
            View All Features <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <GlassCard key={i} className="p-10 group hover:bg-[#1f1f1f] border-white/5">
              <div className="w-14 h-14 bg-[#262626] rounded-full flex items-center justify-center mb-8 text-white group-hover:bg-[#8b5cf6] group-hover:scale-110 transition-all">
                {f.icon}
              </div>
              <h3 className="text-xl font-black text-white mb-4 uppercase italic tracking-tighter">
                {f.title}
              </h3>
              <p className="text-gray-500 text-sm font-bold uppercase leading-relaxed tracking-tight">
                {f.desc}
              </p>
            </GlassCard>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Features;