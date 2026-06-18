import { Component } from '@angular/core';

import { LoginDesktopComponent } from '@dotted-labs/ngx-supabase-auth';

@Component({
  selector: 'app-auth-handler',
  imports: [LoginDesktopComponent],
  template: `
    <sup-login-desktop>
      <div login-desktop-branding class="flex flex-col items-center gap-2">
        <div class="avatar placeholder">
          <div class="bg-primary text-primary-content rounded-full w-24">
            <span class="text-3xl">SA</span>
          </div>
        </div>
        <h2 class="text-2xl font-bold text-white">Electron Demo</h2>
        <p class="text-white/70">Inicia sesión para continuar</p>
      </div>
    </sup-login-desktop>
  `,
})
export class AuthHandlerComponent {}
