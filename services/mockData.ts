
import { Employee } from '../types';

const generateHistory = (base: number) => {
  return Array.from({ length: 7 }).map((_, i) => ({
    date: `Día ${i + 1}`,
    stress: Math.max(0, Math.min(1, base + (Math.random() * 0.4 - 0.2)))
  }));
};

export const generateMockEmployees = (): Employee[] => [
  { 
    id: 'emp_1', name: 'Adrián Mendoza', email: 'a.mendoza@logistics.com', phone: '+34 611 222 333', manager: 'Sonia Raga', zone: 'Madrid-Sur', status: 'pendiente',
    anger: 0.82, pain: 0.15, anxiety: 0.45, tiredness: 0.88, distress: 0.3, disgust: 0.1, irony: 0.1, doubt: 0.2, sadness: 0.1, frustration: 0.8, confusion: 0.1, boredom: 0.2, contempt: 0.1, satisfaction: 0.2, determination: 0.4, relief: 0.1, security: 0.3, amusement: 0.1, sympathy: 0.2, excitement: 0.1,
    last_message: 'Todo bien por aquí.', created_at: '2025-05-10T08:30:00Z', hour: '09:00',
    history: generateHistory(0.6)
  },
  { 
    id: 'emp_2', name: 'Lucía Ortiz', email: 'l.ortiz@logistics.com', phone: '+34 611 444 555', manager: 'Sonia Raga', zone: 'Madrid-Sur', status: 'atendido',
    anger: 0.1, pain: 0.05, anxiety: 0.1, tiredness: 0.2, distress: 0.1, disgust: 0.05, irony: 0.05, doubt: 0.1, sadness: 0.1, frustration: 0.1, confusion: 0.05, boredom: 0.1, contempt: 0.05, satisfaction: 0.85, determination: 0.95, relief: 0.9, security: 0.95, amusement: 0.6, sympathy: 0.7, excitement: 0.8,
    last_message: 'Ruta finalizada sin incidentes.', created_at: '2025-05-10T14:20:00Z', hour: '14:00',
    history: generateHistory(0.1)
  },
  { 
    id: 'emp_3', name: 'Kevin Blanco', email: 'k.blanco@logistics.com', phone: '+34 611 666 777', manager: 'Marc Vila', zone: 'Barcelona-Port', status: 'pendiente',
    anger: 0.15, pain: 0.62, anxiety: 0.8, tiredness: 0.75, distress: 0.6, disgust: 0.2, irony: 0.75, doubt: 0.65, sadness: 0.6, frustration: 0.4, confusion: 0.6, boredom: 0.4, contempt: 0.3, satisfaction: 0.1, determination: 0.2, relief: 0.1, security: 0.2, amusement: 0.1, sympathy: 0.2, excitement: 0.1,
    last_message: 'Sí, sí, todo perfecto, no te preocupes.', created_at: '2025-05-10T09:15:00Z', hour: '09:00',
    history: generateHistory(0.5)
  },
  { 
    id: 'emp_4', name: 'Elena Soler', email: 'e.soler@logistics.com', phone: '+34 611 888 999', manager: 'Marc Vila', zone: 'Barcelona-Port', status: 'en_proceso',
    anger: 0.4, pain: 0.2, anxiety: 0.3, tiredness: 0.5, distress: 0.2, disgust: 0.1, irony: 0.1, doubt: 0.3, sadness: 0.2, frustration: 0.9, confusion: 0.8, boredom: 0.3, contempt: 0.1, satisfaction: 0.4, determination: 0.8, relief: 0.7, security: 0.5, amusement: 0.2, sympathy: 0.3, excitement: 0.3,
    last_message: 'Mucha confusión con la nueva actualización.', created_at: '2025-05-10T11:45:00Z', hour: '11:00',
    history: generateHistory(0.4)
  },
  { 
    id: 'emp_5', name: 'Javier Ruiz', email: 'j.ruiz@logistics.com', phone: '+34 611 000 111', manager: 'Sonia Raga', zone: 'Madrid-Norte', status: 'pendiente',
    anger: 0.1, pain: 0.1, anxiety: 0.1, tiredness: 0.3, distress: 0.1, disgust: 0.1, irony: 0.1, doubt: 0.1, sadness: 0.1, frustration: 0.2, confusion: 0.1, boredom: 0.8, contempt: 0.6, satisfaction: 0.1, determination: 0.3, relief: 0.1, security: 0.2, amusement: 0.1, sympathy: 0.2, excitement: 0.1,
    last_message: 'Día monótono, poca actividad.', created_at: '2025-05-10T10:00:00Z', hour: '18:00',
    history: generateHistory(0.2)
  },
  { 
    id: 'emp_6', name: 'Sofia Vega', email: 's.vega@logistics.com', phone: '+34 611 555 111', manager: 'Marc Vila', zone: 'Valencia', status: 'atendido',
    anger: 0.9, pain: 0.1, anxiety: 0.7, tiredness: 0.8, distress: 0.5, disgust: 0.2, irony: 0.1, doubt: 0.1, sadness: 0.1, frustration: 0.8, confusion: 0.1, boredom: 0.1, contempt: 0.1, satisfaction: 0.2, determination: 0.1, relief: 0.1, security: 0.3, amusement: 0.1, sympathy: 0.1, excitement: 0.1,
    last_message: 'Atascos en la entrada del puerto.', created_at: '2025-05-10T18:00:00Z', hour: '18:00',
    history: generateHistory(0.7)
  }
];

export const getFrictions = () => [
  { tag: 'Nueva App', stress: 85, frustration: 70 },
  { tag: 'Vehículo', stress: 45, frustration: 30 },
  { tag: 'Cliente', stress: 65, frustration: 50 },
  { tag: 'Rutas', stress: 30, frustration: 20 }
];

export const getBurnoutHistory = () => {
  return Array.from({ length: 14 }).map((_, i) => ({
    date: `May ${10 - (13 - i)}`,
    burnout: 0.2 + (Math.sin(i / 2) * 0.1) + (i > 10 ? 0.4 : 0),
    retention: 0.9 - (i * 0.02)
  }));
};
