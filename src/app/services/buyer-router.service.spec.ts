import { TestBed, inject } from '@angular/core/testing';

import { BuyerRouterService } from './buyer-router.service';

describe('BayerRouterService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BayerRouterService]
    });
  });

  it('should be created', inject([BayerRouterService], (service: BayerRouterService) => {
    expect(service).toBeTruthy();
  }));
});
