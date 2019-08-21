import { create, all } from 'mathjs'
const config = {};
const math = create(all, config);

export class Process {

  static s_name: string = 'Process';
  id: string = 's_process';

  variableName: string = '';
  expression: string = '';
  processExpression: string = '';

  processValue;

  processSymbol: any;

  constructor() { this.processValue = new Array(); }

  createProcessSymbol(processSym: any) {
    this.expression = processSym.expression;
    this.processExpression = processSym.processExpression;
    this.processSymbol = processSym.processSymbol;
    this.processValue = processSym.processValue;
    this.variableName = processSym.variableName;
  }

  setProcessSymbol(symbol: any) { this.processSymbol = symbol; }
  getProcessSymbol() { return this.processSymbol; }

  setVariableName(var_name: string) { this.variableName = var_name; }
  getVariableName() { return this.variableName; }

  setExpression(exp: string) { this.expression = exp; }
  getExpression() { return this.expression; }

  getProcessExpression() {
    this.processExpression = this.getVariableName() + ' = ' + this.getExpression();
    return this.processExpression;
  }

  parseExpression(variables: any[], dataType: string) {

    let strSplit = [], values = [], operators = [], parsedValues = [];
    let tempArrIndex: number, result;
    // let op = '', oper1, oper2, j = 0;

    // Check for operators
    if ((this.expression.indexOf('+') != -1) || (this.expression.indexOf('-') != -1) ||
      (this.expression.indexOf('*') != -1) || (this.expression.indexOf('/') != -1) || (this.expression.indexOf('%') != -1) ||
      (this.expression.indexOf('(') != -1) || (this.expression.indexOf(')') != -1)) {
      // Split expression by operators
      strSplit = this.expression.split(/[\+\-\*\/\%\(\)]/g);

      // Stored operators in an Array called "operators"
      operators = this.expression.match(/[\+\-\*\/\%\(\)]/g);
      // Store operands in an Array called "values"
      for (let i = 0; i < strSplit.length; i++) { values[i] = strSplit[i].trim(); }
    } else {
      values.splice(values.length, 0, this.expression.trim());
      // T: add variable.value to values[]
      // F: alert('Variable not declared in expression')
      // Make this.expression = this.variables[index].value
    }

    // Check if it is a variable name
    for (let i = 0; i < values.length; i++) {
      for (let j = 0; j < variables.length; j++) {
        if (variables[j].getIsArray()) {
          let tempVarName = values[i].split('[');
          if (tempVarName[0] == variables[j].getName()) {
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
            values.splice(i, 1, variables[j].variable[tempArrIndex]);
          }
        } else {
          if (variables[j].getName() == values[i]) {
            values.splice(i, 1, variables[j].value);
          }
        }
      }
    }

    // Convert "values[]" to desired data type
    switch (dataType) {
      case 'Integer':
        for (let i = 0; i < values.length; i++) { parsedValues.splice(parsedValues.length, 0, parseInt(values[i])); }
        break;
      case 'Real':
        for (let i = 0; i < values.length; i++) { parsedValues.splice(parsedValues.length, 0, parseFloat(values[i])); }
        break;
      case 'String':
        for (let i = 0; i < values.length; i++) { parsedValues.splice(parsedValues.length, 0, values[i].replace(/\"/g, '').toString()); }
        break;
      case 'Boolean':
        for (let i = 0; i < values.length; i++) {
          if (values[i] == "true") parsedValues.splice(parsedValues.length, 0, true);
          if (values[i] == "false") parsedValues.splice(parsedValues.length, 0, false);
        }
        break;
      default: break;
    }

    // Remove empty elements [""] from parsedValues
    for (let i = 0; i < parsedValues.length; i++) { if (isNaN(parsedValues[i])) parsedValues.splice(i, 1, ""); }
    // Create newExpression with parsed values instead of variable names
    let newExpression = "";
    for (let j = 0; j < operators.length; j++) {
      newExpression += parsedValues[j] + operators[j];
    }
    newExpression += parsedValues[parsedValues.length - 1];
    // Evaluate the expression and return the result
    result = math.evaluate(newExpression);
    return result;
  }

  calculateIntegerExpression(num1: number, num2: number, operator: string) {
    let result: number;
    switch (operator) {
      case '+': result = num1 + num2; break;
      case '-': result = num1 - num2; break;
      case '*': result = num1 * num2; break;
      case '/': result = num1 / num2; break;
      case '%': result = num1 % num2; break;
      default: break;
    }
    return Math.floor(result);
  }

  calculateRealExpression(num1: number, num2: number, operator: string) {
    let result: number;
    switch (operator) {
      case '+': result = num1 + num2; break;
      case '-': result = num1 - num2; break;
      case '*': result = num1 * num2; break;
      case '/': result = num1 / num2; break;
      case '%': result = num1 % num2; break;
      default: break;
    }
    return result;
  }

  calculateBooleanExpression(bool1: boolean, bool2: boolean, operator: string) {
    let result: any = bool1;
    switch (operator) {
      case '%':
      case '-':
      case '+':
      case '*':
      case '/':
      default: console.log('Invalid expression for Booleans!'); break;
    }
    return result;
  }

  calculateStringExpression(str1: string, str2: string, operator: string) {
    let result: any;
    switch (operator) {
      case '+': result = str1 + str2; break;
      case '%':
      case '-':
      case '*':
      case '/':
      default: console.log('Invalid operation for Strings!'); break;
    }
    return result;
  }

  pseudoCode() { return '\tProcess ' + this.getProcessExpression() + '\n'; }

  cplusplusCode() {
    return '\t' + this.getProcessExpression() + ';\n';
  }

  getJavaCode() {
    return '\t\t' + this.getProcessExpression() + ';\n';
  }

}