import { Start } from "./Start";
import { Stop } from "./Stop";
import { Declare } from "./Declare";
import { Process } from "./Process";
import { Output } from "./Output";
import { Input } from "./Input";
import { Comment } from "./Comment";
import { IfCase } from "./IfCase";
import { WhileLoop } from "./WhileLoop";
import { Variable } from "./Variable";
import { AlertController } from "@ionic/angular";
import { DoWhileLoop } from "./DoWhileLoop";
import { ForLoop } from "./ForLoop";
import { LoopBlock } from "./LoopBlock";
import { create, all } from 'mathjs';
import { LoopblockstateService } from "../loopblockstate.service";
const config = {};
const math = create(all, config);

export class Flowchart {
  SYMBOLS: any[];
  tempSymbols: any[];
  variables = { vars: [] };
  comments: string[];

  isProgramRunning: boolean = false;
  // inputPromptStatement: string = "";
  // isInputEntered: boolean = false;
  isAnInputBlockRunning: boolean = false;
  continueDebugIndex: number = 0;

  chapConsole: HTMLDivElement;
  consoleInput: HTMLInputElement;
  //alertC: AlertController;

  constructor(public alertC: AlertController, private loopBlockState: LoopblockstateService) {
    this.SYMBOLS = [];
    this.variables.vars = [];
    this.tempSymbols = [];

    this.chapConsole = document.getElementById("console") as HTMLDivElement;
  }

  addSymbolToFlowchart(symbol: any, position: number) {
    this.SYMBOLS.splice(position, 0, symbol);
  }

  removeSymbolFromFlowchart(position: number) {
    this.SYMBOLS.splice(position, 1);
  }

  getSymbolFromFlowchart(index: number) {
    return this.SYMBOLS[index];
  }

  clearFlowchart() {
    let start = new Start();
    let stop = new Stop();
    this.SYMBOLS = [start, stop];
  }

  displayFlowchartPseudoCode() {
    let pseudocode = "";
    pseudocode += new Start().pseudoCode();
    for (let i = 0; i < this.SYMBOLS.length; i++) {
      const syms = this.SYMBOLS[i];
      pseudocode = pseudocode + syms.pseudoCode();
    }
    pseudocode += new Stop().pseudoCode();
    return pseudocode;
  }

  displayCPlusPlusCode() {
    let cppcode = "";
    cppcode += new Start().cplusplusCode();
    for (let i = 0; i < this.SYMBOLS.length; i++) {
      const syms = this.SYMBOLS[i];
      cppcode = cppcode + syms.cplusplusCode();
    }
    cppcode += new Stop().cplusplusCode();
    return cppcode;
  }

  displayJavaCode() {
    let javaCode = "";
    javaCode += new Start().getJavaCode();
    for (let i = 0; i < this.SYMBOLS.length; i++) {
      const syms = this.SYMBOLS[i];
      javaCode = javaCode + syms.getJavaCode();
    }
    javaCode += new Stop().getJavaCode();
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
    for (let j = 0; j < this.variables.vars.length; j++) {
      if (variable.getIsArray()) {
        if (
          variable.getName() == this.variables.vars[j].getName()
        ) {
          this.variables.vars[j].variable[arrayIndex] = variable.getValue();
        }
      } else {
        if (
          variable.getName() == this.variables.vars[j].getName()
        ) {
          this.variables.vars[j].setValue(variable.getValue());
        }
      }
    }
  }

  findVariable(variable: Variable, arrayIndex?: number) : Variable {
    for (let j = 0; j < this.variables.vars.length; j++) {
      if (variable.getIsArray()) {
        if (
          variable.getName() == this.variables.vars[j].getName()
        ) {
          return this.variables.vars[j].variable[arrayIndex];
        }
      } else {
        if (
          variable.getName() == this.variables.vars[j].getName()
        ) {
          return this.variables.vars[j];
        }
      }
    }
  }

