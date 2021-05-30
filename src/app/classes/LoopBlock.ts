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

  consoleLog: HTMLTextAreaElement;
  consoleInput: HTMLInputElement;
  alertC: AlertController;

  constructor() {
    this.SYMBOLS = [];
    this.variables = [];
    this.tempSymbols = [];

    this.alertC = new AlertController();
    this.consoleLog = document.getElementById("console") as HTMLTextAreaElement;
  }

  async showAlert(alertTitle: string, alertMsg: string) {
    const alert = await this.alertC.create({
      header: alertTitle,
      message: alertMsg,
      buttons: ["OK"]
    });
    await alert.present();
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
  }

  declareVariable(declareSymbol: Declare, pos: number) {
    this.variables.splice(pos, 0, declareSymbol.parseDeclareExp());
  }

  async showInputPrompt(inputSym: Input, alertTitle: string, varIndex: number, symIndex: number, vars: any[], arrayIndex?: number) {
    const alert = await this.alertC.create({
      header: alertTitle,
      inputs: [
        {
          name: "inputText",
          type: "text"
        }
      ],
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
          cssClass: "secondary",
          handler: data => { 
            inputSym.isInputEntered = false;
            this.isAnInputBlockRunning = false;
            this.validateLoopBlock(this.variables, this.isAnInputBlockRunning, ++symIndex, this.tempSymbols.length);
            console.log("> [LoopBlock] Input (canceled) Complete");
           }
        },
        {
          text: "OK",
          handler: data => {
            inputSym.inputData = data.inputText;
            inputSym.isInputEntered = false;
            inputSym.inputParsing(vars[varIndex], data.inputText, arrayIndex);
            this.consoleLog.value += "> " + data.inputText + "\n";
            this.isAnInputBlockRunning = false;
            this.validateLoopBlock(this.variables, this.isAnInputBlockRunning, ++symIndex, this.tempSymbols.length);
            console.log("> [LoopBlock] Input (entered) Complete");
          }
        }
      ]
    });
    alert.onDidDismiss().then(data => {
      inputSym.isInputEntered = false;
      this.isAnInputBlockRunning = false;
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
    this.isAnInputBlockRunning = isAnInputBlockRunning;

    for (let i = startIndex; i < this.tempSymbols.length; i++) {
      // DECLARE
      if (this.tempSymbols[i] instanceof Declare) {
        if (!this.isAnInputBlockRunning) {
          let declareSym = this.tempSymbols[i] as Declare;
          let vars = await declareSym.parseDeclareExp();
          for (let a = 0; a < vars.length; a++) {
            this.variables.splice(this.variables.length, 0, vars[a]);
          }
        }
        
      }

      // INPUT
      else if (this.tempSymbols[i] instanceof Input) {
        if (!this.isAnInputBlockRunning) {
          let inputSym = this.tempSymbols[i] as Input;
          let didInputRun = await inputSym.validateInputSymbol(this.variables, i, this.consoleLog);
          if (!didInputRun) {
            // TODO: this.isProgramRunning = false;
          } else {
            this.consoleLog.className = "noerrorAlert";
            this.isAnInputBlockRunning = true;
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

      // PROCESS
      else if (this.tempSymbols[i] instanceof Process) {
        if (!this.isAnInputBlockRunning) {
          let processSym = this.tempSymbols[i] as Process;
          let didProcessRun = await processSym.validateProcessSymbol(this.variables, this.consoleLog);
          if (!didProcessRun) {
            // TODO: this.isProgramRunning = false;
          } else {
            this.consoleLog.className = "noerrorAlert";
          }
        }
      }

      // OUTPUT
      else if (this.tempSymbols[i] instanceof Output) {
        if (!this.isAnInputBlockRunning) {
          let outputSym = this.tempSymbols[i] as Output;
          let didOutputRun = await outputSym.validateOutputSymbol(this.variables, this.consoleLog);
          if (!didOutputRun) {
            // TODO: this.isProgramRunning = false;
            this.consoleLog.className = "errorAlert";
          } else {
            this.consoleLog.className = "noerrorAlert";
          }
        } 
      }

      // COMMENT
      else if (this.tempSymbols[i] instanceof Comment) {
        break;
      }

      // IF CASE
      else if (this.tempSymbols[i] instanceof IfCase) {
        if (!this.isAnInputBlockRunning) {
          let ifSymbol = this.tempSymbols[i] as IfCase;
          let ifBlock = ifSymbol.parseIfCaseExpression(this.variables);
          if (ifBlock == null) {
            this.consoleLog.className = "errorAlert"; // Error Message Color Change Code Here
            this.consoleLog.value += "ERROR: Invalid Statement at 'IF-CASE' => Variable is not declared!" + "\n";
            break;
          } else {
            this.consoleLog.className = "noerrorAlert";
            // Add ifBlock symbols to a LoopBlock
            let ifLoopBlock = new LoopBlock();
            ifLoopBlock.SYMBOLS = ifBlock;
            ifLoopBlock.variables = this.variables;
            await ifLoopBlock.validateLoopBlock(this.variables, this.isAnInputBlockRunning, 0, ifLoopBlock.SYMBOLS.length);
          }
        }
        
      }

      // WHILE LOOP
      else if (this.tempSymbols[i] instanceof WhileLoop) {
        if (!this.isAnInputBlockRunning) {
          // TODO: Refactor While Loop Validation
          let whileBoolean: boolean;
          let whileSymbol = this.tempSymbols[i] as WhileLoop;
          let whileBlock = whileSymbol.parseWhileLoopExpression(this.variables);
          if (whileBlock == null) {
            // // TODO: Show Error in Console
            this.consoleLog.className = "errorAlert"; // Error Message Color Change Code Here
            this.consoleLog.value += "ERROR at 'WHILE-LOOP'" + "\n";
            break;
          } else {
            this.consoleLog.className = "noerrorAlert";
            if (whileBlock.length != 0) { whileBoolean = true; }
            else { whileBoolean = false; }
            let whileLoopBlock = new LoopBlock();
            whileLoopBlock.SYMBOLS = whileSymbol.trueLoopBlock;
            whileLoopBlock.variables = this.variables;
            console.log("While Loop Block: ", whileLoopBlock);

            while (whileBoolean) {
              // Validate whileBlock symbols only
              let x = await whileLoopBlock.validateLoopBlock(this.variables, this.isAnInputBlockRunning);
              // Check whileBoolean after validating While Loop Block symbols
              whileBlock = whileSymbol.parseWhileLoopExpression(x);
              if (whileBlock.length != 0) { whileBoolean = true; }
              else { whileBoolean = false; }
              console.log("While Loop pass: ", x);
            }
            break;
          }
        }
      }

      // FOR LOOP
      else if (this.tempSymbols[i] instanceof ForLoop) {
        if (!this.isAnInputBlockRunning) {
          // TODO: Refactor For Loop Validation
          let tempArrIndex: number;
          let forSymbol = this.tempSymbols[i] as ForLoop;
          let didForLoopRun = await forSymbol.validateForLoop(this.variables, this.consoleLog);
          if (didForLoopRun) {
            forSymbol.setCurrentValue(forSymbol.getStartValue());
            // Add forBlock symbols to a LoopBlock
            let forLoopBlock = new LoopBlock();
            forLoopBlock.SYMBOLS = forSymbol.trueLoopBlock;
            // Pass Variables to forLoopBlock
            forLoopBlock.variables = this.variables;
            console.log("For Loop Block: ", forLoopBlock);

            if (forSymbol.getStepDirection() === 'Increasing') {
              // Validation to prevent INFINITE LOOPS:
              if (forSymbol.getStartValue() < forSymbol.getEndValue()) {
                for (let tempVar = forSymbol.getStartValue();
                  tempVar <= forSymbol.getEndValue();
                  tempVar = forSymbol.iterateForStepDirection(tempVar)) {
                  // Validate forBlock symbols only
                  this.updateVariables(forSymbol.getForVariable(), tempArrIndex);
                  let x = await forLoopBlock.validateLoopBlock(this.variables, this.isAnInputBlockRunning, 0, forLoopBlock.SYMBOLS.length);
                  console.log("loop pass: ", x);
                } break;
              }
            } else if (forSymbol.getStepDirection() === 'Decreasing') {
              // Validation to prevent INFINITE LOOPS:
              if (forSymbol.getStartValue() > forSymbol.getEndValue()) {
                for (let tempVar = forSymbol.getStartValue();
                  tempVar >= forSymbol.getEndValue();
                  tempVar = forSymbol.iterateForStepDirection(tempVar)) {
                  // Validate forBlock symbols only
                  this.updateVariables(forSymbol.getForVariable(), tempArrIndex);
                  let x = await forLoopBlock.validateLoopBlock(this.variables, this.isAnInputBlockRunning, 0, forLoopBlock.SYMBOLS.length);
                  console.log("loop pass: ", x);
                } break;
              }
            } else { break; }
          } else {
            // TODO: Show Errors in Console
            this.consoleLog.className = "errorAlert"; // Error Message Color Change Code Here
            this.consoleLog.value += "ERROR at 'FOR-LOOP'" + "\n";
          }
        }

      }

      // DO WHILE LOOP
      else if (this.tempSymbols[i] instanceof DoWhileLoop) {
        if (!this.isAnInputBlockRunning) {
          // TODO: Refactor Do While Loop Validation
          let doWhileBoolean, doWhileIndex, doWhileSymCount;
          let doWhileSymbol = this.tempSymbols[i] as DoWhileLoop;
          doWhileIndex = i;

          let doWhileBlock = doWhileSymbol.parseDoWhileExpression(this.variables);
          if (doWhileBlock == null) {
            // TODO: Show Error in Console
            this.consoleLog.className = "errorAlert"; // Error Message Color Change Code Here
            this.consoleLog.value += "ERROR at 'DO WHILE LOOP'" + "\n";
            break;
          } else {
            doWhileSymCount = doWhileBlock.length;
            if (doWhileBlock.length != 0) { doWhileBoolean = true; }
            else { doWhileBoolean = false; }

            let doWhileLoopBlock = new LoopBlock();
            doWhileLoopBlock.SYMBOLS = doWhileSymbol.trueLoopBlock;
            doWhileLoopBlock.variables = this.variables;
            console.log("Do While Loop Block: ", doWhileLoopBlock);

            do {
              // Validate whileBlock symbols only [version 2]
              let x = await doWhileLoopBlock.validateLoopBlock(this.variables, this.isAnInputBlockRunning);
              // Check whileBoolean after validating While Loop Block symbols
              doWhileBlock = doWhileSymbol.parseDoWhileExpression(x);
              if (doWhileBlock.length != 0) { doWhileBoolean = true; }
              else { doWhileBoolean = false; }
              console.log("Do While Loop pass: " + doWhileBoolean, x);
            } while (doWhileBoolean);
            break;
          }
        }
        
      }
    }

    console.log("Variables (LoopBlock)", this.variables);
    console.log("Symbols (LoopBlock)", this.SYMBOLS);
    console.log("Temporary symbols (LoopBlock)", this.tempSymbols);
    return this.variables;
  }

  async validateSymbol(symbol: any, variables: any[], isAnInputBlockRunning: boolean, startIndex?: number, endIndex?: number) {
    if (symbol == null) {
      return;
    }
    for (let i=0; i<symbol.children.length; i++) {
      // Validate symbol according to their symbol type
      // this.validateSymbol(symbol.children[i]);
    }
  }

  // TODO: Add "prepareFlowchartForSaving()"
}
