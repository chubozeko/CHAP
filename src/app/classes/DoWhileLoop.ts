export class DoWhileLoop {

  static s_name: string = 'Do';
  id: string = 's_do_while_loop';

  doWhileExpression: string;
  doWhileSymbol: any;

  trueExpression: string;
  trueLoopBlock: any[];

  falseExpression: string;
  falseLoopBlock: any[];

  constructor() {
    this.doWhileExpression = '';
    this.trueLoopBlock = [];
    this.falseLoopBlock = [];
  }

  createDoWhileLoopSymbol(doWhileSym: any) { }

  setDoWhileExpression(do_while_exp: string) { this.doWhileExpression = do_while_exp; }
  getDoWhileExpression() { return this.doWhileExpression; }

  setDoWhileSymbol(doWhileSym: any) { this.doWhileSymbol = doWhileSym; }
  getDoWhileSymbol() { return this.doWhileSymbol; }

  parseDoWhileExpression(variables) {
    let opers = [],
      exps = [],
      exps1 = [];
    let op = "",
      oper1,
      oper2,
      result,
      j = 0;
    let isVarDeclared = false;

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

    // Check if it is a variable name & parse to desired data type
    for (let i = 0; i < exps.length; i++) {
      for (let j = 0; j < variables.length; j++) {
        if (variables[j].getName() == exps[i]) {
          isVarDeclared = true;
          if (variables[j].getDataType() == "Integer")
            exps.splice(i, 1, parseInt(variables[j].value));
          else if (variables[j].getDataType() == "Real")
            exps.splice(i, 1, parseFloat(variables[j].value));
          else if (variables[j].getDataType() == "String")
            exps.splice(i, 1, variables[j].value.toString());
          else if (variables[j].getDataType() == "Boolean") {
            if (variables[j] == "true") exps.splice(i, 1, true);
            if (variables[j] == "false") exps.splice(i, 1, false);
          }
        } else {
          let v = exps[i];
          let temp: any;
          if (!isNaN(parseInt(v)) || !isNaN(parseFloat(v))) {
            let a = v.split(".");
            if (a.length > 1) temp = parseFloat(v);
            else temp = parseInt(v);
          } else if (v == "true") {
            temp = true;
          } else if (v == "false") {
            temp = false;
          } else {
            temp = v.toString();
          }
          exps.splice(i, 1, temp);
        }
      }
    }

    // Calculate expression
    while (opers.length != 0) {
      if (opers.indexOf("%") != -1) {
        j = opers.indexOf("%");
      } else if (opers.indexOf("/") != -1) {
        j = opers.indexOf("/");
      } else if (opers.indexOf("*") != -1) {
        j = opers.indexOf("*");
      } else if (opers.indexOf("+") != -1) {
        j = opers.indexOf("+");
      } else if (opers.indexOf("-") != -1) {
        j = opers.indexOf("-");
      } else if (opers.indexOf("<") != -1) {
        j = opers.indexOf("<");
      } else if (opers.indexOf("<=") != -1) {
        j = opers.indexOf("<=");
      } else if (opers.indexOf(">") != -1) {
        j = opers.indexOf(">");
      } else if (opers.indexOf(">=") != -1) {
        j = opers.indexOf(">=");
      } else if (opers.indexOf("==") != -1) {
        j = opers.indexOf("==");
      } else if (opers.indexOf("!=") != -1) {
        j = opers.indexOf("!=");
      } else if (opers.indexOf("&&") != -1) {
        j = opers.indexOf("&&");
      } else if (opers.indexOf("||") != -1) {
        j = opers.indexOf("||");
      }

      op = opers[j];
      oper1 = exps[j];
      oper2 = exps[j + 1];

      switch (typeof oper1) {
        case "number":
          result = this.calculateIntegerExpression(oper1, oper2, op);
          break;
        //case "number": result = this.calculateRealExpression(oper1, oper2, op); break;
        case "string":
          result = this.calculateStringExpression(oper1, oper2, op);
          break;
        case "boolean":
          result = this.calculateBooleanExpression(oper1, oper2, op);
          break;
        default:
          break;
      }
      opers.splice(j, 1);
      exps.splice(j, 2, result);
    }
    console.log("Expressions:", exps);

    if (!isVarDeclared) return null;
    if (exps[0] == true) return this.trueLoopBlock;
    else if (exps[0] == false) return this.falseLoopBlock;
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

  pseudoCode() {
    let doWhileTrue = '';
    for (let i = 0; i < this.trueLoopBlock.length; i++) {
      const el = this.trueLoopBlock[i];
      doWhileTrue += '\t' + el.pseudoCode();
    }
    return '\tDo\n' + doWhileTrue + '\tWhile ' + this.getDoWhileExpression() + '\n\tEnd Do While\n';
  }

  cplusplusCode() {
    let doWhileTrue = '';
    for (let i = 0; i < this.trueLoopBlock.length; i++) {
      const el = this.trueLoopBlock[i];
      doWhileTrue += '\t' + el.cplusplusCode();
    }
    return '\tdo { \n' + doWhileTrue + '\t} while (' + this.getDoWhileExpression() + ');\n';
  }

  getJavaCode() {
    let doWhileTrue = '';
    for (let i = 0; i < this.trueLoopBlock.length; i++) {
      const el = this.trueLoopBlock[i];
      doWhileTrue += '\t' + el.getJavaCode();
    }
    return '\t\tdo { \n' + doWhileTrue + '\t\t} while (' + this.getDoWhileExpression() + ');\n';
  }

}