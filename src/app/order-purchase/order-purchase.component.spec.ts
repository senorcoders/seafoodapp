import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderPurchaseComponent } from './order-purchase.component';

describe('OrderPurchaseComponent', () => {
  let component: OrderPurchaseComponent;
  let fixture: ComponentFixture<OrderPurchaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderPurchaseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderPurchaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
