import { Injectable, inject, signal, computed } from '@angular/core';
import { FuelDataService } from '../services/fuel-data.service';
import { FuelRecord, FuelFilters } from '../../shared/interfaces/fuel.interfaces';

@Injectable({ providedIn: 'root' })
export class ConsultaFacade {
  private readonly dataService = inject(FuelDataService);

  // ---- Estado (signals) ----
  readonly loading = signal(false);
  private readonly loaded = signal(false);
  private readonly allRecords = signal<FuelRecord[]>([]);

  readonly filters = signal<FuelFilters>({ state: '', fuelType: '' });
  readonly currentPage = signal(1);
  readonly pageSize = 10;

  // ---- Dados derivados (computed) ----
  readonly filteredRecords = computed(() => {
    const f = this.filters();
    return this.allRecords().filter((r) => {
      const okState = !f.state || r.state === f.state;
      const okFuel = !f.fuelType || r.fuelType === f.fuelType;
      return okState && okFuel;
    });
  });

  readonly totalPages = computed(() => Math.ceil(this.filteredRecords().length / this.pageSize));

  readonly pagedRecords = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize;
    return this.filteredRecords().slice(start, start + this.pageSize);
  });

  readonly availableStates = computed(() =>
    [...new Set(this.allRecords().map((r) => r.state))].sort(),
  );

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

  applyFilters(filters: FuelFilters): void {
    this.filters.set(filters);
    this.currentPage.set(1);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
    }
  }

  getById(id: number): FuelRecord | undefined {
    return this.allRecords().find((r) => r.id === id);
  }
}
