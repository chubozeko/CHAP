import { Variable } from "./Variable";
import { create, all } from 'mathjs';
const config = {};
const math = create(all, config);

export class ForLoop {

  static s_name: string = 'For';
  id: string = 's_for_loop';

  forLoopExpression: string = '';
  forLoopSymbol: any;
  forLoopVariable: Variable;

  forVariableName: string = '';
  startValue: number;
  currentValue: number;
  endValue: number;
  stepDirection: string = '';
  stepValue: number = 1;

  trueExpression: string;
  trueLoopBlock: any[];

  falseExpression: string;
  falseLoopBlock: any[];

  constructor() {
    this.forVariableName = '';
    this.startValue = 0;
    this.endValue = 0;
    this.stepDirection = '';
    this.stepValue = 1;
    this.trueLoopBlock = [];
    this.falseLoopBlock = [];
    this.forLoopVariable = new Variable();
  }

  createForLoopSymbol(forSym: any) {
    this.forLoopExpression = forSym.forLoopExpression;
    this.forLoopSymbol = forSym.forLoopSymbol;
    this.trueExpression = forSym.trueExpression;
    this.trueLoopBlock = forSym.trueLoopBlock;
    this.falseExpression = forSym.falseExpression;
    this.falseLoopBlock = forSym.falseLoopBlock;
    this.forVariableName = forSym.forVariableName;
    this.startValue = forSym.startValue;
    this.endValue = forSym.endValue;
    this.stepDirection = forSym.stepDirection;
    this.stepValue = forSym.stepValue;
    this.trueLoopBlock = forSym.trueLoopBlock;
    this.falseLoopBlock = forSym.falseLoopBlock;
  }

  setVariableName(var_name: string) { this.forVariableName = var_name; }
  getVariableName() { return this.forVariableName; }

  setForVariable(variable: Variable, arrayIndex?: number) {
    this.forLoopVariable.setName(variable.getName());
    this.forLoopVariable.setIsArray(variable.getIsArray());
    this.forLoopVariable.setDataType(variable.getDataType());
    if (variable.getIsArray()) {
      this.forLoopVariable.setValue(variable.variable[arrayIndex]);
    } else {
      this.forLoopVariable.setValue(variable.getValue());
    }
  }
  getForVariable() {
    let newVar = new Variable();
    newVar.setName(this.forVariableName);
    newVar.setValue(this.currentValue);
    return newVar;
  }

  setStartValue(startVal: number) { this.startValue = startVal; }
  getStartValue() { return this.startValue; }

  setCurrentValue(currentVal: number) { this.currentValue = currentVal; }
  getCurrentValue() { return this.currentValue; }

  setEndValue(endVal: number) { this.endValue = endVal; }
  getEndValue() { return this.endValue; }

  setStepDirection(stepDir: string) { this.stepDirection = stepDir; }
  getStepDirection() { return this.stepDirection; }

  setStepValue(stepVal: number) { this.stepValue = stepVal; }
  getStepValue() { return this.stepValue; }

  setForExpression() {
    this.forLoopExpression = '';
    this.forLoopExpression += this.getVariableName() + ' = ' + this.getStartValue() + ' to ' + this.getEndValue();
    if (this.getStepDirection() == 'Increasing') {
      this.forLoopExpression += ' increment ' + this.getStepValue();
    } else {
      this.forLoopExpression += ' decrement ' + this.getStepValue();
    }
  }
  getForExpression() { return this.forLoopExpression; }

  setForSymbol(forSym: any) { this.forLoopSymbol = forSym; }
  getForSymbol() { return this.forLoopSymbol; }

  iterateForStepDirection(forVar) {
    if (this.getStepDirection() == 'Increasing') {
      this.setCurrentValue(forVar += this.getStepValue());
      return this.currentValue;
    } else if (this.getStepDirection() == 'Decreasing') {
      this.setCurrentValue(forVar -= this.getStepValue());
      return this.currentValue;
    } else {
      let consoleLog = document.getElementById("console") as HTMLTextAreaElement;
      consoleLog.value += "\nStep Direction of For Loop undefined!";
      return null;
    }
  }

