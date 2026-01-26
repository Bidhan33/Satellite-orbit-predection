import { useState, useEffect } from 'react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

// Custom tooltip component (outside render)
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#0a0a0a] border border-cyan-500/50 px-3 py-2 rounded">
        <p className="text-cyan-400 text-xs font-bold">{payload[0].value}</p>
      </div>
    );
  }
  return null;
};

const StatisticsPanel = () => {
  // Satellite growth data (2000-2025)
  const satelliteGrowthData = [
    { year: 2000, count: 150 },
    { year: 2003, count: 180 },
    { year: 2006, count: 210 },
    { year: 2009, count: 280 },
    { year: 2012, count: 380 },
    { year: 2015, count: 520 },
    { year: 2018, count: 780 },
    { year: 2020, count: 1200 },
    { year: 2021, count: 1850 },
    { year: 2022, count: 3100 },
    { year: 2023, count: 4800 },
    { year: 2024, count: 6500 },
    { year: 2025, count: 8200 },
  ];

  // Live activity data with animation
  const [activityData, setActivityData] = useState([
    { time: 'Now-10s', activity: 45 },
    { time: 'Now-8s', activity: 52 },
    { time: 'Now-6s', activity: 48 },
    { time: 'Now-4s', activity: 61 },
    { time: 'Now-2s', activity: 58 },
    { time: 'Now', activity: 67 },
  ]);

  const [activeSatelliteCount, setActiveSatelliteCount] = useState(67);

  // Simulate real-time activity updates
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSatelliteCount((prev) => {
        const change = Math.floor(Math.random() * 20) - 10;
        const newCount = Math.max(30, Math.min(80, prev + change));
        return newCount;
      });

      setActivityData((prev) => {
        const newData = [...prev.slice(1)];
        const newActivity = Math.max(
          30,
          Math.min(80, newData[newData.length - 1].activity + (Math.random() - 0.5) * 25)
        );
        newData.push({
          time: 'Now',
          activity: Math.round(newActivity),
        });
        return newData;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full h-full bg-linear-to-b from-purple-900/5 via-transparent to-cyan-900/5 border-l border-purple-900/30 overflow-y-auto flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-purple-900/20">
        <h2 className="text-lg font-black uppercase tracking-widest text-cyan-400 flex items-center gap-2">
          <span className="text-2xl">◆</span> Live Statistics
        </h2>
        <p className="text-xs text-gray-500 mt-2">Real-time satellite metrics & historical data</p>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 space-y-6 overflow-y-auto">
        {/* Active Satellites Counter */}
        <div className="rounded-lg border border-cyan-500/30 bg-linear-to-br from-cyan-900/10 to-transparent p-4">
          <div className="text-xs font-bold uppercase tracking-widest text-cyan-400 mb-3">
            Currently Active
          </div>
          <div className="flex items-end gap-4">
            <div className="flex-1">
              <div className="text-4xl font-black text-cyan-400 leading-none">
                {activeSatelliteCount}
              </div>
              <div className="text-xs text-gray-500 mt-2">Satellites in Orbit</div>
            </div>
            <div className="w-2 h-12 bg-linear-to-t from-cyan-500 to-cyan-400 rounded animate-pulse"></div>
          </div>
        </div>

        {/* Live Activity Meter */}
        <div className="rounded-lg border border-purple-500/30 bg-linear-to-br from-purple-900/10 to-transparent p-4">
          <div className="text-xs font-bold uppercase tracking-widest text-purple-400 mb-3">
            Orbital Traffic (Last 10s)
          </div>
          <div className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={activityData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(139, 92, 246, 0.1)" />
                <XAxis
                  dataKey="time"
                  stroke="rgba(139, 92, 246, 0.3)"
                  tick={{ fontSize: 10 }}
                />
                <YAxis
                  stroke="rgba(139, 92, 246, 0.3)"
                  tick={{ fontSize: 10 }}
                  domain={[20, 85]}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="activity"
                  stroke="#a855f7"
                  strokeWidth={2}
                  dot={false}
                  isAnimationActive
                  animationDuration={500}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="text-xs text-gray-500 mt-2">Real-time orbital activity events</div>
        </div>

        {/* Satellite Growth Chart */}
        <div className="rounded-lg border border-cyan-500/30 bg-linear-to-br from-cyan-900/10 to-transparent p-4">
          <div className="text-xs font-bold uppercase tracking-widest text-cyan-400 mb-3">
            Satellite Growth (2000-2025)
          </div>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={satelliteGrowthData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                <defs>
                  <linearGradient id="growthGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.8} />
                    <stop offset="100%" stopColor="#0891b2" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(6, 182, 212, 0.1)" />
                <XAxis
                  dataKey="year"
                  stroke="rgba(6, 182, 212, 0.3)"
                  tick={{ fontSize: 9 }}
                />
                <YAxis
                  stroke="rgba(6, 182, 212, 0.3)"
                  tick={{ fontSize: 9 }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="count"
                  fill="url(#growthGradient)"
                  stroke="#06b6d4"
                  strokeWidth={2}
                  isAnimationActive
                  animationDuration={800}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-3 gap-2 mt-3 text-xs">
            <div className="bg-[#0a0a0a] rounded p-2">
              <div className="text-gray-500">2000</div>
              <div className="text-cyan-400 font-bold">150</div>
            </div>
            <div className="bg-[#0a0a0a] rounded p-2">
              <div className="text-gray-500">2012</div>
              <div className="text-cyan-400 font-bold">380</div>
            </div>
            <div className="bg-[#0a0a0a] rounded p-2">
              <div className="text-gray-500">2025</div>
              <div className="text-cyan-400 font-bold">8.2K</div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="rounded-lg border border-purple-500/30 bg-linear-to-br from-purple-900/10 to-transparent p-4 space-y-2">
          <div className="text-xs font-bold uppercase tracking-widest text-purple-400 mb-3">
            System Overview
          </div>
          <div className="grid grid-cols-2 gap-2">
            <StatBox label="Avg Altitude" value="650 km" />
            <StatBox label="Avg Velocity" value="7.6 km/s" />
            <StatBox label="Tracked Objects" value="8,200+" />
            <StatBox label="Updates/sec" value="24 Hz" />
          </div>
        </div>
      </div>
    </div>
  );
};

const StatBox = ({ label, value }) => (
  <div className="bg-[#0a0a0a] rounded p-2 border border-gray-700/30">
    <div className="text-xs text-gray-500 uppercase">{label}</div>
    <div className="text-sm font-black text-cyan-400">{value}</div>
  </div>
);

export default StatisticsPanel;
