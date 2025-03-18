import { Component } from '@angular/core';
import { ProfileComponent as SupProfileComponent } from '@dotted-labs/ngx-supabase-auth';

@Component({
  selector: 'app-profile-page',
  imports: [SupProfileComponent],
  template: `
    <div class="max-w-md mx-auto card card-border bg-base-100 border-base-300 card-sm">
      <div class="card-body">
        <sup-profile
          title="Your Profile"
          subtitle="Manage your account information here"
          [showAvatarSection]="true"
          [showPasswordSection]="true"
          [showSignOut]="true"
        ></sup-profile>
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
export class ProfilePageComponent {}