  parseForLoopExpression(variables) {
    let opers = [], exps = [], exps1 = [];
    let op = "", oper1, oper2, result, j = 0, tempArrIndex;
    let isVarDeclared = false;

    // LOGICAL Operators: &&, ||, !
    if (
      this.forLoopExpression.indexOf("&&") != -1 ||
      this.forLoopExpression.indexOf("||") != -1 ||
      this.forLoopExpression.indexOf("!") != -1 ||
      this.forLoopExpression.indexOf("<") != -1 ||
      this.forLoopExpression.indexOf(">") != -1 ||
      this.forLoopExpression.indexOf("==") != -1 ||
      this.forLoopExpression.indexOf("<=") != -1 ||
      this.forLoopExpression.indexOf(">=") != -1 ||
      this.forLoopExpression.indexOf("!=") != -1 ||
      this.forLoopExpression.indexOf("+") != -1 ||
      this.forLoopExpression.indexOf("-") != -1 ||
      this.forLoopExpression.indexOf("*") != -1 ||
      this.forLoopExpression.indexOf("/") != -1 ||
      this.forLoopExpression.indexOf("%") != -1
    ) {
      // Split by logical operators
      exps1 = this.forLoopExpression.split(/[\&\|\!\>\<\=\+\-\*\/\%]+/g);
      for (let i = 0; i < exps1.length; i++) {
        exps[i] = exps1[i].trim();
      }
      // Store logical operators in "opers"
      opers = this.forLoopExpression.match(/[\&\|\!\>\<\=\+\-\*\/\%]+/g);
    } else {
      exps.splice(exps.length, 0, this.forLoopExpression.trim());
    }

    // Check if it is a variable name & parse to desired data type
    for (let i = 0; i < exps.length; i++) {
      for (let j = 0; j < variables.length; j++) {
        if (variables[j].getIsArray()) {
          let tempVarName = exps[i].split('[');
          if (
            tempVarName[0] == variables[j].getName()
          ) {
            isVarDeclared = true;
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
            if (variables[j].getDataType() == 'Integer') exps.splice(i, 1, parseInt(variables[j].variable[tempArrIndex]));
            else if (variables[j].getDataType() == 'Real') exps.splice(i, 1, parseFloat(variables[j].variable[tempArrIndex]));
            else if (variables[j].getDataType() == 'String') exps.splice(i, 1, variables[j].variable[tempArrIndex].toString());
            else if (variables[j].getDataType() == 'Boolean') {
              if (variables[j].variable[tempArrIndex] == "true") exps.splice(i, 1, true);
              if (variables[j].variable[tempArrIndex] == "false") exps.splice(i, 1, false);
            }
          }
        } else {
          if (variables[j].getName() == exps[i]) {
            isVarDeclared = true;
            if (variables[j].getDataType() == 'Integer') exps.splice(i, 1, parseInt(variables[j].value));
            else if (variables[j].getDataType() == 'Real') exps.splice(i, 1, parseFloat(variables[j].value));
            else if (variables[j].getDataType() == 'String') exps.splice(i, 1, variables[j].value.toString());
            else if (variables[j].getDataType() == 'Boolean') {
              if (variables[j] == "true") exps.splice(i, 1, true);
              if (variables[j] == "false") exps.splice(i, 1, false);
            }
          } else {
            let v = exps[i];
            let temp: any;
            if (!isNaN(parseInt(v)) || !isNaN(parseFloat(v))) {
              let a = v.split('.');
              if (a.length > 1) temp = parseFloat(v); else temp = parseInt(v);
            } else if (v == 'true') { temp = true; }
            else if (v == 'false') { temp = false; }
            else { temp = v.toString(); }
            exps.splice(i, 1, temp);
          }
        }
      }
    }

    if (!isVarDeclared) return null;
    // Remove empty elements [""] from parsedValues
    for (let i = 0; i < exps.length; i++) { if (isNaN(exps[i])) exps.splice(i, 1, ""); }
    // Create newExpression with parsed values instead of variable names
    let newExpression = "";
    for (let j = 0; j < opers.length; j++) {
      newExpression += exps[j] + opers[j];
    }
    newExpression += exps[exps.length - 1];
    // Evaluate the expression and return the result
    result = math.evaluate(newExpression);
    if (result == true) return this.trueLoopBlock;
    else if (result == false) return this.falseLoopBlock;
  }

  calculateIntegerExpression(num1: number, num2: number, operator: string) {
    let result: any;
    switch (operator) {
      case "+":
        result = num1 + num2;
        break;
      case "-":
        result = num1 - num2;
        break;
      case "*":
        result = num1 * num2;
        break;
      case "/":
        result = num1 / num2;
        break;
      case "%":
        result = num1 % num2;
        break;
      case "<":
        result = num1 < num2;
        break;
      case ">":
        result = num1 > num2;
        break;
      case "<=":
        result = num1 <= num2;
        break;
      case ">=":
        result = num1 >= num2;
        break;
      case "!=":
        result = num1 != num2;
        break;
      case "==":
        result = num1 == num2;
        break;
      case "&&":
        result = num1 && num2;
        break;
      case "||":
        result = num1 || num2;
        break;
      default:
        break;
    }
    if (typeof result == "number") return Math.floor(result);
    else return result;
  }

