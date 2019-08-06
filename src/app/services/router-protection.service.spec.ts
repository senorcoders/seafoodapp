import { TestBed, inject } from '@angular/core/testing';

import { RouterProtectionService } from './router-protection.service';

describe('RouterProtectionService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RouterProtectionService]
    });
  });

  it('should be created', inject([RouterProtectionService], (service: RouterProtectionService) => {
    expect(service).toBeTruthy();
  }));
});
