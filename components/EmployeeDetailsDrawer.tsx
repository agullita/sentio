
import React from 'react';
import { Employee } from '../types';
import { X, Phone, Mail, MapPin, User, ShieldCheck, Zap, MessageSquare, Target, Activity, Heart, ShieldAlert, BrainCircuit, Shield } from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';

interface Props {
  employee: Employee | null;
  onClose: () => void;
  onStatusChange: (id: string, status: any) => void;
}

const EmployeeDetailsDrawer: React.FC<Props> = ({ employee, onClose, onStatusChange }) => {
  if (!employee) return null;

  // Psychological Shape Analysis Data
  // Dataset A (Red Area): Plot [Anger, Anxiety, Tiredness, Irony]
  // Dataset B (Green Area): Plot [Determination, Satisfaction, Excitement]
  // We use 7 distinct axes to visualize the "Shape" and balance/imbalance.
  const radarData = [
    { subject: 'IRA', A: employee.anger * 100, B: 0 },
    { subject: 'ANSIEDAD', A: employee.anxiety * 100, B: 0 },
    { subject: 'CANSANCIO', A: employee.tiredness * 100, B: 0 },
    { subject: 'IRONÍA', A: employee.irony * 100, B: 0 },
    { subject: 'DETERMINAC.', A: 0, B: employee.determination * 100 },
    { subject: 'SATISFAC.', A: 0, B: employee.satisfaction * 100 },
    { subject: 'ENTUSIASMO', A: 0, B: employee.excitement * 100 },
  ];

  // Logic to identify special states for the CEO insight
  const isBurnedOutLeader = employee.determination > 0.7 && employee.tiredness > 0.7;
  const isCynicalHighPerformer = employee.determination > 0.8 && employee.irony > 0.6;

  return (
    <>
      <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-40 transition-opacity" onClick={onClose} />
      <div className="fixed top-0 right-0 h-full w-[580px] bg-slate-900 border-l border-slate-800 z-50 shadow-2xl animate-in slide-in-from-right duration-500 flex flex-col">
        
        {/* Header - Tactical HUD */}
        <div className="p-8 border-b border-slate-800 flex justify-between items-center bg-slate-950/40">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20 shadow-inner">
              <User size={36} />
            </div>
            <div>
              <h3 className="font-black text-white text-2xl tracking-tighter">{employee.name}</h3>
              <p className="text-xs font-bold text-indigo-400 uppercase tracking-[0.25em] flex items-center gap-2">
                <Target size={12} className="text-indigo-500" /> {employee.role || 'Unidad de Flota'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-slate-800 rounded-2xl text-slate-500 transition-all hover:rotate-90">
            <X size={28} />
          </button>
        </div>

        {/* Deep Dive Content */}
        <div className="flex-1 overflow-y-auto p-10 space-y-12 custom-scrollbar">
          
          {/* Radar Chart: THE SHAPE ANALYSIS */}
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h4 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.3em] flex items-center gap-2">
                <BrainCircuit size={14} className="text-indigo-500" /> Psychological Shape Analysis
              </h4>
              <div className="flex gap-4">
                <div className="flex items-center gap-2 px-3 py-1 bg-rose-500/10 border border-rose-500/20 rounded-full">
                  <div className="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)]" />
                  <span className="text-[10px] font-black text-rose-500 uppercase">Riesgos</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
                  <span className="text-[10px] font-black text-emerald-500 uppercase">Talento</span>
                </div>
              </div>
            </div>
            
            <div className="h-80 w-full bg-slate-950/60 rounded-[3rem] border border-slate-800/50 p-8 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                 <Shield size={140} />
              </div>
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                  <PolarGrid stroke="#1e293b" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 10, fontWeight: '800' }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                  <Radar 
                    name="Risks" 
                    dataKey="A" 
                    stroke="#f43f5e" 
                    fill="#f43f5e" 
                    fillOpacity={0.5} 
                    strokeWidth={3} 
                    animationDuration={1500}
                  />
                  <Radar 
                    name="Talent" 
                    dataKey="B" 
                    stroke="#10b981" 
                    fill="#10b981" 
                    fillOpacity={0.5} 
                    strokeWidth={3} 
                    animationDuration={1500}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#020617', border: '1px solid #1e293b', borderRadius: '12px', fontSize: '10px', fontWeight: 'bold' }} 
                    itemStyle={{ color: '#94a3b8' }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            {/* AI Diagnosis Badge */}
            <div className="flex flex-col gap-4">
              {isBurnedOutLeader && (
                <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center gap-4 animate-pulse">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-500">
                    <Zap size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest">Alerta de Perfil</p>
                    <p className="text-sm font-bold text-slate-200 uppercase">Líder Agotado (Burned-out Leader)</p>
                  </div>
                </div>
              )}
              {isCynicalHighPerformer && (
                <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-500">
                    <Activity size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Alerta de Perfil</p>
                    <p className="text-sm font-bold text-slate-200 uppercase">Alto Rendimiento Cínico</p>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Metric Breakdown Matrix */}
          <div className="grid grid-cols-2 gap-10">
            <div className="space-y-6">
               <h5 className="text-[11px] font-black text-rose-500 uppercase tracking-widest flex items-center gap-2">
                 <ShieldAlert size={14} /> Risk Indicators
               </h5>
               <div className="space-y-5">
                 <MetricBar label="Ira (Anger)" val={employee.anger} color="rose" />
                 <MetricBar label="Ansiedad (Anxiety)" val={employee.anxiety} color="rose" />
                 <MetricBar label="Fatiga (Tiredness)" val={employee.tiredness} color="rose" />
                 <MetricBar label="Ironía (Irony)" val={employee.irony} color="rose" />
               </div>
            </div>
            <div className="space-y-6">
               <h5 className="text-[11px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-2">
                 <Heart size={14} /> Talent Assets
               </h5>
               <div className="space-y-5">
                 <MetricBar label="Determinación" val={employee.determination} color="emerald" />
                 <MetricBar label="Satisfacción" val={employee.satisfaction} color="emerald" />
                 <MetricBar label="Entusiasmo" val={employee.excitement} color="emerald" />
                 <MetricBar label="Seguridad" val={employee.security || 0} color="emerald" />
               </div>
            </div>
          </div>

          {/* Last Message Analysis */}
          <section className="bg-slate-950/40 rounded-[2.5rem] p-8 border border-slate-800/60 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-10">
              <MessageSquare size={48} className="text-indigo-400" />
            </div>
            <h5 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-4">Neural Speech Analysis</h5>
            <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl relative">
              <p className="text-sm text-slate-300 leading-relaxed italic pr-8 font-medium">
                "{employee.last_message}"
              </p>
              <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2 text-[9px] font-black text-indigo-400 uppercase tracking-widest">
                  <Activity size={10} /> Analyzed by Gemini Intelligence
                </div>
                <div className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${employee.irony > 0.5 ? 'bg-amber-500/20 text-amber-500' : 'bg-emerald-500/20 text-emerald-500'}`}>
                  {employee.irony > 0.5 ? 'Posible Incoherencia' : 'Coherencia Alta'}
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Footer Actions */}
        <div className="p-8 border-t border-slate-800 bg-slate-950/90 flex gap-4">
          <a href={`tel:${employee.phone}`} className="flex-1 flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold text-xs py-4 rounded-2xl border border-slate-800 transition-all shadow-inner">
            <Phone size={16} /> Encriptar Llamada
          </a>
          <button 
            onClick={() => { onStatusChange(employee.id, 'atendido'); onClose(); }}
            className="flex-[1.5] bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs py-4 rounded-2xl transition-all shadow-2xl shadow-indigo-600/20 uppercase tracking-[0.2em] flex items-center justify-center gap-2"
          >
            <ShieldCheck size={18} /> Resolver Intervención
          </button>
        </div>
      </div>
    </>
  );
};

const MetricBar = ({ label, val, color }: any) => (
  <div className="space-y-2">
    <div className="flex justify-between items-center text-[10px] font-black">
      <span className="text-slate-500 uppercase tracking-wider">{label}</span>
      <span className="text-slate-300 font-mono">{(val * 100).toFixed(0)}%</span>
    </div>
    <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden border border-slate-800/50">
      <div 
        className={`h-full transition-all duration-1000 ease-out ${color === 'rose' ? 'bg-gradient-to-r from-rose-600 to-rose-400' : 'bg-gradient-to-r from-emerald-600 to-emerald-400'}`} 
        style={{ width: `${val * 100}%` }} 
      />
    </div>
  </div>
);

export default EmployeeDetailsDrawer;
