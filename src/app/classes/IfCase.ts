import { create, all } from 'mathjs'
import { LoopBlock } from './LoopBlock';
const config = {};
const math = create(all, config);

export class IfCase {

  static s_name: string = 'If';
  id: string = 's_if_case';
  symbolIndex: number = -1;
  parentIndex: number = -1;
  isInTrueLoopBlock: boolean = true;

  ifStatement: string = '';
  ifcaseSymbol: any;

  trueExpression: string;
  trueBlockSymbols: any[];
  trueBlockId: string = 'ifTrueBlock';
  // trueBlock: LoopBlock;

  falseExpression: string;
  falseBlockSymbols: any[];
  falseBlockId: string = 'ifFalseBlock';
  // falseBlock: LoopBlock;

  // TREE STRUCTURE
  // node = {
  //   symbolNode: IfCase,
  //   trueNode: this.trueBlockSymbols,
  //   falseNode: LoopBlock
  // };

  constructor() {
    this.trueBlockSymbols = [];
    // this.trueBlock = new LoopBlock();
    // this.trueBlock.SYMBOLS = [];
    this.falseBlockSymbols = [];
    // this.falseBlock = new LoopBlock();
    // this.falseBlock.SYMBOLS = [];
    
  }

  createIfCaseSymbol(ifCaseSym: any) {
    this.ifStatement = ifCaseSym.ifStatement;
    this.ifcaseSymbol = ifCaseSym.ifcaseSymbol;
    this.trueExpression = ifCaseSym.trueExpression;
    this.trueBlockSymbols = ifCaseSym.trueBlockSymbols;
    // this.trueBlock.SYMBOLS = ifCaseSym.trueBlockSymbols;
    this.falseExpression = ifCaseSym.falseExpression;
    this.falseBlockSymbols = ifCaseSym.falseBlockSymbols;
    // this.falseBlock.SYMBOLS = ifCaseSym.falseBlockSymbols;
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

  // async validateIfCaseNode(variables: any[]) {
  //   this.parseIfCaseExpression(variables);
  //   let ifLoopBlock = new LoopBlock();
  //   ifLoopBlock.SYMBOLS = ifBlock;
  //   ifLoopBlock.variables = this.variables.vars;
  //   await ifLoopBlock.validateLoopBlock(this.variables.vars, this.isAnInputBlockRunning, 0, ifLoopBlock.SYMBOLS.length);
  // }

  parseIfCaseExpression(variables: any[]) {
    let opers = [], exps = [], exps1 = [];
    let op = '', oper1, oper2, result, j = 0, tempArrIndex;
    let isVarDeclared = false, isParsingStrings = false, strSplit;

    strSplit = this.ifStatement.split(/[\&\|\!\>\<\=\+\-\*\/\%]+/g);
    for (let i = 0; i < strSplit.length; i++) { exps[i] = strSplit[i].trim(); }

    // Store LOGICAL Operators: &&, ||, ! in "opers"
    if ((this.ifStatement.indexOf('&&') != -1) || (this.ifStatement.indexOf('||') != -1) || (this.ifStatement.indexOf('!') != -1)
      || (this.ifStatement.indexOf('<') != -1) || (this.ifStatement.indexOf('>') != -1) || (this.ifStatement.indexOf('==') != -1)
      || (this.ifStatement.indexOf('<=') != -1) || (this.ifStatement.indexOf('>=') != -1) || (this.ifStatement.indexOf('!=') != -1)
      || (this.ifStatement.indexOf('+') != -1) || (this.ifStatement.indexOf('-') != -1) || (this.ifStatement.indexOf('*') != -1)
      || (this.ifStatement.indexOf('/') != -1) || (this.ifStatement.indexOf('%') != -1)) {
      opers = this.ifStatement.match(/[\&\|\!\>\<\=\+\-\*\/\%]+/g);
    } else {
      opers = [];
    }
    // console.log("If Case exps: ", exps);
    // console.log("If Case opers: ", opers);
    
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
          }
        } else {
          if (variables[j].getName() == exps[i]) {
            isVarDeclared = true;
            exps.splice(i, 1, variables[j].value);
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
      if (exps[0] == true) return this.trueBlockSymbols;
      else if (exps[0] == false) return this.falseBlockSymbols;
    }

    // Remove empty elements [""] from parsedValues
    for (let i = 0; i < exps.length; i++) { if (exps[i] == "") exps.splice(i, 1); }
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
    // Parse && and || for mathjs
    if (newExpression.indexOf('&&') != -1 || newExpression.indexOf('||') != -1) {
      newExpression = newExpression.replace('&&', '&').replace('||', '|');
    }
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