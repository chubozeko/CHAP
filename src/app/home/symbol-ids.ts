import { Comment } from "../classes/Comment";
import { Declare } from "../classes/Declare";
import { DoWhileLoop } from "../classes/DoWhileLoop";
import { Flowchart } from "../classes/Flowchart";
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
  static IF_CASE_TRUE: string = "ift";
  static IF_CASE_FALSE: string = "iff";
  static FOR_LOOP_TRUE: string = "fort";
  static WHILE_LOOP_TRUE: string = "whit";
  static DO_WHILE_LOOP_TRUE: string = "dowt";
  static IF_TRUE_BLOCK: string = "if_true";
  static IF_FALSE_BLOCK: string = "if_false";
  static FOR_TRUE_BLOCK: string = "for_true";
  static WHILE_TRUE_BLOCK: string = "whi_true";
  static DO_WHILE_TRUE_BLOCK: string = "dow_true";
  static DEPTH_LEVEL: string = "lvl_";

  constructor() {}

  private getSymbolIndex(symbolId: string, block: HTMLElement) : number {
    let tempIndex, loopBlockSymbols = 0, symbolIndex;
    // Get all the symbols in the given block
    let syms = block.getElementsByClassName("symbol");
    for (let i=0; i<syms.length; i++) {
      if (syms[i].className.includes('if_sym') || syms[i].className.includes('for_sym') || 
      syms[i].className.includes('while_sym') || syms[i].className.includes('do_while_sym')) {
        // Loop Symbols
        if (syms[i].parentElement.id == symbolId) {
          tempIndex = i;
          break;
        } else if ((syms[i].parentElement.parentElement.className.includes('ifTrueBlock') || 
          syms[i].parentElement.parentElement.className.includes('ifFalseBlock') || 
          syms[i].parentElement.parentElement.className.includes('forTrueBlock') || 
          syms[i].parentElement.parentElement.className.includes('whileTrueBlock') || 
          syms[i].parentElement.parentElement.className.includes('doWhileTrueBlock'))
           && syms[i].parentElement.parentElement != block) {
            loopBlockSymbols++;
        }
      } else {
        // Other Symbols
        if (syms[i].id == symbolId) {
          tempIndex = i;
          break;
        } else if ((syms[i].parentElement.className.includes('ifTrueBlock') || 
          syms[i].parentElement.className.includes('ifFalseBlock') || 
          syms[i].parentElement.className.includes('forTrueBlock') || 
          syms[i].parentElement.className.includes('whileTrueBlock') || 
          syms[i].parentElement.className.includes('doWhileTrueBlock')) && syms[i].parentElement != block) {
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

  private getParentIndex(symbolId: string, block: HTMLElement) : number {
    let syms = block.getElementsByClassName("symbol");
    for (let i=0; i<syms.length; i++) {
      if (syms[i].className.includes('if_sym') || syms[i].className.includes('for_sym') || 
      syms[i].className.includes('while_sym') || syms[i].className.includes('do_while_sym')) {
        // Loop symbols
        if (syms[i].parentElement.id == symbolId) {
          if (syms[i].parentElement.parentElement.className.includes('ifTrueBlock') || 
          syms[i].parentElement.parentElement.className.includes('ifFalseBlock') || 
          syms[i].parentElement.parentElement.className.includes('forTrueBlock') || 
          syms[i].parentElement.parentElement.className.includes('whileTrueBlock') || 
          syms[i].parentElement.parentElement.className.includes('doWhileTrueBlock')) {
            // Get the ID of parentElement, parse it, and get the last number, which is the "parentIndex"
            return Number.parseInt(syms[i].parentElement.parentElement.id.split('_').pop());
          } else if (syms[i].parentElement.id == "workspace") {
            return -1;
          }
        }
      } else {
        // Other symbols
        if (syms[i].id == symbolId) {
          if (syms[i].parentElement.className.includes('ifTrueBlock') || syms[i].parentElement.className.includes('ifFalseBlock') || 
          syms[i].parentElement.className.includes('forTrueBlock') || syms[i].parentElement.className.includes('whileTrueBlock') || 
          syms[i].parentElement.className.includes('doWhileTrueBlock')) {
            // Get the ID of parentElement, parse it, and get the last number, which is the "parentIndex"
            return Number.parseInt(syms[i].parentElement.id.split('_').pop());
          } else if (syms[i].parentElement.id == "workspace") {
            return -1;
          }
        }
      }
      
    }
    return -1;
  }

  public getSymbolDepth(element: Element, depth) {
    let str = 0;
    let children = element.children;
    for (let i = 0; i < children.length; ++i) {
      if (children[i].nodeType != 3) {
        if (children[i].id == "s_temp_id") {
          return depth;
        }
        str += this.getSymbolDepth(children[i], depth + 1);
      }
    }
    return str;
  }

  public generateId(symbolId: string, block: HTMLElement, symbol: Symbols) {
    let symId = '', trueBlockId = '', falseBlockId = '';
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
      switch(block.className) {
        case "ifTrueBlock": 
          symId += SymbolId.IF_CASE_TRUE + '_' + symbol.parentIndex + '_';
          trueBlockId += SymbolId.IF_CASE_TRUE + '_' + symbol.parentIndex + '_';
          falseBlockId += SymbolId.IF_CASE_TRUE + '_' + symbol.parentIndex + '_';
          symbol.isInTrueLoopBlock = true;
          break;
        case "ifFalseBlock": 
          symId += SymbolId.IF_CASE_FALSE + '_' + symbol.parentIndex + '_';
          trueBlockId += SymbolId.IF_CASE_FALSE + '_' + symbol.parentIndex + '_';
          falseBlockId += SymbolId.IF_CASE_FALSE + '_' + symbol.parentIndex + '_';
          symbol.isInTrueLoopBlock = false;
          break;
        case "forTrueBlock": 
          symId += SymbolId.FOR_LOOP_TRUE + '_' + symbol.parentIndex + '_';
          trueBlockId += SymbolId.FOR_LOOP_TRUE + '_' + symbol.parentIndex + '_'; 
          falseBlockId += SymbolId.FOR_LOOP_TRUE + '_' + symbol.parentIndex + '_';
          symbol.isInTrueLoopBlock = true;
          break;
        case "whileTrueBlock": 
          symId += SymbolId.WHILE_LOOP_TRUE + '_' + symbol.parentIndex + '_'; 
          trueBlockId += SymbolId.WHILE_LOOP_TRUE + '_' + symbol.parentIndex + '_'; 
          falseBlockId += SymbolId.WHILE_LOOP_TRUE + '_' + symbol.parentIndex + '_'; 
          symbol.isInTrueLoopBlock = true;
          break;
        case "doWhileTrueBlock": 
          symId += SymbolId.DO_WHILE_LOOP_TRUE + '_' + symbol.parentIndex + '_'; 
          trueBlockId += SymbolId.DO_WHILE_LOOP_TRUE + '_' + symbol.parentIndex + '_'; 
          falseBlockId += SymbolId.DO_WHILE_LOOP_TRUE + '_' + symbol.parentIndex + '_'; 
          symbol.isInTrueLoopBlock = true;
          break;
        default: 
          symId += 'xxv_' + symbol.parentIndex + '_';
          trueBlockId += 'ggg_' + symbol.parentIndex + '_';
          falseBlockId += 'bbb_' + symbol.parentIndex + '_';
          break;
      }
    }
    // 4. Add symbol depth (lvl_symbolDepth)
    let lvl = this.getSymbolDepth(document.getElementById("workspace"), 0) / 5;
    symId += SymbolId.DEPTH_LEVEL + lvl + "_";
    trueBlockId += SymbolId.DEPTH_LEVEL + lvl + "_";
    falseBlockId += SymbolId.DEPTH_LEVEL + lvl + "_";
    // 5. Check what type of symbol it is (e.g. 'symComponent instanceof Declare')
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
      trueBlockId += SymbolId.IF_TRUE_BLOCK + '_' + symbol.symbolIndex;
      falseBlockId += SymbolId.IF_FALSE_BLOCK + '_' + symbol.symbolIndex;
    } else if (symbol instanceof ForLoop) {
      symId += SymbolId.FOR_LOOP + '_' + symbol.symbolIndex;
      trueBlockId += SymbolId.FOR_TRUE_BLOCK + '_' + symbol.symbolIndex;
    } else if (symbol instanceof WhileLoop) {
      symId += SymbolId.WHILE_LOOP + '_' + symbol.symbolIndex;
      trueBlockId += SymbolId.WHILE_TRUE_BLOCK + '_' + symbol.symbolIndex;
    } else if (symbol instanceof DoWhileLoop) {
      symId += SymbolId.DO_WHILE_LOOP + '_' + symbol.symbolIndex;
      trueBlockId += SymbolId.DO_WHILE_TRUE_BLOCK + '_' + symbol.symbolIndex;
    }
    console.log("new generated id = " + symId);

    // 6. Assign the generated ID to the symbol
    let syms = block.getElementsByClassName("symbol");
    for (let i=0; i<syms.length; i++) {
      if (syms[i].parentElement.className.includes('if_div') || syms[i].parentElement.className.includes('for_div') || 
      syms[i].parentElement.className.includes('while_div') || syms[i].parentElement.className.includes('do_while_div')) {
        // Loop symbols
        if (syms[i].parentElement.id == symbolId) {
          syms[i].parentElement.id = symId;
          symbol.id = symId;
          if (symbol instanceof IfCase) {
            symbol.trueBlockId = trueBlockId;
            symbol.falseBlockId = falseBlockId;
            syms[i].parentElement.getElementsByClassName('ifTrueBlock')[0].id = trueBlockId;
            syms[i].parentElement.getElementsByClassName('ifFalseBlock')[0].id = falseBlockId;
          } else if (symbol instanceof ForLoop) {
            symbol.trueBlockId = trueBlockId;
            syms[i].parentElement.getElementsByClassName('forTrueBlock')[0].id = trueBlockId;
          } else if (symbol instanceof WhileLoop) {
            symbol.trueBlockId = trueBlockId;
            syms[i].parentElement.getElementsByClassName('whileTrueBlock')[0].id = trueBlockId;
          } else if (symbol instanceof DoWhileLoop) {
            symbol.trueBlockId = trueBlockId;
            syms[i].parentElement.getElementsByClassName('doWhileTrueBlock')[0].id = trueBlockId;
          }
          return;
        }
      } else {
        // Other symbols
        if (syms[i].id == symbolId) {
          syms[i].id = symId;
          symbol.id = symId;
          return;
        }
      }
      
    }
    
    return;
  }

  public updateIds(block: HTMLElement, flowchart: Flowchart) {
    let currentSymId = "", updateSymId = "s_update_id";
    // 1. Get all the symbols in the flowchart with unique ids
    let syms = block.getElementsByClassName("symbol");
    // 2. Traverse through the symbols (foreach) -> For each symbol:
    for(let i=0; i<syms.length; i++) {
      if (syms[i].id != "s_start" && syms[i].id != "s_stop") {
        if (syms[i].className.includes("s_if_case") || syms[i].className.includes("s_for_loop") || 
        syms[i].className.includes("s_while_loop") || syms[i].className.includes("s_do_while_loop")) {
          currentSymId = syms[i].parentElement.id;
        } else {
          currentSymId = syms[i].id;
        }
        // 3. Find that current symbol in the flowchart (backend)
        let currentSymbol = flowchart.searchForSymbolInFlowchart(currentSymId) as Symbols;
        // 4. Change the current symbol’s id to “s_update_id”
        let curSymbolElement = document.getElementById(currentSymId);
        curSymbolElement.id = updateSymId;
        // 5. Update the ID by generating a new one using generateId(“s_update_id”, ... )
        this.generateId(curSymbolElement.id, curSymbolElement.parentElement, currentSymbol);
      }
    }
    
  }

}