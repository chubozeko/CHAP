import { Injectable } from '@angular/core';
import { Flowchart } from './classes/Flowchart';
import { LoopBlock } from './classes/LoopBlock';

@Injectable({
  providedIn: 'root'
})
export class LoopblockstateService {

  variables: any[];
  isAnInputBlockRunning: boolean;
  isProgramRunning: boolean;

  currentBlock: LoopBlock | Flowchart;
  inputSymbolIndex: number;

  parentBlock: LoopBlock | Flowchart;
  loopSymbolIndex: number;

  constructor() { }

  initialize() {
    this.variables = [];
    this.isAnInputBlockRunning = false;
    this.isProgramRunning = false;
    this.currentBlock = null;
    this.inputSymbolIndex = null;
    this.parentBlock = null;
    this.loopSymbolIndex = null;
  }
}
