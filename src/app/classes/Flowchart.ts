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

export class Flowchart {
  SYMBOLS: any[];
  tempSymbols: any[];
  variables = { vars: [] };
  comments: string[];

  isProgramRunning: boolean = false;
  inputPromptStatement: string = "";
  isInputEntered: boolean;
  outputStatement: string = "";

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

  async showInputPrompt(alertTitle: string, varIndex: number, symIndex: number) {
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
            console.log("Ok " + data.inputText);
            this.inputParsing(this.variables.vars[varIndex], data.inputText);
            this.consoleLog = document.getElementById(
              "console"
            ) as HTMLTextAreaElement;
            this.consoleLog.value = "";
            this.validateFlowchart(++symIndex, this.tempSymbols.length);
          }
        }
      ]
    });

    alert.onDidDismiss().then(data => {
      console.log("hello");
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

  declareVariable(declareSymbol: Declare, pos: number) {
    this.variables.vars.splice(pos, 0, declareSymbol.parseDeclareExp());
  }

  inputParsing(var1: Variable, var_val: any) {
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

    console.log(this.variables);
  }

  async validateInput(varIndex: number, symIndex: number) {
    // Display Input prompt
    this.inputPromptStatement =
      Input.prototype.parseInputExp(this.variables.vars[varIndex]) + "\n";
    this.isInputEntered = true;
    this.showInputPrompt(this.inputPromptStatement, varIndex, symIndex);
  }

  validateProcess(symbol: Process, varIndex: number) {
    this.variables.vars[varIndex].value = symbol.parseExpression(
      this.variables.vars,
      this.variables.vars[varIndex].getDataType()
    );
  }

  async validateFlowchart(startIndex: number, endIndex: number) {
    for (let q = 0; q < this.SYMBOLS.length; q++) {
      this.tempSymbols.splice(q, 0, this.SYMBOLS[q]);
    }
    if (startIndex == 0) {
      this.variables.vars = [];
    }
    let varIndex = 0;

    for (let i = startIndex; i < endIndex; i++) {
      // START
      if (this.tempSymbols[i] instanceof Start) {
        console.log("Start Program");
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
        for (let j = 0; j < this.variables.vars.length; j++) {
          if (
            this.tempSymbols[i].getVariableName() == this.variables.vars[j].getName()
          ) {
            isVarDeclared = true;
            varIndex = j;
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
          console.log("input variable declared! carry on...");
          if (!this.isInputEntered) this.validateInput(varIndex, i);
        }
      }

      // PROCESS
      else if (this.tempSymbols[i] instanceof Process) {
        let isVarDeclared = false;
        for (let j = 0; j < this.variables.vars.length; j++) {
          if (
            this.tempSymbols[i].getVariableName() == this.variables.vars[j].getName()
          ) {
            isVarDeclared = true;
            varIndex = j;
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
          console.log("process variable declared. carry on...");
          this.validateProcess(this.tempSymbols[i], varIndex);
        }
      }

      // OUTPUT
      else if (this.tempSymbols[i] instanceof Output) {
        let isVarDeclared,
          hasQuotes = 0,
          outputS = "";
        let outputStr: string = this.tempSymbols[i].getOutputExpression();
        let str = outputStr.split("&");
        for (let k = 0; k < str.length; k++) {
          let s1 = str[k].trim();
          if (s1.indexOf('"') == -1) {
            console.log("No quotes");
            for (let j = 0; j < this.variables.vars.length; j++) {
              if (s1 == this.variables.vars[j].getName()) {
                isVarDeclared = true;
                varIndex = j;
              }
            }
          } else {
            hasQuotes++;
            this.outputStatement = outputStr;
            console.log("Quotes");
          }
        }

        if (!isVarDeclared && hasQuotes == 0) {
          this.showAlert(
            "Invalid Statement at 'Output'",
            "Variable is not declared!"
          );
        } else if (isVarDeclared && hasQuotes == 0) {
          // Output variable
          console.log("output variable declared! carry on...");
          let s1 = this.tempSymbols[i].getOutputExpression();
          let s2 = s1.split("&");
          for (let i = 0; i < s2.length; i++) {
            let str = s2[i].trim();
            for (let l = 0; l < this.variables.vars.length; l++) {
              if (str == this.variables.vars[l].getName()) {
                if (
                  this.variables.vars[l].value == undefined &&
                  isNaN(this.variables.vars[l].value)
                ) {
                  outputS = "";
                } else outputS += this.variables.vars[l].value;
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
                if (str == this.variables.vars[l].getName()) {
                  if (
                    this.variables.vars[l].value == undefined &&
                    isNaN(this.variables.vars[l].value)
                  ) {
                    outputS = "";
                  } else outputS += this.variables.vars[l].value;
                }
              }
            }
          }
        }

        this.consoleLog.value += outputS;
      }

      // COMMENT
      else if (this.tempSymbols[i] instanceof Comment) {
        break;
      }

      // IF CASE
      else if (this.tempSymbols[i] instanceof IfCase) {
        let ifBlock = this.tempSymbols[i].parseIfCaseExpression(this.variables.vars);
        // Add ifBlock symbols to Flowchart instead of IfCase
        this.tempSymbols.splice(i, 1);
        for (let k = 0; k < ifBlock.length; k++) {
          this.tempSymbols.splice(i + k, 0, ifBlock[k]);
        }
        --i;
      }

      // WHILE LOOP
      else if (this.tempSymbols[i] instanceof WhileLoop) {
        let whileBoolean, whileIndex, whileSymCount, endOfWhile, whileBlock;
        let whileSymbol = new WhileLoop();
        whileSymbol = this.tempSymbols[i];
        whileIndex = i;

        whileBlock = whileSymbol.parseWhileLoopExpression(this.variables.vars);
        whileSymCount = whileBlock.length;
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
          // Validate whileBlock symbols only [version 2]
          let x = whileLoopBlock.validateLoopBlock(); // this.variables

          // Check whileBoolean after validating While Loop Block symbols
          whileBlock = whileSymbol.parseWhileLoopExpression(x);
          if (whileBlock.length != 0) { whileBoolean = true; }
          else { whileBoolean = false; }
          console.log("loop pass: " + whileBoolean, x);
        }
        break;
      }

      // FOR LOOP
      else if (this.tempSymbols[i] instanceof ForLoop) {
        //this.tempSymbols[i].parseForLoopExp();
      }

      // DO WHILE LOOP
      else if (this.tempSymbols[i] instanceof DoWhileLoop) {
        //this.tempSymbols[i].parseDoWhileLoopExp();
        let doWhileBoolean, doWhileIndex, doWhileSymCount, doWhileBlock;
        let doWhileSymbol = new DoWhileLoop();
        doWhileSymbol = this.tempSymbols[i];
        doWhileIndex = i;

        doWhileBlock = doWhileSymbol.parseDoWhileExpression(this.variables.vars);
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
          let x = doWhileLoopBlock.validateLoopBlock(); // this.variables

          // Check whileBoolean after validating While Loop Block symbols
          doWhileBlock = doWhileSymbol.parseDoWhileExpression(x);
          if (doWhileBlock.length != 0) { doWhileBoolean = true; }
          else { doWhileBoolean = false; }
          console.log("loop pass: " + doWhileBoolean, x);
        } while (doWhileBoolean);
        break;
      }

      // STOP
      else if (this.tempSymbols[i] instanceof Stop) {
        console.log("End Program");
        this.isProgramRunning = false;
      }
    }

    console.log("Variables", this.variables);
    console.log("Symbols", this.SYMBOLS);
    console.log("Temporary symbols", this.tempSymbols);
  }
}
