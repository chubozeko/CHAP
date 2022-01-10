import { create, all } from 'mathjs'
const config = {};
const math = create(all, config);

export class DoWhileLoop {

  static s_name: string = 'Do';
  s_id: string = 's_do_while_loop';
  id: string = 's_do_while_loop';
  symbolIndex: number = -1;
  parentIndex: number = -1;
  isInTrueLoopBlock: boolean = true;

  doWhileExpression: string;
  doWhileSymbol: any;

  trueExpression: string;
  trueLoopBlock: any[];
  trueBlockId: string = 'doWhileTrueBlock';

  falseExpression: string;
  falseLoopBlock: any[];
  falseBlockId: string = '';

  constructor() {
    this.doWhileExpression = '';
    this.trueLoopBlock = [];
    this.falseLoopBlock = [];
  }

  createDoWhileLoopSymbol(doWhileSym: any) {
    this.doWhileExpression = doWhileSym.doWhileExpression;
    this.doWhileSymbol = doWhileSym.doWhileSymbol;
    this.trueExpression = doWhileSym.trueExpression;
    this.trueLoopBlock = doWhileSym.trueLoopBlock;
    this.falseExpression = doWhileSym.falseExpression;
    this.falseLoopBlock = doWhileSym.falseLoopBlock;
  }

  setDoWhileExpression(do_while_exp: string) { this.doWhileExpression = do_while_exp; }
  getExpression() { return this.doWhileExpression; }

  setDoWhileSymbol(doWhileSym: any) { this.doWhileSymbol = doWhileSym; }
  getDoWhileSymbol() { return this.doWhileSymbol; }

  parseDoWhileExpression(variables) {
    let opers = [], exps = [], exps1 = [];
    let op = "", oper1, oper2, result, j = 0, tempArrIndex;
    let isVarDeclared = false, isParsingStrings = false;

    // LOGICAL Operators: &&, ||, !
    if (
      this.doWhileExpression.indexOf("&&") != -1 ||
      this.doWhileExpression.indexOf("||") != -1 ||
      this.doWhileExpression.indexOf("!") != -1 ||
      this.doWhileExpression.indexOf("<") != -1 ||
      this.doWhileExpression.indexOf(">") != -1 ||
      this.doWhileExpression.indexOf("==") != -1 ||
      this.doWhileExpression.indexOf("<=") != -1 ||
      this.doWhileExpression.indexOf(">=") != -1 ||
      this.doWhileExpression.indexOf("!=") != -1 ||
      this.doWhileExpression.indexOf("+") != -1 ||
      this.doWhileExpression.indexOf("-") != -1 ||
      this.doWhileExpression.indexOf("*") != -1 ||
      this.doWhileExpression.indexOf("/") != -1 ||
      this.doWhileExpression.indexOf("%") != -1
    ) {
      // Split by logical operators
      exps1 = this.doWhileExpression.split(/[\&\|\!\>\<\=\+\-\*\/\%]+/g);
      for (let i = 0; i < exps1.length; i++) {
        exps[i] = exps1[i].trim();
      }
      // Store logical operators in "opers"
      opers = this.doWhileExpression.match(/[\&\|\!\>\<\=\+\-\*\/\%]+/g);
    } else {
      exps.splice(exps.length, 0, this.doWhileExpression.trim());
    }

    console.log("Do While exps: ", exps);
    console.log("Do While opers: ", opers);
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
              let a = v.split('.');
              if (a.length > 1) temp = parseFloat(v); else temp = parseInt(v);
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

    // Remove empty elements [""] from exps
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

  addSymbolToTrueBlock(symbol: any, position: number) { this.trueLoopBlock.splice(position, 0, symbol); }
  getSymbolFromTrueBlock(index: number) { return this.trueLoopBlock[index]; }
  removeSymbolFromTrueBlock(position: number) { this.trueLoopBlock.splice(position, 1); }

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

  pseudoCode() {
    let doWhileTrue = '';
    for (let i = 0; i < this.trueLoopBlock.length; i++) {
      const el = this.trueLoopBlock[i];
      doWhileTrue += '\t' + el.pseudoCode();
    }
    return '\tDo\n' + doWhileTrue + '\tWhile ' + this.getExpression() + '\n\tEnd Do While\n';
  }

  cplusplusCode() {
    let doWhileTrue = '';
    for (let i = 0; i < this.trueLoopBlock.length; i++) {
      const el = this.trueLoopBlock[i];
      doWhileTrue += '\t' + el.cplusplusCode();
    }
    return '\tdo { \n' + doWhileTrue + '\t} while (' + this.getExpression() + ');\n';
  }

  getJavaCode() {
    let doWhileTrue = '';
    for (let i = 0; i < this.trueLoopBlock.length; i++) {
      const el = this.trueLoopBlock[i];
      doWhileTrue += '\t' + el.getJavaCode();
    }
    return '\t\tdo { \n' + doWhileTrue + '\t\t} while (' + this.getExpression() + ');\n';
  }

}