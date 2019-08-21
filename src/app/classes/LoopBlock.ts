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

  async validateInput(varIndex: number, symIndex: number, arrayIndex?: number) {
    // Display Input prompt
    this.inputPromptStatement =
      Input.prototype.parseInputExp(this.variables[varIndex]) + "\n";
    this.isInputEntered = true;
    this.showInputPrompt(this.inputPromptStatement, varIndex, symIndex, arrayIndex);
  }

  async showInputPrompt(alertTitle: string, varIndex: number, symIndex: number, arrayIndex?: number) {
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
            console.log("Cancel " + data.inputText);
          }
        },
        {
          text: "OK",
          handler: data => {
            this.isInputEntered = false;
            this.inputParsing(this.variables[varIndex], data.inputText, arrayIndex);
            this.consoleLog = document.getElementById(
              "console"
            ) as HTMLTextAreaElement;
            this.consoleLog.value += "> " + data.inputText + "\n";
            this.isAnInputBlockRunning = false;
            // this.validateLoopBlock(this.variables);
            this.validateLoopBlock(this.variables, ++symIndex, this.tempSymbols.length);
          }
        }
      ]
    });

    alert.onDidDismiss().then(data => { });

    await alert.present();
  }

  inputParsing(var1: Variable, var_val: any, arrayIndex?: number) {
    // Checking the data type of an entered variable into the Console
    let var_value1: any;
    if (!isNaN(parseInt(var_val))) {
      var_value1 = parseInt(var_val);
    } else if (!isNaN(parseFloat(var_val))) {
      var_value1 = parseFloat(var_val);
    } else if (var_val == "true") {
      var_value1 = true;
    } else if (var_val == "false") {
      var_value1 = false;
    } else {
      var_value1 = var_val.toString();
    }

    if (var1.getIsArray()) {
      if (var1.getDataType() == "Integer" && typeof var_value1 == "number") {
        var1.variable[arrayIndex] = var_value1;
      } else if (var1.getDataType() == "Real" && typeof var_value1 == "number") {
        var1.variable[arrayIndex] = var_value1;
      } else if (
        var1.getDataType() == "String" &&
        typeof var_value1 == "string"
      ) {
        var1.variable[arrayIndex] = var_value1;
      } else if (
        var1.getDataType() == "Boolean" &&
        typeof var_value1 == "boolean"
      ) {
        var1.variable[arrayIndex] = var_value1;
      } else {
        this.showAlert("Invalid datatype entered!", "");
      }
    } else {
      if (var1.getDataType() == "Integer" && typeof var_value1 == "number") {
        var1.value = var_value1;
      } else if (var1.getDataType() == "Real" && typeof var_value1 == "number") {
        var1.value = var_value1;
      } else if (
        var1.getDataType() == "String" &&
        typeof var_value1 == "string"
      ) {
        var1.value = var_value1;
      } else if (
        var1.getDataType() == "Boolean" &&
        typeof var_value1 == "boolean"
      ) {
        var1.value = var_value1;
      } else {
        this.showAlert("Invalid datatype entered!", "");
      }
    }
    console.log(this.variables);
  }

  validateProcess(symbol: Process, varIndex: number, arrayIndex?: number) {
    if (this.variables[varIndex].getIsArray()) {
      this.variables[varIndex].variable[arrayIndex] = symbol.parseExpression(
        this.variables,
        this.variables[varIndex].getDataType()
      );
    } else {
      this.variables[varIndex].value = symbol.parseExpression(
        this.variables,
        this.variables[varIndex].getDataType()
      );
    }
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
        let vars = this.tempSymbols[i].parseDeclareExp();
        for (let a = 0; a < vars.length; a++) {
          this.variables.splice(this.variables.length, 0, vars[a]);
        }
      }

      // INPUT
      else if (this.tempSymbols[i] instanceof Input) {
        let isVarDeclared = false;
        let isVarAnArray = false;
        let tempArrIndex: number;
        for (let j = 0; j < this.variables.length; j++) {
          // Check if the input variable is an array
          if (this.variables[j].getIsArray()) {
            let tempVarName = this.tempSymbols[i].getVariableName().split('[');
            if (
              tempVarName[0] == this.variables[j].getName()
            ) {
              isVarDeclared = true;
              isVarAnArray = true;
              varIndex = j;
              this.continueDebugIndex = varIndex;
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
            }
          } else {
            if (
              this.tempSymbols[i].getVariableName() == this.variables[j].getName()
            ) {
              isVarDeclared = true;
              varIndex = j;
            }
          }

        }
        if (!isVarDeclared) {
          this.showAlert(
            "Invalid Statement at 'Input'",
            'Variable "' +
            this.tempSymbols[i].getVariableName() +
            '" is not declared!'
          );
        } else {
          if (!this.isInputEntered) {
            this.isAnInputBlockRunning = true;
            if (isVarAnArray) {
              this.validateInput(varIndex, i, tempArrIndex);
            } else {
              this.validateInput(varIndex, i);
            }
          }
        }
        continue;
      }

      // PROCESS
      else if (this.tempSymbols[i] instanceof Process) {
        let isVarDeclared = false;
        let isVarAnArray = false;
        let tempArrIndex: number;
        for (let j = 0; j < this.variables.length; j++) {
          if (this.variables[j].getIsArray()) {
            let tempVarName = this.tempSymbols[i].getVariableName().split('[');
            if (
              tempVarName[0] == this.variables[j].getName()
            ) {
              isVarDeclared = true;
              isVarAnArray = true;
              varIndex = j;
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
            }
          } else {
            if (
              this.tempSymbols[i].getVariableName() == this.variables[j].getName()
            ) {
              isVarDeclared = true;
              varIndex = j;
            }
          }
        }
        if (!isVarDeclared) {
          this.showAlert(
            "Invalid Statement at 'Process'",
            'Variable "' +
            this.tempSymbols[i].getVariableName() +
            '" is not declared!'
          );
        } else {
          if (!this.isAnInputBlockRunning) {
            if (isVarAnArray) {
              this.validateProcess(this.tempSymbols[i], varIndex, tempArrIndex);
            } else {
              this.validateProcess(this.tempSymbols[i], varIndex);
            }
          }
        }
      }

      // OUTPUT
      else if (this.tempSymbols[i] instanceof Output) {
        let isVarDeclared = false;
        let isVarAnArray = false;
        let tempArrIndex: number;
        let hasQuotes = 0, outputS = "";
        // Get output expression
        let outputStr: string = this.tempSymbols[i].getOutputExpression();
        let str = outputStr.split("&");
        for (let k = 0; k < str.length; k++) {
          let s1 = str[k].trim();
          if (s1.indexOf('"') == -1) {
            // Check if it is a variable
            for (let j = 0; j < this.variables.length; j++) {
              if (this.variables[j].getIsArray()) {
                let tempVarName = s1.split('[');
                if (
                  tempVarName[0] == this.variables[j].getName()
                ) {
                  isVarDeclared = true;
                  isVarAnArray = true;
                  varIndex = j;
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
                }
              } else {
                if (s1 == this.variables[j].getName()) {
                  isVarDeclared = true;
                  varIndex = j;
                }
              }
            }
          } else {
            hasQuotes++;
            this.outputStatement = outputStr;
          }
        }

        if (!isVarDeclared && hasQuotes == 0) {
          this.showAlert(
            "Invalid Statement at 'Output'",
            "Variable is not declared!"
          );
        } else if (isVarDeclared && hasQuotes == 0) {
          // Output variable
          let s1 = this.tempSymbols[i].getOutputExpression();
          let s2 = s1.split("&");
          for (let i = 0; i < s2.length; i++) {
            let str = s2[i].trim();
            for (let l = 0; l < this.variables.length; l++) {
              /* check if it is an array  */
              if (this.variables[l].getIsArray()) {
                let tempVarName = str.split('[');
                if (
                  tempVarName[0] == this.variables[l].getName()
                ) {
                  // Getting the index of the array
                  let tempIn = tempVarName[1].replace(']', '');
                  if (!isNaN(parseInt(tempIn))) {
                    tempArrIndex = parseInt(tempIn);
                  } else {
                    for (let r = 0; r < this.variables.length; r++) {
                      if (tempIn == this.variables[r].getName()) {
                        tempArrIndex = this.variables[r].getValue();
                      }
                    }
                  }
                  if (
                    this.variables[l].variable[tempArrIndex] == undefined &&
                    isNaN(this.variables[l].variable[tempArrIndex])
                  ) {
                    outputS = "";
                  } else outputS += this.variables[l].variable[tempArrIndex];
                }
              } else {
                if (str == this.variables[l].getName()) {
                  if (
                    this.variables[l].value == undefined &&
                    isNaN(this.variables[l].value)
                  ) {
                    outputS = "";
                  } else outputS += this.variables[l].value;
                }
              }
            }
          }
        } else if (hasQuotes > 0) {
          // Output String expression
          let s1 = this.tempSymbols[i].getOutputExpression();
          let s2 = s1.split("&");
          for (let i = 0; i < s2.length; i++) {
            let str = s2[i].trim();
            if (str.indexOf('"') != -1) {
              let str2 = str.replace(/\"/g, "");
              outputS += str2;
            } else {
              for (let l = 0; l < this.variables.length; l++) {
                if (!this.variables[l].getIsArray()) {
                  if (str == this.variables[l].getName()) {
                    if (
                      this.variables[l].value == undefined &&
                      isNaN(this.variables[l].value)
                    ) {
                      outputS = "";
                    } else outputS += this.variables[l].value;
                  }
                } else {
                  let tempVarName = str.split('[');
                  if (
                    tempVarName[0] == this.variables[l].getName()
                  ) {
                    // Getting the index of the array
                    let tempIn = tempVarName[1].replace(']', '');
                    if (!isNaN(parseInt(tempIn))) {
                      tempArrIndex = parseInt(tempIn);
                    } else {
                      for (let r = 0; r < this.variables.length; r++) {
                        if (tempIn == this.variables[r].getName()) {
                          tempArrIndex = this.variables[r].getValue();
                        }
                      }
                    }
                    if (
                      this.variables[l].variable[tempArrIndex] == undefined &&
                      isNaN(this.variables[l].variable[tempArrIndex])
                    ) {
                      outputS = "";
                    } else outputS += this.variables[l].variable[tempArrIndex];
                  }
                }
              }
            }
          }
        }
        if (this.isAnInputBlockRunning == false)
          this.consoleLog.value += outputS + "\n";
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
