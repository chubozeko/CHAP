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
  consoleLog: HTMLDivElement;
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
        // TODO: Show Error in Console
       // this.showAlert("Invalid datatype entered!", "");
       this.consoleLog.className="errorAlert"; // Eror Message Color Change Code Here
       this.consoleLog.innerHTML += "ERROR: Invalid Datatype Entered !" + "\n";
      }
    } else {
      if (var1.getDataType() == "Integer" && typeof var_value1 == "number") {
        var1.value = var_value1;
        this.consoleLog.className = "noerrorAlert";
      } else if (var1.getDataType() == "Real" && typeof var_value1 == "number") {
        var1.value = var_value1;
        this.consoleLog.className = "noerrorAlert";
      } else if (
        var1.getDataType() == "String" &&
        typeof var_value1 == "string"
      ) {
        var1.value = var_value1;
        this.consoleLog.className = "noerrorAlert";
      } else if (
        var1.getDataType() == "Boolean" &&
        typeof var_value1 == "boolean"
      ) {
        var1.value = var_value1;
        this.consoleLog.className = "noerrorAlert";
      } else{
       if((var1.getDataType()!="Integer" && typeof var_value1!="number" )|| (var1.getDataType() != "Real" && typeof var_value1 != "number") ||(var1.getDataType() != "String" &&
      typeof var_value1 != "string") ||( var1.getDataType() != "Boolean" && typeof var_value1 != "boolean" )) {
     
        // TODO: Show Error in Console
        //this.showAlert("Invalid datatype entered!", "");
        this.consoleLog.className="errorWAlert"; // Eror Message Color Change Code Here
        this.consoleLog.innerHTML += "WARNING: Invalid Datatype Entered !" + "\n";

        
      
      }else{
        
        //this.consoleLog.className = "noerrorAlert";
       
      }
     // this.consoleLog.className = "noerrorAlert";
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

  async validateInputSymbol(variables: any[], symIndex: number, consoleLog: HTMLDivElement) {
    let isVarDeclared = false, isVarAnArray = false;
    let tempArrIndex: number, varIndex, continueDebugIndex;
    this.consoleLog = consoleLog;
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
      this.consoleLog.className = "errorAlert";
      this.consoleLog.innerHTML += "ERROR CODE I-01: Invalid Statement at 'INPUT' => Variable" + 
        this.getVariableName() + " is not declared!" + "\n";
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