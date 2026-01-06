
import React from 'react';
import { Employee } from '../types';

interface FireListModalProps {
  isOpen: boolean;
  onClose: () => void;
  employees: Employee[];
}

const FireListModal: React.FC<FireListModalProps> = ({ isOpen, onClose, employees }) => {
  if (!isOpen) return null;

  // Función para calcular el riesgo localmente para visualización (escala 0-10)
  const calculateLocalRisk = (emp: Employee) => {
    const score = ((emp.anger * 2) + (emp.pain * 2) + emp.anxiety + emp.tiredness) / 6;
    return score * 10;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-slate-900 border border-red-500/30 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl shadow-red-500/10">
        <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-red-950/20">
          <h3 className="text-xl font-bold text-red-500 flex items-center gap-2">
            <i className="fas fa-fire animate-pulse"></i> Lista de Fuego (Alertas Críticas)
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <i className="fas fa-times text-lg"></i>
          </button>
        </div>
        <div className="max-h-96 overflow-y-auto p-4 space-y-3">
          {employees.map((emp) => {
            const riskValue = calculateLocalRisk(emp);
            return (
              <div key={emp.id} className="p-4 bg-slate-800/50 rounded-xl border border-slate-700 flex justify-between items-center group hover:border-red-500/50 transition-colors">
                <div className="flex-1">
                  <p className="font-bold text-slate-100">{emp.name}</p>
                  <p className="text-xs text-slate-400 flex items-center gap-2">
                    <i className="fas fa-user-tie text-[10px]"></i> {emp.manager} • <i className="fas fa-map-marker-alt text-[10px]"></i> {emp.zone}
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <div className="h-1.5 flex-1 bg-slate-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-red-500" 
                        style={{ width: `${Math.min(riskValue * 10, 100)}%` }}
                      ></div>
                    </div>
                    <span className="text-[10px] font-black text-red-400 whitespace-nowrap">
                      {riskValue.toFixed(1)}/10
                    </span>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {emp.anger > 0.5 && <span className="text-[8px] bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded font-bold">IRA</span>}
                    {emp.pain > 0.4 && <span className="text-[8px] bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded font-bold">DOLOR</span>}
                    {emp.distress > 0.4 && <span className="text-[8px] bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded font-bold">ANGUSTIA</span>}
                    {emp.disgust > 0.5 && <span className="text-[8px] bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded font-bold">ASCO</span>}
                  </div>
                </div>
                <a 
                  href={`tel:${emp.phone}`} 
                  className="ml-4 h-10 w-10 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center transition-all group-hover:scale-110 shadow-lg shadow-red-500/20 shrink-0"
                >
                  <i className="fas fa-phone text-white"></i>
                </a>
              </div>
            );
          })}
          {employees.length === 0 && (
            <div className="text-center py-10">
              <i className="fas fa-check-circle text-green-500 text-5xl mb-4"></i>
              <p className="text-slate-400 font-medium">No hay alertas críticas pendientes.</p>
            </div>
          )}
        </div>
        <div className="p-4 border-t border-slate-800 bg-slate-900/50 text-right">
          <button 
            onClick={onClose} 
            className="px-6 py-2 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 font-bold transition-colors text-xs uppercase tracking-widest"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default FireListModal;
