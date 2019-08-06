import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StorefrontNewComponent } from './storefront-new.component';

describe('StorefrontNewComponent', () => {
  let component: StorefrontNewComponent;
  let fixture: ComponentFixture<StorefrontNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StorefrontNewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StorefrontNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
