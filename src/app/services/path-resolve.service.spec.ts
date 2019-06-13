import { TestBed, inject } from '@angular/core/testing';

import { PathResolveService } from './path-resolve.service';

describe('PathResolveService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PathResolveService]
    });
  });

  it('should be created', inject([PathResolveService], (service: PathResolveService) => {
    expect(service).toBeTruthy();
  }));
});
