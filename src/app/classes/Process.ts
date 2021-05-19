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

  consoleLog: HTMLTextAreaElement;

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
    let strSplit = [], values = [], operators = [], result;

    strSplit = this.expression.split(/[\+\-\*\/\%\(\)]/g);
    for (let i = 0; i < strSplit.length; i++) { values[i] = strSplit[i].trim(); }

    // Store operators in "operators"
    if ((this.expression.indexOf('+') != -1) || (this.expression.indexOf('-') != -1) ||
      (this.expression.indexOf('*') != -1) || (this.expression.indexOf('/') != -1) || (this.expression.indexOf('%') != -1) ||
      (this.expression.indexOf('(') != -1) || (this.expression.indexOf(')') != -1)) {
      operators = this.expression.match(/[\+\-\*\/\%\(\)]/g);
    } else {
      operators = [];
    }

    for (let i = 0; i < values.length; i++) {
      // Check if it is a variable name
      let isDeclared: boolean;
      isDeclared = this.checkIfVariable(values[i], variables, true, null);
      if (isDeclared) {
        values[i] = this.parseVariable(values[i], variables);
      }
      // Parse values[i] to desired data type
      let tempVal = values[i];
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

      if ((values[i] == null || values[i] == undefined) && isNaN(values[i])) {
        if (isDeclared) {
          this.consoleLog.className = "errorAlert";
          this.consoleLog.value += "Data Type ERROR: Invalid value at OUTPUT symbol: " +
            tempVal + "\n" + dataType + " Expected.\n";
          return false;
        } else {
          this.consoleLog.className = "errorAlert";
          this.consoleLog.value += "ERROR: Variable " + tempVal + " is not declared at 'PROCESS'" + "\n";
          return false;
        }
      }
    }

    if (dataType != 'String') {
      // Create newExpression with values[]
      let newExpression = "";
      for (let j = 0; j < operators.length; j++) {
        newExpression += values[j] + operators[j];
      }
      newExpression += values[values.length - 1];
      // Evaluate the expression with math.js and return the result
      result = math.evaluate(newExpression);
    } else {
      let op = '', oper1, oper2, j = 0;
      if (operators.length > 0) {
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
    return this.checkIfVariable(this.getVariableName(), variables, false, result);
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
    if (pBlock.indexOf('"') != -1) {
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
          console.log("new process string: " + pBlock.substring(1, pBlock.length-1));
          return pBlock.substring(1, pBlock.length-1);
        } else {
          // TODO: Show Syntax Error for misplaced quotation marks
          console.error("ERROR: Syntax error at Process symbol!");
          return null;
        }
      }
    } else if (pBlock.indexOf("'") != -1) {
      // TODO: Add "SINGLE_QUOTES" error
      console.error("ERROR: Single Quotes NOT ALLOWED at Process symbol!");
      return null;
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

  async validateProcessSymbol(variables: any[], consoleLog: HTMLTextAreaElement) {
    this.consoleLog = consoleLog;
    let isValid = this.checkIfVariable(this.getVariableName(), variables, false, null);
    if (!isValid) {
      return false;
    } else {
      return this.parseExpression(variables, this.processDataType);
    }
  }

  private checkIfVariable(pBlock: string, variables: any[], checkNull: boolean, calculatedExp?: any): boolean {
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
              this.consoleLog.className = "errorAlert";
              this.consoleLog.value += "ERROR: Undeclared Array Index Variable " +
                arrIndex + " at OUTPUT symbol." + "\n";
              // console.error("ERROR: Undeclared / Undefined Array Index Variable at Output symbol!");
            }
          }
          if (!checkNull) {
            if (calculatedExp != null) {
              variables[j].variable[arrIndex] = calculatedExp;
              isVarDeclared = true;
            }
            return true;
          } else {
            if (
              variables[j].variable[arrIndex] == undefined ||
              isNaN(variables[j].variable[arrIndex])
            ) {
              this.consoleLog.className = "errorAlert";
              this.consoleLog.value += "ERROR: Undefined / Null Array Variable " +
                pBlock + " at OUTPUT symbol." + "\n";
              // console.error("ERROR: Undefined / Null Array Variable at Process symbol!");
              return false;
            } else {
              if (calculatedExp != null) {
                variables[j].variable[arrIndex] = calculatedExp;
                isVarDeclared = true;
              }
            }
          }
          return isVarDeclared;
        }
      } else {
        if (pBlock == variables[j].getName()) {
          isVarDeclared = true;
          isVarAnArray = false;
          this.processDataType = variables[j].getDataType();
          if (!checkNull) {
            if (calculatedExp != null) {
              variables[j].value = calculatedExp;
              isVarDeclared = true;
            }
            return true;
          } else {
            if (variables[j].value == undefined || isNaN(variables[j].value)) {
              this.consoleLog.className = "errorAlert";
              this.consoleLog.value += "ERROR: Undefined / Null Variable " +
                pBlock + " at OUTPUT symbol." + "\n";
              // console.error("ERROR: Undefined / Null Variable at Output symbol!");
              return false;
            } else {
              if (calculatedExp != null) {
                variables[j].value = calculatedExp;
                isVarDeclared = true;
              }
            }
          }
          return isVarDeclared;
        }
      }
    }
    return isVarDeclared;
  }

}