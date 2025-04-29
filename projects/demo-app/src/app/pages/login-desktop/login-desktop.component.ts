import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoginDesktopRedirectComponent as SupLoginDesktopRedirectComponent } from '@dotted-labs/ngx-supabase-auth';

@Component({
  selector: 'app-login-desktop-page',
  imports: [SupLoginDesktopRedirectComponent],
  template: `
    <div class="max-w-md mx-auto card card-border bg-base-100 border-base-300 card-sm">
      <div class="card-body">
        <sup-login-desktop-redirect />
      </div>
    </div>
  `,
})
export class LoginDesktopPageComponent {
  constructor(private router: Router) {}

  public onForgotPassword() {
    this.router.navigate(['/forgot-password']);
  }

  public onSignup() {
    this.router.navigate(['/signup']);
  }
}
