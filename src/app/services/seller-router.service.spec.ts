import { TestBed, inject } from '@angular/core/testing';

import { SellerRouterService } from './seller-router.service';

describe('SellerRouterService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SellerRouterService]
    });
  });

  it('should be created', inject([SellerRouterService], (service: SellerRouterService) => {
    expect(service).toBeTruthy();
  }));
});
