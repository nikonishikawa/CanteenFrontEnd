import { TestBed } from '@angular/core/testing';

import { ManageAddressService } from './manage-address.service';

describe('ManageAddressService', () => {
  let service: ManageAddressService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ManageAddressService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
