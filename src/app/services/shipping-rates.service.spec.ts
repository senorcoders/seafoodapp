import { TestBed, inject } from '@angular/core/testing';

import { ShippingRatesService } from './shipping-rates.service';

describe('ShippingRatesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ShippingRatesService]
    });
  });

  it('should be created', inject([ShippingRatesService], (service: ShippingRatesService) => {
    expect(service).toBeTruthy();
  }));
});
