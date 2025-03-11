import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthStore } from '@dotted-labs/ngx-supabase-auth';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
      <h1 class="app-title">Dashboard</h1>

      <div class="dashboard-content">
        @if (authStore.user()) {
        <div class="user-info">
          <h2>Welcome, {{ getUserName() }}</h2>
          <p>Email: {{ authStore.user()?.email }}</p>
          <p>
            Last Sign In: {{ formatDate(authStore.user()?.last_sign_in_at) }}
          </p>
        </div>
        }

        <div class="actions">
          <button class="btn btn-profile" (click)="navigateToProfile()">
            View Profile
          </button>
          <button class="btn btn-logout" (click)="logout()">Sign Out</button>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 2rem;
      }

      .app-title {
        margin-bottom: 2rem;
        color: #333;
        text-align: center;
        font-size: 2rem;
      }

      .dashboard-content {
        background-color: white;
        border-radius: 8px;
        padding: 2rem;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      }

      .user-info {
        margin-bottom: 2rem;
      }

      .user-info h2 {
        color: #333;
        margin-bottom: 1rem;
        font-size: 1.5rem;
      }

      .user-info p {
        color: #666;
        margin-bottom: 0.5rem;
        font-size: 1rem;
      }

      .actions {
        display: flex;
        gap: 1rem;
        justify-content: flex-start;
      }

      .btn {
        padding: 0.75rem 1.5rem;
        border: none;
        border-radius: 4px;
        font-weight: 500;
        cursor: pointer;
        transition: background-color 0.2s;
      }

      .btn-profile {
        background-color: #3498db;
        color: white;
      }

      .btn-profile:hover {
        background-color: #2980b9;
      }

      .btn-logout {
        background-color: #e74c3c;
        color: white;
      }

      .btn-logout:hover {
        background-color: #c0392b;
      }
    `,
  ],
})
export class DashboardComponent {
  authStore = inject(AuthStore);

  constructor(private router: Router) {}

  getUserName(): string {
    const user = this.authStore.user();
    // Try to get the user name from metadata
    return (
      user?.user_metadata?.['name'] || user?.email?.split('@')[0] || 'User'
    );
  }

  formatDate(dateString?: string): string {
    if (!dateString) return 'Never';

    const date = new Date(dateString);
    return date.toLocaleString();
  }

  navigateToProfile(): void {
    this.router.navigate(['/profile']);
  }

  logout(): void {
    this.authStore.signOut();
  }
}
