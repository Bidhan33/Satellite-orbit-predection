const NASA3DModel = ({ className = "" }) => (
  <div className={`relative overflow-hidden rounded-full bg-black/40 border border-white/10 ${className}`}>
    <iframe
      src="https://solarsystem.nasa.gov/gltf_embed/2393/"
      width="100%"
      height="100%"
      frameBorder="0"
      loading="lazy"
      title="NASA Satellite Model"
      className="pointer-events-auto scale-110"
    />
  </div>
);

export default NASA3DModel;
