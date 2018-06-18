import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeaturedSellersComponent } from './featured-sellers.component';

describe('FeaturedSellersComponent', () => {
  let component: FeaturedSellersComponent;
  let fixture: ComponentFixture<FeaturedSellersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeaturedSellersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeaturedSellersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
