import { Comment } from "../classes/Comment";
import { Declare } from "../classes/Declare";
import { DoWhileLoop } from "../classes/DoWhileLoop";
import { ForLoop } from "../classes/ForLoop";
import { IfCase } from "../classes/IfCase";
import { Input } from "../classes/Input";
import { Output } from "../classes/Output";
import { Process } from "../classes/Process";
import { Symbols } from "../classes/Symbols";
import { WhileLoop } from "../classes/WhileLoop";

export class SymbolId {

  static DECLARE: string = "dec";
  static INPUT: string = "inp";
  static OUTPUT: string = "out";
  static PROCESS: string = "proc";
  static COMMENT: string = "com";
  static IF_CASE: string = "if";
  static FOR_LOOP: string = "for";
  static WHILE_LOOP: string = "whi";
  static DO_WHILE_LOOP: string = "dow";
  static FLOWCHART: string = "fc";
  static IF_CASE_TRUE: string = "if_t";
  static IF_CASE_FALSE: string = "if_f";
  static FOR_LOOP_TRUE: string = "for_t";
  static WHILE_LOOP_TRUE: string = "whi_t";
  static DO_WHILE_TRUE: string = "dow_t";

  constructor() {}

  public getSymbolIndex(symbolId: string, block: HTMLElement) {
    let tempIndex, loopBlockSymbols = 0, symbolIndex;
    // Get all the symbols in the given block
    let syms = block.getElementsByClassName("symbol");
    for (let i=0; i<syms.length; i++) {
      if (syms[i].parentElement.className.includes('if_div') || syms[i].parentElement.className.includes('for_div') || 
      syms[i].parentElement.className.includes('while_div') || syms[i].parentElement.className.includes('do_while_div')) {
        // Loop Symbols
        if (syms[i].parentElement.id == symbolId) {
          // console.log("gsi => I'm a LOOP symbol!");
          tempIndex = i;
          break;
        } else if ((syms[i].parentElement.parentElement.id == "ifTrueBlock" || 
          syms[i].parentElement.parentElement.id == "ifFalseBlock" || syms[i].parentElement.parentElement.id == "forTrueBlock" || 
          syms[i].parentElement.parentElement.id == "whileTrueBlock" || syms[i].parentElement.parentElement.id == "doWhileTrueBlock")
           && syms[i].parentElement.parentElement != block) {
            loopBlockSymbols++;
        }
      } else {
        // Other Symbols
        if (syms[i].id == symbolId) {
          // console.log("gsi => I'm a NORMAL symbol!");
          tempIndex = i;
          break;
        } else if ((syms[i].parentElement.id == "ifTrueBlock" || syms[i].parentElement.id == "ifFalseBlock" || 
          syms[i].parentElement.id == "forTrueBlock" || syms[i].parentElement.id == "whileTrueBlock" || 
          syms[i].parentElement.id == "doWhileTrueBlock") && syms[i].parentElement != block) {
            loopBlockSymbols++;
        }
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
    for (let i=0; i<syms.length; i++) {
      if (syms[i].className.includes('if_div') || syms[i].className.includes('for_div') || 
      syms[i].className.includes('while_div') || syms[i].className.includes('do_while_div')) {
        // Loop symbols
        if (syms[i].parentElement.id == symbolId) {
          // console.log("gpi => I'm a LOOP symbol!");
          if (syms[i].parentElement.parentElement.id == "ifTrueBlock" || 
          syms[i].parentElement.parentElement.id == "ifFalseBlock" || syms[i].parentElement.parentElement.id == "forTrueBlock" || 
          syms[i].parentElement.parentElement.id == "whileTrueBlock" || syms[i].parentElement.parentElement.id == "doWhileTrueBlock") {
            // * Can't do it like this because the LoopBlock's parent is <td> in the <table> structure
            return this.getSymbolIndex(syms[i].parentElement.parentElement.parentElement.id, 
              syms[i].parentElement.parentElement.parentElement.parentElement);
          } else if (syms[i].parentElement.id == "workspace") {
            return -1;
          }
        }
      } else {
        // Other symbols
        if (syms[i].id == symbolId) {
          // console.log("gpi => I'm a NORMAL symbol!");
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
      
    }
    return -1;
  }

  public generateId(symbolId: string, block: HTMLElement, symbol: Symbols) {
    let symId = '';
    // 1. call getSymbolIndex() and assign it to symComponent.symbolIndex
    symbol.symbolIndex = this.getSymbolIndex(symbolId, block);
    // 2. call getParentIndex() and assign it to symComponent.parentIndex
    symbol.parentIndex = this.getParentIndex(symbolId, block);
    console.log("generateId symbol: ", symbol);
    // 3. Check the parentIndex and parent type
    if (symbol.parentIndex == -1) {
      // In Flowchart
      symId += SymbolId.FLOWCHART + '_';
    } else {
      // In LoopBlock
      switch(block.id) {
        case "ifTrueBlock": symId += SymbolId.IF_CASE_TRUE + '_' + symbol.parentIndex + '_'; break;
        case "ifFalseBlock": symId += SymbolId.IF_CASE_FALSE + '_' + symbol.parentIndex + '_'; break;
        case "forTrueBlock": symId += SymbolId.FOR_LOOP_TRUE + '_' + symbol.parentIndex + '_'; break;
        case "whileTrueBlock": symId += SymbolId.WHILE_LOOP_TRUE + '_' + symbol.parentIndex + '_'; break;
        case "doWhileTrueBlock": symId += SymbolId.DO_WHILE_TRUE + '_' + symbol.parentIndex + '_'; break;
        default: symId += '_' + symbol.parentIndex + '_'; break;
      }
    }
    // 4. Check what type of symbol it is (e.g. 'symComponent instanceof Declare')
    // and build the id based on that (fc_dec_0)
    if (symbol instanceof Declare) {
      symId += SymbolId.DECLARE + '_' + symbol.symbolIndex;
    } else if (symbol instanceof Input) {
      symId += SymbolId.INPUT + '_' + symbol.symbolIndex;
    } else if (symbol instanceof Output) {
      symId += SymbolId.OUTPUT + '_' + symbol.symbolIndex;
    } else if (symbol instanceof Process) {
      symId += SymbolId.PROCESS + '_' + symbol.symbolIndex;
    } else if (symbol instanceof Comment) {
      symId += SymbolId.COMMENT + '_' + symbol.symbolIndex;
    } else if (symbol instanceof IfCase) {
      symId += SymbolId.IF_CASE + '_' + symbol.symbolIndex;
    } else if (symbol instanceof ForLoop) {
      symId += SymbolId.FOR_LOOP + '_' + symbol.symbolIndex;
    } else if (symbol instanceof WhileLoop) {
      symId += SymbolId.WHILE_LOOP + '_' + symbol.symbolIndex;
    } else if (symbol instanceof DoWhileLoop) {
      symId += SymbolId.DO_WHILE_LOOP + '_' + symbol.symbolIndex;
    }
    console.log("new generated id = " + symId);

    // 5. Assign the generated ID to the symbol
    let syms = block.getElementsByClassName("symbol");
    for (let i=0; i<syms.length; i++) {
      if (syms[i].parentElement.className.includes('if_div') || syms[i].parentElement.className.includes('for_div') || 
      syms[i].parentElement.className.includes('while_div') || syms[i].parentElement.className.includes('do_while_div')) {
        // Loop symbols
        if (syms[i].parentElement.id == symbolId) {
          syms[i].parentElement.id = symId;
          return;
        }
      } else {
        // Other symbols
        if (syms[i].id == symbolId) {
          syms[i].id = symId;
          return;
        }
      }
      
    }
    return;
  }

}