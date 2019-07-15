import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FishInformationManagmentComponent } from './fish-information-managment.component';

describe('FishInformationManagmentComponent', () => {
  let component: FishInformationManagmentComponent;
  let fixture: ComponentFixture<FishInformationManagmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FishInformationManagmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FishInformationManagmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
