import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeaturedTypesComponent } from './featured-types.component';

describe('FeaturedTypesComponent', () => {
  let component: FeaturedTypesComponent;
  let fixture: ComponentFixture<FeaturedTypesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeaturedTypesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeaturedTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
