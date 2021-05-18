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
  processDataType: any;

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

    strSplit = this.expression.split(/[\+\-\*\/\%\(\)]/g);
    for (let i = 0; i < strSplit.length; i++) { values[i] = strSplit[i].trim(); }

    operators = this.expression.match(/[\+\-\*\/\%\(\)]/g);

    for (let i = 0; i < values.length; i++) {
      if (this.checkIfVariable(values[i], variables)) {
        values[i] = this.parseVariable(values[i], variables);
      }

      switch (dataType) {
        case 'Integer':
          values[i] = parseInt(values[i], 10);
          break;
        case 'Real':
          values[i] = parseFloat(values[i]);
          break;
        case 'String':
          values[i] = this.parseString(values[i]);
          break;
        case 'Boolean':
          if (values[i] == "true") values[i] = true;
          else if (values[i] == "false") values[i] = false;
          else values[i] = undefined;
          break;
        default: break;
      }

      if (values[i] == null || values[i] == undefined || isNaN(values[i])) {
        return false;
      }
    }

    if (dataType != 'String') {
      // Create newExpression with parsed values instead of variable names
      let newExpression = "";
      for (let j = 0; j < operators.length; j++) {
        newExpression += values[j] + operators[j];
      }
      newExpression += values[values.length - 1];
      // Evaluate the expression and return the result
      result = math.evaluate(newExpression);
    } else {
      let op = '', oper1, oper2, j = 0;
      if (operators.length != 0) {
        while (operators.length != 0) {
          if (operators.indexOf('%') != -1) { j = operators.indexOf('%'); }
          else if (operators.indexOf('/') != -1) { j = operators.indexOf('/'); }
          else if (operators.indexOf('*') != -1) { j = operators.indexOf('*'); }
          else if (operators.indexOf('+') != -1) { j = operators.indexOf('+'); }
          else if (operators.indexOf('-') != -1) { j = operators.indexOf('-'); }

          op = operators[j];
          oper1 = values[j];
          oper2 = values[j + 1];
          result = this.calculateStringExpression(oper1, oper2, op);

          operators.splice(j, 1);
          values.splice(j, 2, result);
        }
      } else {
        result = this.calculateStringExpression(values[0], "", "+");
      }
    }

    return this.checkIfVariable(this.getVariableName(), variables, result);

    /*
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
        for (let i = 0; i < values.length; i++) { parsedValues.splice(parsedValues.length, 0, parseInt(values[i], 10)); }
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

    if (dataType != 'String') {
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
    } else {
      let op = '', oper1, oper2, j = 0;
      if (operators.length != 0) {
        while (operators.length != 0) {
          if (operators.indexOf('%') != -1) { j = operators.indexOf('%'); }
          else if (operators.indexOf('/') != -1) { j = operators.indexOf('/'); }
          else if (operators.indexOf('*') != -1) { j = operators.indexOf('*'); }
          else if (operators.indexOf('+') != -1) { j = operators.indexOf('+'); }
          else if (operators.indexOf('-') != -1) { j = operators.indexOf('-'); }

          op = operators[j];
          oper1 = parsedValues[j];
          oper2 = parsedValues[j + 1];
          result = this.calculateStringExpression(oper1, oper2, op);

          operators.splice(j, 1);
          parsedValues.splice(j, 2, result);
        }
      } else {
        result = this.calculateStringExpression(parsedValues[0], "", "+");
      }
    }

    return result;
    */
  }

  parseVariable(pBlock: string, variables: any[]) {
    let tempArrIndex;
    // Check if it is a variable name
    for (let j = 0; j < variables.length; j++) {
      if (variables[j].getIsArray()) {
        let tempVarName = pBlock.split('[');
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
          return variables[j].variable[tempArrIndex];
        }
      } else {
        if (variables[j].getName() == pBlock) {
          return variables[j].value;
        }
      }
    }
    return null;
  }

  parseString(pBlock: string) {
    let quoteCount = 0;
    for(let i=0; i<pBlock.length; i++){
      if (pBlock.charAt(i) == '"'){
        quoteCount++;
      }
    }
    // Even quotes => OK; Uneven quotes => Missing Quotation
    if (quoteCount % 2 != 0) {
      // TODO: Show "MISSING QUOTATION" Error
      console.error("ERROR: Missing Quotation Mark at Process symbol!");
      return null;
    } else {
      if (pBlock.charAt(0) == '"' && pBlock.charAt(pBlock.length-1) == '"') {
        // Output String expression
        return pBlock.substring(1, pBlock.length-1);
      } else {
        // TODO: Show Syntax Error for misplaced quotation marks
        console.error("ERROR: Syntax error at Process symbol!");
        return null;
      }
      
    }
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

  validateProcessSymbol(variables: any[]) {
    let isVarDeclared = false, isVarAnArray = false, isValid: boolean;
    let tempArrIndex: number, varIndex;
    isValid = this.checkIfVariable(this.getVariableName(), variables);
    if (!isValid) {
      return false;
    } else {
      return this.parseExpression(variables, this.processDataType);
    }

    /*
    for (let j = 0; j < variables.length; j++) {
      if (variables[j].getIsArray()) {
        let tempVarName = this.getVariableName().split('[');
        if (tempVarName[0] == variables[j].getName()) {
          isVarDeclared = true;
          isVarAnArray = true;
          varIndex = j;
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
        }
      } else {
        if (this.getVariableName() == variables[j].getName()) {
          isVarDeclared = true;
          varIndex = j;
        }
      }
    }
    if (!isVarDeclared) {
      return false;
    } else {
      if (isVarAnArray) {
        variables[varIndex].variable[tempArrIndex] = this.parseExpression(variables, variables[varIndex].getDataType());
      } else {
        variables[varIndex].value = this.parseExpression(variables, variables[varIndex].getDataType());
      }
    }
    return true;
    */
  }

  private checkIfVariable(pBlock: string, variables: any[], calculatedExp?: any): boolean {
    let isVarDeclared: boolean = false, isVarAnArray: boolean, arrIndex: number;
    for (let j = 0; j < variables.length; j++) {
      if (variables[j].getIsArray()) {
        let tempOb = pBlock.split('[');
        if (tempOb[0] == variables[j].getName()) {
          isVarDeclared = true;
          isVarAnArray = true;
          this.processDataType = variables[j].getDataType();
          // Getting the index of the array
          let tempIn = tempOb[1].replace(']', '');
          if (!isNaN(parseInt(tempIn))) {
            arrIndex = parseInt(tempIn);
          } else {
            let isArrIndexDeclared = false;
            for (let k = 0; k < variables.length; k++) {
              if (tempIn == variables[k].getName()) {
                isArrIndexDeclared = true;
                arrIndex = variables[k].getValue();
              }
            }
            if (!isArrIndexDeclared || arrIndex == undefined) {
              // TODO: Show "UNDECLARED ARRAY INDEX VARIABLE" Error
              console.error("ERROR: Undeclared / Undefined Array Index Variable at Output symbol!");
            }
          }
          if (
            variables[j].variable[arrIndex] == undefined &&
            isNaN(variables[j].variable[arrIndex])
          ) {
            // TODO: Show "UNDEFINED / NULL VARIABLE" Error
            console.error("ERROR: Undefined / Null Array Variable at Output symbol!");
            return false;
          } else {
            if (calculatedExp != null) {
              variables[j].variable[arrIndex] = calculatedExp;
              isVarDeclared = true;
            }
          }
          break;
        } else { isVarDeclared = false; }
      } else {
        if (pBlock == variables[j].getName()) {
          isVarDeclared = true;
          isVarAnArray = false;
          this.processDataType = variables[j].getDataType();
          if (variables[j].value == undefined && isNaN(variables[j].value)) {
            // TODO: Show "UNDEFINED / NULL VARIABLE" Error
            console.error("ERROR: Undefined / Null Variable at Output symbol!");
            return false;
          } else {
            if (calculatedExp != null) {
              variables[j].value = calculatedExp;
              isVarDeclared = true;
            }
          }
          break;
        } else { isVarDeclared = false; }
      }
    }
    return isVarDeclared;
  }

}