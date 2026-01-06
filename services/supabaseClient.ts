
import { Employee } from '../types';
import * as mock from './mockData';

// Simulación de la capa de datos de Supabase
export const supabase = {
  from: (table: string) => ({
    select: async () => {
      // En un entorno real: return await supabase.from(table).select('*')
      // Fix: Replaced non-existent getEmployees with generateMockEmployees from mockData.ts
      return { data: mock.generateMockEmployees(), error: null };
    },
    update: async (id: string, payload: any) => {
      console.log(`Supabase: Updating ${id} in ${table}`, payload);
      return { error: null };
    }
  })
};
