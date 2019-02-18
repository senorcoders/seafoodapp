import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CitiManagmentComponent } from './citi-managment.component';

describe('CitiManagmentComponent', () => {
  let component: CitiManagmentComponent;
  let fixture: ComponentFixture<CitiManagmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CitiManagmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CitiManagmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
