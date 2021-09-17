import { Declare } from "./Declare";
import { Process } from "./Process";
import { Output } from "./Output";
import { Input } from "./Input";
import { Comment } from "./Comment";
import { IfCase } from "./IfCase";
import { Variable } from "./Variable";
import { AlertController } from "@ionic/angular";
import { WhileLoop } from "./WhileLoop";
import { DoWhileLoop } from "./DoWhileLoop";
import { ForLoop } from "./ForLoop";
import { create, all } from 'mathjs'
import { LoopblockstateService } from "../loopblockstate.service";
import { Flowchart } from "./Flowchart";
const config = {};
const math = create(all, config);

export class LoopBlock {
  SYMBOLS: any[];
  tempSymbols: any[];
  variables: any[];
  comments: string[];

  isProgramRunning: boolean = false;
  inputPromptStatement: string = "";
  isInputEntered: boolean = false;
  isAnInputBlockRunning: boolean;
  outputStatement: string = "";
  continueDebugIndex: number = 0;

  chapConsole: HTMLDivElement;
  consoleInput: HTMLInputElement;
  alertC: AlertController;

  constructor(private loopBlockState: LoopblockstateService) {
    this.SYMBOLS = [];
    this.variables = [];
    this.tempSymbols = [];

    this.alertC = new AlertController();
    this.chapConsole = document.getElementById("console") as HTMLDivElement;
  }

  addSymbolToLoopBlock(symbol: any, position: number) {
    this.SYMBOLS.splice(position, 0, symbol);
  }

  removeSymbolFromLoopBlock(position: number) {
    this.SYMBOLS.splice(position, 1);
  }

  getSymbolFromLoopBlock(index: number) {
    return this.SYMBOLS[index];
  }

  displayLoopBlockPseudoCode() {
    let pseudocode = "";
    for (let i = 0; i < this.SYMBOLS.length; i++) {
      const syms = this.SYMBOLS[i];
      pseudocode = pseudocode + syms.pseudoCode();
    }
    return pseudocode;
  }

  displayCPlusPlusCode() {
    let cppcode = "";
    for (let i = 0; i < this.SYMBOLS.length; i++) {
      const syms = this.SYMBOLS[i];
      cppcode = cppcode + syms.cplusplusCode();
    }
    return cppcode;
  }

  displayJavaCode() {
    let javaCode = "";
    for (let i = 0; i < this.SYMBOLS.length; i++) {
      const syms = this.SYMBOLS[i];
      javaCode = javaCode + syms.getJavaCode();
    }
    return javaCode;
  }

  async showAlert(alertTitle: string, alertMsg: string) {
    const alert = await this.alertC.create({
      header: alertTitle,
      message: alertMsg,
      buttons: ["OK"]
    });
    await alert.present();
  }

  public consoleLog(textColourClass, lineOutput) {
    this.chapConsole = document.getElementById("console") as HTMLDivElement;
    this.chapConsole.innerHTML += `<span class="` + textColourClass + `"> ` + lineOutput + "</span> \n";
  }

  updateVariables(variable: Variable, arrayIndex?: number) {
    for (let j = 0; j < this.variables.length; j++) {
      if (variable.getIsArray()) {
        if (
          variable.getName() == this.variables[j].getName()
        ) {
          this.variables[j].variable[arrayIndex] = variable.getValue();
        }
      } else {
        if (
          variable.getName() == this.variables[j].getName()
        ) {
          this.variables[j].setValue(variable.getValue());
        }
      }
    }
    this.loopBlockState.variables = this.variables;
  }

  findVariable(variable: Variable, arrayIndex?: number) : Variable {
    for (let j = 0; j < this.variables.length; j++) {
      if (variable.getIsArray()) {
        if (
          variable.getName() == this.variables[j].getName()
        ) {
          return this.variables[j].variable[arrayIndex];
        }
      } else {
        if (
          variable.getName() == this.variables[j].getName()
        ) {
          return this.variables[j];
        }
      }
    }
  }

  declareVariable(declareSymbol: Declare, pos: number) {
    this.variables.splice(pos, 0, declareSymbol.parseDeclareExp());
  }

