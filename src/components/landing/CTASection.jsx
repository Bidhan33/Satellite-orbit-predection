const CTASection = ({ onGetStarted }) => {
  return (
    <div className="bg-[#0a0a0a] py-40 px-6 relative">
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <h2 className="text-6xl md:text-7xl font-black text-white mb-12 uppercase italic tracking-tighter leading-none">
          Design with speed <br/> 
          <span className="text-gray-600">and NASA assets</span>
        </h2>
        <button 
          onClick={onGetStarted}
          className="px-16 py-6 bg-white text-black rounded-full text-sm font-black uppercase tracking-[0.2em] hover:scale-105 transition-all shadow-[0_0_60px_rgba(255,255,255,0.15)]"
        >
          Launch OrbitTrack
        </button>
      </div>
    </div>
  );
};

export default CTASection;