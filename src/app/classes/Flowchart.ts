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
            inputSym.isInputEntered = false;
            this.isAnInputBlockRunning = false;
            this.validateFlowchart(++inputSym.inputPromptProps[2], this.tempSymbols.length);
            console.log("> Input (canceled) Complete");
          }
        },
        {
          text: "OK",
          handler: data => {
            inputSym.inputData = data.inputText;
            inputSym.isInputEntered = false;
            inputSym.inputParsing(vars[varIndex], data.inputText, arrayIndex);
            this.consoleLog.value += "> Input : " + data.inputText + "\n";
            this.isAnInputBlockRunning = false;
            this.validateFlowchart(++symIndex, this.tempSymbols.length);
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
        if (!this.isAnInputBlockRunning) {
          let declareSym = this.tempSymbols[i] as Declare;
          let vars = await declareSym.parseDeclareExp();
          for (let a = 0; a < vars.length; a++) {
            this.variables.vars.splice(this.variables.vars.length, 0, vars[a]);
          }
        }
      }

      // INPUT
      else if (this.tempSymbols[i] instanceof Input) {
        if (!this.isAnInputBlockRunning) {
          let inputSym = this.tempSymbols[i] as Input;
          let didInputRun = await inputSym.validateInputSymbol(this.variables.vars, i, this.consoleLog);
          if (!didInputRun) {
            // TODO: Show Error in Console
            this.showAlert(
              "Invalid Statement at 'Input'",
              'Variable "' +
              inputSym.getVariableName() +
              '" is not declared!'
            );
          } else {
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

      // PROCESS
      else if (this.tempSymbols[i] instanceof Process) {
        if (!this.isAnInputBlockRunning) {
          let processSym = this.tempSymbols[i] as Process;
          let didProcessRun = await processSym.validateProcessSymbol(this.variables.vars);
          if (!didProcessRun) {
            // TODO: Show Error in Console
            this.showAlert(
              "Invalid Statement at 'Process'",
              'Variable "' +
              this.tempSymbols[i].getVariableName() +
              '" is not declared!'
            );
          }
        }
      }

      // OUTPUT
      else if (this.tempSymbols[i] instanceof Output) {
        if (!this.isAnInputBlockRunning) {
          let outputSym = this.tempSymbols[i] as Output;
          let didOutputRun = await outputSym.validateOutputSymbol(this.variables.vars, this.consoleLog);
          if (!didOutputRun) {
            // TODO: Show Error in Console
           
            //  var error="ERROR: Invalid Statement at 'Output' => Variable is not declared!"+ "\n";
            //  this.consoleLog.value+=error.fontcolor("red");

            // this.consoleLog.className="errorAlert"; // Eror Message Color Change Code Here
             this.consoleLog.value += "ERROR: Invalid Statement at 'Output' => Variable is not declared!" + "\n";

            // this.showAlert(
            //   "Invalid Statement at 'Output'",
            //   "Variable is not declared!"
            // );
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
          let ifBlock = ifSymbol.parseIfCaseExpression(this.variables.vars);
          if (ifBlock == null) {
            // TODO: Show Error in Console
            this.showAlert(
              "Invalid Statement at 'If Case'",
              'Variable is not declared!'
            );
            break;
          } else {
            await ifBlock.validateLoopBlock(this.variables.vars, this.isAnInputBlockRunning, 0, ifBlock.SYMBOLS.length);
          }
          console.log("If Case Complete");
        }
      }

      // WHILE LOOP
      else if (this.tempSymbols[i] instanceof WhileLoop) {
        if (!this.isAnInputBlockRunning) {
          // TODO: Refactor While Loop Validation
          let whileBoolean: boolean;
          let whileSymbol = this.tempSymbols[i] as WhileLoop;
          let whileBlock = whileSymbol.parseWhileLoopExpression(this.variables.vars);
          if (whileBlock == null) {
            // TODO: Show Error in Console
            this.showAlert(
              "Invalid Statement at 'While Loop'",
              'Variable is not declared!'
            );
            break;
          } else {
            if (whileBlock.length != 0) { whileBoolean = true; }
            else { whileBoolean = false; }
            // Add whileBlock symbols to a LoopBlock
            let whileLoopBlock = new LoopBlock();
            for (let v = 0; v < whileSymbol.trueLoopBlock.length; v++) {
              whileLoopBlock.SYMBOLS.splice(v, 0, whileSymbol.trueLoopBlock[v]);
            }
            // Pass Variables to WhileLoopBlock
            for (let q = 0; q < this.variables.vars.length; q++) {
              whileLoopBlock.variables.splice(q, 0, this.variables.vars[q]);
            }
            console.log("While Loop Block: ", whileLoopBlock);

            while (whileBoolean) {
              // Validate whileBlock symbols only
              let x = await whileLoopBlock.validateLoopBlock(this.variables.vars, this.isAnInputBlockRunning, 0, whileLoopBlock.SYMBOLS.length);
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
          let isVarDeclared = false, isVarAnArray = false;
          let tempArrIndex: number;
          let forSymbol = this.tempSymbols[i] as ForLoop;

          for (let j = 0; j < this.variables.vars.length; j++) {
            if (this.variables.vars[j].getIsArray()) {
              let tempVarName = forSymbol.getVariableName().split('[');
              if (
                tempVarName[0] == this.variables.vars[j].getName()
              ) {
                isVarDeclared = true;
                isVarAnArray = true;
                // Getting the index of the array
                let tempIn = tempVarName[1].replace(']', '');
                if (!isNaN(parseInt(tempIn))) {
                  tempArrIndex = parseInt(tempIn);
                } else {
                  for (let k = 0; k < this.variables.vars.length; k++) {
                    if (tempIn == this.variables.vars[k].getName()) {
                      tempArrIndex = this.variables.vars[k].getValue();
                    }
                  }
                }
                this.variables.vars[j].variable[tempArrIndex] = forSymbol.getStartValue();
                forSymbol.setForVariable(this.variables.vars[j], tempArrIndex);
              }
            } else if (
              forSymbol.getVariableName() == this.variables.vars[j].getName()
            ) {
              this.variables.vars[j].setValue(forSymbol.getStartValue());
              forSymbol.setForVariable(this.variables.vars[j]);
              isVarDeclared = true;
            }
          }
          if (!isVarDeclared) {
            // TODO: Show Error in Console
            this.showAlert(
              "Invalid Statement at 'For Loop'",
              'Variable "' +
              forSymbol.getVariableName() +
              '" is not declared!'
            );
          } else {
            forSymbol.setCurrentValue(forSymbol.getStartValue());
            // Add forBlock symbols to a LoopBlock
            let forLoopBlock = new LoopBlock();
            for (let v = 0; v < forSymbol.trueLoopBlock.length; v++) {
              forLoopBlock.SYMBOLS.splice(v, 0, forSymbol.trueLoopBlock[v]);
            }
            // Pass Variables to forLoopBlock
            for (let q = 0; q < this.variables.vars.length; q++) {
              forLoopBlock.variables.splice(q, 0, this.variables.vars[q]);
            }
            console.log("For Loop Block: ", forLoopBlock);

            if (forSymbol.getStepDirection() === 'Increasing') {
              // Validation to prevent INFINITE LOOPS:
              if (forSymbol.getStartValue() < forSymbol.getEndValue()) {
                for (let tempVar = forSymbol.getStartValue();
                  tempVar <= forSymbol.getEndValue();
                  tempVar = forSymbol.iterateForStepDirection(tempVar)) {
                  // Validate forBlock symbols only
                  this.updateVariables(forSymbol.getForVariable(), tempArrIndex);
                  let x = await forLoopBlock.validateLoopBlock(this.variables.vars, this.isAnInputBlockRunning, 0, forLoopBlock.SYMBOLS.length);
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
                  let x = await forLoopBlock.validateLoopBlock(this.variables.vars, this.isAnInputBlockRunning, 0, forLoopBlock.SYMBOLS.length);
                  console.log("loop pass: ", x);
                } break;
              }
            } else { break; }
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

          let doWhileBlock = doWhileSymbol.parseDoWhileExpression(this.variables.vars);
          if (doWhileBlock == null) {
            // TODO: Show Error in Console
            this.showAlert(
              "Invalid Statement at 'Do While Loop'",
              'Variable is not declared!'
            );
            break;
          } else {
            doWhileSymCount = doWhileBlock.length;
            if (doWhileBlock.length != 0) { doWhileBoolean = true; }
            else { doWhileBoolean = false; }

            // Add doWhileBlock symbols to a LoopBlock
            let doWhileLoopBlock = new LoopBlock();
            for (let v = 0; v < doWhileSymbol.trueLoopBlock.length; v++) {
              doWhileLoopBlock.SYMBOLS.splice(v, 0, doWhileSymbol.trueLoopBlock[v]);
            }
            // Pass Variables to DoWhileLoopBlock
            for (let q = 0; q < this.variables.vars.length; q++) {
              doWhileLoopBlock.variables.splice(q, 0, this.variables.vars[q]);
            }
            console.log("Do While Loop Block: ", doWhileLoopBlock);

            do {
              // Validate whileBlock symbols only [version 2]
              let x = await doWhileLoopBlock.validateLoopBlock(this.variables.vars, this.isAnInputBlockRunning, 0, doWhileLoopBlock.SYMBOLS.length);
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
        for (let j = 0; j < ifSymbol.trueBlock.SYMBOLS.length; j++) {
          let tempS = ifSymbol.getSymbolFromTrueBlock(j);
          if (tempS instanceof Output) {
            let tempX = tempS.getOutputExpression() as string;
            let y = tempX.replace(/\"/g, "`");
            tempS.setOutputExpression(y);
          }
        }
        for (let j = 0; j < ifSymbol.falseBlock.SYMBOLS.length; j++) {
          let tempS = ifSymbol.getSymbolFromFalseBlock(j);
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
