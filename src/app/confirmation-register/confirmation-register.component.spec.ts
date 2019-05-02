import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmationRegisterComponent } from './confirmation-register.component';

describe('ConfirmationRegisterComponent', () => {
  let component: ConfirmationRegisterComponent;
  let fixture: ComponentFixture<ConfirmationRegisterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmationRegisterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmationRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
