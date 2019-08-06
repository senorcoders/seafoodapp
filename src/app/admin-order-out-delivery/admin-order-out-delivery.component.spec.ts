import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminOrderOutDeliveryComponent } from './admin-order-out-delivery.component';

describe('AdminOrderOutDeliveryComponent', () => {
  let component: AdminOrderOutDeliveryComponent;
  let fixture: ComponentFixture<AdminOrderOutDeliveryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminOrderOutDeliveryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminOrderOutDeliveryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
