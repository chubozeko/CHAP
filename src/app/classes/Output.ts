export class Output {

  static s_name: string = 'Output';
  id: string = 's_output';
  symbolIndex: number = -1;
  parentIndex: number = -1;
  isInTrueLoopBlock: boolean = true;

  outputExp: string = 'Output';
  outputS: string = '';

  outputSymbol: any;

  chapConsole: HTMLDivElement;

  constructor() { }

  createOutputSymbol(outputSym: any) {
    this.outputExp = outputSym.outputExp;
    this.outputSymbol = outputSym.outputSymbol;
  }

  setOutputExpression(exp: string) { this.outputExp = exp; }
  getOutputExpression() { return this.outputExp; }

  setOutputSymbol(symbol: any) { this.outputSymbol = symbol; }
  getOutputSymbol() { return this.outputSymbol; }

  consoleLog(textColourClass, lineOutput) {
    this.chapConsole = document.getElementById("console") as HTMLDivElement;
    this.chapConsole.innerHTML += `<span class="` + textColourClass + `"> ` + lineOutput + "</span> \n";
  }

  validateOutputSymbol(variables: any[]) {
    let isValid: boolean;
    this.outputS = "";
    // Get output expression
    let outputStr: string = this.getOutputExpression();
    let oBlocks = outputStr.split("&");
    for (let i=0; i<oBlocks.length; i++) {
      let ob = oBlocks[i].trim();
      // Check if it contains double quotes ""
      if (ob.indexOf('"') != -1) {
        isValid = this.quotationChecker(ob);
        if (isValid == false) {
          var sl_tip = "SOLUTION TIP : Make Sure You Open / Close Quotation Mark at Output Symbol.";
          this.consoleLog("errorAlert", "ERROR CODE O-01: Missing Quotation Mark at 'OUTPUT' symbol!\n" + sl_tip.toString());
        }
      } else if (ob.indexOf("'") != -1) {
        isValid = false;
        console.error("ERROR: Single Quotes NOT ALLOWED at Output symbol!");
        this.consoleLog("errorAlert", "ERROR CODE O-02: Single Quotes NOT ALLOWED at 'OUTPUT' symbol!");
      } else {
        isValid = this.checkIfVariable(ob, variables);
        if (isValid == false){
          var sl_tip = "SOLUTION TIP : Please Check Declared Variable Name or Entered Data Type.";
          this.consoleLog("errorAlert", "ERROR CODE O-03: Undefined / Null Variable or Array at 'OUTPUT' symbol!\n" + sl_tip.toString());
        }
      }

      if (isValid == false || isValid == null || isValid == undefined) {
        return false;
      }
    }

    if (this.outputS == "NaN"){
      var solutionTip = `SOLUTION TIP : Please Check IF DECLARED DATA TYPE IS INTEGER REMOVE {'','} MARK AT OUTPUT SYMBOL.`;
      this.consoleLog("errorAlert", "SYNTAX ERROR CODE O-04: Check Entered Expression at 'OUTPUT' Symbol. \n" + solutionTip);
    } else if(this.outputS == "null") {
      var solutionTip = `SOLUTION TIP : Please Check IF DECLARED DATA TYPE IS STRING ONLY USE DOUBLE QUATATIONS AT THE OUTPUT SYMBOL TO DISPLAY VALUE !`;
      this.consoleLog("errorAlert", "SYNTAX ERROR CODE O-05: Check Entered Expression at 'OUTPUT' Symbol. \n" + solutionTip);
    } else {
      // Eğer hata mesajı yok ise rengi beyaz yapsın
      this.consoleLog("noerrorAlert", "Output : " + this.outputS);
      return true;
    }
    
  }

  private checkIfVariable(oBlock: string, variables: any[]): boolean {
    let isVarDeclared: boolean = false, isVarAnArray: boolean, arrIndex: number;
    for (let j = 0; j < variables.length; j++) {
      if (variables[j].getIsArray()) {
        let tempOb = oBlock.split('[');
        if (tempOb[0] == variables[j].getName()) {
          isVarDeclared = true;
          isVarAnArray = true;
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
              this.consoleLog("errorAlert", "ERROR CODE O-06: Undeclared / Undefined Array Index Variable at 'OUTPUT' symbol!");
              console.error("ERROR CODE O-06: Undeclared / Undefined Array Index Variable at 'OUTPUT' symbol!");
            }
          }
          if (
            variables[j].variable[arrIndex] == undefined &&
            isNaN(variables[j].variable[arrIndex])
          ) {
            this.consoleLog("errorAlert", "ERROR CODE O-07: Undefined / Null Array Variable at 'OUTPUT' symbol!");
            console.error("ERROR CODE O-07: Undefined / Null Array Variable at 'OUTPUT' symbol!");
            return false;
          } else { this.outputS += variables[j].variable[arrIndex]; }
          break;
        } else { isVarDeclared = false; }
      } else {
        if (oBlock == variables[j].getName()) {
          isVarDeclared = true;
          isVarAnArray = false;
          if (variables[j].value == undefined && isNaN(variables[j].value)) {
            this.consoleLog("errorAlert", "ERROR CODE O-08: Undefined / Null Variable at 'OUTPUT' symbol!");
            console.error("ERROR CODE O-08: Undefined / Null Variable at 'OUTPUT' symbol!");
            return false;
          } else { this.outputS += variables[j].value; }
          break;
        } else { isVarDeclared = false; }
      }
    }
    return isVarDeclared;
  }

  private quotationChecker(oBlock: string): boolean {
    let quoteCount = 0;
    for(let i=0; i<oBlock.length; i++){
      if (oBlock.charAt(i) == '"'){
        quoteCount++;
      }
    }
    // Even quotes => OK; Uneven quotes => Missing Quotation
    if (quoteCount % 2 != 0) {
      this.consoleLog("errorAlert", "ERROR CODE O-09: Missing Quotation Mark at 'OUTPUT' symbol!");
      console.error("ERROR CODE O-09: Missing Quotation Mark at 'OUTPUT' symbol!");
      return false;
    } else {
      if (oBlock.charAt(0) == '"' && oBlock.charAt(oBlock.length-1) == '"') {
        // Output String expression
        // let str = oBlock.replace(/\"/g, "");
        let str = oBlock.substring(1, oBlock.length-1);
        this.outputS += str;
        return true;
      } else {
        this.consoleLog("errorAlert", "ERROR CODE O-10: Syntax error at 'OUTPUT' symbol!");
        console.error("ERROR CODE O-10: Syntax error at 'OUTPUT' symbol!");
        return false;
      }
      
    }
  }

  pseudoCode() { return '\tOutput ' + this.getOutputExpression().replace(/\&/g, ', ') + '\n'; }

  cplusplusCode() {
    return '\tcout<<' + this.getOutputExpression().replace(/\&/g, '<<') + '<<endl;\n';
  }

  getJavaCode() {
    return '\t\tSystem.out.println(' + this.getOutputExpression().replace(/\&/g, ' + ') + ');\n';
  }

}