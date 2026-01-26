import { Satellite, Twitter, Github, Zap } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-[#0a0a0a] border-t border-white/5 py-24 px-10 text-gray-500">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-16">
        {/* Brand Column */}
        <div className="col-span-2">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
              <Satellite className="w-3 h-3 text-black" />
            </div>
            <span className="font-black text-white text-lg tracking-tighter uppercase italic">
              ORBITTRACK
            </span>
          </div>
          <p className="text-xs font-bold uppercase tracking-widest leading-loose max-w-xs">
            Professional satellite tracking systems integrated with NASA GLTF interactive models.
          </p>
        </div>
        
        {/* Products Column */}
        <div>
          <h4 className="font-black text-white text-[10px] uppercase tracking-[0.3em] mb-8 italic">
            Products
          </h4>
          <ul className="space-y-4 text-[11px] font-bold uppercase tracking-widest">
            <li className="hover:text-[#8b5cf6] cursor-pointer">Live Map</li>
            <li className="hover:text-[#8b5cf6] cursor-pointer">NASA Models</li>
            <li className="hover:text-[#8b5cf6] cursor-pointer">TLE API</li>
            <li className="text-white">
              Pro Access <Zap className="w-3 h-3 inline ml-1 fill-[#8b5cf6] text-[#8b5cf6]" />
            </li>
          </ul>
        </div>

        {/* Legal Column */}
        <div>
          <h4 className="font-black text-white text-[10px] uppercase tracking-[0.3em] mb-8 italic">
            Legal
          </h4>
          <ul className="space-y-4 text-[11px] font-bold uppercase tracking-widest">
            <li className="hover:text-[#8b5cf6] cursor-pointer">NASA License</li>
            <li className="hover:text-[#8b5cf6] cursor-pointer">Privacy</li>
            <li className="hover:text-[#8b5cf6] cursor-pointer">Terms</li>
            <li className="hover:text-[#8b5cf6] cursor-pointer">Contact</li>
          </ul>
        </div>

        {/* Social Column */}
        <div>
          <h4 className="font-black text-white text-[10px] uppercase tracking-[0.3em] mb-8 italic">
            Social
          </h4>
          <div className="flex gap-4">
            <div className="w-10 h-10 bg-[#141414] rounded-full flex items-center justify-center hover:bg-white hover:text-black transition-all cursor-pointer">
              <Twitter className="w-4 h-4" />
            </div>
            <div className="w-10 h-10 bg-[#141414] rounded-full flex items-center justify-center hover:bg-white hover:text-black transition-all cursor-pointer">
              <Github className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Row */}
      <div className="max-w-7xl mx-auto mt-24 pt-8 border-t border-white/5 flex justify-between text-[9px] font-black uppercase tracking-[0.4em]">
        <span>© 2025 Aerospace Dynamics Inc.</span>
        <span>Assets by NASA Solar System</span>
      </div>
    </footer>
  );
};

export default Footer;