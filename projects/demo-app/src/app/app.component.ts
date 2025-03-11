import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  template: `
    <main class="app-container">
      <router-outlet></router-outlet>
    </main>
  `,
  styles: [
    `
      .app-container {
        min-height: 100vh;
        background-color: #f5f5f5;
        padding: 2rem 0;
      }
    `,
  ],
})
export class AppComponent {
  title = 'Supabase Auth Demo App';
}
