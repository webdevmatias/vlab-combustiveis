import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GovHeaderComponent } from './shared/components/gov-header.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, GovHeaderComponent],
  template: `
    <app-gov-header />

    <router-outlet />

    <footer
      class="bg-[#071D41] text-white/60 text-xs text-center py-3 mt-auto border-t border-[#0a295c]"
    >
      © {{ year }} Governo Federal · Ministério dos Transportes · Painel de Combustíveis
    </footer>
  `,
  styles: [':host { display: flex; flex-direction: column; min-height: 100vh; }'],
})
export class AppComponent {
  readonly year = new Date().getFullYear();
}
