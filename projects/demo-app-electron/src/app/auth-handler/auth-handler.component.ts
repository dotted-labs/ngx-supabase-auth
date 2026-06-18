import { Component} from '@angular/core';

import { LoginDesktopComponent } from '@dotted-labs/ngx-supabase-auth';

@Component({
  selector: 'app-auth-handler',
  imports: [LoginDesktopComponent],
  template: ` <sup-login-desktop /> `,
})
export class AuthHandlerComponent {}
