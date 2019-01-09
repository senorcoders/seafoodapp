import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemsByStatusComponent } from './items-by-status.component';

describe('ItemsByStatusComponent', () => {
  let component: ItemsByStatusComponent;
  let fixture: ComponentFixture<ItemsByStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemsByStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemsByStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
