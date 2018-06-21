import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeaturedStoreComponent } from './featured-store.component';

describe('FeaturedStoreComponent', () => {
  let component: FeaturedStoreComponent;
  let fixture: ComponentFixture<FeaturedStoreComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeaturedStoreComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeaturedStoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
