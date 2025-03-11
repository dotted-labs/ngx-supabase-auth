import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxSupabaseAuthComponent } from './ngx-supabase-auth.component';

describe('NgxSupabaseAuthComponent', () => {
  let component: NgxSupabaseAuthComponent;
  let fixture: ComponentFixture<NgxSupabaseAuthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgxSupabaseAuthComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NgxSupabaseAuthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
