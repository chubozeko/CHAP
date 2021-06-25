import { Injectable } from '@angular/core';
import { DoWhileLoop } from './classes/DoWhileLoop';
import { Flowchart } from './classes/Flowchart';
import { ForLoop } from './classes/ForLoop';
import { LoopBlock } from './classes/LoopBlock';
import { WhileLoop } from './classes/WhileLoop';

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
  loopSymbolType: string;

  passDoWhile: boolean;

  constructor() { }

  initialize() {
    this.variables = [];
    this.isAnInputBlockRunning = false;
    this.isProgramRunning = false;
    this.currentBlock = null;
    this.inputSymbolIndex = null;
    this.parentBlock = null;
    this.loopSymbolIndex = null;
    this.passDoWhile = true;
  }
}
