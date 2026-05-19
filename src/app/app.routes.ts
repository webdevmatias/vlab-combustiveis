import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  // Dashboard
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./features/dashboard/dashboard.component').then((m) => m.DashboardComponent),
    title: 'Dashboard — Painel de Combustíveis',
  },
  // Listagem de abastecimentos
  {
    path: 'consulta',
    loadComponent: () =>
      import('./features/abastecimentos/abastecimentos.component').then(
        (m) => m.AbastecimentosComponent,
      ),
    title: 'Consulta — Painel de Combustíveis',
  },
  // Detalhe de um registro (bônus)
  {
    path: 'consulta/:id',
    loadComponent: () =>
      import('./features/detalhes/detalhe.component').then((m) => m.DetalheComponent),
    title: 'Detalhe — Painel de Combustíveis',
  },
];
