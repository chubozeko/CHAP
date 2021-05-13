export class Output {

  static s_name: string = 'Output';
  id: string = 's_output';

  outputExp: string = '';

  outputSymbol: any;

  constructor() { }

  createOutputSymbol(outputSym: any) {
    this.outputExp = outputSym.outputExp;
    this.outputSymbol = outputSym.outputSymbol;
  }

  setOutputExpression(exp: string) { this.outputExp = exp; }
  getOutputExpression() { return this.outputExp; }

  setOutputSymbol(symbol: any) { this.outputSymbol = symbol; }
  getOutputSymbol() { return this.outputSymbol; }

  async validateOutputSymbol(variables: any[], consoleLog: HTMLTextAreaElement) {
    let isVarDeclared = null, isVarAnArray = false;
    let tempArrIndex: number;
    let hasQuotes = 0, outputS = "", vIndex;
    // Get output expression
    let outputStr: string = this.getOutputExpression();
    let str = outputStr.split("&");
    for (let k = 0; k < str.length; k++) {
      let s1 = str[k].trim();
      if (s1.indexOf('"') == -1) {
        // Check if it is a variable
        for (let j = 0; j < variables.length; j++) {
          if (variables[j].getIsArray()) {
            let tempVarName = s1.split('[');
            if (
              tempVarName[0] == variables[j].getName()
            ) {
              isVarDeclared = true;
              isVarAnArray = true;
              vIndex = j;
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
              break;
            } else { isVarDeclared = false; }
          } else {
            if (s1 == variables[j].getName()) {
              isVarDeclared = true;
              vIndex = j;
              break;
            } else { isVarDeclared = false; }
          }
        }
      } else {
        hasQuotes++;
      }
    }

    // if ((isVarDeclared == null || !isVarDeclared) && hasQuotes == 0) {
    if (!isVarDeclared && hasQuotes == 0) {
      return false;
    } else if (isVarDeclared && hasQuotes == 0) {
      // Output variable
      let s1 = this.getOutputExpression();
      let s2 = s1.split("&");
      for (let i = 0; i < s2.length; i++) {
        let str = s2[i].trim();
        for (let l = 0; l < variables.length; l++) {
          /* check if it is an array  */
          if (variables[l].getIsArray()) {
            let tempVarName = str.split('[');
            if (tempVarName[0] == variables[l].getName()) {
              // Getting the index of the array
              let tempIn = tempVarName[1].replace(']', '');
              if (!isNaN(parseInt(tempIn))) {
                tempArrIndex = parseInt(tempIn);
              } else {
                for (let r = 0; r < variables.length; r++) {
                  if (tempIn == variables[r].getName()) {
                    tempArrIndex = variables[r].getValue();
                  }
                }
              }
              if (
                variables[l].variable[tempArrIndex] == undefined &&
                isNaN(variables[l].variable[tempArrIndex])
              ) {
                outputS = "";
              } else outputS += variables[l].variable[tempArrIndex];
            }
          } else {
            if (str == variables[l].getName()) {
              if (variables[l].value == undefined && isNaN(variables[l].value)) {
                outputS = "";
              } else outputS += variables[l].value;
            }
          }
        }
      }
    } else if (hasQuotes > 0) {
      // Output String expression
      let s1 = this.getOutputExpression();
      let s2 = s1.split("&");
      for (let i = 0; i < s2.length; i++) {
        let str = s2[i].trim();
        if (str.indexOf('"') != -1) {
          let str2 = str.replace(/\"/g, "");
          outputS += str2;
        } else {
          for (let l = 0; l < variables.length; l++) {
            if (!variables[l].getIsArray()) {
              if (str == variables[l].getName()) {
                if (
                  variables[l].value == undefined &&
                  isNaN(variables[l].value)
                ) {
                  outputS = "";
                } else outputS += variables[l].value;
              }
            } else {
              let tempVarName = str.split('[');
              if (
                tempVarName[0] == variables[l].getName()
              ) {
                // Getting the index of the array
                let tempIn = tempVarName[1].replace(']', '');
                if (!isNaN(parseInt(tempIn))) {
                  tempArrIndex = parseInt(tempIn);
                } else {
                  for (let r = 0; r < variables.length; r++) {
                    if (tempIn == variables[r].getName()) {
                      tempArrIndex = variables[r].getValue();
                    }
                  }
                }
                if (
                  variables[l].variable[tempArrIndex] == undefined &&
                  isNaN(variables[l].variable[tempArrIndex])
                ) {
                  outputS = "";
                } else outputS += variables[l].variable[tempArrIndex];
              }
            }
          }
        }
      }
    }
    consoleLog.value += "Output: " + outputS + "\n";

    return true;
  }

  pseudoCode() { return '\tOutput ' + this.getOutputExpression().replace(/\&/g, ', ') + '\n'; }

  cplusplusCode() {
    return '\tcout<<' + this.getOutputExpression().replace(/\&/g, '<<') + '<<endl;\n';
  }

  getJavaCode() {
    return '\t\tSystem.out.println(' + this.getOutputExpression().replace(/\&/g, ' + ') + ');\n';
  }

}