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
  isAnInputBlockRunning: boolean = false;
  outputStatement: string = "";
  continueDebugIndex: number = 0;

  consoleLog: HTMLTextAreaElement;
  consoleInput: HTMLInputElement;
  //alertC: AlertController;

  constructor(public alertC: AlertController) {
    this.SYMBOLS = [];
    this.variables = [];
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

  async showInputPrompt(inputSym: Input, alertTitle: string, varIndex: number, symIndex: number, vars: any[], arrayIndex?: number): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const alert = this.alertC.create({
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
            handler: data => { resolve(false); }
          },
          {
            text: "OK",
            handler: data => {
              inputSym.inputData = data.inputText;
              resolve(true);
              /*
              inputSym.isInputEntered = false;
              inputSym.inputParsing(vars[varIndex], data.inputText, arrayIndex);
              this.consoleLog.value += "> " + data.inputText + "\n";
              this.isAnInputBlockRunning = false;
              console.log("Input Prompt Showed.");
              // Return to Flowchart
              this.validateLoopBlock(this.variables, ++symIndex, this.tempSymbols.length);
              */
            }
          }
        ]
      }).then(alert => alert.present());
    });
  }

  async validateLoopBlock(variables: any[], startIndex?: number, endIndex?: number) {
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
    let varIndex = 0;

    for (let i = startIndex; i < this.tempSymbols.length; i++) {
      // DECLARE
      if (this.tempSymbols[i] instanceof Declare) {
        let declareSym = this.tempSymbols[i] as Declare;
        let vars = await declareSym.parseDeclareExp();
        for (let a = 0; a < vars.length; a++) {
          this.variables.splice(this.variables.length, 0, vars[a]);
        }
      }

      // INPUT
      else if (this.tempSymbols[i] instanceof Input) {
        let inputSym = this.tempSymbols[i] as Input;
        let didInputRun = await inputSym.validateInputSymbol(this.variables, this.isAnInputBlockRunning, i, this.consoleLog);
        if (!didInputRun) {
          this.showAlert(
            "Invalid Statement at 'Input'",
            'Variable "' +
            inputSym.getVariableName() +
            '" is not declared!'
          );
        } else {
          this.showInputPrompt(inputSym,
            inputSym.inputPromptProps[0],
            inputSym.inputPromptProps[1],
            inputSym.inputPromptProps[2],
            inputSym.inputPromptProps[3],
            inputSym.inputPromptProps[4])
            .then((res) => {
              if (res) {
                inputSym.isInputEntered = false;
                inputSym.inputParsing(this.variables[inputSym.inputPromptProps[1]], inputSym.inputData, inputSym.inputPromptProps[4]);
                this.consoleLog.value += "> " + inputSym.inputData + "\n";
                this.isAnInputBlockRunning = false;
                console.log("Input Prompt Completed.");
                // Return to Flowchart
                this.validateLoopBlock(this.variables, ++inputSym.inputPromptProps[2], this.tempSymbols.length);
              } else {
                inputSym.isInputEntered = false;
                // inputSym.inputParsing(this.variables[inputSym.inputPromptProps[1]], inputSym.inputData, inputSym.inputPromptProps[4]);
                this.consoleLog.value += "> -" + "\n";
                this.isAnInputBlockRunning = false;
                console.log("Input Prompt Completed.");
                // Return to Flowchart
                this.validateLoopBlock(this.variables, ++inputSym.inputPromptProps[2], this.tempSymbols.length);
              }
            });
        }
      }

      // PROCESS
      else if (this.tempSymbols[i] instanceof Process) {
        let processSym = this.tempSymbols[i] as Process;
        let didProcessRun = await processSym.validateProcessSymbol(this.variables, this.isAnInputBlockRunning);
        if (!didProcessRun) {
          this.showAlert(
            "Invalid Statement at 'Process'",
            'Variable "' +
            this.tempSymbols[i].getVariableName() +
            '" is not declared!'
          );
        }
      }

      // OUTPUT
      else if (this.tempSymbols[i] instanceof Output) {
        let outputSym = this.tempSymbols[i] as Output;
        let didOutputRun = await outputSym.validateOutputSymbol(this.variables, this.isAnInputBlockRunning, this.consoleLog);
        if (!didOutputRun) {
          this.showAlert(
            "Invalid Statement at 'Output'",
            "Variable is not declared!"
          );
        }
      }

      // COMMENT
      else if (this.tempSymbols[i] instanceof Comment) {
        break;
      }

      // IF CASE
      else if (this.tempSymbols[i] instanceof IfCase) {
        let ifBlock;
        let ifSymbol = new IfCase();
        ifSymbol = this.tempSymbols[i];
        ifBlock = ifSymbol.parseIfCaseExpression(this.variables);
        if (ifBlock == null) {
          this.showAlert(
            "Invalid Statement at 'If Case'",
            'Variable is not declared!'
          );
          break;
        } else {
          let ifCaseBlock = new LoopBlock(this.alertC);
          // Add ifBlock symbols to IfCaseBlock
          for (let v = 0; v < ifBlock.length; v++) {
            ifCaseBlock.SYMBOLS.splice(v, 0, ifBlock[v]);
          }
          // Pass Variables to IfCaseBlock
          for (let q = 0; q < this.variables.length; q++) {
            ifCaseBlock.variables.splice(q, 0, this.variables[q]);
          }
          console.log("If Case Block: ", ifCaseBlock);
          let x = await ifCaseBlock.validateLoopBlock(this.variables);
          console.log("if case passed: ", x);
        }
      }

      // WHILE LOOP
      else if (this.tempSymbols[i] instanceof WhileLoop) {
        let whileBoolean, whileBlock;
        let whileSymbol = new WhileLoop();
        whileSymbol = this.tempSymbols[i];
        whileBlock = whileSymbol.parseWhileLoopExpression(this.variables);
        if (whileBlock == null) {
          this.showAlert(
            "Invalid Statement at 'While Loop'",
            'Variable is not declared!'
          );
          break;
        } else {
          if (whileBlock.length != 0) { whileBoolean = true; }
          else { whileBoolean = false; }

          // Add whileBlock symbols to a LoopBlock
          let whileLoopBlock = new LoopBlock(this.alertC);
          for (let v = 0; v < whileSymbol.trueLoopBlock.length; v++) {
            whileLoopBlock.SYMBOLS.splice(v, 0, whileSymbol.trueLoopBlock[v]);
          }
          // Pass Variables to WhileLoopBlock
          for (let q = 0; q < this.variables.length; q++) {
            whileLoopBlock.variables.splice(q, 0, this.variables[q]);
          }

          console.log("Loop Block: ", whileLoopBlock);

          while (whileBoolean) {
            // Validate whileBlock symbols only
            let x = await whileLoopBlock.validateLoopBlock(this.variables);
            // Check whileBoolean after validating While Loop Block symbols
            whileBlock = whileSymbol.parseWhileLoopExpression(x);
            if (whileBlock.length != 0) { whileBoolean = true; }
            else { whileBoolean = false; }
            console.log("loop pass: ", x);
          }
          break;
        }

      }

      // FOR LOOP
      else if (this.tempSymbols[i] instanceof ForLoop) {
        let isVarDeclared = false;
        let isVarAnArray = false;
        let tempArrIndex: number;
        let forSymbol = new ForLoop();
        forSymbol = this.tempSymbols[i];

        for (let j = 0; j < this.variables.length; j++) {

          if (this.variables[j].getIsArray()) {
            let tempVarName = forSymbol.getVariableName().split('[');
            if (
              tempVarName[0] == this.variables[j].getName()
            ) {
              isVarDeclared = true;
              isVarAnArray = true;
              // Getting the index of the array
              let tempIn = tempVarName[1].replace(']', '');
              if (!isNaN(parseInt(tempIn))) {
                tempArrIndex = parseInt(tempIn);
              } else {
                for (let k = 0; k < this.variables.length; k++) {
                  if (tempIn == this.variables[k].getName()) {
                    tempArrIndex = this.variables[k].getValue();
                  }
                }
              }
              this.variables[j].variable[tempArrIndex] = forSymbol.getStartValue();
              forSymbol.setForVariable(this.variables[j], tempArrIndex);
            }
          } else

            if (
              forSymbol.getVariableName() == this.variables[j].getName()
            ) {
              this.variables[j].setValue(forSymbol.getStartValue());
              forSymbol.setForVariable(this.variables[j]);
              isVarDeclared = true;
            }
        }
        if (!isVarDeclared) {
          this.showAlert(
            "Invalid Statement at 'For Loop'",
            'Variable "' +
            forSymbol.getVariableName() +
            '" is not declared!'
          );
        } else {
          forSymbol.setCurrentValue(forSymbol.getStartValue());
          // Add forBlock symbols to a LoopBlock
          let forLoopBlock = new LoopBlock(this.alertC);
          for (let v = 0; v < forSymbol.trueLoopBlock.length; v++) {
            forLoopBlock.SYMBOLS.splice(v, 0, forSymbol.trueLoopBlock[v]);
          }
          // Pass Variables to forLoopBlock
          for (let q = 0; q < this.variables.length; q++) {
            forLoopBlock.variables.splice(q, 0, this.variables[q]);
          }
          console.log("Loop Block: ", forLoopBlock);

          if (forSymbol.getStepDirection() === 'Increasing') {
            // Validation to prevent INFINITE LOOPS:
            if (forSymbol.getStartValue() < forSymbol.getEndValue()) {
              for (let tempVar = forSymbol.getStartValue();
                tempVar <= forSymbol.getEndValue();
                tempVar = forSymbol.iterateForStepDirection(tempVar)) {
                // Validate forBlock symbols only
                this.updateVariables(forSymbol.getForVariable(), tempArrIndex);
                let x = await forLoopBlock.validateLoopBlock(this.variables);
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
                let x = await forLoopBlock.validateLoopBlock(this.variables);
                console.log("loop pass: ", x);
              } break;
            }
          } else { break; }
        }

      }

      // DO WHILE LOOP
      else if (this.tempSymbols[i] instanceof DoWhileLoop) {
        let doWhileBoolean, doWhileIndex, doWhileSymCount, doWhileBlock;
        let doWhileSymbol = new DoWhileLoop();
        doWhileSymbol = this.tempSymbols[i];
        doWhileIndex = i;

        doWhileBlock = doWhileSymbol.parseDoWhileExpression(this.variables);
        if (doWhileBlock == null) {
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
          let doWhileLoopBlock = new LoopBlock(this.alertC);
          for (let v = 0; v < doWhileSymbol.trueLoopBlock.length; v++) {
            doWhileLoopBlock.SYMBOLS.splice(v, 0, doWhileSymbol.trueLoopBlock[v]);
          }
          // Pass Variables to DoWhileLoopBlock
          for (let q = 0; q < this.variables.length; q++) {
            doWhileLoopBlock.variables.splice(q, 0, this.variables[q]);
          }

          console.log("Loop Block: ", doWhileLoopBlock);

          do {
            // Validate whileBlock symbols only [version 2]
            let x = await doWhileLoopBlock.validateLoopBlock(this.variables);
            // Check whileBoolean after validating While Loop Block symbols
            doWhileBlock = doWhileSymbol.parseDoWhileExpression(x);
            if (doWhileBlock.length != 0) { doWhileBoolean = true; }
            else { doWhileBoolean = false; }
            console.log("loop pass: " + doWhileBoolean, x);
          } while (doWhileBoolean);
          break;
        }
      }
    }

    console.log("Variables", this.variables);
    console.log("Symbols", this.SYMBOLS);
    console.log("Temporary symbols", this.tempSymbols);
    return this.variables;
  }
}
