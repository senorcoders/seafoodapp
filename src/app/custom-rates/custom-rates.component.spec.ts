import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomRatesComponent } from './custom-rates.component';

describe('CustomRatesComponent', () => {
  let component: CustomRatesComponent;
  let fixture: ComponentFixture<CustomRatesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomRatesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomRatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
