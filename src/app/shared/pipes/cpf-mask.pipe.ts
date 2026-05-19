import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'cpfMask', standalone: true })
export class CpfMaskPipe implements PipeTransform {
  transform(cpf: string): string {
    if (!cpf || cpf.length !== 11) return cpf;
    return `${cpf.slice(0, 3)}.***.***.${cpf.slice(9)}`;
  }
}
