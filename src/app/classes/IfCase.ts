import { create, all } from 'mathjs'
const config = {};
const math = create(all, config);

export class IfCase {

  static s_name: string = 'If';
  id: string = 's_if_case';

  ifStatement: string = '';
  ifcaseSymbol: any;

  trueExpression: string;
  trueBlockSymbols: any[];

  falseExpression: string;
  falseBlockSymbols: any[];

  constructor() {
    this.trueBlockSymbols = [];
    this.falseBlockSymbols = [];
  }

  createIfCaseSymbol(ifCaseSym: any) {
    this.ifStatement = ifCaseSym.ifStatement;
    this.ifcaseSymbol = ifCaseSym.ifcaseSymbol;
    this.trueExpression = ifCaseSym.trueExpression;
    this.trueBlockSymbols = ifCaseSym.trueBlockSymbols;
    this.falseExpression = ifCaseSym.falseExpression;
    this.falseBlockSymbols = ifCaseSym.falseBlockSymbols;
  }

  setIfStatement(if_exp: string) { this.ifStatement = if_exp; }
  getIfStatement() { return this.ifStatement; }

  setIfCaseSymbol(ifSym: any) { this.ifcaseSymbol = ifSym; }
  getIfCaseSymbol() { return this.ifcaseSymbol; }

  addSymbolToTrueBlock(symbol: any, position: number) { this.trueBlockSymbols.splice(position, 0, symbol); }
  getSymbolFromTrueBlock(index: number) { return this.trueBlockSymbols[index]; }
  removeSymbolFromTrueBlock(position: number) { this.trueBlockSymbols.splice(position, 1); }

  addSymbolToFalseBlock(symbol: any, position: number) { this.falseBlockSymbols.splice(position, 0, symbol); }
  getSymbolFromFalseBlock(index: number) { return this.falseBlockSymbols[index]; }
  removeSymbolFromFalseBlock(position: number) { this.falseBlockSymbols.splice(position, 1); }

