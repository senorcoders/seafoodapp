import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SfsPayComponent } from './sfs-pay.component';

describe('SfsPayComponent', () => {
  let component: SfsPayComponent;
  let fixture: ComponentFixture<SfsPayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SfsPayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SfsPayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
