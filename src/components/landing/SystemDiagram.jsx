import { Database, Radio, Cpu, Globe2 } from "lucide-react";
import NASA3DModel from "../ui/NASA3DModel";

const SystemDiagram = () => {
  return (
    <div id="system" className="bg-[#0a0a0a] py-32 px-6 border-t border-white/5">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-24">
          <h2 className="text-5xl font-black text-white mb-6 uppercase italic tracking-tighter">
            Architecture
          </h2>
          <p className="text-gray-500 font-bold uppercase tracking-tight max-w-xl mx-auto">
            Processing telemetry through NASA's interactive 3D modeling standard.
          </p>
        </div>

        {/* Diagram */}
        <div className="relative h-[600px] w-full max-w-4xl mx-auto flex items-center justify-center">
          {/* Central Hub with NASA 3D Model */}
          <div className="relative z-10">
            <NASA3DModel className="w-64 h-64 md:w-80 md:h-80 shadow-[0_0_100px_rgba(139,92,246,0.4)] border-2 border-[#8b5cf6]/50" />
            <div className="text-center mt-8 font-black text-white tracking-[0.4em] uppercase text-xs italic">
              SGP4 LIVE PROPAGATION
            </div>
          </div>

          {/* Circular Rings */}
          <div className="absolute inset-0 border border-white/5 rounded-full" />
          <div className="absolute inset-32 border border-white/10 rounded-full animate-reverse-spin" />

          {/* Node Labels */}
          {[
            { label: "TLE FEEDS", icon: <Database />, pos: "-top-8 left-1/2 -translate-x-1/2" },
            { label: "STATIONS", icon: <Radio />, pos: "-bottom-8 left-1/2 -translate-x-1/2" },
            { label: "COMPUTE", icon: <Cpu />, pos: "top-1/2 -left-12 -translate-y-1/2" },
            { label: "RENDER", icon: <Globe2 />, pos: "top-1/2 -right-12 -translate-y-1/2" }
          ].map((node, i) => (
            <div key={i} className={`absolute ${node.pos} z-20`}>
              <div className="bg-white px-6 py-3 rounded-2xl flex items-center gap-3 shadow-2xl">
                <div className="text-[#8b5cf6]">{node.icon}</div>
                <div className="text-[10px] font-black text-black tracking-widest uppercase">
                  {node.label}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SystemDiagram;