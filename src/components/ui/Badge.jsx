import { Zap } from "lucide-react";

const Badge = ({ children }) => (
  <span className="inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] bg-white text-black mb-8">
    <Zap className="w-3 h-3 mr-2 fill-black" /> 
    {children}
  </span>
);

export default Badge;