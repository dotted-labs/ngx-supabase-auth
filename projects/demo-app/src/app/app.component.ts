import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet],
  template: `
    <main class="container mx-auto   w-96">
      <router-outlet />
    </main>
  `,
})
export class AppComponent {
  title = 'Supabase Auth Demo App';
}
