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
import { BORDER_STYLE } from "html2canvas/dist/types/css/property-descriptors/border-style";
import { borderLeftWidth } from "html2canvas/dist/types/css/property-descriptors/border-width";
const config = {};
const math = create(all, config);

export class Flowchart {
  SYMBOLS: any[];
  tempSymbols: any[];
  variables = { vars: [] };
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

  async validateInput(varIndex: number, symIndex: number, arrayIndex?: number) {
    // Display Input prompt
  
    this.inputPromptStatement =
      Input.prototype.parseInputExp(this.variables.vars[varIndex]) + "\n";
    this.isInputEntered = true;
    this.showInputPrompt(this.inputPromptStatement, varIndex, symIndex, arrayIndex);
  }
 // 
  async showInputPrompt(alertTitle: string, varIndex: number, symIndex: number, arrayIndex?: number) {
    //alert.getElementsByClassName();
    const alert = await this.alertC.create({
      cssClass: 'aalert_input',
     // header: '<h1>'+alertTitle+'</h1>',
      
     //
    
      message: '<label class="alertTitle"><b>'+alertTitle+'</b></label>',
      inputs: [
        {
          
          name: 'inputText',
                         
         placeholder: 'Enter Input Value To Here',
                  
                                     
                   type: 'text',
                 
          
        }
      ],
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
          cssClass: 'bgalertbtncancel',
          handler: data => {
            console.log("Cancel " + data.inputText);
          }
        },
        {
         
          cssClass: "primary",
          text: "OK",
          
          handler: data => {
            this.isInputEntered = false;
            this.inputParsing(this.variables.vars[varIndex], data.inputText, arrayIndex);
            this.consoleLog = document.getElementById(
              "console"
            ) as HTMLTextAreaElement;
            this.consoleLog.value += ">Input :" + data.inputText + "\n";
            this.isAnInputBlockRunning = false;
            this.validateFlowchart(++symIndex, this.tempSymbols.length);
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
    if (this.variables.vars[varIndex].getIsArray()) {
      this.variables.vars[varIndex].variable[arrayIndex] = symbol.parseExpression(
        this.variables.vars,
        this.variables.vars[varIndex].getDataType()
      );
    } else {
      this.variables.vars[varIndex].value = symbol.parseExpression(
        this.variables.vars,
        this.variables.vars[varIndex].getDataType()
      );
    }
  }

  async validateFlowchart(startIndex: number, endIndex: number) {
    if (startIndex == 0) {
      this.variables.vars = [];
      this.tempSymbols = [];
      for (let q = 0; q < this.SYMBOLS.length; q++) {
        this.tempSymbols.splice(q, 0, this.SYMBOLS[q]);
      }
    }
    let varIndex = 0;

    for (let i = startIndex; i < endIndex; i++) {
      // START
      if (this.tempSymbols[i] instanceof Start) {
        this.isProgramRunning = true;
      }

      // DECLARE
      else if (this.tempSymbols[i] instanceof Declare) {
        let vars = this.tempSymbols[i].parseDeclareExp();
        for (let a = 0; a < vars.length; a++) {
          this.variables.vars.splice(this.variables.vars.length, 0, vars[a]);
        }
      }

      // INPUT
      else if (this.tempSymbols[i] instanceof Input) {
        let isVarDeclared = false;
        let isVarAnArray = false;
        let tempArrIndex: number;
        for (let j = 0; j < this.variables.vars.length; j++) {
          // Check if the input variable is an array
          if (this.variables.vars[j].getIsArray()) {
            let tempVarName = this.tempSymbols[i].getVariableName().split('[');
            if (
              tempVarName[0] == this.variables.vars[j].getName()
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
                for (let k = 0; k < this.variables.vars.length; k++) {
                  if (tempIn == this.variables.vars[k].getName()) {
                    tempArrIndex = this.variables.vars[k].getValue();
                  }
                }
              }
            }
          } else {
            if (
              this.tempSymbols[i].getVariableName() == this.variables.vars[j].getName()
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
        for (let j = 0; j < this.variables.vars.length; j++) {
          if (this.variables.vars[j].getIsArray()) {
            let tempVarName = this.tempSymbols[i].getVariableName().split('[');
            if (
              tempVarName[0] == this.variables.vars[j].getName()
            ) {
              isVarDeclared = true;
              isVarAnArray = true;
              varIndex = j;
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
            }
          } else {
            if (
              this.tempSymbols[i].getVariableName() == this.variables.vars[j].getName()
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
        let hasQuotes = 0, outputS = "Output :";
        // Get output expression
        let outputStr: string = this.tempSymbols[i].getOutputExpression();
        let str = outputStr.split("&");
        for (let k = 0; k < str.length; k++) {
          let s1 = str[k].trim();
          if (s1.indexOf('"') == -1) {
            // Check if it is a variable
            for (let j = 0; j < this.variables.vars.length; j++) {
              if (this.variables.vars[j].getIsArray()) {
                let tempVarName = s1.split('[');
                if (
                  tempVarName[0] == this.variables.vars[j].getName()
                ) {
                  isVarDeclared = true;
                  isVarAnArray = true;
                  varIndex = j;
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
                }
              } else {
                if (s1 == this.variables.vars[j].getName()) {
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
            for (let l = 0; l < this.variables.vars.length; l++) {
              /* check if it is an array  */
              if (this.variables.vars[l].getIsArray()) {
                let tempVarName = str.split('[');
                if (
                  tempVarName[0] == this.variables.vars[l].getName()
                ) {
                  // Getting the index of the array
                  let tempIn = tempVarName[1].replace(']', '');
                  if (!isNaN(parseInt(tempIn))) {
                    tempArrIndex = parseInt(tempIn);
                  } else {
                    for (let r = 0; r < this.variables.vars.length; r++) {
                      if (tempIn == this.variables.vars[r].getName()) {
                        tempArrIndex = this.variables.vars[r].getValue();
                      }
                    }
                  }
                  if (
                    this.variables.vars[l].variable[tempArrIndex] == undefined &&
                    isNaN(this.variables.vars[l].variable[tempArrIndex])
                  ) {
                    outputS = "Output :";
                  } else outputS += this.variables.vars[l].variable[tempArrIndex];
                }
              } else {
                if (str == this.variables.vars[l].getName()) {
                  if (
                    this.variables.vars[l].value == undefined &&
                    isNaN(this.variables.vars[l].value)
                  ) {
                    outputS = "Output :";
                  } else outputS += this.variables.vars[l].value;
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
              for (let l = 0; l < this.variables.vars.length; l++) {
                if (!this.variables.vars[l].getIsArray()) {
                  if (str == this.variables.vars[l].getName()) {
                    if (
                      this.variables.vars[l].value == undefined &&
                      isNaN(this.variables.vars[l].value)
                    ) {
                      outputS = "Output :";
                    } else outputS += this.variables.vars[l].value;
                  }
                } else {
                  let tempVarName = str.split('[');
                  if (
                    tempVarName[0] == this.variables.vars[l].getName()
                  ) {
                    // Getting the index of the array
                    let tempIn = tempVarName[1].replace(']', '');
                    if (!isNaN(parseInt(tempIn))) {
                      tempArrIndex = parseInt(tempIn);
                    } else {
                      for (let r = 0; r < this.variables.vars.length; r++) {
                        if (tempIn == this.variables.vars[r].getName()) {
                          tempArrIndex = this.variables.vars[r].getValue();
                        }
                      }
                    }
                    if (
                      this.variables.vars[l].variable[tempArrIndex] == undefined &&
                      isNaN(this.variables.vars[l].variable[tempArrIndex])
                    ) {
                      outputS = "Output :";
                    } else outputS += this.variables.vars[l].variable[tempArrIndex];
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
        ifBlock = ifSymbol.parseIfCaseExpression(this.variables.vars);
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
          for (let q = 0; q < this.variables.vars.length; q++) {
            ifCaseBlock.variables.splice(q, 0, this.variables.vars[q]);
          }
          console.log("If Case Block: ", ifCaseBlock);
          let x = await ifCaseBlock.validateLoopBlock(this.variables.vars, 0, ifCaseBlock.SYMBOLS.length);
          console.log("if case passed: ", x);
        }
      }

      // WHILE LOOP
      else if (this.tempSymbols[i] instanceof WhileLoop) {
        let whileBoolean, whileBlock;
        let whileSymbol = new WhileLoop();
        whileSymbol = this.tempSymbols[i];
        whileBlock = whileSymbol.parseWhileLoopExpression(this.variables.vars);
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
          for (let q = 0; q < this.variables.vars.length; q++) {
            whileLoopBlock.variables.splice(q, 0, this.variables.vars[q]);
          }

          console.log("Loop Block: ", whileLoopBlock);

          while (whileBoolean) {
            // Validate whileBlock symbols only
            let x = await whileLoopBlock.validateLoopBlock(this.variables.vars, 0, whileLoopBlock.SYMBOLS.length);
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
          for (let q = 0; q < this.variables.vars.length; q++) {
            forLoopBlock.variables.splice(q, 0, this.variables.vars[q]);
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
                let x = await forLoopBlock.validateLoopBlock(this.variables.vars, 0, forLoopBlock.SYMBOLS.length);
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
                let x = await forLoopBlock.validateLoopBlock(this.variables.vars, 0, forLoopBlock.SYMBOLS.length);
                console.log("loop pass: ", x);
              } break;
            }
          } else {
             break; 
            }
        }

      }

      // DO WHILE LOOP
      else if (this.tempSymbols[i] instanceof DoWhileLoop) {
        let doWhileBoolean, doWhileIndex, doWhileSymCount, doWhileBlock;
        let doWhileSymbol = new DoWhileLoop();
        doWhileSymbol = this.tempSymbols[i];
        doWhileIndex = i;

        doWhileBlock = doWhileSymbol.parseDoWhileExpression(this.variables.vars);
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
          for (let q = 0; q < this.variables.vars.length; q++) {
            doWhileLoopBlock.variables.splice(q, 0, this.variables.vars[q]);
          }

          console.log("Loop Block: ", doWhileLoopBlock);

          do {
            // Validate whileBlock symbols only [version 2]
            let x = await doWhileLoopBlock.validateLoopBlock(this.variables.vars, 0, doWhileLoopBlock.SYMBOLS.length);
            // Check whileBoolean after validating While Loop Block symbols
            doWhileBlock = doWhileSymbol.parseDoWhileExpression(x);
            if (doWhileBlock.length != 0) { 
              doWhileBoolean = true; }
            else { 
              doWhileBoolean = false; 
            }
            console.log("loop pass: " + doWhileBoolean, x);
          } while (doWhileBoolean);
          break;
        }
      }

      // STOP
      else if (this.tempSymbols[i] instanceof Stop) {
        this.isProgramRunning = false;
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
        console.log("Output :"+ this.tempSymbols[i].getOutputExpression());
      }
      // IF CASE
      else if (this.tempSymbols[i] instanceof IfCase) {
        let ifSymbol = new IfCase();
        ifSymbol = this.tempSymbols[i];
        for (let j = 0; j < ifSymbol.trueBlockSymbols.length; j++) {
          let tempS = ifSymbol.getSymbolFromTrueBlock(j);
          if (tempS instanceof Output) {
            let tempX = tempS.getOutputExpression() as string;
            let y = tempX.replace( /\"/g, "`");
            tempS.setOutputExpression(y);
            console.log("Output :"+  tempS[i].getOutputExpression());
           
          }
        }
        for (let j = 0; j < ifSymbol.falseBlockSymbols.length; j++) {
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
