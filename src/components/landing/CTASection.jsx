const CTASection = ({ onGetStarted, onOrbitPrediction }) => {
  return (
    <div className="bg-[#0a0a0a] py-40 px-6 relative">
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <h2 className="text-6xl md:text-7xl font-black text-white mb-12 uppercase italic tracking-tighter leading-none">
          Ready to explore <br/> 
          <span className="text-[#8b5cf6]">orbital mechanics?</span>
        </h2>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <button 
            onClick={onGetStarted}
            className="px-12 py-5 bg-white text-black rounded-full text-sm font-black uppercase tracking-[0.2em] hover:scale-105 transition-all shadow-[0_0_60px_rgba(255,255,255,0.15)]"
          >
            View Satellite List
          </button>
          <button 
            onClick={onOrbitPrediction}
            className="px-12 py-5 bg-[#8b5cf6] text-white rounded-full text-sm font-black uppercase tracking-[0.2em] hover:scale-105 transition-all shadow-[0_0_60px_rgba(139,92,246,0.3)] border-2 border-[#8b5cf6]"
          >
            Start Prediction
          </button>
        </div>
      </div>
    </div>
  );
};

export default CTASection;