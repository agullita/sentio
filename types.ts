
export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';
export type InterventionStatus = 'pendiente' | 'atendido' | 'en_proceso';

export interface EmployeeHistory {
  date: string;
  stress: number;
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  manager: string;
  zone: string;
  status: InterventionStatus;
  // Emociones (0-1)
  anger: number;
  pain: number;
  anxiety: number;
  tiredness: number;
  distress: number;
  disgust: number;
  irony: number;
  doubt: number;
  sadness: number;
  frustration: number;
  confusion: number;
  boredom: number;
  contempt: number;
  satisfaction: number;
  determination: number;
  relief: number;
  security: number;
  amusement: number;
  sympathy: number;
  excitement: number;
  last_message: string;
  created_at: string;
  hour?: string; 
  history: EmployeeHistory[]; // Para sparklines
}

export interface DashboardStats {
  globalRisk: number;
  criticalAlerts: number;
  incoherenceRate: number;
  cohesionIndex: number;
  resilienceHallOfFame: Array<{ name: string; ratio: number }>;
  managerAnxiety: Array<{ manager: string; anxiety: number }>;
}

export enum DashboardTab {
  OVERVIEW = 'overview',
  OPERATIONS = 'operations',
  TRENDS = 'trends',
  TALENT = 'talent',
  CEO_INSIGHTS = 'ceo',
  DETAILED_ANALYSIS = 'detailed'
}
