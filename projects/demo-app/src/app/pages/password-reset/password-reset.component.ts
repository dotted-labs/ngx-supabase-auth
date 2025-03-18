import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PasswordResetComponent as SupPasswordResetComponent } from '@dotted-labs/ngx-supabase-auth';

@Component({
  selector: 'app-password-reset-page',
  imports: [SupPasswordResetComponent],
  template: `
    <div class="max-w-md mx-auto card card-border bg-base-100 border-base-300 card-sm">
      <div class="card-body">
        <sup-password-reset
          title="Reset Your Password"
          subtitle="Enter your email and we'll send you a reset link"
          (backToLogin)="onBackToLogin()"
        ></sup-password-reset>
      </div>
    </div>
  `,
  styles: [
    `
      .container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 2rem;
        text-align: center;
      }

      .app-title {
        margin-bottom: 2rem;
        color: #333;
        font-size: 2rem;
      }
    `,
  ],
})
export class PasswordResetPageComponent {
  constructor(private router: Router) {}

  onBackToLogin() {
    this.router.navigate(['/login']);
  }
}