  calculateRealExpression(num1: number, num2: number, operator: string) {
    let result: any;
    switch (operator) {
      case "+":
        result = num1 + num2;
        break;
      case "-":
        result = num1 - num2;
        break;
      case "*":
        result = num1 * num2;
        break;
      case "/":
        result = num1 / num2;
        break;
      case "%":
        result = num1 % num2;
        break;
      case "<":
        result = num1 < num2;
        break;
      case ">":
        result = num1 > num2;
        break;
      case "<=":
        result = num1 <= num2;
        break;
      case ">=":
        result = num1 >= num2;
        break;
      case "!=":
        result = num1 != num2;
        break;
      case "==":
        result = num1 == num2;
        break;
      case "&&":
        result = num1 && num2;
        break;
      case "||":
        result = num1 || num2;
        break;
      default:
        break;
    }
    return result;
  }

  calculateBooleanExpression(bool1: boolean, bool2: boolean, operator: string) {
    let result: any;
    switch (operator) {
      case "!=":
        result = bool1 != bool2;
        break;
      case "==":
        result = bool1 == bool2;
        break;
      case "&&":
        result = bool1 && bool2;
        break;
      case "||":
        result = bool1 || bool2;
        break;
      default:
        console.log("Invalid expression for Booleans!");
        break;
    }
    return result;
  }

  calculateStringExpression(str1: string, str2: string, operator: string) {
    let result: any;
    switch (operator) {
      case "<":
        result = str1 < str2;
        break;
      case ">":
        result = str1 > str2;
        break;
      case "<=":
        result = str1 <= str2;
        break;
      case ">=":
        result = str1 >= str2;
        break;
      case "!=":
        result = str1 != str2;
        break;
      case "==":
        result = str1 == str2;
        break;
      case "&&":
        result = str1 && str2;
        break;
      case "||":
        result = str1 || str2;
        break;
      default:
        console.log("Invalid expression for Strings!");
        break;
    }
    return result;
  }

  addSymbolToTrueBlock(symbol: any, position: number) { this.trueLoopBlock.splice(position, 0, symbol); }
  getSymbolFromTrueBlock(index: number) { return this.trueLoopBlock[index]; }
  removeSymbolFromTrueBlock(position: number) { this.trueLoopBlock.splice(position, 1); }

  pseudoCode() {
    let forTrue = '';
    for (let i = 0; i < this.trueLoopBlock.length; i++) {
      const el = this.trueLoopBlock[i];
      forTrue += '\t' + el.pseudoCode();
    }
    return '\tFor ' + this.getForExpression() + ' Do\n' + forTrue + '\tEnd For\n';
  }

  cplusplusCode() {
    let forTrue = '', forExp = '';
    for (let i = 0; i < this.trueLoopBlock.length; i++) {
      const el = this.trueLoopBlock[i];
      forTrue += '\t' + el.cplusplusCode();
    }
    forExp += this.getVariableName() + '=' + this.getStartValue() + '; ';
    forExp += this.getVariableName() + '<' + this.getEndValue() + '; ';
    if (this.getStepDirection() == 'Increasing') {
      forExp += this.getVariableName() + '=' + this.getVariableName() + '+' + this.getStepValue();
    } else if (this.getStepDirection() == 'Decreasing') {
      forExp += this.getVariableName() + '=' + this.getVariableName() + '-' + this.getStepValue();
    }
    return '\tfor (' + forExp + '){\n' + forTrue + '\t} \n';
  }

  getJavaCode() {
    let forTrue = '', forExp = '';
    for (let i = 0; i < this.trueLoopBlock.length; i++) {
      const el = this.trueLoopBlock[i];
      forTrue += '\t' + el.getJavaCode();
    }
    forExp += this.getVariableName() + '=' + this.getStartValue() + '; ';
    forExp += this.getVariableName() + '<' + this.getEndValue() + '; ';
    if (this.getStepDirection() == 'Increasing') {
      forExp += this.getVariableName() + '=' + this.getVariableName() + '+' + this.getStepValue();
    } else if (this.getStepDirection() == 'Decreasing') {
      forExp += this.getVariableName() + '=' + this.getVariableName() + '-' + this.getStepValue();
    }
    return '\t\tfor (' + forExp + '){\n' + forTrue + '\t\t} \n';
  }

}