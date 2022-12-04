import { TestBed } from '@angular/core/testing';

import { OvitrapService } from './ovitrap.service';

describe('DengueCaseService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: OvitrapService = TestBed.get(OvitrapService);
    expect(service).toBeTruthy();
  });
});
