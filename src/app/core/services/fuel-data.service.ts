import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, shareReplay } from 'rxjs/operators';
import { FuelRecord, FuelType } from '../../shared/interfaces/fuel.interfaces';

const STATES_CITIES: Record<string, string[]> = {
  SP: ['São Paulo', 'Campinas', 'Santos'],
  RJ: ['Rio de Janeiro', 'Niterói'],
  MG: ['Belo Horizonte', 'Uberlândia'],
  PR: ['Curitiba', 'Londrina'],
  RS: ['Porto Alegre', 'Caxias do Sul'],
  BA: ['Salvador', 'Feira de Santana'],
  CE: ['Fortaleza', 'Caucaia'],
  GO: ['Goiânia', 'Anápolis'],
  PE: ['Recife', 'Olinda', 'Caruaru'],
};

const ALL_STATES = Object.keys(STATES_CITIES);
const FUEL_TYPES: FuelType[] = ['Gasolina', 'Etanol', 'Diesel'];

const STATIONS = [
  'Posto Ipiranga',
  'Posto Shell',
  'Posto BR',
  'Auto Posto Central',
  'Rede Combustível',
  'Posto Petrobras',
];

const DRIVERS = [
  { name: 'Carlos Silva', cpf: '12345678901' },
  { name: 'Ana Souza', cpf: '98765432100' },
  { name: 'Pedro Lima', cpf: '11122233344' },
  { name: 'Maria Oliveira', cpf: '55566677788' },
  { name: 'João Santos', cpf: '99988877766' },
];

const VEHICLES = [
  { plate: 'ABC1D23', model: 'Fiat Strada' },
  { plate: 'DEF2E45', model: 'Ford Ranger' },
  { plate: 'GHI3F67', model: 'VW Saveiro' },
  { plate: 'JKL4G89', model: 'Toyota Hilux' },
  { plate: 'MNO5H01', model: 'Chevrolet S10' },
];

const BASE_PRICES: Record<FuelType, number> = {
  Gasolina: 5.89,
  Etanol: 3.95,
  Diesel: 6.12,
};

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function rand(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

function generateRecords(count: number): FuelRecord[] {
  return Array.from({ length: count }, (_, i) => {
    const state = pick(ALL_STATES);
    const city = pick(STATES_CITIES[state]);
    const fuelType = pick(FUEL_TYPES);
    const driver = pick(DRIVERS);
    const vehicle = pick(VEHICLES);

    const pricePerLiter = Number((BASE_PRICES[fuelType] * rand(0.9, 1.1)).toFixed(2));
    const liters = Number(rand(25, 90).toFixed(2));
    const totalPaid = Number((pricePerLiter * liters).toFixed(2));

    const d = new Date();
    d.setDate(d.getDate() - Math.floor(rand(0, 180)));

    return {
      id: i + 1,
      date: d.toISOString().split('T')[0],
      station: pick(STATIONS),
      city,
      state,
      fuelType,
      pricePerLiter,
      liters,
      totalPaid,
      driverName: driver.name,
      driverCpf: driver.cpf,
      vehiclePlate: vehicle.plate,
      vehicleModel: vehicle.model,
    };
  }).sort((a, b) => b.date.localeCompare(a.date));
}

@Injectable({ providedIn: 'root' })
export class FuelDataService {
  private readonly records: FuelRecord[] = generateRecords(150);
  private cachedRequest$: Observable<FuelRecord[]> | null = null;

  getAll(): Observable<FuelRecord[]> {
    if (!this.cachedRequest$) {
      this.cachedRequest$ = of(this.records).pipe(
        delay(600), // Simula latência de rede apenas na primeira chamada
        shareReplay(1),
      );
    }

    return this.cachedRequest$;
  }
}
