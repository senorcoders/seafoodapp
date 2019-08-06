import { TestBed, inject } from '@angular/core/testing';

import { AdminRouterService } from './admin-router.service';

describe('AdminRouterService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AdminRouterService]
    });
  });

  it('should be created', inject([AdminRouterService], (service: AdminRouterService) => {
    expect(service).toBeTruthy();
  }));
});
