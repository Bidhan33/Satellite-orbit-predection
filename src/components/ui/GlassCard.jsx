const variants = {
  dark: "bg-[#141414] border border-white/5",
  purple: "bg-[#8b5cf6] border border-white/10 text-white",
  white: "bg-white border border-transparent text-black"
};

const GlassCard = ({ children, className = "", variant = "dark" }) => {
  return (
    <div className={`${variants[variant]} rounded-4xl transition-all duration-300 ${className}`}>
      {children}
    </div>
  );
};

export default GlassCard;
export { GlassCard };
