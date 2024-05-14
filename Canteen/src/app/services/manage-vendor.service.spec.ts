import { TestBed } from '@angular/core/testing';

import { ManageVendorService } from './manage-vendor.service';

describe('ManageVendorService', () => {
  let service: ManageVendorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ManageVendorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
