import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Homeve2Component } from './homeve2.component';

describe('Homeve2Component', () => {
  let component: Homeve2Component;
  let fixture: ComponentFixture<Homeve2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Homeve2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Homeve2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
