import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdersItemsComponent } from './orders-items.component';

describe('OrdersItemsComponent', () => {
  let component: OrdersItemsComponent;
  let fixture: ComponentFixture<OrdersItemsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrdersItemsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrdersItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
