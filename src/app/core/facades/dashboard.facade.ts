import { Injectable, inject, signal, computed } from '@angular/core';
import { FuelDataService } from '../services/fuel-data.service';
import {
  FuelRecord,
  DashboardKpis,
  ConsumptionByState,
} from '../../shared/interfaces/fuel.interfaces';

@Injectable({ providedIn: 'root' })
export class DashboardFacade {
  private readonly dataService = inject(FuelDataService);

  // ---- Estado (signals) ----
  readonly loading = signal(false);
  private readonly loaded = signal(false);
  private readonly allRecords = signal<FuelRecord[]>([]);

  // ---- Dados derivados (computed) ----
  readonly kpis = computed<DashboardKpis>(() => {
    const records = this.allRecords();
    if (!records.length) return { avgGasolinePrice: 0, avgDieselPrice: 0, totalLiters: 0 };

    const avg = (type: string) => {
      const subset = records.filter((r) => r.fuelType === type);
      return subset.length ? subset.reduce((s, r) => s + r.pricePerLiter, 0) / subset.length : 0;
    };

    return {
      avgGasolinePrice: avg('Gasolina'),
      avgDieselPrice: avg('Diesel'),
      totalLiters: records.reduce((s, r) => s + r.liters, 0),
    };
  });

  readonly consumptionByState = computed<ConsumptionByState[]>(() => {
    const map: Record<string, number> = {};
    for (const r of this.allRecords()) {
      map[r.state] = (map[r.state] ?? 0) + r.liters;
    }
    return Object.entries(map)
      .map(([state, liters]) => ({ state, liters: Math.round(liters) }))
      .sort((a, b) => b.liters - a.liters);
  });

  readonly priceEvolution = computed(() => {
    const records = this.allRecords();
    if (!records.length) return [];

    const periodMap = new Map<
      string,
      { gasSum: number; gasCount: number; dieselSum: number; dieselCount: number }
    >();

    for (const r of records) {
      const date = new Date(r.date);
      const sortKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

      if (!periodMap.has(sortKey)) {
        periodMap.set(sortKey, { gasSum: 0, gasCount: 0, dieselSum: 0, dieselCount: 0 });
      }

      const stats = periodMap.get(sortKey)!;

      if (r.fuelType === 'Gasolina') {
        stats.gasSum += r.pricePerLiter;
        stats.gasCount++;
      } else if (r.fuelType === 'Diesel') {
        stats.dieselSum += r.pricePerLiter;
        stats.dieselCount++;
      }
    }

    return Array.from(periodMap.entries())
      .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
      .map(([key, stats]) => {
        const [year, month] = key.split('-');
        return {
          period: `${month}/${year}`,
          gasolinePrice: stats.gasCount ? stats.gasSum / stats.gasCount : 0,
          dieselPrice: stats.dieselCount ? stats.dieselSum / stats.dieselCount : 0,
        };
      });
  });

  // ---- Ações ----
  loadAll(): void {
    if (this.loaded()) return;

    this.loading.set(true);
    this.dataService.getAll().subscribe({
      next: (records) => {
        this.allRecords.set(records);
        this.loaded.set(true);
        this.loading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.loading.set(false);
      },
    });
  }
}
