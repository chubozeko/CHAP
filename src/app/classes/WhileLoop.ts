export class WhileLoop {
  static id: string = "s_while_loop";
  static s_name: string = "While";

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
      for (let i = 0; i < exps1.length; i++) {
        exps[i] = exps1[i].trim();
      }
      // Store logical operators in "opers"
      opers = this.whileExpression.match(/[\&\|\!\>\<\=\+\-\*\/\%]+/g);
    } else {
      exps.splice(exps.length, 0, this.whileExpression.trim());
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
}
