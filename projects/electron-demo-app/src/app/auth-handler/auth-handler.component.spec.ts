import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthHandlerComponent } from './auth-handler.component';

describe('AuthHandlerComponent', () => {
  let component: AuthHandlerComponent;
  let fixture: ComponentFixture<AuthHandlerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthHandlerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthHandlerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
