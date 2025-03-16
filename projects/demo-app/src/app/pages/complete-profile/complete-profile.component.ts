import { Component } from '@angular/core';
import { ProfileCompletionComponent } from '@dotted-labs/ngx-supabase-auth';

@Component({
  selector: 'app-complete-profile-page',
  standalone: true,
  imports: [ProfileCompletionComponent],
  template: ` <ngx-profile-completion></ngx-profile-completion> `,
})
export class CompleteProfilePageComponent {
  constructor() {
    console.log('[CompleteProfilePage] Component initialized');
  }
}
