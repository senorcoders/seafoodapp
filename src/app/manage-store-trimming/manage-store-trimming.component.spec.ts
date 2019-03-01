import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageStoreTrimmingComponent } from './manage-store-trimming.component';

describe('ManageStoreTrimmingComponent', () => {
  let component: ManageStoreTrimmingComponent;
  let fixture: ComponentFixture<ManageStoreTrimmingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageStoreTrimmingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageStoreTrimmingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