  declareVariable(declareSymbol: Declare, pos: number) {
    this.variables.vars.splice(pos, 0, declareSymbol.parseDeclareExp(this.variables.vars));
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
      this.validateFlowchart(++symIndex, this.tempSymbols.length, this.variables.vars);
      console.log("> Input (dismissed) Complete");
    });
    await alert.present();
  }

  async validateFlowchart(startIndex: number, endIndex: number, variables: any[]) {
    if (variables == null) {
      this.variables.vars = [];
      this.tempSymbols = [];
      for (let q = 0; q < this.SYMBOLS.length; q++) {
        this.tempSymbols.splice(q, 0, this.SYMBOLS[q]);
      }
      this.isProgramRunning = true;
      this.loopBlockState.isProgramRunning = this.isProgramRunning;
    } else {
      this.isProgramRunning = this.loopBlockState.isProgramRunning;
      this.isAnInputBlockRunning = this.loopBlockState.isAnInputBlockRunning;
      this.variables.vars = this.loopBlockState.variables;
    }

    for (let i = startIndex; i < endIndex; i++) {
      // DECLARE
      if (this.tempSymbols[i] instanceof Declare) {
        if (this.isProgramRunning) {
          if (!this.isAnInputBlockRunning) {
            let declareSym = this.tempSymbols[i] as Declare;
            this.variables.vars = await declareSym.parseDeclareExp(this.variables.vars);
          }
        }
      }

      // INPUT
      else if (this.tempSymbols[i] instanceof Input) {
        if (this.isProgramRunning) {
          if (!this.isAnInputBlockRunning) {
            let inputSym = this.tempSymbols[i] as Input;
            let didInputRun = await inputSym.validateInputSymbol(this.variables.vars, i);
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
              console.log("< Input Symbol Complete in FC");
            }
          }
        }
      }

      // PROCESS
      else if (this.tempSymbols[i] instanceof Process) {
        if (this.isProgramRunning) {
          if (!this.isAnInputBlockRunning) {
            let processSym = this.tempSymbols[i] as Process;
            let didProcessRun = await processSym.validateProcessSymbol(this.variables.vars, this.chapConsole);
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
            let didOutputRun = outputSym.validateOutputSymbol(this.variables.vars);
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
            let ifBlock = ifSymbol.parseIfCaseExpression(this.variables.vars);
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
              ifLoopBlock.variables = this.variables.vars;
              let props = await ifLoopBlock.validateLoopBlock(this.variables.vars, this.isAnInputBlockRunning, 0, ifLoopBlock.SYMBOLS.length);
              this.variables.vars = props.variables;
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
            let whileBlock = whileSymbol.parseWhileLoopExpression(this.variables.vars);
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
              whileLoopBlock.variables = this.variables.vars;
              console.log("While Loop Block: ", whileLoopBlock);
  
              while (whileBoolean) {
                let props = await whileLoopBlock.validateLoopBlock(this.variables.vars, this.isAnInputBlockRunning, 0, whileLoopBlock.SYMBOLS.length);
                // Check whileBoolean after validating While Loop Block symbols
                this.variables.vars = props.variables;
                this.isAnInputBlockRunning = props.isAnInputBlockRunning;
                if (this.isAnInputBlockRunning) {
                  // Store LoopBlock State (parentBlock, loopSymbolIndex)
                  this.loopBlockState.parentBlock = this;
                  this.loopBlockState.loopSymbolIndex = i;
                  this.loopBlockState.loopSymbolType = "WhileLoop";
                  console.log(" Skip this [Flowchart] While Loop since an Input symbol is running...");
                  break;
                }
                whileBlock = whileSymbol.parseWhileLoopExpression(this.variables.vars);
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
            let didForLoopRun = await forSymbol.validateForLoop(this.variables.vars, this.chapConsole);
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
                    let props = await forLoopBlock.validateLoopBlock(this.variables.vars, this.isAnInputBlockRunning, 0, forLoopBlock.SYMBOLS.length);
                    this.variables.vars = props.variables;
                    this.isAnInputBlockRunning = props.isAnInputBlockRunning;
                    if (this.isAnInputBlockRunning) {
                      // Store LoopBlock State (parentBlock, loopSymbolIndex)
                      this.loopBlockState.parentBlock = this;
                      this.loopBlockState.loopSymbolIndex = i;
                      this.loopBlockState.loopSymbolType = "ForLoop";
                      console.log(" Skip this [Flowchart] For Loop since an Input symbol is running...");
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
                    let props = await forLoopBlock.validateLoopBlock(this.variables.vars, this.isAnInputBlockRunning, 0, forLoopBlock.SYMBOLS.length);
                    this.variables.vars = props.variables;
                    this.isAnInputBlockRunning = props.isAnInputBlockRunning;
                    if (this.isAnInputBlockRunning) {
                      // Store LoopBlock State (parentBlock, loopSymbolIndex)
                      this.loopBlockState.parentBlock = this;
                      this.loopBlockState.loopSymbolIndex = i;
                      this.loopBlockState.loopSymbolType = "ForLoop";
                      console.log(" Skip this [Flowchart] For Loop since an Input symbol is running...");
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
            let doWhileBlock = doWhileSymbol.parseDoWhileExpression(this.variables.vars);
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
              doWhileLoopBlock.variables = this.variables.vars;
              this.loopBlockState.loopSymbolType = "DoWhileLoop";
              console.log("Do While Loop Block: ", doWhileLoopBlock);
              do {
                if (!this.loopBlockState.passDoWhile) {
                  this.loopBlockState.passDoWhile = true;
                  doWhileBlock = doWhileSymbol.parseDoWhileExpression(this.variables.vars);
                  if (doWhileBlock.length != 0) { doWhileBoolean = true; }
                  else { doWhileBoolean = false; }
                  continue;
                } else {
                  let props = await doWhileLoopBlock.validateLoopBlock(this.variables.vars, this.isAnInputBlockRunning, 0, doWhileLoopBlock.SYMBOLS.length);
                  // Check doWhileBoolean after validating Do While Loop Block symbols
                  this.variables.vars = props.variables;
                  this.isAnInputBlockRunning = props.isAnInputBlockRunning;
                  doWhileBlock = doWhileSymbol.parseDoWhileExpression(this.variables.vars);
                  if (doWhileBlock.length != 0) { doWhileBoolean = true; }
                  else { doWhileBoolean = false; }
                  if (this.isAnInputBlockRunning) {
                    // Store LoopBlock State (parentBlock, loopSymbolIndex)
                    this.loopBlockState.parentBlock = this;
                    this.loopBlockState.loopSymbolIndex = i;
                    this.loopBlockState.loopSymbolType = "DoWhileLoop";
                    console.log(" Skip this [Flowchart] Do While Loop since an Input symbol is running...");
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
    this.isProgramRunning = false;
  }

  updateLoopBlockState() {
    // Update Loop Block State (variables, isAnInputBlockRunning)
    this.loopBlockState.variables = this.variables.vars;
    this.loopBlockState.isAnInputBlockRunning = this.isAnInputBlockRunning;
    console.log("<== Loop Block State (from Flowchart) ==>", this.loopBlockState);
  }

  prepareFlowchartForSaving() {
    this.variables.vars = [];
    this.tempSymbols = [];
    for (let q = 0; q < this.SYMBOLS.length; q++) {
      this.tempSymbols.splice(q, 0, this.SYMBOLS[q]);
    }

    for (let i = 0; i < this.tempSymbols.length; i++) {
      // OUTPUT
      if (this.tempSymbols[i] instanceof Output) {
        let tempX = this.tempSymbols[i].getOutputExpression() as string;
        let y = tempX.replace(/\"/g, "`");
        console.log('old output', this.tempSymbols[i].getOutputExpression());
        this.tempSymbols[i].setOutputExpression(y);
        console.log('new output', this.tempSymbols[i].getOutputExpression());
      }
      // IF CASE
      else if (this.tempSymbols[i] instanceof IfCase) {
        let ifSymbol = new IfCase();
        ifSymbol = this.tempSymbols[i];
        for (let j = 0; j < ifSymbol.trueBlockSymbols.length; j++) {
          let tempS = ifSymbol.trueBlockSymbols[j];
          if (tempS instanceof Output) {
            let tempX = tempS.getOutputExpression() as string;
            let y = tempX.replace(/\"/g, "`");
            tempS.setOutputExpression(y);
          }
        }
        for (let j = 0; j < ifSymbol.falseBlockSymbols.length; j++) {
          let tempS = ifSymbol.falseBlockSymbols[j];
          if (tempS instanceof Output) {
            let tempX = tempS.getOutputExpression() as string;
            let y = tempX.replace(/\"/g, "`");
            tempS.setOutputExpression(y);
          }
        }
      }
      // WHILE LOOP
      else if (this.tempSymbols[i] instanceof WhileLoop) {
        let whileSymbol = new WhileLoop();
        whileSymbol = this.tempSymbols[i];
        for (let j = 0; j < whileSymbol.trueLoopBlock.length; j++) {
          let tempS = whileSymbol.getSymbolFromTrueBlock(j);
          if (tempS instanceof Output) {
            let tempX = tempS.getOutputExpression() as string;
            let y = tempX.replace(/\"/g, "`");
            tempS.setOutputExpression(y);
          }
        }
      }
      // FOR LOOP
      else if (this.tempSymbols[i] instanceof ForLoop) {
        let forSymbol = new ForLoop();
        forSymbol = this.tempSymbols[i];
        for (let j = 0; j < forSymbol.trueLoopBlock.length; j++) {
          let tempS = forSymbol.getSymbolFromTrueBlock(j);
          if (tempS instanceof Output) {
            let tempX = tempS.getOutputExpression() as string;
            let y = tempX.replace(/\"/g, "`");
            tempS.setOutputExpression(y);
          }
        }
      }
      // DO WHILE LOOP
      else if (this.tempSymbols[i] instanceof DoWhileLoop) {
        let doWhileSymbol = new DoWhileLoop();
        doWhileSymbol = this.tempSymbols[i];
        for (let j = 0; j < doWhileSymbol.trueLoopBlock.length; j++) {
          let tempS = doWhileSymbol.getSymbolFromTrueBlock(j);
          if (tempS instanceof Output) {
            let tempX = tempS.getOutputExpression() as string;
            let y = tempX.replace(/\"/g, "`");
            tempS.setOutputExpression(y);
          }
        }
      }
    }
  }
}
