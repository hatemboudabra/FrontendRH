import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [],
  template: `
  `,
  styles: ``
})
export class FooterComponent {
  year: number = new Date().getFullYear();
}
