import { useEffect, useRef, useState } from 'react';
import * as satellite from 'satellite.js';
import { Zap, ZoomIn, ZoomOut } from 'lucide-react';
import { GlassCard } from '../../ui/GlassCard';

const OrbitVisualization = ({ position, tle1, tle2, observerLat = 60.1695, observerLng = 24.9354 }) => {
  const canvasRef = useRef(null);
  const [view2D, setView2D] = useState(true);
  const [canvasSize, setCanvasSize] = useState({ width: 600, height: 400 });
  const [zoom, setZoom] = useState(0.5);

  // Observer coordinates
  const obsLat = observerLat;
  const obsLon = observerLng;
  const [nextHelsinkiPass, setNextHelsinkiPass] = useState(null);
  const [countdown, setCountdown] = useState('');

  // Zoom handlers
  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.2, 3));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.2, 0.5));
  const handleResetZoom = () => setZoom(1);

  useEffect(() => {
    if (!canvasRef.current || !tle1 || !tle2) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size dynamically based on container
    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (parent) {
        const width = parent.offsetWidth;
        const height = parent.offsetHeight;
        canvas.width = width * window.devicePixelRatio;
        canvas.height = height * window.devicePixelRatio;
        setCanvasSize({ width: width * window.devicePixelRatio, height: height * window.devicePixelRatio });
      }
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const satrec = satellite.twoline2satrec(tle1, tle2);
    const meanMotion = parseFloat(tle2.substring(52, 63).trim());
    const periodMinutes = 1440 / meanMotion; // Orbital period in minutes
    const periodMs = periodMinutes * 60 * 1000; // in milliseconds

    let animationId;
    let startTime = Date.now();

    const draw = () => {
      // Use fixed canvas size for performance
      canvas.width = canvasSize.width;
      canvas.height = canvasSize.height;

      const elapsed = Date.now() - startTime;
      const orbitProgress = (elapsed % periodMs) / periodMs; // 0 to 1
      const simulatedTime = new Date(Date.now() - (orbitProgress * periodMs)); // Adjust to sync

      // Clear canvas with dark background
      ctx.fillStyle = '#0a0a0a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw Earth with zoom applied
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      // Maximize earth and orbit size for visual impact
      const baseEarthRadius = Math.min(canvas.width, canvas.height) * 0.45;
      const earthRadius = baseEarthRadius * zoom;

      // Earth gradient
      const earthGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, earthRadius);
      earthGradient.addColorStop(0, '#1e40af');
      earthGradient.addColorStop(0.7, '#064e3b');
      earthGradient.addColorStop(1, '#0f172a');
      ctx.fillStyle = earthGradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, earthRadius, 0, Math.PI * 2);
      ctx.fill();

      // Earth border
      ctx.strokeStyle = '#0ea5e9';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw orbit path
      ctx.strokeStyle = 'rgba(139, 92, 246, 0.3)';
      ctx.lineWidth = 4;
      ctx.setLineDash([10, 10]);
      // Make orbit radius fill almost to canvas edge, apply zoom
      const baseOrbitRadius = Math.min(canvas.width, canvas.height) * 0.48;
      const orbitRadius = baseOrbitRadius * zoom;
      ctx.beginPath();
      ctx.arc(centerX, centerY, orbitRadius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);

      // Mark Observer Location
      const observerAngle = (obsLon * Math.PI) / 180;
      const observerX = centerX + orbitRadius * Math.cos(observerAngle);
      const observerY = centerY + orbitRadius * Math.sin(observerAngle);
      ctx.fillStyle = '#f59e42';
      ctx.beginPath();
      ctx.arc(observerX, observerY, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.font = '13px sans-serif';
      ctx.fillStyle = '#f59e42';
      ctx.textAlign = 'center';
      ctx.fillText('Observer', observerX, observerY - 16);

      // Calculate satellite position using TLE and satellite.js
      const positionAndVelocity = satellite.propagate(satrec, simulatedTime);
      const gmst = satellite.gstime(simulatedTime);
      const geo = satellite.eciToGeodetic(positionAndVelocity.position, gmst);
      const satLat = satellite.degreesLat(geo.latitude);
      const satLon = satellite.degreesLong(geo.longitude);

      // Satellite position on orbit
      const satAngle = (satLon * Math.PI) / 180;
      const satX = centerX + orbitRadius * Math.cos(satAngle);
      const satY = centerY + orbitRadius * Math.sin(satAngle);

      // Draw orbit direction arrow
      const nextAngle = satAngle + 0.05; // Small angle ahead for direction
      const arrowStartX = centerX + orbitRadius * Math.cos(satAngle);
      const arrowStartY = centerY + orbitRadius * Math.sin(satAngle);
      const arrowEndX = centerX + orbitRadius * Math.cos(nextAngle);
      const arrowEndY = centerY + orbitRadius * Math.sin(nextAngle);

      // Draw arrow line
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.6)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(arrowStartX, arrowStartY);
      ctx.lineTo(arrowEndX, arrowEndY);
      ctx.stroke();

      // Draw arrowhead
      const arrowHeadSize = 8;
      const angle = Math.atan2(arrowEndY - arrowStartY, arrowEndX - arrowStartX);
      ctx.fillStyle = 'rgba(6, 182, 212, 0.8)';
      ctx.beginPath();
      ctx.moveTo(arrowEndX, arrowEndY);
      ctx.lineTo(arrowEndX - arrowHeadSize * Math.cos(angle - Math.PI / 6), arrowEndY - arrowHeadSize * Math.sin(angle - Math.PI / 6));
      ctx.lineTo(arrowEndX - arrowHeadSize * Math.cos(angle + Math.PI / 6), arrowEndY - arrowHeadSize * Math.sin(angle + Math.PI / 6));
      ctx.closePath();
      ctx.fill();

      // Satellite glow
      const glowGradient = ctx.createRadialGradient(satX, satY, 0, satX, satY, 15);
      glowGradient.addColorStop(0, 'rgba(6, 182, 212, 0.8)');
      glowGradient.addColorStop(1, 'rgba(6, 182, 212, 0)');
      ctx.fillStyle = glowGradient;
      ctx.fillRect(satX - 15, satY - 15, 30, 30);

      // Draw satellite as a diamond/rhombus shape (more distinctive)
      ctx.save();
      ctx.translate(satX, satY);
      ctx.rotate(satAngle + Math.PI / 4); // Rotate based on orbit position
      
      // Draw satellite body
      ctx.fillStyle = '#06b6d4';
      ctx.beginPath();
      ctx.moveTo(0, -10);   // top
      ctx.lineTo(8, 0);     // right
      ctx.lineTo(0, 10);    // bottom
      ctx.lineTo(-8, 0);    // left
      ctx.closePath();
      ctx.fill();

      // Draw satellite detail lines
      ctx.strokeStyle = '#0891b2';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(-6, -5);
      ctx.lineTo(6, -5);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(-6, 5);
      ctx.lineTo(6, 5);
      ctx.stroke();

      // Draw solar panels
      ctx.fillStyle = 'rgba(34, 197, 94, 0.6)';
      ctx.fillRect(-12, -3, 24, 1.5);
      ctx.fillRect(-12, 1.5, 24, 1.5);

      ctx.restore();

      // Draw orbit direction text
      ctx.fillStyle = '#06b6d4';
      ctx.font = 'bold 11px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('↻ Orbit', centerX, centerY + earthRadius + 85);

      // Draw coordinates text
      ctx.fillStyle = '#cbd5e1';
      ctx.font = '12px monospace';
      ctx.textAlign = 'left';
      ctx.fillText(`Lat: ${satLat.toFixed(2)}°`, 20, 30);
      ctx.fillText(`Lon: ${satLon.toFixed(2)}°`, 20, 50);

      // Draw legend
      ctx.fillStyle = '#94a3b8';
      ctx.font = '11px sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText('◆ Satellite', canvas.width - 20, 30);
      ctx.fillText('-- Orbit', canvas.width - 20, 50);
      ctx.fillText('• Observer', canvas.width - 20, 70);

      // Continue animation
      animationId = requestAnimationFrame(draw);
    };

    // Start animation
    animationId = requestAnimationFrame(draw);

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [tle1, tle2, observerLat, observerLng, canvasSize, zoom]);

  // Calculate next Helsinki pass and countdown
  useEffect(() => {
    if (!tle1 || !tle2) return;
    const satrec = satellite.twoline2satrec(tle1, tle2);
    const now = new Date();
    let found = false;
    let nextPass = null;
    for (let i = 1; i <= 180; i++) { // check next 3 hours, every minute
      const future = new Date(now.getTime() + i * 60 * 1000);
      const posVel = satellite.propagate(satrec, future);
      const gmst = satellite.gstime(future);
      const geo = satellite.eciToGeodetic(posVel.position, gmst);
      const lat = satellite.degreesLat(geo.latitude);
      const lon = satellite.degreesLong(geo.longitude);
      if (
        Math.abs(lat - obsLat) < 1 &&
        Math.abs(lon - obsLon) < 1
      ) {
        nextPass = future;
        found = true;
        break;
      }
    }
    setNextHelsinkiPass(nextPass);
  }, [tle1, tle2]);

  useEffect(() => {
    if (!nextHelsinkiPass) {
      setCountdown('No pass in next 3 hours');
      return;
    }
    const interval = setInterval(() => {
      const now = new Date();
      const diff = nextHelsinkiPass - now;
      if (diff > 0) {
        const mins = Math.floor(diff / 60000);
        const secs = Math.floor((diff % 60000) / 1000);
        setCountdown(`${mins} min ${secs} sec`);
      } else {
        setCountdown('Passing now!');
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [nextHelsinkiPass]);

  return (
    <GlassCard className="w-full h-full p-6 flex flex-col">
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-700">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-cyan-400" />
          <h2 className="text-lg font-semibold">Orbit Visualization</h2>
        </div>
        <div className="flex gap-2 items-center">
          <button
            onClick={handleZoomOut}
            className="px-2 py-1 text-xs font-semibold rounded transition-colors text-gray-500 border border-gray-700 hover:border-cyan-400 hover:text-cyan-400 flex items-center gap-1"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-xs text-gray-400 w-8 text-center">{zoom.toFixed(1)}x</span>
          <button
            onClick={handleZoomIn}
            className="px-2 py-1 text-xs font-semibold rounded transition-colors text-gray-500 border border-gray-700 hover:border-cyan-400 hover:text-cyan-400 flex items-center gap-1"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={handleResetZoom}
            className="px-2 py-1 text-xs font-semibold rounded transition-colors text-gray-500 border border-gray-700 hover:border-purple-400 hover:text-purple-400"
            title="Reset Zoom"
          >
            Reset
          </button>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setView2D(true)}
            className={`px-3 py-1 text-xs font-semibold rounded transition-colors ${
              view2D
                ? 'bg-cyan-500/30 text-cyan-400 border border-cyan-500'
                : 'text-gray-500 border border-gray-700 hover:border-purple-500'
            }`}
          >
            2D Map
          </button>
          <button
            onClick={() => setView2D(false)}
            className={`px-3 py-1 text-xs font-semibold rounded transition-colors ${
              !view2D
                ? 'bg-cyan-500/30 text-cyan-400 border border-cyan-500'
                : 'text-gray-500 border border-gray-700 hover:border-purple-500'
            }`}
          >
            3D Globe (Soon)
          </button>
        </div>
      </div>

      <div className="flex-1 w-full flex flex-col">
        {view2D ? (
          <>
            <div className="flex-1 w-full flex items-center justify-center p-6" style={{ minHeight: 'calc(100vh - 200px)' }}>
              <canvas
                ref={canvasRef}
                style={{ width: '100%', height: '100%', borderRadius: '1rem', border: '2px solid #334155', background: '#0f172a', boxShadow: '0 8px 32px rgba(0,0,0,0.25)' }}
              />
            </div>
            <div className="text-cyan-300 text-lg text-center w-full px-6 pb-6">
              Next Helsinki pass: {nextHelsinkiPass ? nextHelsinkiPass.toLocaleString() : 'N/A'}<br />
              Countdown: {countdown}
            </div>
          </>
        ) : (
          <div className="w-full h-full rounded-lg border border-gray-700 bg-gray-950 flex items-center justify-center">
            <p className="text-gray-500">3D CesiumJS viewer coming soon...</p>
          </div>
        )}
      </div>
    </GlassCard>
  );
};

export default OrbitVisualization;
