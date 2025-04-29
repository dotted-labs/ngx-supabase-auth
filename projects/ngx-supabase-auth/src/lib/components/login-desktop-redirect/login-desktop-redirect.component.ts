import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthStore } from '../../store/auth.store';

/**
 * Login component to handle email/password and social login
 */
@Component({
  selector: 'sup-login-desktop-redirect',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login-desktop-redirect.component.html',
})
export class LoginDesktopRedirectComponent implements OnInit {
  public authStore = inject(AuthStore);

  public ngOnInit() {
    this.authStore.openAppDesktopAfterLogin();
  }

  public redirectToDesktop() {
    this.authStore.openAppDesktopAfterLogin();
  }
}
