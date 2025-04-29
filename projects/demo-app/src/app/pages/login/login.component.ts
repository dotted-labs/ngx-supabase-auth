import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { LoginComponent as SupLoginComponent } from '@dotted-labs/ngx-supabase-auth';

@Component({
  selector: 'app-login-page',
  imports: [SupLoginComponent],
  template: `
    <div class="max-w-md mx-auto card card-border bg-base-100 border-base-300 card-sm">
      <div class="card-body">
        <sup-login (forgotPassword)="onForgotPassword()" (signup)="onSignup()"></sup-login>
      </div>
    </div>
  `,
})
export class LoginPageComponent {
  private readonly router = inject(Router);

  public onForgotPassword() {
    this.router.navigate(['/forgot-password']);
  }

  public onSignup() {
    this.router.navigate(['/signup']);
  }
}
