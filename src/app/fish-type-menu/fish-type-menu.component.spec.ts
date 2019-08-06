import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FishTypeMenuComponent } from './fish-type-menu.component';

describe('FishTypeMenuComponent', () => {
  let component: FishTypeMenuComponent;
  let fixture: ComponentFixture<FishTypeMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FishTypeMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FishTypeMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