  async showInputPrompt(inputSym: Input, alertTitle: string, varIndex: number, symIndex: number, vars: any[], arrayIndex?: number) {
    const alert = await this.alertC.create({
     // header: alertTitle,
     message: '<label class="alertTitle"><b>'+alertTitle+'</b></label>',
     inputs: [
      {
        
        name: 'inputText',
                       
       placeholder: '❗ Enter Input Value To Here ❗',
                
                                   
                 type: 'text',
               
        
      }
     ],
     buttons: [
       {
         text: "Cancel",
         role: "cancel",
         cssClass: "secondary",
         handler: () => { 
           console.log("> Input (canceled) Complete");
         }
       },
       {
         text: "OK",
         handler: data => {
           inputSym.inputData = data.inputText;
           inputSym.inputParsing(vars[varIndex], data.inputText, arrayIndex);
           this.consoleLog("noerrorAlert", "> Input: " + data.inputText);
           console.log("> Input (entered) Complete");
         }
       }
     ]
   });
    alert.onDidDismiss().then(() => {
      inputSym.isInputEntered = false;
      this.isAnInputBlockRunning = false;
      this.loopBlockState.isAnInputBlockRunning = false;
      this.loopBlockState.isProgramRunning = true;
      this.validateLoopBlock(this.variables, this.isAnInputBlockRunning, ++symIndex, this.tempSymbols.length);
      console.log("> [LoopBlock] Input (dismissed) Complete");
    });
    await alert.present();
  }

