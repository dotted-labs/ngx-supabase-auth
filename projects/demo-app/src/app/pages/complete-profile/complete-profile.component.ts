import { Component } from '@angular/core';
import { ProfileCompletionComponent } from '@dotted-labs/ngx-supabase-auth';

@Component({
  selector: 'app-complete-profile-page',
  standalone: true,
  imports: [ProfileCompletionComponent],
  template: `
    <div class="container mx-auto py-8">
      <ngx-profile-completion></ngx-profile-completion>
    </div>
  `,
})
export class CompleteProfilePageComponent {
  constructor() {
    console.log('🚀 [CompleteProfilePage] Component initialized');
  }
}
