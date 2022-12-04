import { TestBed } from '@angular/core/testing';

import { CupService } from './cup.service';

describe('DengueCaseService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CupService = TestBed.get(CupService);
    expect(service).toBeTruthy();
  });
});
