import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminLogisticManagmentComponent } from './admin-logistic-managment.component';

describe('AdminLogisticManagmentComponent', () => {
  let component: AdminLogisticManagmentComponent;
  let fixture: ComponentFixture<AdminLogisticManagmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminLogisticManagmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminLogisticManagmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
