import { create, all } from 'mathjs';
const config = {};
const math = create(all, config);

export class WhileLoop {

  static s_name: string = "While";
  id: string = "s_while_loop";
  symbolIndex: number = -1;
  parentIndex: number = -1;
  isInTrueLoopBlock: boolean = true;

  whileExpression: string = "";
  whileSymbol: any;

  trueExpression: string;
  trueLoopBlock: any[];
  trueBlockId: string = 'whileTrueBlock';

  falseExpression: string;
  falseLoopBlock: any[];
  falseBlockId: string = '';

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
    let isVarDeclared = false, isParsingStrings = false;

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

    console.log("While Loop exps: ", exps);
    console.log("While Loop opers: ", opers);
    // Check if it is a variable name & parse to desired data type
    for (let i = 0; i < exps.length; i++) {
      for (let j = 0; j < variables.length; j++) {
        if (variables[j].getIsArray()) {
          let tempVarName = exps[i].split('[');
          if (tempVarName[0] == variables[j].getName()) {
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
            exps.splice(i, 1, variables[j].variable[tempArrIndex]);
            /*
            if (variables[j].getDataType() == 'Integer') exps.splice(i, 1, parseInt(variables[j].variable[tempArrIndex]));
            else if (variables[j].getDataType() == 'Real') exps.splice(i, 1, parseFloat(variables[j].variable[tempArrIndex]));
            else if (variables[j].getDataType() == 'String') exps.splice(i, 1, variables[j].variable[tempArrIndex].toString());
            else if (variables[j].getDataType() == 'Boolean') {
              if (variables[j].variable[tempArrIndex] == "true") exps.splice(i, 1, true);
              if (variables[j].variable[tempArrIndex] == "false") exps.splice(i, 1, false);
            }
            */
          }
        } else {
          if (variables[j].getName() == exps[i]) {
            isVarDeclared = true;
            /*
            if (variables[j].getDataType() == 'Integer') exps.splice(i, 1, parseInt(variables[j].value));
            else if (variables[j].getDataType() == 'Real') exps.splice(i, 1, parseFloat(variables[j].value));
            else if (variables[j].getDataType() == 'String') exps.splice(i, 1, variables[j].value.toString());
            else if (variables[j].getDataType() == 'Boolean') {
              if (variables[j] == "true") exps.splice(i, 1, true);
              if (variables[j] == "false") exps.splice(i, 1, false);
            }
            */
            exps.splice(i, 1, variables[j].value);
          } else {
            /*
            let v = exps[i];
            let temp: any;
            if (!isNaN(parseInt(v)) || !isNaN(parseFloat(v))) {
              console.log("v = " + exps[i]);
              if (Number.isInteger(v)) temp = parseInt(v); else temp = parseFloat(v);
              // let a = v.split('.');
              // if (a.length > 1) temp = parseFloat(v); else temp = parseInt(v);
            } else if (v == 'true') { temp = true; }
            else if (v == 'false') { temp = false; }
            else { temp = v.toString(); }
            exps.splice(i, 1, temp);
            */
          }
        }
      }
    }

    if (!isVarDeclared) return null;

    if (typeof exps[0] === 'string' || exps[0] instanceof String) {
      isParsingStrings = true;
      for (let i = 0; i < exps.length; i++) { 
        // if (exps[i] == "") exps.splice(i, 1);
        if (typeof exps[i] === 'string' || exps[i] instanceof String) {
          if (exps[i].indexOf('\"') != -1) {
            exps[i] = exps[i].replaceAll('\"', '');
          }
        }
      }
      // Calculate expression (for Strings)
      while (opers.length != 0) {
        // Checking operators in their order of Operations
        if (opers.indexOf('%') != -1) { j = opers.indexOf('%'); }
        else if (opers.indexOf('/') != -1) { j = opers.indexOf('/'); }
        else if (opers.indexOf('*') != -1) { j = opers.indexOf('*'); }
        else if (opers.indexOf('+') != -1) { j = opers.indexOf('+'); }
        else if (opers.indexOf('-') != -1) { j = opers.indexOf('-'); }
        else if (opers.indexOf('<') != -1) { j = opers.indexOf('<'); }
        else if (opers.indexOf('<=') != -1) { j = opers.indexOf('<='); }
        else if (opers.indexOf('>') != -1) { j = opers.indexOf('>'); }
        else if (opers.indexOf('>=') != -1) { j = opers.indexOf('>='); }
        else if (opers.indexOf('==') != -1) { j = opers.indexOf('=='); }
        else if (opers.indexOf('!=') != -1) { j = opers.indexOf('!='); }
        else if (opers.indexOf('&&') != -1) { j = opers.indexOf('&&'); }
        else if (opers.indexOf('||') != -1) { j = opers.indexOf('||'); }
        op = opers[j];
        oper1 = exps[j];
        oper2 = exps[j + 1];
        result = this.calculateStringExpression(oper1, oper2, op);
        opers.splice(j, 1);
        exps.splice(j, 2, result);
      }
    } else { isParsingStrings = false; }

    if (isParsingStrings) {
      if (exps[0] == true) return this.trueLoopBlock;
      else if (exps[0] == false) return this.falseLoopBlock;
    }

    // Remove empty elements [""] from parsedValues
    for (let i = 0; i < exps.length; i++) { if (exps[i] == "") exps.splice(i, 1); }
    // Create newExpression with parsed values instead of variable names
    let newExpression = "";
    for (let j = 0; j < opers.length; j++) {
      newExpression += exps[j] + opers[j];
    }
    newExpression += exps[exps.length - 1];
    // Parse && and || for mathjs
    if (newExpression.indexOf('&&') != -1 || newExpression.indexOf('||') != -1) {
      newExpression = newExpression.replace('&&', '&').replace('||', '|');
    }
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
      case "<": result = str1 < str2; break;
      case ">": result = str1 > str2; break;
      case "<=": result = str1 <= str2; break;
      case ">=": result = str1 >= str2; break;
      case "!=": result = str1 != str2; break;
      case "==": result = str1 == str2; break;
      case "&&": result = str1 && str2; break;
      case "||": result = str1 || str2; break;
      default: console.log("Invalid expression for Strings!"); break;
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
