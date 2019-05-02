export class ForLoop {

  static id: string = 's_for_loop';
  static s_name: string = 'For';

  forLoopExpression: string = '';
  forLoopSymbol: any;

  forVariableName: string = '';
  startValue: number;
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
  }

  setVariableName(var_name: string) { this.forVariableName = var_name; }
  getVariableName() { return this.forVariableName; }

  setStartValue(startVal: number) { this.startValue = startVal; }
  getStartValue() { return this.startValue; }

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
      return forVar += this.getStepValue();
    } else if (this.getStepDirection() == 'Decreasing') {
      return forVar -= this.getStepValue();
    } else {
      let consoleLog = document.getElementById("console") as HTMLTextAreaElement;
      consoleLog.value += "\nStep Direction of For Loop undefined!";
      return null;
    }
  }

  parseForLoopExpression(variables) {
    let opers = [],
      exps = [],
      exps1 = [];
    let op = "",
      oper1,
      oper2,
      result,
      j = 0;

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
        if (variables[j].getName() == exps[i]) {
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

      // console.log('Values: ');
      // console.log(parsedValues);
      // console.log('Operators: ');
      // console.log(opers);
    }

    console.log("Expressions:", exps);
    // console.log(exps);
    // console.log(opers);

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

}