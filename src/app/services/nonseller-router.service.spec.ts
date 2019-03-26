import { TestBed, inject } from '@angular/core/testing';

import { NonsellerRouterService } from './nonseller-router.service';

describe('NonsellerRouterService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NonsellerRouterService]
    });
  });

  it('should be created', inject([NonsellerRouterService], (service: NonsellerRouterService) => {
    expect(service).toBeTruthy();
  }));
});
