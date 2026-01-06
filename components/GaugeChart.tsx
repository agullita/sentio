
import React from 'react';

interface GaugeChartProps {
  value: number; // 0-100
  label: string;
}

const GaugeChart: React.FC<GaugeChartProps> = ({ value, label }) => {
  const radius = 80;
  const stroke = 12;
  const normalizedValue = Math.min(Math.max(value, 0), 100);
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (normalizedValue / 100) * circumference;

  const getColor = (val: number) => {
    if (val <= 35) return '#10b981'; // Óptimo: Verde
    if (val <= 60) return '#f59e0b'; // Precaución: Amarillo
    return '#ef4444'; // Crítico: Rojo
  };

  const getStatusText = (val: number) => {
    if (val <= 35) return 'ÓPTIMO';
    if (val <= 60) return 'PRECAUCIÓN';
    return 'CRÍTICO';
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <svg className="w-48 h-48 -rotate-90">
          <circle
            cx="96"
            cy="96"
            r={radius}
            stroke="#1e293b"
            strokeWidth={stroke}
            fill="transparent"
          />
          <circle
            cx="96"
            cy="96"
            r={radius}
            stroke={getColor(value)}
            strokeWidth={stroke}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center rotate-0">
          <span className="text-4xl font-extrabold text-white">{Math.round(value)}</span>
          <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: getColor(value) }}>
            {getStatusText(value)}
          </span>
          <span className="text-[10px] uppercase text-slate-500 font-semibold mt-1">{label}</span>
        </div>
      </div>
    </div>
  );
};

export default GaugeChart;
