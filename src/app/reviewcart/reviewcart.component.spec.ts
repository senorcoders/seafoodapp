import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewcartComponent } from './reviewcart.component';

describe('ReviewcartComponent', () => {
  let component: ReviewcartComponent;
  let fixture: ComponentFixture<ReviewcartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReviewcartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewcartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
