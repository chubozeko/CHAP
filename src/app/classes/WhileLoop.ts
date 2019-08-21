import { create, all } from 'mathjs';
const config = {};
const math = create(all, config);

export class WhileLoop {

  static s_name: string = "While";
  id: string = "s_while_loop";

  whileExpression: string = "";
  whileSymbol: any;

  trueExpression: string;
  trueLoopBlock: any[];

  falseExpression: string;
  falseLoopBlock: any[];

  constructor() {
    this.whileExpression = "";
    this.trueLoopBlock = [];
    this.falseLoopBlock = [];
  }

  createWhileLoopSymbol(whileSym: any) {
    this.whileExpression = whileSym.whileExpression;
    this.whileSymbol = whileSym.whileSymbol;
    this.trueExpression = whileSym.trueExpression;
    this.trueLoopBlock = whileSym.trueLoopBlock;
    this.falseExpression = whileSym.falseExpression;
    this.falseLoopBlock = whileSym.falseLoopBlock;
  }

  setWhileExpression(while_exp: string) {
    this.whileExpression = while_exp;
  }
  getWhileExpression() {
    return this.whileExpression;
  }

  setWhileSymbol(whileSym: any) {
    this.whileSymbol = whileSym;
  }
  getWhileSymbol() {
    return this.whileSymbol;
  }

  parseWhileLoopExpression(variables) {
    let opers = [], exps = [], exps1 = [];
    let op = "", oper1, oper2, result, j = 0, tempArrIndex;
    let isVarDeclared = false;

    // LOGICAL Operators: &&, ||, !
    if (
      this.whileExpression.indexOf("&&") != -1 ||
      this.whileExpression.indexOf("||") != -1 ||
      this.whileExpression.indexOf("!") != -1 ||
      this.whileExpression.indexOf("<") != -1 ||
      this.whileExpression.indexOf(">") != -1 ||
      this.whileExpression.indexOf("==") != -1 ||
      this.whileExpression.indexOf("<=") != -1 ||
      this.whileExpression.indexOf(">=") != -1 ||
      this.whileExpression.indexOf("!=") != -1 ||
      this.whileExpression.indexOf("+") != -1 ||
      this.whileExpression.indexOf("-") != -1 ||
      this.whileExpression.indexOf("*") != -1 ||
      this.whileExpression.indexOf("/") != -1 ||
      this.whileExpression.indexOf("%") != -1
    ) {
      // Split by logical operators
      exps1 = this.whileExpression.split(/[\&\|\!\>\<\=\+\-\*\/\%]+/g);
      for (let i = 0; i < exps1.length; i++) { exps[i] = exps1[i].trim(); }
      // Store logical operators in "opers"
      opers = this.whileExpression.match(/[\&\|\!\>\<\=\+\-\*\/\%]+/g);
    } else {
      exps.splice(exps.length, 0, this.whileExpression.trim());
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

  addSymbolToTrueBlock(symbol: any, position: number) {
    this.trueLoopBlock.splice(position, 0, symbol);
  }
  getSymbolFromTrueBlock(index: number) {
    return this.trueLoopBlock[index];
  }
  removeSymbolFromTrueBlock(position: number) {
    this.trueLoopBlock.splice(position, 1);
  }

  pseudoCode() {
    let whiletrue = "";
    for (let i = 0; i < this.trueLoopBlock.length; i++) {
      const el = this.trueLoopBlock[i];
      whiletrue += "\t" + el.pseudoCode();
    }
    return (
      "\tWhile " +
      this.getWhileExpression() +
      " Do\n" +
      whiletrue +
      "\tEnd While\n"
    );
  }

  cplusplusCode() {
    let whiletrue = "";
    for (let i = 0; i < this.trueLoopBlock.length; i++) {
      const el = this.trueLoopBlock[i];
      whiletrue += "\t" + el.cplusplusCode();
    }
    return (
      "\twhile (" + this.getWhileExpression() + "){\n" + whiletrue + "\t} \n"
    );
  }

  getJavaCode() {
    let whiletrue = "";
    for (let i = 0; i < this.trueLoopBlock.length; i++) {
      const el = this.trueLoopBlock[i];
      whiletrue += "\t" + el.getJavaCode();
    }
    return (
      "\t\twhile (" + this.getWhileExpression() + "){\n" + whiletrue + "\t\t} \n"
    );
  }

}
