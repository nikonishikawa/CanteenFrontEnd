import { TestBed } from '@angular/core/testing';

import { ManagePositionService } from './manage-position.service';

describe('ManagePositionService', () => {
  let service: ManagePositionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ManagePositionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
