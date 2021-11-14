import { TestBed } from '@angular/core/testing';

import { LoopblockstateService } from './loopblockstate.service';

describe('LoopblockstateService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LoopblockstateService = TestBed.get(LoopblockstateService);
    expect(service).toBeTruthy();
  });
});
