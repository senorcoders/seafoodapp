import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrationBuyerComponent } from './registration-buyer.component';

describe('RegistrationBuyerComponent', () => {
  let component: RegistrationBuyerComponent;
  let fixture: ComponentFixture<RegistrationBuyerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegistrationBuyerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrationBuyerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
