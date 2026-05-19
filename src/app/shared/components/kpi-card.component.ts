import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-kpi-card',
  standalone: true,
  template: `
    <div
      class="bg-white rounded-lg border border-gray-200 p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow border-l-4 border-l-[#1351B4]"
    >
      <span class="text-4xl" aria-hidden="true">{{ icon }}</span>
      <div>
        <p class="text-xs text-gray-500 uppercase tracking-wide font-semibold">{{ label }}</p>
        <p class="text-2xl font-bold text-[#1351B4] mt-1">{{ value }}</p>
      </div>
    </div>
  `,
})
export class KpiCardComponent {
  @Input() icon = '';
  @Input() label = '';
  @Input() value = '';
}
