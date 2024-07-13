import { TestBed } from '@angular/core/testing';

import { GoogleMapsHttpService } from './google-maps-http.service';

describe('GoogleMapsHttpService', () => {
  let service: GoogleMapsHttpService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GoogleMapsHttpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
