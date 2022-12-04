import { TestBed } from '@angular/core/testing';

import { DengueCaseService } from './dengue-case.service';

describe('DengueCaseService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DengueCaseService = TestBed.get(DengueCaseService);
    expect(service).toBeTruthy();
  });
});
