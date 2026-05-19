export type FuelType = 'Gasolina' | 'Etanol' | 'Diesel';

export interface FuelRecord {
  id: number;
  date: string; // "2025-01-15"
  station: string; // nome do posto
  city: string;
  state: string; // UF ex: "SP"
  fuelType: FuelType;
  pricePerLiter: number; // R$/litro
  liters: number;
  totalPaid: number; // pricePerLiter × liters
  driverName: string;
  driverCpf: string; // "12345678901"
  vehiclePlate: string;
  vehicleModel: string;
}

// KPIs exibidos nos cards do dashboard
export interface DashboardKpis {
  avgGasolinePrice: number;
  avgDieselPrice: number;
  totalLiters: number;
}

// Dado agrupado por estado (para o gráfico de barras)
export interface ConsumptionByState {
  state: string;
  liters: number;
}

// Filtros da tela de Consulta
export interface FuelFilters {
  state: string;
  fuelType: string;
}
