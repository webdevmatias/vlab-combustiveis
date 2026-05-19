import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-gov-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],

  template: `
    <!-- Skip link acessível -->
    <a
      href="#main-content"
      class="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:bg-white focus:px-4 focus:py-2 focus:rounded focus:shadow"
    >
      Ir para o conteúdo principal
    </a>

    <header id="main-header" role="banner" class="bg-white border-b border-gray-200">
      <!-- ==================================================
           LINHA 1 — Barra gov.br
           ================================================== -->
      <div class="py-6">
        <div class="max-w-300 mx-auto min-h-14 px-6 flex items-center gap-4 flex-wrap">
          <!-- Logo gov.br -->
          <!-- Logo gov.br -->
          <a
            href="https://www.gov.br"
            target="_blank"
            rel="noopener"
            aria-label="Portal gov.br"
            class="flex items-center no-underline shrink-0"
          >
            <img src="/image.png" alt="gov.br" class="h-8 w-auto object-contain" />
          </a>

          <!-- Divisor -->
          <div class="w-[0.6px] h-10 bg-gray-300 shrink-0"></div>

          <!-- Assinatura -->
          <span class="text-[15px] text-black leading-tight shrink-0">
            Presidência da<br />
            República
          </span>

          <!-- Espaço -->
          <div class="flex-1"></div>

          <!-- Navegação -->
          <nav aria-label="Links do governo" class="hidden md:flex items-center gap-6">
            <a
              routerLink="/dashboard"
              class="text-sm text-[#1351B4] hover:underline transition-colors"
            >
              Dashboard
            </a>

            <a
              routerLink="/consulta"
              class="text-sm text-[#1351B4] hover:underline transition-colors"
            >
              Consulta
            </a>

            <a href="#" class="text-sm text-[#1351B4] hover:underline transition-colors">
              Acessibilidade
            </a>
          </nav>

          <!-- Divisor -->
          <div class="hidden md:block w-px h-7 bg-gray-300"></div>

          <!-- Ações -->
          <div class="hidden md:flex items-center gap-5">
            <!-- Idioma -->
            <div class="flex items-center gap-1">
              <span class="text-[14px] font-bold! text-[#1351B4] leading-none">
                <span class="sr-only">Idioma atual:</span>
                PT
              </span>

              <button
                type="button"
                aria-label="Alterar idioma"
                aria-expanded="false"
                aria-controls="langues-menu"
                class="w-6 h-6 flex items-center justify-center rounded-full text-[#1351B4] hover:bg-gray-100 transition-colors"
              >
                <i class="fas fa-angle-down text-[11px]" aria-hidden="true"></i>
              </button>
            </div>

            <!-- Cookies -->
            <button
              type="button"
              aria-label="Cookies"
              class="text-[#1351B4] hover:opacity-70 transition-opacity"
            >
              <i class="fas fa-cookie-bite text-[18px]" aria-hidden="true"></i>
            </button>

            <!-- Apps -->
            <button
              type="button"
              aria-label="Aplicativos"
              class="text-[#1351B4] hover:opacity-70 transition-opacity"
            >
              <i class="fas fa-th text-[17px]" aria-hidden="true"></i>
            </button>

            <!-- Contraste -->
            <button
              type="button"
              (click)="toggleContrast()"
              aria-label="Ativar alto contraste"
              class="text-[#1351B4] hover:opacity-70 transition-opacity"
            >
              <i class="fas fa-adjust text-[18px]" aria-hidden="true"></i>
            </button>
          </div>

          <!-- Entrar -->
          <button
            type="button"
            aria-label="Entrar com gov.br"
            class="flex items-center gap-2 bg-[#1351B4] text-white text-[15px] rounded-full px-5 py-2.5 text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            <i class="fas fa-user text-[15px]" aria-hidden="true"></i>

            Entrar com gov.br
          </button>
        </div>
      </div>

      <!-- ==================================================
           LINHA 2 — Ministério + pesquisa
           ================================================== -->
      <div>
        <div class="max-w-300 mx-auto px-6 flex items-center gap-4 flex-wrap pb-4">
          <!-- Menu -->
          <div class="flex items-center gap-3 shrink-0">
            <button
              type="button"
              aria-label="Abrir menu"
              class="text-[#1351B4]"
              (click)="mobileMenuOpen.set(!mobileMenuOpen())"
            >
              <i class="fas fa-bars text-[28px]" aria-hidden="true"></i>
            </button>

            <div>
              <div class="text-2xl font-light text-[#071D41] leading-tight">
                Ministério dos Transportes
              </div>
            </div>
          </div>

          <!-- Espaço -->
          <div class="flex-1"></div>

          <!-- Pesquisa -->
          <div
            class="hidden sm:flex items-center w-95 h-14 px-4 rounded overflow-hidden shrink-0 bg-[#ededed]"
          >
            <input
              type="search"
              placeholder="O que você procura?"
              aria-label="Pesquisar"
              class="flex-1 h-full px-4 text-sm italic outline-none bg-transparent text-[#333333] placeholder:text-[#333333]"
            />

            <!-- Microfone -->
            <button
              type="button"
              aria-label="Pesquisar por voz"
              class="w-11 h-full flex items-center justify-center text-[#1351B4]"
            >
              <i class="fas fa-microphone text-[18px]" aria-hidden="true"></i>
            </button>

            <!-- Lupa -->
            <button
              type="button"
              aria-label="Pesquisar"
              class="w-11 h-full flex items-center justify-center text-[#1351B4]"
            >
              <i class="fas fa-search text-[18px]" aria-hidden="true"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- ==================================================
           Menu mobile
           ================================================== -->
      @if (mobileMenuOpen()) {
        <nav
          aria-label="Menu principal"
          class="md:hidden border-t border-gray-200 bg-gray-50 px-6 py-2 flex flex-col"
        >
          <a
            routerLink="/dashboard"
            routerLinkActive="font-semibold bg-blue-50"
            (click)="mobileMenuOpen.set(false)"
            class="px-3 py-2 rounded text-sm text-[#1351B4] hover:bg-blue-50"
          >
            Dashboard
          </a>

          <a
            routerLink="/consulta"
            routerLinkActive="font-semibold bg-blue-50"
            (click)="mobileMenuOpen.set(false)"
            class="px-3 py-2 rounded text-sm text-[#1351B4] hover:bg-blue-50"
          >
            Consulta
          </a>
        </nav>
      }
    </header>
  `,
})
export class GovHeaderComponent {
  readonly mobileMenuOpen = signal(false);

  toggleContrast(): void {
    document.documentElement.classList.toggle('high-contrast');
  }
}
