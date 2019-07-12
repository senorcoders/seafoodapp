import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AmmendInvoiceComponent } from './ammend-invoice.component';

describe('AmmendInvoiceComponent', () => {
  let component: AmmendInvoiceComponent;
  let fixture: ComponentFixture<AmmendInvoiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AmmendInvoiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AmmendInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
