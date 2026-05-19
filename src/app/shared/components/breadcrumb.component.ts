import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';

export interface BreadcrumbItem {
  label: string;
  link?: string; // sem link = item atual (não clicável)
}

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [RouterLink, NgFor, NgIf],
  template: `
    <nav
      class="bg-gray-50 border-b border-gray-200 py-2 px-4"
      aria-label="Localização na aplicação"
    >
      <ol class="max-w-6xl mx-auto flex items-center gap-1 text-xs text-gray-600 flex-wrap">
        <li *ngFor="let item of items; let last = last" class="flex items-center gap-1">
          <a
            *ngIf="!last && item.link"
            [routerLink]="item.link"
            class="text-[#1351B4] hover:underline focus:outline-none focus:ring-2 focus:ring-[#1351B4] rounded"
            >{{ item.label }}</a
          >
          <span *ngIf="last" class="font-semibold text-gray-700" aria-current="page">{{
            item.label
          }}</span>
          <span *ngIf="!last" class="text-gray-400" aria-hidden="true">›</span>
        </li>
      </ol>
    </nav>
  `,
})
export class BreadcrumbComponent {
  @Input() items: BreadcrumbItem[] = [];
}
