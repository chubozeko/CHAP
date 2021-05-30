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

  consoleLog: HTMLTextAreaElement;
  consoleInput: HTMLInputElement;
  //alertC: AlertController;

  constructor(public alertC: AlertController) {
    // let defaultSymbols = document.getElementsByClassName('symbols');
    // for (let i = 0; i < defaultSymbols.length; i++) {
    //   this.SYMBOLS.splice( i, 0, defaultSymbols[i] );
    // }
    let start = new Start();
    let stop = new Stop();
    this.SYMBOLS = [];
    this.variables.vars = [];
    this.tempSymbols = [];

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

  declareVariable(declareSymbol: Declare, pos: number) {
    this.variables.vars.splice(pos, 0, declareSymbol.parseDeclareExp());
  }

  async showInputPrompt(inputSym: Input, alertTitle: string, varIndex: number, symIndex: number, vars: any[], arrayIndex?: number) {
    const alert = await this.alertC.create({
     // header: alertTitle,
      message: '<label class="alertTitle"><b>'+alertTitle+'</b></label>',
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
            // inputSym.isInputEntered = false;
            // this.isAnInputBlockRunning = false;
            // this.validateFlowchart(++inputSym.inputPromptProps[2], this.tempSymbols.length);
            console.log("> Input (canceled) Complete");
          }
        },
        {
          text: "OK",
          handler: data => {
            inputSym.inputData = data.inputText;
            // inputSym.isInputEntered = false;
            inputSym.inputParsing(vars[varIndex], data.inputText, arrayIndex);
            this.consoleLog.value += "> Input: " + data.inputText + "\n";
            // this.isAnInputBlockRunning = false;
            // this.validateFlowchart(++symIndex, this.tempSymbols.length);
            console.log("> Input (entered) Complete");
          }
        }
      ]
    });
    alert.onDidDismiss().then(data => {
      inputSym.isInputEntered = false;
      this.isAnInputBlockRunning = false;
      this.validateFlowchart(++symIndex, this.tempSymbols.length);
      console.log("> Input (dismissed) Complete");
    });
    await alert.present();
  }

  async validateFlowchart(startIndex: number, endIndex: number) {
    if (startIndex == 0) {
      this.variables.vars = [];
      this.tempSymbols = [];
      for (let q = 0; q < this.SYMBOLS.length; q++) {
        this.tempSymbols.splice(q, 0, this.SYMBOLS[q]);
      }
    }

    for (let i = startIndex; i < endIndex; i++) {
      // START
      if (this.tempSymbols[i] instanceof Start) {
        this.isProgramRunning = true;
      }

      // DECLARE
      else if (this.tempSymbols[i] instanceof Declare) {
        if (this.isProgramRunning) {
          if (!this.isAnInputBlockRunning) {
            let declareSym = this.tempSymbols[i] as Declare;
            let vars = await declareSym.parseDeclareExp();
            for (let a = 0; a < vars.length; a++) {
              this.variables.vars.splice(this.variables.vars.length, 0, vars[a]);
            }
          }
        }
      }

      // INPUT
      else if (this.tempSymbols[i] instanceof Input) {
        if (this.isProgramRunning) {
          if (!this.isAnInputBlockRunning) {
            let inputSym = this.tempSymbols[i] as Input;
            let didInputRun = await inputSym.validateInputSymbol(this.variables.vars, i, this.consoleLog);
            if (!didInputRun) {
              this.isProgramRunning = false;
            } else {
              this.consoleLog.className = "noerrorAlert";
              this.isAnInputBlockRunning = true;
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
            let didProcessRun = await processSym.validateProcessSymbol(this.variables.vars, this.consoleLog);
            if (!didProcessRun) {
              this.isProgramRunning = false;
            } else {
              this.consoleLog.className = "noerrorAlert";
            }
          }
        }
        
      }

      // OUTPUT
      else if (this.tempSymbols[i] instanceof Output) {
        if (this.isProgramRunning) {
          if (!this.isAnInputBlockRunning) {
            let outputSym = this.tempSymbols[i] as Output;
            let didOutputRun = outputSym.validateOutputSymbol(this.variables.vars, this.consoleLog);
            if (!didOutputRun) {
              this.isProgramRunning = false;
              this.consoleLog.className = "errorAlert";
            } else {
              this.consoleLog.className = "noerrorAlert";
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
            // let ifBlock = await ifSymbol.validateIfCaseNode(this.variables.vars);
            let ifBlock = ifSymbol.parseIfCaseExpression(this.variables.vars);
            if (ifBlock == null) {
              this.consoleLog.className = "errorAlert"; // Error Message Color Change Code Here
              this.consoleLog.value += "ERROR: Invalid Statement at 'IF-CASE' => Variable is not declared!" + "\n";
              break;
            } else {
              this.consoleLog.className = "noerrorAlert";
              // Add ifBlock symbols to a LoopBlock
              let ifLoopBlock = new LoopBlock();
              ifLoopBlock.SYMBOLS = ifBlock;
              ifLoopBlock.variables = this.variables.vars;
              let props = await ifLoopBlock.validateLoopBlock(this.variables.vars, this.isAnInputBlockRunning, 0, ifLoopBlock.SYMBOLS.length);
              this.variables.vars = props.variables;
              this.isAnInputBlockRunning = props.isAnInputBlockRunning;
            }
            console.log("If Case Complete");
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
              // TODO: Show Error in Console
              this.consoleLog.className = "errorAlert"; // Error Message Color Change Code Here
              this.consoleLog.value += "ERROR at 'WHILE-LOOP'" + "\n";
              break;
            } else {
              this.consoleLog.className = "noerrorAlert";
              if (whileBlock.length != 0) { whileBoolean = true; }
              else { whileBoolean = false; }
              let whileLoopBlock = new LoopBlock();
              whileLoopBlock.SYMBOLS = whileSymbol.trueLoopBlock;
              whileLoopBlock.variables = this.variables.vars;
              console.log("While Loop Block: ", whileLoopBlock);
  
              while (whileBoolean) {
                let props = await whileLoopBlock.validateLoopBlock(this.variables.vars, this.isAnInputBlockRunning, 0, whileLoopBlock.SYMBOLS.length);
                // Check whileBoolean after validating While Loop Block symbols
                this.variables.vars = props.variables;
                this.isAnInputBlockRunning = props.isAnInputBlockRunning;
                whileBlock = whileSymbol.parseWhileLoopExpression(this.variables.vars);
                if (whileBlock.length != 0) { whileBoolean = true; }
                else { whileBoolean = false; }
                console.log("While Loop passed: ", this.variables.vars);
              }
              break;
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
            let didForLoopRun = await forSymbol.validateForLoop(this.variables.vars, this.consoleLog);
            if (didForLoopRun) {
              forSymbol.setCurrentValue(forSymbol.getStartValue());
              // Add forBlock symbols to a LoopBlock
              let forLoopBlock = new LoopBlock();
              forLoopBlock.SYMBOLS = forSymbol.trueLoopBlock;
              // Pass Variables to forLoopBlock
              forLoopBlock.variables = this.variables.vars;
              console.log("For Loop Block: ", forLoopBlock);

              if (forSymbol.getStepDirection() === 'Increasing') {
                // Validation to prevent INFINITE LOOPS:
                if (forSymbol.getStartValue() < forSymbol.getEndValue()) {
                  for (let tempVar = forSymbol.getStartValue();
                    tempVar <= forSymbol.getEndValue();
                    tempVar = forSymbol.iterateForStepDirection(tempVar)) {
                    // Validate forBlock symbols only
                    this.updateVariables(forSymbol.getForVariable(), tempArrIndex);
                    let props = await forLoopBlock.validateLoopBlock(this.variables.vars, this.isAnInputBlockRunning, 0, forLoopBlock.SYMBOLS.length);
                    this.variables.vars = props.variables;
                    this.isAnInputBlockRunning = props.isAnInputBlockRunning;
                    console.log("loop pass: ", props);
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
                    let props = await forLoopBlock.validateLoopBlock(this.variables.vars, this.isAnInputBlockRunning, 0, forLoopBlock.SYMBOLS.length);
                    this.variables.vars = props.variables;
                    this.isAnInputBlockRunning = props.isAnInputBlockRunning;
                    console.log("loop pass: ", props);
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
              // TODO: Show Error in Console
              this.consoleLog.className = "errorAlert"; // Error Message Color Change Code Here
              this.consoleLog.value += "ERROR at 'DO WHILE LOOP'" + "\n";
              break;
            } else {
              this.consoleLog.className = "noerrorAlert";
              doWhileSymCount = doWhileBlock.length;
              if (doWhileBlock.length != 0) { doWhileBoolean = true; }
              else { doWhileBoolean = false; }
              let doWhileLoopBlock = new LoopBlock();
              doWhileLoopBlock.SYMBOLS = doWhileSymbol.trueLoopBlock;
              doWhileLoopBlock.variables = this.variables.vars;
              console.log("Do While Loop Block: ", doWhileLoopBlock);
  
              do {
                let props = await doWhileLoopBlock.validateLoopBlock(this.variables.vars, this.isAnInputBlockRunning, 0, doWhileLoopBlock.SYMBOLS.length);
                // Check doWhileBoolean after validating Do While Loop Block symbols
                this.variables.vars = props.variables;
                this.isAnInputBlockRunning = props.isAnInputBlockRunning;
                doWhileBlock = doWhileSymbol.parseDoWhileExpression(this.variables.vars);
                if (doWhileBlock.length != 0) { doWhileBoolean = true; }
                else { doWhileBoolean = false; }
                console.log("Do While Loop pass: " + doWhileBoolean, props);
              } while (doWhileBoolean);
              break;
            }
          }
        }
        
      }

      // STOP
      else if (this.tempSymbols[i] instanceof Stop) {
        if (!this.isAnInputBlockRunning) {
          this.isProgramRunning = false;
        }
      }
    }

    console.log("Variables", this.variables);
    console.log("Symbols", this.SYMBOLS);
    console.log("Temporary symbols", this.tempSymbols);
    // this.isProgramRunning = false;
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
