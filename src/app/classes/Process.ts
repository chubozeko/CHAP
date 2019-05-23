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
    let op = '', oper1, oper2, result, j = 0;

    // Check for operators
    if ((this.expression.indexOf('+') != -1) || (this.expression.indexOf('-') != -1) ||
      (this.expression.indexOf('*') != -1) || (this.expression.indexOf('/') != -1) || (this.expression.indexOf('%') != -1)) {
      // Split expression by operators
      strSplit = this.expression.split(/[\+\-\*\/\%]+/g);
      // Stored operators in an Array called "operators"
      operators = this.expression.match(/[\+\-\*\/\%]+/g);
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
        if (variables[j].getName() == values[i]) {
          values.splice(i, 1, variables[j].value);
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

    console.log('Operators: ');
    console.log(operators);

    console.log('Values: ');
    console.log(parsedValues);

    while (operators.length != 0) {
      if (operators.indexOf('%') != -1) { j = operators.indexOf('%'); }
      else if (operators.indexOf('/') != -1) { j = operators.indexOf('/'); }
      else if (operators.indexOf('*') != -1) { j = operators.indexOf('*'); }
      else if (operators.indexOf('+') != -1) { j = operators.indexOf('+'); }
      else if (operators.indexOf('-') != -1) { j = operators.indexOf('-'); }

      op = operators[j];
      oper1 = parsedValues[j];
      oper2 = parsedValues[j + 1];

      switch (dataType) {
        case 'Integer': result = this.calculateIntegerExpression(oper1, oper2, op); break;
        case 'Real': result = this.calculateRealExpression(oper1, oper2, op); break;
        case 'String': result = this.calculateStringExpression(oper1, oper2, op); break;
        case 'Boolean': result = this.calculateBooleanExpression(oper1, oper2, op); break;
        default: break;
      }

      operators.splice(j, 1);
      parsedValues.splice(j, 2, result);

      console.log('Values: ');
      console.log(parsedValues);
      console.log('Operators: ');
      console.log(operators);
    }

    console.log(parsedValues);
    return parsedValues[0];
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

}