
import React, { useState, useMemo, useEffect } from 'react';
import { 
  Activity, AlertCircle, Bell, ChevronDown, Filter, 
  LayoutDashboard, LogOut, MoreHorizontal, Search, 
  Settings, Users, TrendingUp, Award, CheckCircle2,
  Phone, Mail, MapPin, BrainCircuit, Zap, ArrowUpRight,
  XCircle, RotateCcw, Eye, ShieldAlert, Heart, TrendingDown,
  BarChart3, UserCheck, Flame, Grid3X3
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, LineChart, Line, AreaChart, Area, Cell, Legend 
} from 'recharts';
import { Employee, DashboardTab, InterventionStatus, RiskLevel } from './types';
import { generateMockEmployees, getFrictions, getBurnoutHistory } from './services/mockData';
import { getExecutiveBriefing } from './services/geminiService';
import GaugeChart from './components/GaugeChart';
import EmployeeDetailsDrawer from './components/EmployeeDetailsDrawer';
import FireListModal from './components/FireListModal';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<DashboardTab>(DashboardTab.OVERVIEW);
  const [employees, setEmployees] = useState<Employee[]>(generateMockEmployees());
  const [isFireModalOpen, setIsFireModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [aiInsight, setAiInsight] = useState('Calculando correlaciones estratégicas...');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const analytics = useMemo(() => {
    const riskScores = employees.map(e => (e.anger + e.anxiety + e.tiredness + e.pain) / 4);
    const globalRisk = (riskScores.reduce((a, b) => a + b, 0) / employees.length) * 100;
    
    const fireList = employees.filter(e => {
      const risk = (e.anger + e.anxiety + e.tiredness + e.pain) / 4;
      return risk > 0.7 && e.status === 'pendiente';
    });

    const incoherences = employees.filter(e => {
      const positiveWords = ['bien', 'genial', 'ok', 'si', 'perfecto'];
      const textMatch = positiveWords.some(w => e.last_message.toLowerCase().includes(w));
      const emoMatch = (e.irony + e.sadness + e.doubt) > 0.5;
      return textMatch && emoMatch;
    }).length;

    const resilienceRatio = employees.map(e => ({
      name: e.name,
      ratio: (e.determination + e.relief + 0.1) / (e.frustration + e.anxiety + 0.1)
    })).sort((a, b) => b.ratio - a.ratio).slice(0, 3);

    const cohesionIndex = employees.reduce((acc, e) => acc + (e.amusement + e.sympathy), 0) / employees.length * 50;

    const managerAnxietyAccumulator = employees.reduce<Record<string, { total: number; count: number }>>((acc, e) => {
      if (!acc[e.manager]) acc[e.manager] = { total: 0, count: 0 };
      acc[e.manager].total += e.anxiety;
      acc[e.manager].count += 1;
      return acc;
    }, {});

    // Explicitly cast Object.entries result or destructured variables to ensure correct typing of 'data'
    const managerData = Object.entries(managerAnxietyAccumulator).map(([name, data]) => {
      const stats = data as { total: number; count: number };
      return {
        manager: name,
        anxiety: (stats.total / stats.count) * 100
      };
    });

    const hourlyAnger = ['09:00', '11:00', '14:00', '18:00'].map(h => ({
      hour: h,
      anger: employees.filter(e => e.hour === h).reduce((acc, e) => acc + e.anger, 0) / Math.max(1, employees.filter(e => e.hour === h).length) * 100
    }));

    return { 
      globalRisk, fireList, 
      incoherenceRate: Math.round((incoherences / employees.length) * 100),
      resilienceRatio, cohesionIndex, managerData, hourlyAnger
    };
  }, [employees]);

  useEffect(() => {
    const fetchAI = async () => {
      const summary = `Riesgo: ${analytics.globalRisk}%. Alertas: ${analytics.fireList.length}. Incoherencia: ${analytics.incoherenceRate}%. Cohesión: ${analytics.cohesionIndex}.`;
      const briefing = await getExecutiveBriefing(summary);
      setAiInsight(briefing);
      setIsLoading(false);
    };
    fetchAI();
  }, [analytics.globalRisk]);

  const filteredEmployees = employees.filter(e => 
    e.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    e.manager.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-slate-950 text-slate-200 font-sans selection:bg-indigo-500/30 overflow-hidden">
      {/* SIDEBAR */}
      <aside className="w-64 border-r border-slate-900 flex flex-col z-20 bg-slate-950/50 backdrop-blur-xl shrink-0">
        <div className="p-8 flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/20">
            <BrainCircuit size={20} className="text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-black tracking-tighter text-white text-sm">MINDFLEET</span>
            <span className="text-[10px] font-bold text-indigo-400 tracking-[0.2em] uppercase">Executive</span>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          <SidebarLink icon={LayoutDashboard} label="Semáforo (L1)" active={activeTab === DashboardTab.OVERVIEW} onClick={() => setActiveTab(DashboardTab.OVERVIEW)} />
          <SidebarLink icon={Grid3X3} label="Detallado (L1.5)" active={activeTab === DashboardTab.DETAILED_ANALYSIS} onClick={() => setActiveTab(DashboardTab.DETAILED_ANALYSIS)} />
          <SidebarLink icon={BarChart3} label="Operativa (L2)" active={activeTab === DashboardTab.OPERATIONS} onClick={() => setActiveTab(DashboardTab.OPERATIONS)} />
          <SidebarLink icon={TrendingUp} label="Tendencias (L3)" active={activeTab === DashboardTab.TRENDS} onClick={() => setActiveTab(DashboardTab.TRENDS)} />
          <SidebarLink icon={Award} label="Talento (L4)" active={activeTab === DashboardTab.TALENT} onClick={() => setActiveTab(DashboardTab.TALENT)} />
          <SidebarLink icon={ShieldAlert} label="CEO Insights (L5)" active={activeTab === DashboardTab.CEO_INSIGHTS} onClick={() => setActiveTab(DashboardTab.CEO_INSIGHTS)} />
        </nav>

        <div className="p-6 border-t border-slate-900/50">
          <div className="bg-slate-900/40 rounded-xl p-4 border border-slate-800">
             <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">System Health</span>
             </div>
             <p className="text-[9px] text-slate-500 font-medium">Model: Gemini 3 Flash Pro<br/>Lat: 120ms • Stable</p>
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <main className="flex-1 overflow-y-auto custom-scrollbar bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-900/5 via-slate-950 to-slate-950">
        <header className="h-16 border-b border-slate-900/50 flex items-center justify-between px-10 sticky top-0 z-10 backdrop-blur-md bg-slate-950/60">
          <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            <span>Intelligence Unit</span>
            <ChevronDown size={12} />
            <span className="text-indigo-400">{activeTab}</span>
          </div>

          <div className="flex items-center gap-6">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={14} />
              <input 
                type="text" 
                placeholder="Buscar flota..." 
                className="bg-slate-900/50 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-[11px] w-64 focus:ring-1 focus:ring-indigo-500/30 focus:outline-none placeholder:text-slate-600"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-500/10 border border-rose-500/20 rounded-full cursor-pointer hover:bg-rose-500/20 transition-all" onClick={() => setIsFireModalOpen(true)}>
              <Flame size={14} className="text-rose-500 animate-bounce" />
              <span className="text-[10px] font-black text-rose-500 uppercase">{analytics.fireList.length} Alertas</span>
            </div>
          </div>
        </header>

        <div className="p-10 max-w-7xl mx-auto space-y-10">
          
          {activeTab === DashboardTab.OVERVIEW && (
            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
                <div className="bg-slate-900/20 border border-slate-800/50 rounded-3xl p-10 flex flex-col items-center">
                   <GaugeChart value={analytics.globalRisk} label="Global Fleet Risk" />
                </div>
                
                <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <KPICard 
                    icon={Flame}
                    label="Fire List Active"
                    value={analytics.fireList.length}
                    status="critical"
                    description="Riesgo >7.0 desatendidos"
                    onClick={() => setIsFireModalOpen(true)}
                  />
                  <KPICard 
                    icon={ShieldAlert}
                    label="Incoherencia"
                    value={`${analytics.incoherenceRate}%`}
                    status={analytics.incoherenceRate > 20 ? 'medium' : 'low'}
                    description="Quiet Quitting detectado"
                  />
                  <div className="md:col-span-2 bg-indigo-600/5 border border-indigo-500/10 rounded-2xl p-6 relative group">
                     <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                        <Zap size={14} /> AI Briefing
                     </h4>
                     <p className="text-sm font-medium text-slate-300 leading-relaxed italic pr-12">
                        {isLoading ? 'Analizando vectores...' : aiInsight}
                     </p>
                  </div>
                </div>
              </section>

              {/* High Density List with Sparklines */}
              <section className="space-y-4">
                <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] px-2">Monitoreo Directo de Flota</h4>
                <div className="bg-slate-900/20 border border-slate-800/50 rounded-3xl overflow-hidden shadow-2xl">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-900/40 border-b border-slate-800">
                      <tr>
                        <th className="p-5 font-black text-slate-500 uppercase tracking-widest text-[9px]">Empleado</th>
                        <th className="p-5 font-black text-slate-500 uppercase tracking-widest text-[9px]">Trend (7D)</th>
                        <th className="p-5 font-black text-slate-500 uppercase tracking-widest text-[9px]">Zona</th>
                        <th className="p-5 font-black text-slate-500 uppercase tracking-widest text-[9px] text-center">Score</th>
                        <th className="p-5 w-10"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50">
                      {filteredEmployees.map((e) => {
                        const risk = (e.anger + e.anxiety + e.tiredness + e.pain) / 4;
                        const isHigh = risk > 0.7;
                        return (
                          <tr key={e.id} onClick={() => setSelectedEmployee(e)} className="group cursor-pointer hover:bg-slate-900/50 transition-colors">
                            <td className="p-5">
                              <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-[10px] ${isHigh ? 'bg-rose-500/10 text-rose-500' : 'bg-slate-800 text-slate-500'}`}>
                                  {e.name.charAt(0)}
                                </div>
                                <div>
                                  <p className="font-bold text-slate-200">{e.name}</p>
                                  <p className="text-[9px] text-slate-600 font-bold uppercase">{e.manager}</p>
                                </div>
                              </div>
                            </td>
                            <td className="p-5 w-32">
                               <div className="h-8 w-24">
                                  <ResponsiveContainer width="100%" height="100%">
                                     <LineChart data={e.history}>
                                        <Line type="monotone" dataKey="stress" stroke={isHigh ? '#f43f5e' : '#6366f1'} strokeWidth={2} dot={false} />
                                     </LineChart>
                                  </ResponsiveContainer>
                               </div>
                            </td>
                            <td className="p-5 text-slate-500 font-bold uppercase text-[10px]">{e.zone}</td>
                            <td className="p-5 text-center">
                               <span className={`px-2 py-0.5 rounded font-mono font-black ${isHigh ? 'bg-rose-500/20 text-rose-500' : 'bg-slate-800 text-slate-400'}`}>
                                 {(risk * 10).toFixed(1)}
                               </span>
                            </td>
                            <td className="p-5 text-right opacity-0 group-hover:opacity-100 transition-opacity">
                               <MoreHorizontal size={14} className="text-slate-600" />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </section>
            </div>
          )}

          {/* NEW TAB: Detailed Heatmap Analysis */}
          {activeTab === DashboardTab.DETAILED_ANALYSIS && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
               <div className="flex justify-between items-end">
                  <div>
                    <h2 className="text-2xl font-black text-white tracking-tighter">Análisis Detallado de Variables</h2>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Matriz de calor psicológico de toda la flota</p>
                  </div>
               </div>

               <div className="bg-slate-900/20 border border-slate-800/50 rounded-3xl overflow-hidden shadow-2xl">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-[10px] border-collapse">
                       <thead className="bg-slate-900/60 border-b border-slate-800">
                          <tr>
                             <th className="p-4 font-black text-slate-400 uppercase tracking-widest border-r border-slate-800 w-48 sticky left-0 bg-slate-950 z-10">Empleado</th>
                             <th className="p-4 font-black text-slate-400 uppercase tracking-widest text-center">Ira</th>
                             <th className="p-4 font-black text-slate-400 uppercase tracking-widest text-center">Ansiedad</th>
                             <th className="p-4 font-black text-slate-400 uppercase tracking-widest text-center">Cansancio</th>
                             <th className="p-4 font-black text-slate-400 uppercase tracking-widest text-center">Tristeza</th>
                             <th className="p-4 font-black text-slate-400 uppercase tracking-widest text-center">Frustrac.</th>
                             <th className="p-4 font-black text-slate-400 uppercase tracking-widest text-center">Determ.</th>
                             <th className="p-4 font-black text-slate-400 uppercase tracking-widest text-center">Satis.</th>
                             <th className="p-4 font-black text-slate-400 uppercase tracking-widest text-center">Duda</th>
                             <th className="p-4 font-black text-slate-400 uppercase tracking-widest text-center">Confus.</th>
                             <th className="p-4 font-black text-slate-400 uppercase tracking-widest text-center">Empatía</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-slate-800/50">
                          {filteredEmployees.map(e => (
                             <tr key={e.id} className="hover:bg-slate-800/20 transition-colors">
                                <td className="p-4 font-bold text-slate-200 border-r border-slate-800 sticky left-0 bg-slate-950/80 backdrop-blur z-10">
                                   {e.name}
                                   <p className="text-[8px] text-slate-600 font-bold">{e.zone}</p>
                                </td>
                                <HeatmapCell value={e.anger} type="negative" />
                                <HeatmapCell value={e.anxiety} type="negative" />
                                <HeatmapCell value={e.tiredness} type="negative" />
                                <HeatmapCell value={e.sadness} type="negative" />
                                <HeatmapCell value={e.frustration} type="negative" />
                                <HeatmapCell value={e.determination} type="positive" />
                                <HeatmapCell value={e.satisfaction} type="positive" />
                                <HeatmapCell value={e.doubt} type="neutral" />
                                <HeatmapCell value={e.confusion} type="neutral" />
                                <HeatmapCell value={e.sympathy} type="positive" />
                             </tr>
                          ))}
                       </tbody>
                    </table>
                  </div>
               </div>
            </div>
          )}

          {activeTab === DashboardTab.OPERATIONS && (
            <div className="space-y-8 animate-in fade-in duration-500">
               <div className="bg-slate-900/20 border border-slate-800 rounded-3xl p-8">
                  <h4 className="text-xs font-black text-slate-300 uppercase tracking-[0.2em] mb-10">Ranking de Fricciones (Causa Raíz)</h4>
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={getFrictions()} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
                        <XAxis type="number" hide domain={[0, 100]} />
                        <YAxis dataKey="tag" type="category" stroke="#94a3b8" fontSize={10} axisLine={false} tickLine={false} width={100} />
                        <Tooltip contentStyle={{ backgroundColor: '#020617', border: '1px solid #1e293b' }} />
                        <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                        <Bar dataKey="stress" name="Nivel de Estrés" fill="#6366f1" radius={[0, 4, 4, 0]} barSize={20} />
                        <Bar dataKey="frustration" name="Nivel de Frustración" fill="#fb7185" radius={[0, 4, 4, 0]} barSize={20} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
               </div>
            </div>
          )}

          {activeTab === DashboardTab.TRENDS && (
            <div className="space-y-8 animate-in fade-in duration-500">
               <div className="bg-slate-900/20 border border-slate-800 rounded-3xl p-8">
                  <h4 className="text-xs font-black text-slate-300 uppercase tracking-[0.2em] mb-10">La Curva del Burnout (Previsión de Bajas)</h4>
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={getBurnoutHistory()}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                        <XAxis dataKey="date" stroke="#475569" fontSize={10} axisLine={false} tickLine={false} />
                        <YAxis stroke="#475569" fontSize={10} axisLine={false} tickLine={false} />
                        <Tooltip contentStyle={{ backgroundColor: '#020617', border: '1px solid #1e293b' }} />
                        <Legend />
                        <Line type="monotone" dataKey="burnout" name="Fatiga Acumulada" stroke="#f43f5e" strokeWidth={4} dot={{r: 4, fill: '#f43f5e'}} />
                        <Line type="monotone" dataKey="retention" name="Retention Probability" stroke="#10b981" strokeWidth={2} strokeDasharray="5 5" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
               </div>
            </div>
          )}

          {activeTab === DashboardTab.TALENT && (
            <div className="space-y-10 animate-in fade-in duration-500">
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="bg-slate-900/20 border border-indigo-500/10 rounded-3xl p-8">
                     <h4 className="text-xs font-black text-indigo-400 uppercase tracking-[0.2em] mb-8 flex items-center gap-2">
                        <Award size={16} /> Hall of Fame: Resiliencia
                     </h4>
                     <div className="space-y-6">
                        {analytics.resilienceRatio.map((e, idx) => (
                          <div key={idx} className="flex items-center justify-between p-4 bg-slate-900/40 rounded-2xl border border-slate-800">
                             <div className="flex items-center gap-4">
                                <span className="text-2xl font-black text-slate-700">#{idx + 1}</span>
                                <div>
                                   <p className="font-bold text-white text-sm">{e.name}</p>
                                   <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest">Problem Solver Tier</p>
                                </div>
                             </div>
                             <div className="text-right">
                                <span className="text-xs font-black text-emerald-400 font-mono">{(e.ratio * 10).toFixed(1)}</span>
                                <p className="text-[8px] text-slate-500 font-bold uppercase">Ratio Resiliencia</p>
                             </div>
                          </div>
                        ))}
                     </div>
                  </div>
                  
                  <div className="bg-slate-900/20 border border-slate-800 rounded-3xl p-8">
                     <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-8">Clima de Cohesión</h4>
                     <div className="flex flex-col items-center justify-center h-full py-10">
                        <div className="relative">
                           <div className="w-32 h-32 rounded-full border-4 border-slate-800 flex items-center justify-center">
                              <Heart size={40} className="text-rose-500 animate-pulse" />
                           </div>
                           <div className="absolute inset-0 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin duration-[3000ms]" />
                        </div>
                        <p className="mt-6 text-xl font-black text-white">{analytics.cohesionIndex.toFixed(0)} / 100</p>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-2">Salud Social del Equipo</p>
                     </div>
                  </div>
               </div>
            </div>
          )}

          {activeTab === DashboardTab.CEO_INSIGHTS && (
            <div className="space-y-10 animate-in fade-in duration-500">
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="bg-slate-900/20 border border-slate-800 rounded-3xl p-8">
                     <h4 className="text-xs font-black text-slate-300 uppercase tracking-[0.2em] mb-10">Mapa de Ira por Horario</h4>
                     <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                           <AreaChart data={analytics.hourlyAnger}>
                              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                              <XAxis dataKey="hour" stroke="#475569" fontSize={10} />
                              <YAxis stroke="#475569" fontSize={10} hide />
                              <Tooltip contentStyle={{backgroundColor: '#020617'}} />
                              <Area type="monotone" dataKey="anger" name="Nivel de Ira" stroke="#f43f5e" fill="#f43f5e20" strokeWidth={3} />
                           </AreaChart>
                        </ResponsiveContainer>
                     </div>
                  </div>

                  <div className="bg-slate-900/20 border border-slate-800 rounded-3xl p-8">
                     <h4 className="text-xs font-black text-slate-300 uppercase tracking-[0.2em] mb-10">Correlación Manager-Ansiedad</h4>
                     <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                           <BarChart data={analytics.managerData}>
                              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                              <XAxis dataKey="manager" stroke="#475569" fontSize={10} />
                              <YAxis stroke="#475569" fontSize={10} />
                              <Tooltip contentStyle={{backgroundColor: '#020617'}} />
                              <Bar dataKey="anxiety" name="% Ansiedad Equipo" fill="#6366f1" radius={[4, 4, 0, 0]} />
                           </BarChart>
                        </ResponsiveContainer>
                     </div>
                  </div>
               </div>
            </div>
          )}

        </div>
      </main>

      {/* DRAWER & MODAL */}
      <EmployeeDetailsDrawer employee={selectedEmployee} onClose={() => setSelectedEmployee(null)} onStatusChange={(id, status) => {
        setEmployees(prev => prev.map(emp => emp.id === id ? { ...emp, status } : emp));
      }} />
      <FireListModal isOpen={isFireModalOpen} onClose={() => setIsFireModalOpen(false)} employees={analytics.fireList} />

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; height: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 10px; }
      `}</style>
    </div>
  );
};

const HeatmapCell = ({ value, type }: { value: number, type: 'positive' | 'negative' | 'neutral' }) => {
  const getBg = () => {
    if (type === 'negative') return `rgba(244, 63, 94, ${value})`;
    if (type === 'positive') return `rgba(16, 185, 129, ${value})`;
    return `rgba(99, 102, 241, ${value})`;
  };

  return (
    <td className="p-4 text-center font-mono font-bold" style={{ backgroundColor: getBg() }}>
       {(value * 100).toFixed(0)}
    </td>
  );
};

const SidebarLink = ({ icon: Icon, label, active, onClick }: any) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-[11px] font-bold uppercase tracking-wider transition-all duration-300 ${
      active 
        ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/10 shadow-[0_0_20px_rgba(99,102,241,0.05)]' 
        : 'text-slate-600 hover:text-slate-200 hover:bg-slate-900/50'
    }`}
  >
    <Icon size={16} strokeWidth={active ? 2.5 : 2} />
    {label}
  </button>
);

const KPICard = ({ icon: Icon, label, value, status, description, onClick }: any) => {
  const colors = {
    critical: 'text-rose-500 border-rose-500/20 bg-rose-500/5 hover:bg-rose-500/10',
    medium: 'text-amber-500 border-amber-500/20 bg-amber-500/5 hover:bg-amber-500/10',
    low: 'text-emerald-500 border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500/10'
  }[status as RiskLevel | 'critical'];

  return (
    <div onClick={onClick} className={`p-6 border rounded-2xl flex flex-col justify-between transition-all duration-300 cursor-pointer ${colors}`}>
       <div className="flex justify-between items-start">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80">{label}</span>
          <Icon size={14} className="opacity-40" />
       </div>
       <div className="mt-4">
          <h3 className="text-4xl font-black tracking-tighter font-mono">{value}</h3>
          <p className="text-[10px] font-bold opacity-60 mt-2 leading-tight">{description}</p>
       </div>
    </div>
  );
};

export default App;
