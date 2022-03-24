import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'handlePlural',
})
export class HandlePlural implements PipeTransform {
  public transform(number: number, name: string): string {
    if (number <= 1) {
      name = name.slice(0, -1);
    }
    return `${number.toString()} ${name}`;
  }
}
