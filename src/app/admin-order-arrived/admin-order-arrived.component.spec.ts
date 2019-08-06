import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminOrderArrivedComponent } from './admin-order-arrived.component';

describe('AdminOrderArrivedComponent', () => {
  let component: AdminOrderArrivedComponent;
  let fixture: ComponentFixture<AdminOrderArrivedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminOrderArrivedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminOrderArrivedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
