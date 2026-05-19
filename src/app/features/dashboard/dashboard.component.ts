import { Component, inject, OnInit, ViewChild, ElementRef, effect } from '@angular/core';
import { DecimalPipe, NgIf } from '@angular/common';
import { DashboardFacade } from '../../core/facades/dashboard.facade';
import { KpiCardComponent } from '../../shared/components/kpi-card.component';
import { BreadcrumbComponent } from '../../shared/components/breadcrumb.component';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [DecimalPipe, NgIf, KpiCardComponent, BreadcrumbComponent],
  template: `
    <app-breadcrumb
      [items]="[
        { label: 'Home', link: '/' },
        { label: 'Combustíveis', link: '/dashboard' },
        { label: 'Dashboard' },
      ]"
    />

    <main id="main-content" class="bg-[#f8f8f8] min-h-screen">
      <div class="max-w-300 mx-auto px-6 py-6">
        <header class="mb-8">
          <h1 class="text-[32px] font-light text-[#071D41] leading-tight">Painel Gerencial</h1>
          <p class="text-sm text-gray-600 mt-2">Monitoramento de abastecimento da frota nacional</p>
        </header>

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
          <section class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <article class="bg-white border border-gray-200 rounded-md p-5">
              <div class="flex items-start justify-between">
                <div>
                  <span class="text-sm text-gray-500"> Preço médio da gasolina </span>
                  <div class="text-[28px] font-light text-[#071D41] mt-2">
                    R$ {{ facade.kpis().avgGasolinePrice | number: '1.2-2' }}
                  </div>
                </div>
                <i class="fas fa-gas-pump text-[#1351B4] text-xl" aria-hidden="true"></i>
              </div>
            </article>

            <article class="bg-white border border-gray-200 rounded-md p-5">
              <div class="flex items-start justify-between">
                <div>
                  <span class="text-sm text-gray-500"> Preço médio do diesel </span>
                  <div class="text-[28px] font-light text-[#071D41] mt-2">
                    R$ {{ facade.kpis().avgDieselPrice | number: '1.2-2' }}
                  </div>
                </div>
                <i class="fas fa-truck text-[#1351B4] text-xl" aria-hidden="true"></i>
              </div>
            </article>

            <article class="bg-white border border-gray-200 rounded-md p-5">
              <div class="flex items-start justify-between">
                <div>
                  <span class="text-sm text-gray-500"> Volume abastecido </span>
                  <div class="text-[28px] font-light text-[#071D41] mt-2">
                    {{ facade.kpis().totalLiters | number: '1.0-0' }} L
                  </div>
                </div>
                <i class="fas fa-chart-bar text-[#1351B4] text-xl" aria-hidden="true"></i>
              </div>
            </article>
          </section>

          <section class="bg-white border border-gray-200 rounded-md p-6">
            <header class="mb-6">
              <h2 class="text-xl font-light text-[#071D41]">Consumo por Unidade Federativa</h2>
              <p class="text-sm text-gray-500 mt-1">Volume total abastecido por estado (Top 8)</p>
            </header>
            <div class="relative h-75 w-full">
              <canvas #barChart></canvas>
            </div>
          </section>
        }
      </div>
    </main>
  `,
})
export class DashboardComponent implements OnInit {
  readonly facade = inject(DashboardFacade);

  @ViewChild('barChart') barChartRef!: ElementRef<HTMLCanvasElement>;

  barChartInstance: Chart | null = null;

  constructor() {
    effect(() => {
      const stateData = this.facade.consumptionByState();
      const isLoading = this.facade.loading();

      if (!isLoading) {
        setTimeout(() => {
          if (stateData.length > 0) this.renderBarChart(stateData);
        }, 0);
      }
    });
  }

  ngOnInit(): void {
    if (!this.facade.loading() && this.facade.kpis().totalLiters === 0) {
      this.facade.loadAll();
    }
  }

  renderBarChart(data: any[]): void {
    if (!this.barChartRef) return;

    const top8 = data.slice(0, 8);
    const labels = top8.map((item) => item.state);
    const chartData = top8.map((item) => item.liters);

    if (this.barChartInstance) {
      this.barChartInstance.destroy();
    }

    this.barChartInstance = new Chart(this.barChartRef.nativeElement, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Volume (Litros)',
            data: chartData,
            backgroundColor: '#1351B4',
            borderRadius: 4,
            barPercentage: 0.6,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: { beginAtZero: true, grid: { color: '#f3f4f6' } },
          x: { grid: { display: false } },
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (context) => {
                const value = context.parsed.y || 0;
                return `${value.toLocaleString('pt-BR')} L`;
              },
            },
          },
        },
      },
    });
  }
}
