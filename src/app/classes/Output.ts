export class Output {

  static s_name: string = 'Output';
  id: string = 's_output';

  outputExp: string = '';
  outputS: string = '';

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

  validateOutputSymbol(variables: any[], consoleLog: HTMLTextAreaElement) {
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
          consoleLog.className = "errorAlert";
          var sl_tip = "SOLUTION TIP : Make Sure You Open / Close Quotation Mark at Output Symbol !";
          consoleLog.value += "ERROR CODE O-01: Missing Quotation Mark at Output symbol!" + "\n" + sl_tip.toString();
        } else {
          // consoleLog.value+="ERROR: syntax"+"\n";
        }
      } else if (ob.indexOf("'") != -1) {
        isValid = false;
        // TODO: Add "SINGLE_QUOTES" error
        consoleLog.className = "errorAlert";
        console.error("ERROR: Single Quotes NOT ALLOWED at Output symbol!");
        consoleLog.value += "ERROR CODE O-02: Single Quotes NOT ALLOWED at Output symbol!";
      } else {
        isValid = this.checkIfVariable(ob, variables);
        if (isValid == false){
          consoleLog.className = "errorAlert";
          var sl_tip="SOLUTION TIP : Please Check Declared Variable Name or Entered Data Type !";
          consoleLog.value += "ERROR CODE O-03: Undefined / Null Variable or Array at Output symbol!"+"\n"+sl_tip.toString();
        } else {
          //consoleLog.value+="ERROR: Undefined / Null Array Variable at Output symbol!"+"\n";
        }
      }

      if (isValid == false || isValid == null || isValid == undefined) {
        
        return false;
      }
    };
    if(this.outputS=="NaN"){
      consoleLog.className = "errorAlert";
     //var solutionTip="SOLUTION TIP : Please Check IF DECLARED DATA TYPE IS INTEGER REMOVE {'','}"+"MARK AT PROCESS SYMBOL" ;
      consoleLog.value += "SYNTAX ERROR CODE O-04: Check Entered Expression at PROCESS Symbol"+"\n"+"SOLUTION TIP : Please Check IF DECLARED DATA TYPE IS INTEGER REMOVE {'','}"+"MARK AT PROCESS SYMBOL !" ;

    }else if(this.outputS=="null"){
      consoleLog.className = "errorAlert";
      consoleLog.value += "SYNTAX ERROR CODE O-05: Check Entered Expression at PROCESS Symbol"+"\n"+"SOLUTION TIP : Please Check IF DECLARED DATA TYPE IS STRING ONLY USE DOUBLE QUATATIONS AT THE PROCESS SYMBOL TO DISPLAY VALUE !";
    }
   else{
      //consoleLog.className = "noerrorAlert";//  Eğer hata mesajı yok ise rengi beyaz yapsın
      consoleLog.value += "Output : " + this.outputS + "\n";
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
              // TODO: Show "UNDECLARED ARRAY INDEX VARIABLE" Error
              
              console.error("ERROR CODE O-06: Undeclared / Undefined Array Index Variable at Output symbol!");
            }
          }
          if (
            variables[j].variable[arrIndex] == undefined &&
            isNaN(variables[j].variable[arrIndex])
          ) {
            // TODO: Show "UNDEFINED / NULL VARIABLE" Error
          
            console.error("ERROR CODE O-07: Undefined / Null Array Variable at Output symbol!");
          
            return false;
          } else { this.outputS += variables[j].variable[arrIndex]; }
          break;
        } else { isVarDeclared = false; }
      } else {
        if (oBlock == variables[j].getName()) {
          isVarDeclared = true;
          isVarAnArray = false;
          if (variables[j].value == undefined && isNaN(variables[j].value)) {
            // TODO: Show "UNDEFINED / NULL VARIABLE" Error
            console.error("ERROR CODE O-08: Undefined / Null Variable at Output symbol!");
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
      // TODO: Show "MISSING QUOTATION" Error
      console.error("ERROR CODE O-09: Missing Quotation Mark at Output symbol!");
      return false;
    } else {
      if (oBlock.charAt(0) == '"' && oBlock.charAt(oBlock.length-1) == '"') {
        // Output String expression
        // let str = oBlock.replace(/\"/g, "");
        let str = oBlock.substring(1, oBlock.length-1);
        this.outputS += str;
        return true;
      } else {
        // TODO: Show Syntax Error for misplaced quotation marks
        console.error("ERROR CODE O-10: Syntax error at Output symbol!");
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