  async validateLoopBlock(variables: any[], isAnInputBlockRunning: boolean, startIndex?: number, endIndex?: number) {
    if (startIndex == undefined) {
      this.variables = [];
      for (let q = 0; q < variables.length; q++) {
        this.variables.splice(q, 0, variables[q]);
      }
      this.tempSymbols = [];
      for (let q = 0; q < this.SYMBOLS.length; q++) {
        this.tempSymbols.splice(q, 0, this.SYMBOLS[q]);
      }
    } else {
      this.variables = [];
      this.tempSymbols = [];
      for (let q = 0; q < this.SYMBOLS.length; q++) {
        this.tempSymbols.splice(q, 0, this.SYMBOLS[q]);
      }
      for (let q = 0; q < variables.length; q++) {
        this.variables.splice(q, 0, variables[q]);
      }
    }
    this.isProgramRunning = this.loopBlockState.isProgramRunning;
    this.isAnInputBlockRunning = isAnInputBlockRunning;
    this.variables = variables;

    for (let i = startIndex; i < this.tempSymbols.length; i++) {
      // DECLARE
      if (this.tempSymbols[i] instanceof Declare) {
        if (this.isProgramRunning) {
          if (!this.isAnInputBlockRunning) {
            let declareSym = this.tempSymbols[i] as Declare;
            let vars = await declareSym.parseDeclareExp();
            for (let a = 0; a < vars.length; a++) {
              this.variables.splice(this.variables.length, 0, vars[a]);
            }
          }
        }
      }

      // INPUT
      else if (this.tempSymbols[i] instanceof Input) {
        if (this.isProgramRunning) {
          if (!this.isAnInputBlockRunning) {
            let inputSym = this.tempSymbols[i] as Input;
            let didInputRun = await inputSym.validateInputSymbol(this.variables, i);
            if (!didInputRun) {
              this.isProgramRunning = false;
              this.loopBlockState.isProgramRunning = this.isProgramRunning;
            } else {
              this.isAnInputBlockRunning = true;
              // Store Loop Block State (LoopBlock, inputSymbolIndex)
              this.loopBlockState.currentBlock = this;
              this.loopBlockState.inputSymbolIndex = i;
  
              this.showInputPrompt(inputSym,
                inputSym.inputPromptProps[0],
                inputSym.inputPromptProps[1],
                inputSym.inputPromptProps[2],
                inputSym.inputPromptProps[3],
                inputSym.inputPromptProps[4]);
              console.log("< Input Symbol Complete in LB");
            }
          }
        }
      }

      // PROCESS
      else if (this.tempSymbols[i] instanceof Process) {
        if (this.isProgramRunning) {
          if (!this.isAnInputBlockRunning) {
            let processSym = this.tempSymbols[i] as Process;
            let didProcessRun = await processSym.validateProcessSymbol(this.variables, this.chapConsole);
            if (!didProcessRun) {
              this.isProgramRunning = false;
              this.loopBlockState.isProgramRunning = this.isProgramRunning;
            } else {
            }
          }
        }
      }

      // OUTPUT
      else if (this.tempSymbols[i] instanceof Output) {
        if (this.isProgramRunning) {
          if (!this.isAnInputBlockRunning) {
            let outputSym = this.tempSymbols[i] as Output;
            let didOutputRun = await outputSym.validateOutputSymbol(this.variables);
            if (!didOutputRun) {
              this.isProgramRunning = false;
              this.loopBlockState.isProgramRunning = this.isProgramRunning;
            } else {
            }
          }
        }
      }

      // COMMENT
      else if (this.tempSymbols[i] instanceof Comment) {
        if (this.isProgramRunning) { break; }
      }

      // IF CASE
      else if (this.tempSymbols[i] instanceof IfCase) {
        if (this.isProgramRunning) {
          if (!this.isAnInputBlockRunning) {
            let ifSymbol = this.tempSymbols[i] as IfCase;
            let ifBlock = ifSymbol.parseIfCaseExpression(this.variables);
            if (ifBlock == null) {
              // TODO: Show If Case Errors in Console
              this.consoleLog("errorAlert", "ERROR CODE IF-F01: Invalid Statement at 'IF-CASE' => Variable is not declared!");
              this.isProgramRunning = false;
              this.loopBlockState.isProgramRunning = this.isProgramRunning;
              break;
            } else {
              // Add ifBlock symbols to a LoopBlock
              let ifLoopBlock = new LoopBlock(this.loopBlockState);
              ifLoopBlock.SYMBOLS = ifBlock;
              ifLoopBlock.variables = this.variables;
              let props = await ifLoopBlock.validateLoopBlock(this.variables, this.isAnInputBlockRunning, 0, ifLoopBlock.SYMBOLS.length);
              this.variables = props.variables;
              this.isAnInputBlockRunning = props.isAnInputBlockRunning;
              if (this.isAnInputBlockRunning) {
                // TODO: Store LoopBlock State (parentBlock, loopSymbolIndex)
                break;
              }
            }
          }
        }
      }

      // WHILE LOOP
      else if (this.tempSymbols[i] instanceof WhileLoop) {
        if (this.isProgramRunning) {
          if (!this.isAnInputBlockRunning) {
            let whileBoolean: boolean;
            let whileSymbol = this.tempSymbols[i] as WhileLoop;
            let whileBlock = whileSymbol.parseWhileLoopExpression(this.variables);
            if (whileBlock == null) {
              // TODO: Show While Loop Errors in Console
              this.consoleLog("errorAlert", "ERROR CODE WL-F01: Error at 'WHILE-LOOP'");
              this.isProgramRunning = false;
              this.loopBlockState.isProgramRunning = this.isProgramRunning;
              break;
            } else {
              if (whileBlock.length != 0) { whileBoolean = true; }
              else { whileBoolean = false; }
              let whileLoopBlock = new LoopBlock(this.loopBlockState);
              whileLoopBlock.SYMBOLS = whileSymbol.trueLoopBlock;
              whileLoopBlock.variables = this.variables;
              console.log("While Loop Block: ", whileLoopBlock);
  
              while (whileBoolean) {
                let props = await whileLoopBlock.validateLoopBlock(this.variables, this.isAnInputBlockRunning);
                // Check whileBoolean after validating While Loop Block symbols
                this.variables = props.variables;
                this.isAnInputBlockRunning = props.isAnInputBlockRunning;
                if (this.isAnInputBlockRunning) {
                  // Store LoopBlock State (parentBlock, loopSymbolIndex)
                  this.loopBlockState.parentBlock = this;
                  this.loopBlockState.loopSymbolIndex = i;
                  this.loopBlockState.loopSymbolType = "WhileLoop";
                  console.log(" Skip this [LoopBlock] While Loop since an Input symbol is running...");
                  break;
                }
                whileBlock = whileSymbol.parseWhileLoopExpression(this.variables);
                if (whileBlock.length != 0) { whileBoolean = true; }
                else { whileBoolean = false; }
                console.log("While Loop passed: ", props);
              }
            }
          }
        }
      }

      // FOR LOOP
      else if (this.tempSymbols[i] instanceof ForLoop) {
        if (this.isProgramRunning) {
          if (!this.isAnInputBlockRunning) {
            // TODO: Refactor For Loop Validation
            let tempArrIndex: number;
            let forSymbol = this.tempSymbols[i] as ForLoop;
            let didForLoopRun = await forSymbol.validateForLoop(this.variables, this.chapConsole);
            if (didForLoopRun) {
              forSymbol.setCurrentValue(forSymbol.forLoopVariable.getValue());
              // Add forBlock symbols to a LoopBlock
              let forLoopBlock = new LoopBlock(this.loopBlockState);
              forLoopBlock.SYMBOLS = forSymbol.trueLoopBlock;
              if (this.loopBlockState.forLoopVariable != null) {
                forSymbol.setCurrentValue(this.loopBlockState.forLoopVariable.getValue());
              } else {
                forSymbol.setCurrentValue(forSymbol.getStartValue());
              }
              console.log("For Loop Block: ", forLoopBlock);
  
              if (forSymbol.getStepDirection() === 'Increasing') {
                // Validation to prevent INFINITE LOOPS:
                if (forSymbol.getStartValue() < forSymbol.getEndValue()) {
                  while (forSymbol.getCurrentValue() <= forSymbol.getEndValue()) {
                    // Validate forBlock symbols only
                    this.updateVariables(forSymbol.getForVariable(), tempArrIndex);
                    this.loopBlockState.loopSymbolType = "ForLoop";
                    let props = await forLoopBlock.validateLoopBlock(this.variables, this.isAnInputBlockRunning, 0, forLoopBlock.SYMBOLS.length);
                    this.variables = props.variables;
                    this.isAnInputBlockRunning = props.isAnInputBlockRunning;
                    if (this.isAnInputBlockRunning) {
                      // Store LoopBlock State (parentBlock, loopSymbolIndex)
                      this.loopBlockState.parentBlock = this;
                      this.loopBlockState.loopSymbolIndex = i;
                      this.loopBlockState.loopSymbolType = "ForLoop";
                      console.log(" Skip this [LoopBlock] For Loop since an Input symbol is running...");
                      break;
                    }
                    forSymbol.setCurrentValue(forSymbol.getCurrentValue()+1);
                    console.log("loop pass: ", props);
                  }
                }
              } else if (forSymbol.getStepDirection() === 'Decreasing') {
                // Validation to prevent INFINITE LOOPS:
                if (forSymbol.getStartValue() > forSymbol.getEndValue()) {
                  while (forSymbol.getCurrentValue() >= forSymbol.getEndValue()) {
                    // Validate forBlock symbols only
                    this.updateVariables(forSymbol.getForVariable(), tempArrIndex);
                    this.loopBlockState.loopSymbolType = "ForLoop";
                    let props = await forLoopBlock.validateLoopBlock(this.variables, this.isAnInputBlockRunning, 0, forLoopBlock.SYMBOLS.length);
                    this.variables = props.variables;
                    this.isAnInputBlockRunning = props.isAnInputBlockRunning;
                    if (this.isAnInputBlockRunning) {
                      // Store LoopBlock State (parentBlock, loopSymbolIndex)
                      this.loopBlockState.parentBlock = this;
                      this.loopBlockState.loopSymbolIndex = i;
                      this.loopBlockState.loopSymbolType = "ForLoop";
                      console.log(" Skip this [LoopBlock] For Loop since an Input symbol is running...");
                      break;
                    }
                    forSymbol.setCurrentValue(forSymbol.getCurrentValue()-1);
                    console.log("loop pass: ", props);
                  }
                }
              } else { break; }
            } else {
              // TODO: Show For Loop Errors in Console
              this.consoleLog("errorAlert", "ERROR CODE FL-F01: Error at 'FOR-LOOP'");
              this.isProgramRunning = false;
              this.loopBlockState.isProgramRunning = this.isProgramRunning;
            }
          }
        }
      }

      // DO WHILE LOOP
      else if (this.tempSymbols[i] instanceof DoWhileLoop) {
        if (this.isProgramRunning) {
          if (!this.isAnInputBlockRunning) {
            let doWhileBoolean, doWhileIndex, doWhileSymCount;
            let doWhileSymbol = this.tempSymbols[i] as DoWhileLoop;
            doWhileIndex = i;
            let doWhileBlock = doWhileSymbol.parseDoWhileExpression(this.variables);
            if (doWhileBlock == null) {
              // TODO: Show Do While Loop Error in Console
              this.consoleLog("errorAlert", "ERROR CODE DW-F01:Error at 'DO WHILE LOOP'");
              this.isProgramRunning = false;
              this.loopBlockState.isProgramRunning = this.isProgramRunning;
              break;
            } else {
              doWhileSymCount = doWhileBlock.length;
              if (doWhileBlock.length != 0) { doWhileBoolean = true; }
              else { doWhileBoolean = false; }
              let doWhileLoopBlock = new LoopBlock(this.loopBlockState);
              doWhileLoopBlock.SYMBOLS = doWhileSymbol.trueLoopBlock;
              doWhileLoopBlock.variables = this.variables;
              this.loopBlockState.loopSymbolType = "DoWhileLoop";
              console.log("Do While Loop Block: ", doWhileLoopBlock);
              do {
                if (!this.loopBlockState.passDoWhile) {
                  this.loopBlockState.passDoWhile = true;
                  doWhileBlock = doWhileSymbol.parseDoWhileExpression(this.variables);
                  if (doWhileBlock.length != 0) { doWhileBoolean = true; }
                  else { doWhileBoolean = false; }
                  continue;
                } else {
                  let props = await doWhileLoopBlock.validateLoopBlock(this.variables, this.isAnInputBlockRunning);
                  // Check doWhileBoolean after validating While Loop Block symbols
                  this.variables = props.variables;
                  this.isAnInputBlockRunning = props.isAnInputBlockRunning;
                  doWhileBlock = doWhileSymbol.parseDoWhileExpression(this.variables);
                  if (doWhileBlock.length != 0) { doWhileBoolean = true; }
                  else { doWhileBoolean = false; }
                  if (this.isAnInputBlockRunning) {
                    // Store LoopBlock State (parentBlock, loopSymbolIndex)
                    this.loopBlockState.parentBlock = this;
                    this.loopBlockState.loopSymbolIndex = i;
                    this.loopBlockState.loopSymbolType = "DoWhileLoop";
                    console.log(" Skip this [LoopBlock] Do While Loop since an Input symbol is running...");
                    break;
                  }
                  console.log("Do While Loop pass: " + doWhileBoolean, props);
                }
              } while (doWhileBoolean);
            }
          }
        }
      }
    }

    this.updateLoopBlockState();
    return { variables: this.variables, isAnInputBlockRunning: this.isAnInputBlockRunning };
  }

