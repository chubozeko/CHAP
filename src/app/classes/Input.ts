import { AlertController } from "@ionic/angular";
import { Declare } from "./Declare";
import { Variable } from "./Variable";

export class Input {

  static s_name: string = 'Input';
  s_id: string = 's_input';
  id: string = 's_input';
  symbolIndex: number = -1;
  parentIndex: number = -1;
  isInTrueLoopBlock: boolean = true;

  variableName: string = '';
  inputExpression: string = 'Input';
  inputPrompt: string = '';
  inputSymbol: any;
  inputData: any;
  isInputEntered: boolean = false;
  isAnInputBlockRunning: boolean;
  chapConsole: HTMLDivElement;
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

  getExpression() {
    this.inputExpression = this.getVariableName();
    return this.inputExpression;
  }

  parseInputExp(variable: Variable) {
    this.inputPrompt = 'Enter a value of type ' + variable.getDataType() + ' for variable ' + variable.getName();
    return this.inputPrompt;
  }

  consoleLog(textColourClass, lineOutput) {
    this.chapConsole = document.getElementById("console") as HTMLDivElement;
    this.chapConsole.innerHTML += `<span class="` + textColourClass + `"> ` + lineOutput + "</span> \n";
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
        this.consoleLog("errorAlert", "ERROR CODE I-02: Invalid Data Type Entered at 'INPUT'.");
      }
    } else {
      if (var1.getDataType() == "Integer" && typeof var_value1 == "number") {
        var1.setValue(var_value1);
      } else if (var1.getDataType() == "Real" && typeof var_value1 == "number") {
        var1.setValue(var_value1);
      } else if (
        var1.getDataType() == "String" &&
        typeof var_value1 == "string"
      ) {
        var1.setValue(var_value1);
      } else if (
        var1.getDataType() == "Boolean" &&
        typeof var_value1 == "boolean"
      ) {
        var1.setValue(var_value1);
      } else {
        if ((var1.getDataType() != "Integer" && typeof var_value1 != "number" ) || 
          (var1.getDataType() != "Real" && typeof var_value1 != "number") || 
          (var1.getDataType() != "String" && typeof var_value1 != "string") || 
          (var1.getDataType() != "Boolean" && typeof var_value1 != "boolean" )) {
          // this.consoleLog("errorAlert", "ERROR CODE I-02: Invalid Data Type Entered at 'INPUT'.");
          this.consoleLog("errorWAlert", "WARNING CODE I-03: Invalid Data Type Entered at 'INPUT'.");
        } else {}
        
      }
    }

    return var1;
  }

  pseudoCode() { return '\tInput ' + this.getExpression() + '\n'; }

  cplusplusCode() {
    return '\tcin>>' + this.getVariableName() + ';\n';
  }

  getJavaCode() {
    return '\t\t' + this.getVariableName() + ' = System.console().readLine();\n';
  }

  public validateInputSymbol(variables: any[], symIndex: number) {
    let isVarDeclared = false, isVarAnArray = false;
    let tempArrIndex: number, varIndex, continueDebugIndex;
    for (let j = 0; j < variables.length; j++) {
      // Check if the input variable is an array
      if (variables[j].getIsArray()) {
        let tempVarName = this.getVariableName().split('[');
        if (tempVarName[0] == variables[j].getName()) {
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
        if (this.getVariableName() == variables[j].getName()) {
          isVarDeclared = true;
          varIndex = j;
        }
      }
    }
    if (!isVarDeclared) {
      this.consoleLog("errorAlert", "ERROR CODE I-01: Variable " + this.getVariableName() + " is not declared at 'INPUT'");
      return false;
    } else {
      // Show Input prompt
      if (!this.isInputEntered) {
        if (isVarAnArray) {
          this.isInputEntered = true;
          this.inputPromptProps = [
            this.parseInputExp(variables[varIndex]),
            varIndex,
            symIndex,
            variables,
            tempArrIndex
          ];
          return true;
        } else {
          this.isInputEntered = true;
          this.inputPromptProps = [
            this.parseInputExp(variables[varIndex]),
            varIndex,
            symIndex,
            variables,
            tempArrIndex
          ];
          return true;
        }
      }
    }
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