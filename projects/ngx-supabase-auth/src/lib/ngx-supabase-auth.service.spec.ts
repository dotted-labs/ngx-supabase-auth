import { TestBed } from '@angular/core/testing';

import { NgxSupabaseAuthService } from './ngx-supabase-auth.service';

describe('NgxSupabaseAuthService', () => {
  let service: NgxSupabaseAuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgxSupabaseAuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
