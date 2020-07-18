import { TestBed } from '@angular/core/testing';

import { FileAgeServiceService } from './file-age-service.service';

describe('FileAgeServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FileAgeServiceService = TestBed.get(FileAgeServiceService);
    expect(service).toBeTruthy();
  });
});
