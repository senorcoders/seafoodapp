import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeaturedSellerComponent } from './featured-seller.component';

describe('FeaturedSellerComponent', () => {
  let component: FeaturedSellerComponent;
  let fixture: ComponentFixture<FeaturedSellerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeaturedSellerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeaturedSellerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
