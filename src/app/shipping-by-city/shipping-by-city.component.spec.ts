import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShippingByCityComponent } from './shipping-by-city.component';

describe('ShippingByCityComponent', () => {
  let component: ShippingByCityComponent;
  let fixture: ComponentFixture<ShippingByCityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShippingByCityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShippingByCityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
