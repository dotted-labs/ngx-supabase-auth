import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthStore } from '@dotted-labs/ngx-supabase-auth';

@Component({
  selector: 'app-auth-handler',
  imports: [CommonModule],
  template: `
    <main class="container mx-auto p-4">
      <section class="card w-96 bg-base-100 shadow-xl mx-auto my-8">
        <div class="card-body">
          <h2 class="card-title">Autenticación de Electron</h2>

          @if (store.loading()) {
            <div class="alert">Verificando autenticación...</div>
          }

          @if (store.error()) {
            <div class="alert alert-error">{{ store.error() }}</div>
          }

          @if (store.user() && !store.loading() && !store.error()) {
            <div class="alert alert-success">¡Autenticación exitosa!</div>
            <p>Bienvenido, {{ store.user()?.email }}</p>
          }

          <div class="card-actions justify-end">
            <button class="btn btn-primary" (click)="login()">Iniciar sesión</button>
            <button class="btn btn-secondary" (click)="signup()">Registrarse</button>
          </div>
        </div>
      </section>
    </main>
  `,
  styleUrl: './auth-handler.component.scss',
})
export class AuthHandlerComponent implements OnInit {
  public readonly store = inject(AuthStore);
  public readonly router = inject(Router);

  ngOnInit() {
    // Verificar si estamos en un entorno de Electron
    if (window.electron) {
      // Escuchar eventos de deep link desde el proceso principal de Electron
      window.electron.receive('deep-link-received', (url: string) => {
        this.handleDeepLink(url);
      });
    }
  }

  /**
   * Manejar la URL de deep link recibida
   */
  async handleDeepLink(url: string) {
    console.log('Deep link recibido:', url);

    // Procesar la URL de deep link para autenticación
    await this.store.processDeepLinkAuth(url);

    // Si la autenticación fue exitosa, navegar al dashboard
    if (this.store.user()) {
      this.router.navigate(['/dashboard']);
    }
  }

  /**
   * Iniciar autenticación abriendo una ventana de navegador externa
   */
  login() {
    // Esto abre el navegador web para autenticación
    this.store.openExternalAuthWindow('login');
  }

  /**
   * Iniciar registro abriendo una ventana de navegador externa
   */
  signup() {
    // Esto abre el navegador web para registro
    this.store.openExternalAuthWindow('signup');
  }
}
