export class SymbolId {

  constructor() {}

  public getSymbolIndex(symbolId: string, block: HTMLElement) {
    let tempIndex, loopBlockSymbols = 0, symbolIndex;
    // Get all the symbols in the given block
    let syms = block.getElementsByClassName("symbol");
    for (let i=0; i<syms.length; i++) {
      if (syms[i].id == symbolId) {
        tempIndex = i;
        break;
      } else if ((syms[i].parentElement.id == "ifTrueBlock" || syms[i].parentElement.id == "ifFalseBlock" || 
        syms[i].parentElement.id == "forTrueBlock" || syms[i].parentElement.id == "whileTrueBlock" || 
        syms[i].parentElement.id == "doWhileTrueBlock") && syms[i].parentElement != block) {
          loopBlockSymbols++;
      }
    }
    symbolIndex = tempIndex - loopBlockSymbols;
    if (block.id == "workspace") // Removes Start symbol index
      symbolIndex -= 1;
    if (isNaN(symbolIndex)) // Symbol index not found
      return -1;
    else
      return symbolIndex;
  }

  public getParentIndex(symbolId: string, block: HTMLElement) {
    let syms = block.getElementsByClassName("symbol");
    console.log("syms pi: ", syms);
    for (let i=0; i<syms.length; i++) {
      if (syms[i].id == symbolId) {
        if (syms[i].parentElement.id == "ifTrueBlock" || syms[i].parentElement.id == "ifFalseBlock" || 
        syms[i].parentElement.id == "forTrueBlock" || syms[i].parentElement.id == "whileTrueBlock" || 
        syms[i].parentElement.id == "doWhileTrueBlock") {
          // * Can't do it like this because the LoopBlock's parent is <td> in the <table> structure
          return this.getSymbolIndex(syms[i].parentElement.parentElement.id, syms[i].parentElement.parentElement.parentElement);
        } else if (syms[i].parentElement.id == "workspace") {
          return -1;
        }
      }
    }
     return -1;
  }

  
}