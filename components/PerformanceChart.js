import { useState, useEffect } from "react";

const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// Generate smooth wave data
const generateData = (seed) => {
  return days.map((_, i) => ({
    theory: 30 + Math.sin(i * 0.8 + seed) * 25 + Math.random() * 10,
    practice: 40 + Math.cos(i * 0.9 + seed) * 20 + Math.random() * 10,
    lexicon: 20 + Math.sin(i * 1.1 + seed + 1) * 15 + Math.random() * 8,
  }));
};

const data = generateData(1.2);

const toPath = (points, width, height, padX = 40) => {
  const maxY = 100;
  const xs = points.map((_, i) => padX + (i / (points.length - 1)) * (width - padX * 2));
  const ys = points.map((v) => height - (v / maxY) * (height - 20) - 10);

  let path = `M ${xs[0]} ${ys[0]}`;
  for (let i = 1; i < xs.length; i++) {
    const cp1x = (xs[i - 1] + xs[i]) / 2;
    path += ` C ${cp1x} ${ys[i - 1]}, ${cp1x} ${ys[i]}, ${xs[i]} ${ys[i]}`;
  }
  return { path, xs, ys };
};

const toArea = (points, width, height, padX = 40) => {
  const { path, xs, ys } = toPath(points, width, height, padX);
  const areaPath =
    path +
    ` L ${xs[xs.length - 1]} ${height} L ${xs[0]} ${height} Z`;
  return { path, areaPath, xs, ys };
};

export default function PerformanceChart() {
  const [period, setPeriod] = useState("Weekly");
  const [tooltip, setTooltip] = useState(null);
  const W = 550;
  const H = 180;
  const padX = 40;

  const theory = toArea(data.map((d) => d.theory), W, H, padX);
  const practice = toArea(data.map((d) => d.practice), W, H, padX);
  const lexicon = toArea(data.map((d) => d.lexicon), W, H, padX);

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-50">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-display font-semibold text-gray-900">Performance Chart</h3>
          <p className="text-xs text-gray-400 font-body mt-0.5">Track results and watch your progress rise.</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="text-xs font-body text-gray-600 bg-gray-100 border-0 rounded-lg px-3 py-1.5 cursor-pointer"
          >
            <option>Weekly</option>
            <option>Monthly</option>
            <option>Yearly</option>
          </select>
          <button className="w-7 h-7 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 hover:text-violet-600 transition-colors">
            <svg viewBox="0 0 24 24" fill="none" className="w-3.5 h-3.5" stroke="currentColor" strokeWidth="2">
              <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mb-3">
        {[
          { label: "Theory", color: "#8b5cf6" },
          { label: "Practice", color: "#60a5fa" },
          { label: "Lexicon", color: "#f472b6" },
        ].map((l) => (
          <div key={l.label} className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full" style={{ background: l.color }} />
            <span className="text-xs text-gray-400 font-body">{l.label}</span>
          </div>
        ))}
      </div>

      {/* SVG Chart */}
      <div className="relative">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="w-full"
          onMouseLeave={() => setTooltip(null)}
        >
          <defs>
            <linearGradient id="gTheory" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.3"/>
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.02"/>
            </linearGradient>
            <linearGradient id="gPractice" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.25"/>
              <stop offset="100%" stopColor="#60a5fa" stopOpacity="0.02"/>
            </linearGradient>
            <linearGradient id="gLexicon" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f472b6" stopOpacity="0.25"/>
              <stop offset="100%" stopColor="#f472b6" stopOpacity="0.02"/>
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[0, 25, 50, 75, 100].map((v) => (
            <line
              key={v}
              x1={padX}
              x2={W - padX}
              y1={H - (v / 100) * (H - 20) - 10}
              y2={H - (v / 100) * (H - 20) - 10}
              stroke="#f3f4f6"
              strokeWidth="1"
            />
          ))}

          {/* Area fills */}
          <path d={lexicon.areaPath} fill="url(#gLexicon)" />
          <path d={practice.areaPath} fill="url(#gPractice)" />
          <path d={theory.areaPath} fill="url(#gTheory)" />

          {/* Lines */}
          <path d={lexicon.path} fill="none" stroke="#f472b6" strokeWidth="2" strokeLinecap="round"/>
          <path d={practice.path} fill="none" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round"/>
          <path d={theory.path} fill="none" stroke="#8b5cf6" strokeWidth="2.5" strokeLinecap="round"/>

          {/* Tooltip area & dots */}
          {theory.xs.map((x, i) => (
            <g key={i}>
              {/* Invisible hover zone */}
              <rect
                x={x - 20} y={0} width={40} height={H}
                fill="transparent"
                onMouseEnter={() =>
                  setTooltip({
                    x,
                    y: theory.ys[i],
                    day: days[i],
                    theory: Math.round(data[i].theory),
                    practice: Math.round(data[i].practice),
                    lexicon: Math.round(data[i].lexicon),
                  })
                }
              />
              {tooltip?.day === days[i] && (
                <>
                  <line x1={x} y1={10} x2={x} y2={H - 10} stroke="#e5e7eb" strokeWidth="1" strokeDasharray="4"/>
                  <circle cx={x} cy={theory.ys[i]} r={4} fill="#8b5cf6" stroke="white" strokeWidth="2"/>
                  <circle cx={x} cy={practice.ys[i]} r={4} fill="#60a5fa" stroke="white" strokeWidth="2"/>
                  <circle cx={x} cy={lexicon.ys[i]} r={4} fill="#f472b6" stroke="white" strokeWidth="2"/>
                </>
              )}
            </g>
          ))}

          {/* X-axis labels */}
          {days.map((day, i) => (
            <text
              key={day}
              x={theory.xs[i]}
              y={H - 2}
              textAnchor="middle"
              className="font-body"
              fill="#9ca3af"
              style={{ fontSize: 10, fontFamily: "DM Sans, sans-serif" }}
            >
              {day}
            </text>
          ))}

          {/* Y-axis labels */}
          {[0, 50, 100].map((v) => (
            <text
              key={v}
              x={padX - 5}
              y={H - (v / 100) * (H - 20) - 10 + 4}
              textAnchor="end"
              fill="#9ca3af"
              style={{ fontSize: 9, fontFamily: "DM Sans, sans-serif" }}
            >
              {v}%
            </text>
          ))}

          {/* Tooltip bubble */}
          {tooltip && (
            <g transform={`translate(${Math.min(tooltip.x + 10, W - 90)}, ${Math.max(tooltip.y - 60, 5)})`}>
              <rect width="80" height="56" rx="8" fill="#1e1b4b" opacity="0.9"/>
              <text x="8" y="16" fill="white" style={{ fontSize: 10, fontFamily: "DM Sans", fontWeight: 600 }}>{tooltip.day}</text>
              <text x="8" y="30" fill="#a78bfa" style={{ fontSize: 9, fontFamily: "DM Sans" }}>Theory: {tooltip.theory}%</text>
              <text x="8" y="42" fill="#93c5fd" style={{ fontSize: 9, fontFamily: "DM Sans" }}>Practice: {tooltip.practice}%</text>
              <text x="8" y="54" fill="#f9a8d4" style={{ fontSize: 9, fontFamily: "DM Sans" }}>Lexicon: {tooltip.lexicon}%</text>
            </g>
          )}
        </svg>
      </div>
    </div>
  );
}
