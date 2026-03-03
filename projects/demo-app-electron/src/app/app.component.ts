import { Component, OnInit, inject } from '@angular/core';

import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: ` <router-outlet /> `,
  styles: [],
})
export class AppComponent implements OnInit {
  title = 'Ngx Supabase Auth - Electron Demo';

  ngOnInit() {
    // Verificar si estamos en un entorno de Electron
    if (typeof window !== 'undefined' && window.electron) {
      console.log('Aplicación ejecutándose en Electron');
      console.log('Plataforma:', window.electron.platform);
    } else {
      console.log('Aplicación ejecutándose en navegador web');
    }
  }
}
