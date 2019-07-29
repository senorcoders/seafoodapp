import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Homev3Component } from './homev3.component';

describe('Homev3Component', () => {
  let component: Homev3Component;
  let fixture: ComponentFixture<Homev3Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Homev3Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Homev3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
