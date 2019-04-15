import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FishFeaturesComponent } from './fish-features.component';

describe('FishFeaturesComponent', () => {
  let component: FishFeaturesComponent;
  let fixture: ComponentFixture<FishFeaturesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FishFeaturesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FishFeaturesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
