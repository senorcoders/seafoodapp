import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminOrdersShippedComponent } from './admin-orders-shipped.component';

describe('AdminOrdersShippedComponent', () => {
  let component: AdminOrdersShippedComponent;
  let fixture: ComponentFixture<AdminOrdersShippedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminOrdersShippedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminOrdersShippedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
