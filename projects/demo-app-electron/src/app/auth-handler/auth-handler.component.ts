import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';

import { LoginDesktopComponent } from '@dotted-labs/ngx-supabase-auth';

@Component({
  selector: 'app-auth-handler',
  imports: [LoginDesktopComponent],
  template: ` <sup-login-desktop /> `,
})
export class AuthHandlerComponent {}