  updateLoopBlockState() {
    // Update Loop Block State (variables, isAnInputBlockRunning)
    this.loopBlockState.variables = this.variables;
    this.loopBlockState.isAnInputBlockRunning = this.isAnInputBlockRunning;
    
    if (!this.loopBlockState.isAnInputBlockRunning) {
      // Resume (restart) Loop Block from parent Flowchart/LoopBlock [parentFlowchartLoopBlock.validateLoopBlock()]
      if (this.loopBlockState.parentBlock instanceof Flowchart) {
        if (this.loopBlockState.loopSymbolType == "DoWhileLoop")
          this.loopBlockState.passDoWhile = false;
        if (this.loopBlockState.loopSymbolType == "ForLoop") {
          let forLoop = this.loopBlockState.parentBlock.tempSymbols[this.loopBlockState.loopSymbolIndex] as ForLoop;
          this.loopBlockState.forLoopVariable = this.findVariable(forLoop.getForVariable());
          if (forLoop.getStepDirection() == 'Increasing') {
            this.loopBlockState.forLoopVariable.setValue(this.loopBlockState.forLoopVariable.getValue()+1);
          } else if (forLoop.getStepDirection() == 'Decreasing') {
            this.loopBlockState.forLoopVariable.setValue(this.loopBlockState.forLoopVariable.getValue()-1);
          }
          this.updateVariables(this.loopBlockState.forLoopVariable);
          this.loopBlockState.parentBlock.updateVariables(this.loopBlockState.forLoopVariable);
          console.log("Loop B var: " + this.loopBlockState.forLoopVariable.getValue());
        }
        this.loopBlockState.parentBlock.validateFlowchart(
          this.loopBlockState.loopSymbolIndex, 
          this.loopBlockState.parentBlock.tempSymbols.length,
          this.loopBlockState.variables);
      } else if (this.loopBlockState.parentBlock instanceof LoopBlock) {
        if (this.loopBlockState.loopSymbolType == "DoWhileLoop")
          this.loopBlockState.passDoWhile = false;
        if (this.loopBlockState.loopSymbolType == "ForLoop") {
          let forLoop = this.loopBlockState.parentBlock.tempSymbols[this.loopBlockState.loopSymbolIndex] as ForLoop;
          this.loopBlockState.forLoopVariable = this.findVariable(forLoop.getForVariable());
          if (forLoop.getStepDirection() == 'Increasing') {
            this.loopBlockState.forLoopVariable.setValue(this.loopBlockState.forLoopVariable.getValue()+1);
          } else if (forLoop.getStepDirection() == 'Decreasing') {
            this.loopBlockState.forLoopVariable.setValue(this.loopBlockState.forLoopVariable.getValue()-1);
          }
          this.updateVariables(this.loopBlockState.forLoopVariable);
          this.loopBlockState.parentBlock.updateVariables(this.loopBlockState.forLoopVariable);
        }
        this.loopBlockState.parentBlock.validateLoopBlock(
          this.loopBlockState.variables,
          this.loopBlockState.isAnInputBlockRunning,
          this.loopBlockState.loopSymbolIndex, 
          this.loopBlockState.parentBlock.tempSymbols.length);
      }
    }

    console.log("<== Loop Block State (from LoopBlock) ==>", this.loopBlockState);
  }

  // TODO: Add "prepareFlowchartForSaving()"
}
