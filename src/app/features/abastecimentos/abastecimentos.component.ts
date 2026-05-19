import { Component, inject, OnInit } from '@angular/core';
import { NgFor, NgIf, DatePipe, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ConsultaFacade } from '../../core/facades/consulta.facade';
import { BreadcrumbComponent } from '../../shared/components/breadcrumb.component';
import { FuelFilters } from '../../shared/interfaces/fuel.interfaces';

@Component({
  selector: 'app-abastecimentos',
  standalone: true,
  imports: [NgFor, NgIf, DatePipe, CurrencyPipe, FormsModule, RouterLink, BreadcrumbComponent],
  template: `
    <app-breadcrumb
      [items]="[
        { label: 'Home', link: '/' },
        { label: 'Combustíveis', link: '/dashboard' },
        { label: 'Consulta' },
      ]"
    />

    <main id="main-content" class="bg-[#f8f8f8] min-h-screen">
      <div class="max-w-300 mx-auto px-6 py-6">
        <header class="mb-8 flex items-end justify-between">
          <div>
            <h1 class="text-[32px] font-light text-[#071D41] leading-tight">
              Consulta de Abastecimentos
            </h1>
            <p class="text-sm text-gray-600 mt-2">
              Gerenciamento de registros da frota ({{ facade.filteredRecords().length }}
              encontrados)
            </p>
          </div>
        </header>

        <section class="bg-white border border-gray-200 rounded-md p-6 mb-6">
          <header class="mb-4 flex items-center gap-2">
            <i class="fas fa-filter text-gray-400"></i>
            <h2 class="text-sm font-semibold text-[#071D41]">Filtros de busca</h2>
          </header>

          <div class="flex flex-wrap items-end gap-4">
            <div class="w-full sm:w-48">
              <label for="filter-state" class="block text-xs text-gray-500 mb-1">Estado (UF)</label>
              <select
                id="filter-state"
                [(ngModel)]="localFilters.state"
                (change)="applyFilters()"
                class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 bg-white focus:outline-none focus:ring-1 focus:ring-[#1351B4] focus:border-[#1351B4]"
              >
                <option value="">Todos os estados</option>
                <option *ngFor="let uf of facade.availableStates()" [value]="uf">{{ uf }}</option>
              </select>
            </div>

            <div class="w-full sm:w-48">
              <label for="filter-fuel" class="block text-xs text-gray-500 mb-1">Combustível</label>
              <select
                id="filter-fuel"
                [(ngModel)]="localFilters.fuelType"
                (change)="applyFilters()"
                class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 bg-white focus:outline-none focus:ring-1 focus:ring-[#1351B4] focus:border-[#1351B4]"
              >
                <option value="">Todos os tipos</option>
                <option value="Gasolina">Gasolina</option>
                <option value="Etanol">Etanol</option>
                <option value="Diesel">Diesel</option>
              </select>
            </div>

            <button
              type="button"
              (click)="clearFilters()"
              class="px-4 py-2 border border-gray-300 text-gray-600 bg-white hover:bg-gray-50 rounded-md text-sm font-medium transition-colors flex items-center gap-2"
            >
              <i class="fas fa-eraser"></i> Limpar
            </button>
          </div>
        </section>

        @if (facade.loading()) {
          <section
            class="bg-white border border-gray-200 rounded-md p-12 flex flex-col items-center"
          >
            <div
              class="w-10 h-10 border-4 border-gray-200 border-t-[#1351B4] rounded-full animate-spin"
            ></div>
            <p class="text-sm text-gray-500 mt-4">Carregando informações...</p>
          </section>
        }

        @if (!facade.loading()) {
          <div class="bg-white border border-gray-200 rounded-md shadow-sm overflow-hidden mb-6">
            <div class="overflow-x-auto">
              <table class="w-full text-sm text-left whitespace-nowrap">
                <thead
                  class="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider"
                >
                  <tr>
                    <th scope="col" class="px-6 py-4">Data</th>
                    <th scope="col" class="px-6 py-4">Posto</th>
                    <th scope="col" class="px-6 py-4">Local</th>
                    <th scope="col" class="px-6 py-4">Combustível</th>
                    <th scope="col" class="px-6 py-4 text-right">Valor/L</th>
                    <th scope="col" class="px-6 py-4 text-right">Total Pago</th>
                    <th scope="col" class="px-6 py-4 text-center">Ações</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-100">
                  <tr *ngIf="facade.pagedRecords().length === 0">
                    <td colspan="7" class="px-6 py-12 text-center text-gray-400">
                      <i class="fas fa-search text-2xl mb-2 block"></i>
                      Nenhum registro encontrado com os filtros selecionados.
                    </td>
                  </tr>

                  <tr
                    *ngFor="let r of facade.pagedRecords()"
                    class="hover:bg-gray-50 transition-colors"
                  >
                    <td class="px-6 py-4 text-gray-600">{{ r.date | date: 'dd/MM/yyyy' }}</td>
                    <td class="px-6 py-4 text-[#071D41] font-medium">{{ r.station }}</td>
                    <td class="px-6 py-4 text-gray-600">{{ r.city }} / {{ r.state }}</td>
                    <td class="px-6 py-4">
                      <span
                        class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border"
                        [class.bg-amber-50]="r.fuelType === 'Gasolina'"
                        [class.text-amber-700]="r.fuelType === 'Gasolina'"
                        [class.border-amber-200]="r.fuelType === 'Gasolina'"
                        [class.bg-emerald-50]="r.fuelType === 'Etanol'"
                        [class.text-emerald-700]="r.fuelType === 'Etanol'"
                        [class.border-emerald-200]="r.fuelType === 'Etanol'"
                        [class.bg-blue-50]="r.fuelType === 'Diesel'"
                        [class.text-blue-700]="r.fuelType === 'Diesel'"
                        [class.border-blue-200]="r.fuelType === 'Diesel'"
                      >
                        <i class="fas fa-gas-pump text-[10px]"></i>
                        {{ r.fuelType }}
                      </span>
                    </td>
                    <td class="px-6 py-4 text-right text-gray-600">
                      {{ r.pricePerLiter | currency: 'BRL' : 'symbol' : '1.2-2' }}
                    </td>
                    <td class="px-6 py-4 text-right font-medium text-[#071D41]">
                      {{ r.totalPaid | currency: 'BRL' : 'symbol' : '1.2-2' }}
                    </td>
                    <td class="px-6 py-4 text-center">
                      <a
                        [routerLink]="['/consulta', r.id]"
                        class="text-[#1351B4] hover:text-[#0a357b] transition-colors inline-flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[#1351B4] rounded-sm p-1"
                        [attr.aria-label]="'Ver detalhe do abastecimento no posto ' + r.station"
                      >
                        <i class="fas fa-eye text-sm"></i>
                        <span class="text-sm font-medium">Ver</span>
                      </a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <nav
            *ngIf="facade.totalPages() > 1"
            class="flex items-center justify-between bg-white border border-gray-200 rounded-md px-6 py-3 shadow-sm"
          >
            <button
              type="button"
              [disabled]="facade.currentPage() === 1"
              (click)="facade.goToPage(facade.currentPage() - 1)"
              class="px-3 py-1.5 border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed rounded-md text-sm font-medium transition-colors flex items-center gap-2"
            >
              <i class="fas fa-chevron-left text-xs"></i> Anterior
            </button>

            <span class="text-sm text-gray-500">
              Página <span class="font-semibold text-gray-700">{{ facade.currentPage() }}</span> de
              <span class="font-semibold text-gray-700">{{ facade.totalPages() }}</span>
            </span>

            <button
              type="button"
              [disabled]="facade.currentPage() === facade.totalPages()"
              (click)="facade.goToPage(facade.currentPage() + 1)"
              class="px-3 py-1.5 border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed rounded-md text-sm font-medium transition-colors flex items-center gap-2"
            >
              Próxima <i class="fas fa-chevron-right text-xs"></i>
            </button>
          </nav>
        }
      </div>
    </main>
  `,
})
export class AbastecimentosComponent implements OnInit {
  readonly facade = inject(ConsultaFacade);

  localFilters: FuelFilters = { state: '', fuelType: '' };

  ngOnInit(): void {
    this.facade.loadAll();
    this.localFilters = { ...this.facade.filters() };
  }

  applyFilters(): void {
    this.facade.applyFilters({ ...this.localFilters });
  }

  clearFilters(): void {
    this.localFilters = { state: '', fuelType: '' };
    this.facade.applyFilters({ ...this.localFilters });
  }
}
