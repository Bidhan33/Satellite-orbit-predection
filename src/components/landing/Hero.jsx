import { Satellite, ChevronRight, Activity, Navigation } from "lucide-react";
import GlassCard from "../ui/GlassCard";
import Badge from "../ui/Badge";

const Hero = ({ onGetStarted }) => {
  return (
    <div className="relative min-h-screen bg-[#0a0a0a] text-white overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[#8b5cf6]/10 blur-[120px] rounded-full" />

      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-white/5 bg-[#0a0a0a]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-10 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center transition-transform group-hover:rotate-12">
              <Satellite className="w-5 h-5 text-black" />
            </div>
            <span className="text-xl font-black tracking-tighter uppercase italic">
              ORBIT<span className="text-[#8b5cf6]">TRACK</span>
            </span>
          </div>
          <div className="hidden md:flex items-center gap-10 text-[11px] font-black uppercase tracking-[0.2em] text-gray-400">
            <a href="#system" className="hover:text-white transition">System</a>
            <a href="#features" className="hover:text-white transition">Capabilities</a>
            <button 
              onClick={onGetStarted}
              className="bg-[#8b5cf6] text-white px-8 py-2.5 rounded-full font-black hover:bg-white hover:text-black transition-all shadow-xl"
            >
              Launch App
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Content */}
      <div className="relative max-w-6xl mx-auto px-6 pt-28 pb-20 text-center">
        <Badge>NASA GLTF Assets Integrated</Badge>
        
        <h1 className="text-7xl md:text-8xl font-black text-white mb-8 leading-[0.9] tracking-tighter uppercase italic">
          Precision Orbital <br />
          <span className="text-[#8b5cf6]">Intelligence</span>
        </h1>
        
        <p className="text-lg text-gray-500 mb-12 max-w-2xl mx-auto leading-relaxed font-bold uppercase tracking-tight">
          Professional satellite tracking powered by NASA telemetry and aerospace-grade SGP4 propagation algorithms.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-20">
          <button 
            onClick={onGetStarted}
            className="group bg-white text-black px-10 py-5 rounded-full text-sm font-black uppercase tracking-widest hover:bg-[#8b5cf6] hover:text-white transition-all flex items-center shadow-2xl"
          >
            Start Real-Time Tracking
            <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          {[
            { label: "Active Objects", val: "5,842", icon: <Satellite />, variant: "purple" },
            { label: "Accuracy", val: "< 0.8km", icon: <Navigation />, variant: "white" },
            { label: "Live Feed", val: "3D", icon: <Activity />, variant: "dark" }
          ].map((stat, i) => (
            <GlassCard key={i} variant={stat.variant} className="p-10 text-left hover:scale-[1.03]">
              <div className="mb-4 opacity-80">{stat.icon}</div>
              <div className="text-5xl font-black mb-2 tracking-tighter italic uppercase">{stat.val}</div>
              <div className="text-[10px] uppercase tracking-[0.3em] font-black opacity-60">{stat.label}</div>
            </GlassCard>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Hero;