  parseIfCaseExpression(variables: any[]) {
    let opers = [], parsedValues = [], exps = [], exps1 = [];
    let op = '', oper1, oper2, result, j = 0, tempArrIndex;
    let isVarDeclared = false;

    // LOGICAL Operators: &&, ||, !
    if ((this.ifStatement.indexOf('&&') != -1) || (this.ifStatement.indexOf('||') != -1) || (this.ifStatement.indexOf('!') != -1)
      || (this.ifStatement.indexOf('<') != -1) || (this.ifStatement.indexOf('>') != -1) || (this.ifStatement.indexOf('==') != -1)
      || (this.ifStatement.indexOf('<=') != -1) || (this.ifStatement.indexOf('>=') != -1) || (this.ifStatement.indexOf('!=') != -1)
      || (this.ifStatement.indexOf('+') != -1) || (this.ifStatement.indexOf('-') != -1) || (this.ifStatement.indexOf('*') != -1)
      || (this.ifStatement.indexOf('/') != -1) || (this.ifStatement.indexOf('%') != -1)) {
      // Split by logical operators
      exps1 = this.ifStatement.split(/[\&\|\!\>\<\=\+\-\*\/\%]+/g);
      for (let i = 0; i < exps1.length; i++) { exps[i] = exps1[i].trim(); }
      // Store logical operators in "opers"
      opers = this.ifStatement.match(/[\&\|\!\>\<\=\+\-\*\/\%]+/g);
    } else {
      exps.splice(exps.length, 0, this.ifStatement.trim());
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
    if (result == true) return this.trueBlockSymbols;
    else if (result == false) return this.falseBlockSymbols;
  }

  calculateIntegerExpression(num1: number, num2: number, operator: string) {
    let result: any;
    switch (operator) {
      case '+': result = num1 + num2; break;
      case '-': result = num1 - num2; break;
      case '*': result = num1 * num2; break;
      case '/': result = num1 / num2; break;
      case '%': result = num1 % num2; break;
      case '<': result = num1 < num2; break;
      case '>': result = num1 > num2; break;
      case '<=': result = num1 <= num2; break;
      case '>=': result = num1 >= num2; break;
      case '!=': result = num1 != num2; break;
      case '==': result = num1 == num2; break;
      case '&&': result = num1 && num2; break;
      case '||': result = num1 || num2; break;
      default: break;
    }
    if (typeof (result) == "number") return Math.floor(result);
    else return result;
  }

  calculateRealExpression(num1: number, num2: number, operator: string) {
    let result: any;
    switch (operator) {
      case '+': result = num1 + num2; break;
      case '-': result = num1 - num2; break;
      case '*': result = num1 * num2; break;
      case '/': result = num1 / num2; break;
      case '%': result = num1 % num2; break;
      case '<': result = num1 < num2; break;
      case '>': result = num1 > num2; break;
      case '<=': result = num1 <= num2; break;
      case '>=': result = num1 >= num2; break;
      case '!=': result = num1 != num2; break;
      case '==': result = num1 == num2; break;
      case '&&': result = num1 && num2; break;
      case '||': result = num1 || num2; break;
      default: break;
    }
    return result;
  }

  calculateBooleanExpression(bool1: boolean, bool2: boolean, operator: string) {
    let result: any;
    switch (operator) {
      case '!=': result = bool1 != bool2; break;
      case '==': result = bool1 == bool2; break;
      case '&&': result = bool1 && bool2; break;
      case '||': result = bool1 || bool2; break;
      default: console.log('Invalid expression for Booleans!'); break;
    }
    return result;
  }

  calculateStringExpression(str1: string, str2: string, operator: string) {
    let result: any;
    switch (operator) {
      case '<': result = str1 < str2; break;
      case '>': result = str1 > str2; break;
      case '<=': result = str1 <= str2; break;
      case '>=': result = str1 >= str2; break;
      case '!=': result = str1 != str2; break;
      case '==': result = str1 == str2; break;
      case '&&': result = str1 && str2; break;
      case '||': result = str1 || str2; break;
      default: console.log('Invalid expression for Strings!'); break;
    }
    return result;
  }

  pseudoCode() {
    let iftrue = '', iffalse = '';
    for (let i = 0; i < this.trueBlockSymbols.length; i++) {
      const el = this.trueBlockSymbols[i];
      iftrue += '\t' + el.pseudoCode();
    }
    for (let i = 0; i < this.falseBlockSymbols.length; i++) {
      const el = this.falseBlockSymbols[i];
      iffalse += '\t' + el.pseudoCode();
    }
    return '\tIf ' + this.getIfStatement() + ' Then\n' + iftrue + '\tElse\n' + iffalse + '\tEnd If\n';
  }

  cplusplusCode() {
    let iftrue = '', iffalse = '';
    for (let i = 0; i < this.trueBlockSymbols.length; i++) {
      const el = this.trueBlockSymbols[i];
      iftrue += '\t' + el.cplusplusCode();
    }
    for (let i = 0; i < this.falseBlockSymbols.length; i++) {
      const el = this.falseBlockSymbols[i];
      iffalse += '\t' + el.cplusplusCode();
    }
    return '\tif (' + this.getIfStatement() + '){\n' + iftrue + '\telse {\n' + iffalse + '\t} \n';
  }

  getJavaCode() {
    let iftrue = '', iffalse = '';
    for (let i = 0; i < this.trueBlockSymbols.length; i++) {
      const el = this.trueBlockSymbols[i];
      iftrue += '\t' + el.getJavaCode();
    }
    for (let i = 0; i < this.falseBlockSymbols.length; i++) {
      const el = this.falseBlockSymbols[i];
      iffalse += '\t' + el.getJavaCode();
    }
    return '\t\tif (' + this.getIfStatement() + '){\n' + iftrue + '\t\telse {\n' + iffalse + '\t\t} \n';
  }

}