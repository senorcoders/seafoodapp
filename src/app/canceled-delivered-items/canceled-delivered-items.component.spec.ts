import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CanceledDeliveredItemsComponent } from './canceled-delivered-items.component';

describe('CanceledDeliveredItemsComponent', () => {
  let component: CanceledDeliveredItemsComponent;
  let fixture: ComponentFixture<CanceledDeliveredItemsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CanceledDeliveredItemsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CanceledDeliveredItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
