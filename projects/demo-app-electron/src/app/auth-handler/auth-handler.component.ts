import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LoginDesktopComponent } from '@dotted-labs/ngx-supabase-auth';

@Component({
  selector: 'app-auth-handler',
  imports: [CommonModule, LoginDesktopComponent],
  template: ` <sup-login-desktop /> `,
  styleUrl: './auth-handler.component.scss',
})
export class AuthHandlerComponent {}
