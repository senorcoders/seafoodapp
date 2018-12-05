import { TestBed, inject } from '@angular/core/testing';

import { PricingChargesService } from './pricing-charges.service';

describe('PricingChargesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PricingChargesService]
    });
  });

  it('should be created', inject([PricingChargesService], (service: PricingChargesService) => {
    expect(service).toBeTruthy();
  }));
});
