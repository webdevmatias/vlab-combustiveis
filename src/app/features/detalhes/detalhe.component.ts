import { Component, inject, OnInit, signal, effect } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DatePipe, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConsultaFacade } from '../../core/facades/consulta.facade';
import { FuelRecord } from '../../shared/interfaces/fuel.interfaces';
import { CpfMaskPipe } from '../../shared/pipes/cpf-mask.pipe';
import { BreadcrumbComponent } from '../../shared/components/breadcrumb.component';

@Component({
  selector: 'app-detalhe',
  standalone: true,
  imports: [DatePipe, CurrencyPipe, RouterLink, CpfMaskPipe, BreadcrumbComponent, FormsModule],
  template: `
    <app-breadcrumb
      [items]="[
        { label: 'Home', link: '/' },
        { label: 'Consulta', link: '/consulta' },
        { label: 'Detalhe #' + recordId },
      ]"
    />

    <main id="main-content" class="bg-[#f8f8f8] min-h-screen">
      <div class="max-w-200 mx-auto px-6 py-6">
        @if (facade.loading()) {
          <section
            class="bg-white border border-gray-200 rounded-md p-12 flex flex-col items-center mt-4"
          >
            <div
              class="w-10 h-10 border-4 border-gray-200 border-t-[#1351B4] rounded-full animate-spin"
            ></div>
            <p class="text-sm text-gray-500 mt-4">Buscando registro...</p>
          </section>
        }

        @if (!facade.loading() && !record) {
          <div class="bg-white border border-gray-200 rounded-md p-12 text-center mt-4 shadow-sm">
            <i class="fas fa-search text-5xl text-gray-300 mb-4 block"></i>
            <h1 class="text-xl font-semibold text-[#071D41] mb-2">Registro não encontrado</h1>
            <p class="text-gray-500 mb-6">
              O abastecimento #{{ recordId }} não existe ou foi removido.
            </p>
            <a
              routerLink="/consulta"
              class="inline-flex items-center gap-2 px-4 py-2 bg-[#1351B4] hover:bg-[#0a357b] text-white rounded-md text-sm font-medium transition-colors"
            >
              <i class="fas fa-arrow-left"></i> Voltar para Consulta
            </a>
          </div>
        }

        @if (!facade.loading() && record) {
          <div class="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
            <div>
              <h1 class="text-[28px] font-light text-[#071D41] leading-tight">
                Abastecimento #{{ record.id }}
              </h1>
              <p class="text-sm text-gray-600 mt-1 flex items-center gap-2">
                <i class="far fa-calendar-alt text-gray-400"></i>
                {{ record.date | date: 'dd/MM/yyyy' }}
                <span class="text-gray-300">|</span>
                <i class="fas fa-map-marker-alt text-gray-400"></i> {{ record.station }}
              </p>
            </div>

            <div class="flex items-center gap-3">
              <button
                type="button"
                (click)="showModal.set(true)"
                class="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-1"
                aria-label="Reportar erro neste registro"
              >
                <i class="fas fa-exclamation-triangle"></i> Reportar Erro
              </button>

              <a
                routerLink="/consulta"
                class="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 rounded-md text-sm font-medium transition-colors"
              >
                <i class="fas fa-arrow-left"></i> Voltar
              </a>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <section class="bg-white rounded-md border border-gray-200 p-6 shadow-sm">
              <header class="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
                <i class="fas fa-gas-pump text-[#1351B4]"></i>
                <h2 class="text-sm font-semibold text-[#071D41] uppercase tracking-wide">
                  Detalhes do Consumo
                </h2>
              </header>

              <dl class="space-y-4 text-sm">
                <div class="flex justify-between items-center">
                  <dt class="text-gray-500 font-medium">Combustível</dt>
                  <dd class="font-semibold text-gray-800">{{ record.fuelType }}</dd>
                </div>
                <div class="flex justify-between items-center">
                  <dt class="text-gray-500 font-medium">Preço/Litro</dt>
                  <dd class="font-medium text-gray-800">
                    {{ record.pricePerLiter | currency: 'BRL' : 'symbol' : '1.2-2' }}
                  </dd>
                </div>
                <div class="flex justify-between items-center">
                  <dt class="text-gray-500 font-medium">Volume Abastecido</dt>
                  <dd class="font-medium text-gray-800">{{ record.liters }} L</dd>
                </div>
                <div class="flex justify-between items-center pt-2 border-t border-gray-50">
                  <dt class="text-gray-500 font-medium">Total Pago</dt>
                  <dd class="text-lg font-bold text-[#1351B4]">
                    {{ record.totalPaid | currency: 'BRL' : 'symbol' : '1.2-2' }}
                  </dd>
                </div>
                <div class="flex justify-between items-center">
                  <dt class="text-gray-500 font-medium">Localidade</dt>
                  <dd class="font-medium text-gray-800">{{ record.city }} / {{ record.state }}</dd>
                </div>
              </dl>
            </section>

            <div class="space-y-6">
              <section class="bg-white rounded-md border border-gray-200 p-6 shadow-sm">
                <header class="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
                  <i class="fas fa-user-circle text-[#1351B4]"></i>
                  <h2 class="text-sm font-semibold text-[#071D41] uppercase tracking-wide">
                    Motorista
                  </h2>
                </header>

                <dl class="space-y-4 text-sm">
                  <div class="flex justify-between items-center">
                    <dt class="text-gray-500 font-medium">Nome</dt>
                    <dd class="font-medium text-gray-800">{{ record.driverName }}</dd>
                  </div>
                  <div class="flex justify-between items-center">
                    <dt class="text-gray-500 font-medium">CPF</dt>
                    <dd
                      class="font-mono text-gray-700 tracking-wider bg-gray-50 px-2 py-1 rounded border border-gray-100"
                    >
                      {{ record.driverCpf | cpfMask }}
                    </dd>
                  </div>
                </dl>
              </section>

              <section class="bg-white rounded-md border border-gray-200 p-6 shadow-sm">
                <header class="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
                  <i class="fas fa-car text-[#1351B4]"></i>
                  <h2 class="text-sm font-semibold text-[#071D41] uppercase tracking-wide">
                    Veículo
                  </h2>
                </header>

                <dl class="space-y-4 text-sm">
                  <div class="flex justify-between items-center">
                    <dt class="text-gray-500 font-medium">Placa</dt>
                    <dd
                      class="font-mono text-gray-700 tracking-wider bg-gray-50 px-2 py-1 rounded border border-gray-100 uppercase"
                    >
                      {{ record.vehiclePlate }}
                    </dd>
                  </div>
                  <div class="flex justify-between items-center">
                    <dt class="text-gray-500 font-medium">Modelo</dt>
                    <dd class="font-medium text-gray-800">{{ record.vehicleModel }}</dd>
                  </div>
                </dl>
              </section>
            </div>
          </div>
        }

        <!-- Modal -->
        @if (showModal()) {
          <div
            class="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity"
            role="dialog"
            aria-modal="true"
            (click)="showModal.set(false)"
          >
            <div
              class="bg-white rounded-lg p-6 max-w-md w-full shadow-2xl transform transition-all"
              (click)="$event.stopPropagation()"
            >
              <header class="flex items-center gap-3 mb-2">
                <div
                  class="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center shrink-0"
                >
                  <i class="fas fa-exclamation-triangle text-amber-500"></i>
                </div>
                <h2 class="text-lg font-semibold text-[#071D41]">Reportar Divergência</h2>
              </header>

              <p class="text-sm text-gray-500 mb-5 ml-13">
                Descreva detalhadamente o problema encontrado no registro de abastecimento.
              </p>

              <div class="mb-5">
                <label for="report-text" class="block text-sm font-medium text-gray-700 mb-1">
                  Descrição do problema
                </label>
                <textarea
                  id="report-text"
                  rows="4"
                  placeholder="Ex: O valor total não confere com o volume..."
                  [(ngModel)]="reportText"
                  class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 bg-white focus:outline-none focus:ring-1 focus:ring-[#1351B4] focus:border-[#1351B4] resize-none"
                ></textarea>
              </div>

              <footer class="flex gap-3 justify-end mt-6">
                <button
                  type="button"
                  (click)="showModal.set(false)"
                  class="px-4 py-2 border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 rounded-md text-sm font-medium transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  (click)="submitReport()"
                  class="px-4 py-2 bg-[#1351B4] hover:bg-[#0a357b] text-white rounded-md text-sm font-medium transition-colors"
                >
                  Enviar Relatório
                </button>
              </footer>
            </div>
          </div>
        }
      </div>
    </main>
  `,
})
export class DetalheComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  readonly facade = inject(ConsultaFacade);

  record: FuelRecord | undefined;
  recordId = 0;

  readonly showModal = signal(false);
  reportText = '';

  constructor() {
    effect(() => {
      // Reage automaticamente quando os dados terminam de carregar
      if (!this.facade.loading()) {
        this.record = this.facade.getById(this.recordId);
      }
    });
  }

  ngOnInit(): void {
    this.recordId = Number(this.route.snapshot.paramMap.get('id'));
    this.facade.loadAll();
  }

  submitReport(): void {
    console.log(`[Reportar Erro] Registro #${this.recordId}:`, this.reportText);
    alert(
      `✅ Relatório enviado com sucesso!\n\nRegistro: #${this.recordId}\nMensagem: ${this.reportText}`,
    );

    this.reportText = ''; // Limpa o textarea após o envio
    this.showModal.set(false);
  }
}
