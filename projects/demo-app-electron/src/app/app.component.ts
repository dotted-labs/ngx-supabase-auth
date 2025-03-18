import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet],
  template: `
    <div class="min-h-screen bg-base-200">
      <div class="navbar bg-base-100 shadow-md">
        <div class="navbar-start">
          <div class="dropdown">
            <div tabindex="0" role="button" class="btn btn-ghost btn-circle">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7" />
              </svg>
            </div>
            <ul tabindex="0" class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
              <li><a routerLink="/">Inicio</a></li>
              <li><a routerLink="/dashboard">Dashboard</a></li>
              <li><a routerLink="/profile">Perfil</a></li>
            </ul>
          </div>
        </div>
        <div class="navbar-center">
          <a class="btn btn-ghost text-xl">Ngx Supabase Auth - Electron Demo</a>
        </div>
        <div class="navbar-end">
          <div class="badge badge-primary">Electron</div>
        </div>
      </div>

      <router-outlet></router-outlet>
    </div>
  `,
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
