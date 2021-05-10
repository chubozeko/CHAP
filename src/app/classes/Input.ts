import { AlertController } from "@ionic/angular";
import { Declare } from "./Declare";
import { Variable } from "./Variable";

export class Input {

  static s_name: string = 'Input';
  id: string = 's_input';

  variableName: string = '';
  inputExpression: string = '';
  inputPrompt: string = '';
  inputSymbol: any;
  inputData: any;
  isInputEntered: boolean = false;
  isAnInputBlockRunning: boolean;
  consoleLog: HTMLTextAreaElement;
  alertC: AlertController;
  inputPromptProps = {};

  constructor() {
    this.alertC = new AlertController();
  }

  createInputSymbol(inputSym: any) {
    this.inputExpression = inputSym.inputExpression;
    this.inputPrompt = inputSym.inputPrompt;
    this.inputSymbol = inputSym.inputSymbol;
    this.variableName = inputSym.variableName;
  }

  setVariableName(var_name: string) { this.variableName = var_name; }
  getVariableName() { return this.variableName; }

  setInputSymbol(symbol: any) { this.inputSymbol = symbol; }
  getInputSymbol() { return this.inputSymbol; }

  getInputExpression() {
    this.inputExpression = this.getVariableName();
    return this.inputExpression;
  }

  parseInputExp(variable: Variable) {
    this.inputPrompt = 'Enter a value of type ' + variable.getDataType() + ' for variable ' + variable.getName();
    return this.inputPrompt;
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
  }

  pseudoCode() { return '\tInput ' + this.getInputExpression() + '\n'; }

  cplusplusCode() {
    return '\tcin>>' + this.getVariableName() + ';\n';
  }

  getJavaCode() {
    return '\t\t' + this.getVariableName() + ' = System.console().readLine();\n';
  }

  async validateInputSymbol(variables: any[], isAnInputBlockRunning: boolean, symIndex: number, consoleLog: HTMLTextAreaElement) {
    let isVarDeclared = false, isVarAnArray = false;
    let tempArrIndex: number, varIndex, continueDebugIndex;
    this.consoleLog = consoleLog;
    this.isAnInputBlockRunning = isAnInputBlockRunning;
    for (let j = 0; j < variables.length; j++) {
      // Check if the input variable is an array
      if (variables[j].getIsArray()) {
        let tempVarName = this.getVariableName().split('[');
        if (
          tempVarName[0] == variables[j].getName()
        ) {
          isVarDeclared = true;
          isVarAnArray = true;
          varIndex = j;
          continueDebugIndex = varIndex;
          // Getting the index of the array
          let tempIn = tempVarName[1].replace(']', '');
          if (!isNaN(parseInt(tempIn))) {
            tempArrIndex = parseInt(tempIn);
          } else {
            for (let k = 0; k < variables.length; k++) {
              if (tempIn == variables[k].getName()) {
                tempArrIndex = variables[k].getValue();
              }
            }
          }
        }
      } else {
        if (
          this.getVariableName() == variables[j].getName()
        ) {
          isVarDeclared = true;
          varIndex = j;
        }
      }
    }
    if (!isVarDeclared) {
      // this.showAlert(
      //   "Invalid Statement at 'Input'",
      //   'Variable "' +
      //   this.tempSymbols[i].getVariableName() +
      //   '" is not declared!'
      // );
      return false;
    } else {
      if (!this.isInputEntered) {
        isAnInputBlockRunning = true;
        if (isVarAnArray) {
          // Display Input prompt
          this.isInputEntered = true;
          this.inputPromptProps = [
            this.parseInputExp(variables[varIndex]),
            varIndex,
            symIndex,
            variables,
            tempArrIndex
          ];
          return true;
          // this.showInputPrompt(this.parseInputExp(variables[varIndex]), varIndex, symIndex, variables, tempArrIndex);
        } else {
          // Display Input prompt
          this.isInputEntered = true;
          this.inputPromptProps = [
            this.parseInputExp(variables[varIndex]),
            varIndex,
            symIndex,
            variables,
            tempArrIndex
          ];
          return true;
          // this.showInputPrompt(this.parseInputExp(variables[varIndex]), varIndex, symIndex, variables, tempArrIndex);
        }
      }
    }
    // continue;
  }

  async showInputPrompt(alertTitle: string, varIndex: number, symIndex: number, vars: any[], arrayIndex?: number) {
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
            return true;
          }
        },
        {
          text: "OK",
          handler: data => {
            this.isInputEntered = false;
            this.inputParsing(vars[varIndex], data.inputText, arrayIndex);
            this.consoleLog.value += "> " + data.inputText + "\n";
            this.isAnInputBlockRunning = false;
            return true;
            // Return to Flowchart
            // this.validateFlowchart(++symIndex, this.tempSymbols.length);
          }
        }
      ]
    });

    alert.onDidDismiss().then(data => { return true; });
    await alert.present();
  }

  async showAlert(alertTitle: string, alertMsg: string) {
    const alert = await this.alertC.create({
      header: alertTitle,
      message: alertMsg,
      buttons: ["OK"]
    });
    await alert.present();
  }
}