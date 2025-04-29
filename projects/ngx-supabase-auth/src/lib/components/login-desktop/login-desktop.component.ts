import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthStore } from '../../store/auth.store';

// Declaraciones de tipo para la API de Electron exportada desde preload.js
declare global {
  interface Window {
    electron?: {
      receive: (channel: string, callback: (...args: any[]) => void) => void;
      send: (channel: string, data: any) => void;
      platform: string;
    };
  }
}

/**
 * Login component to handle email/password and social login
 */
@Component({
  selector: 'sup-login-desktop',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login-desktop.component.html',
})
export class LoginDesktopComponent implements OnInit {
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
