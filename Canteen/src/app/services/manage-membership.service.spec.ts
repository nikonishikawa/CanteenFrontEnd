import { TestBed } from '@angular/core/testing';

import { ManageMembershipService } from './manage-membership.service';

describe('ManageMembershipService', () => {
  let service: ManageMembershipService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ManageMembershipService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
