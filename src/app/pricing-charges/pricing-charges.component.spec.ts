import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PricingChargesComponent } from './pricing-charges.component';

describe('PricingChargesComponent', () => {
  let component: PricingChargesComponent;
  let fixture: ComponentFixture<PricingChargesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PricingChargesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PricingChargesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
