import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AvancedPricingComponent } from './avanced-pricing.component';

describe('AvancedPricingComponent', () => {
  let component: AvancedPricingComponent;
  let fixture: ComponentFixture<AvancedPricingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AvancedPricingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AvancedPricingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
