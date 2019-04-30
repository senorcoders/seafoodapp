import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailReadyComponent } from './email-ready.component';

describe('EmailReadyComponent', () => {
  let component: EmailReadyComponent;
  let fixture: ComponentFixture<EmailReadyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmailReadyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailReadyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
