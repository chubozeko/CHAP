import { Start } from "./Start";
import { Stop } from "./Stop";
import { Declare } from "./Declare";
import { Process } from "./Process";
import { Output } from "./Output";
import { Input } from "./Input";
import { Comment } from "./Comment";
import { IfCase } from "./IfCase";
import { WhileLoop } from "./WhileLoop";
import { Variable } from "./Variable";

export class Flowchart{

  SYMBOLS: any[];

  variables: any[];
  comments: string[];

  isProgramRunning: boolean = false;
  inputPromptStatement: string = '';
  isInputEntered: boolean;
  outputStatement: string = '';

  consoleLog: HTMLTextAreaElement;
  consoleInput: HTMLInputElement;

  constructor(){
    let defaultSymbols = document.getElementsByClassName('symbols');
    for (let i = 0; i < defaultSymbols.length; i++) {
      this.SYMBOLS.splice( i, 0, defaultSymbols[i] );
    }

    let start = new Start();
    let stop = new Stop();
    this.SYMBOLS = [ start, stop ];
    this.variables = [];

    console.log(this.SYMBOLS.length);

    this.consoleLog = document.getElementById("console") as HTMLTextAreaElement;
    this.consoleInput = document.getElementById("consoleInput") as HTMLInputElement;
    //document.getElementById("console").addEventListener('keyup', (e) => this.enterPressedOnConsole(e) );
  }

  addSymbolToFlowchart( symbol: any, position: number){ this.SYMBOLS.splice(position, 0, symbol); }

  removeSymbolFromFlowchart( symbol: any, position: number ){ this.SYMBOLS.splice(position, 1, symbol); }

  getSymbolFromFlowchart( index: number ){ return this.SYMBOLS[index]; }

  clearFlowchart(){
    let start = new Start();
    let stop = new Stop();
    this.SYMBOLS = [ start, stop ];
  }

  displayFlowchartPseudoCode(){
    let pseudocode = '';
    for (let i = 0; i < this.SYMBOLS.length; i++) {
      const syms = this.SYMBOLS[i];
      pseudocode = pseudocode + syms.pseudoCode();
    }
    return pseudocode;
  }

  displayCPlusPlusCode(){
    let cppcode = '';
    for (let i = 0; i < this.SYMBOLS.length; i++) {
      const syms = this.SYMBOLS[i];
      cppcode = cppcode + syms.cplusplusCode();
    }
    return cppcode;
  }

  declareVariable( declareSymbol: Declare, pos: number ){
    this.variables.splice( pos, 0, declareSymbol.parseDeclareExp() );
  }

  enterPressedOnConsole(e, var1: Variable){
    e.preventDefault();
    if (e.keyCode == 13) {
      // Get the last line from the Console: variable_value
      let var_val = this.consoleInput.value;

      // Checking the data type of an entered variable into the Console
      let var_value1: any;
      if( !isNaN( parseInt(var_val) ) ){ var_value1 = parseInt(var_val); }
      else if( !isNaN( parseFloat(var_val) ) ){ var_value1 = parseFloat(var_val); }
      else if( var_val == "true" ){ var_value1 = true; }
      else if( var_val == "false" ){ var_value1 = false; }
      else { var_value1 = var_val.toString(); }

      if ( var1.getDataType() == 'Integer' && typeof var_value1 == 'number' ){ 
        var1.value = var_value1; 
        this.consoleInput.disabled = false;
        this.consoleInput.contentEditable = 'true';
        this.isInputEntered = true;
      }
      else if ( var1.getDataType() == 'Real' && typeof var_value1 == 'number' ){ 
        var1.value = var_value1; 
        this.consoleInput.disabled = false;
        this.consoleInput.contentEditable = 'true';
        this.isInputEntered = true;
      }
      else if ( var1.getDataType() == 'String' && typeof var_value1 == 'string' ){ 
        var1.value = var_value1; 
        this.consoleInput.disabled = false;
        this.consoleInput.contentEditable = 'true';
        this.isInputEntered = true;
      }
      else if ( var1.getDataType() == 'Boolean' && typeof var_value1 == 'boolean' ){ 
        var1.value = var_value1; 
        this.consoleInput.disabled = false;
        this.consoleInput.contentEditable = 'true';
        this.isInputEntered = true;
      }
      else {
        this.consoleLog.value += 'Invalid datatype entered! ';
        this.consoleLog.value += this.inputPromptStatement;
      }

      this.consoleInput.value = '';
      console.log(this.variables);

      //return 'input done';
    }
  }

  async validateInput(varIndex: number){
    // Enable Console Input for editing
    this.consoleInput.disabled = false;
    this.consoleInput.contentEditable = 'true';
    // Display Input prompt
    this.inputPromptStatement = Input.prototype.parseInputExp( this.variables[varIndex] ) + "\n";
    this.consoleLog.value += this.inputPromptStatement;
    this.consoleInput.addEventListener("keyup", (e) => this.enterPressedOnConsole(e, this.variables[varIndex]) );

    // return this.isInputEntered;
  }

  validateProcess(symbol: Process, varIndex: number){
    
    this.variables[varIndex].value = symbol.parseExpression( this.variables[varIndex].getDataType() );
    
  }

  validateOutput(varIndex: number){
    if (varIndex == -1){
      let str2 = this.outputStatement.replace(/"/g,'');
      
      // Display Output string statement
      this.consoleLog.value += str2; //this.outputStatement;
    } else {
      // Display Output variable statement
      this.consoleLog.value += this.variables[varIndex].value;
    }
  }

  async validateFlowchart(){
    this.variables = [];
    let varIndex = 0;

    for(let i=0; i<this.SYMBOLS.length; i++){

      // START
      if( this.SYMBOLS[i] instanceof Start ){
        console.log( 'Start Program' );
        this.isProgramRunning = true;
      } 

      // DECLARE
      if( this.SYMBOLS[i] instanceof Declare ){
        this.variables.splice(this.variables.length, 0, this.SYMBOLS[i].parseDeclareExp() );
      } 

      // INPUT
      if( this.SYMBOLS[i] instanceof Input ){
        let isVarDeclared = false;
        for( let j=0; j<this.variables.length; j++ ){
          if( this.SYMBOLS[i].getVariableName() == this.variables[j].getName() ){
            isVarDeclared = true;
            varIndex = j;
          }
        }
        if(!isVarDeclared){
          alert('Variable \"' + this.SYMBOLS[i].getVariableName() + '\" is not declared!');
        } else { 
          console.log('input variable declared! carry on...');
          this.validateInput(varIndex);
        }
      }

      // PROCESS
      if( this.SYMBOLS[i] instanceof Process ){

        let isVarDeclared = false;
        for( let j=0; j<this.variables.length; j++){
          if( this.SYMBOLS[i].getVariableName() == this.variables[j].getName() ){
            isVarDeclared = true;
            varIndex = j;
          }
        }
        if(!isVarDeclared){
          alert('Variable \"' + this.SYMBOLS[i].getVariableName() + '\" is not declared!');
        } else {
          console.log('process variable declared. carry on...');
          this.validateProcess( this.SYMBOLS[i], varIndex );
        }

        // this.SYMBOLS[i].parseProcessExp();
      }

      // OUTPUT
      if( this.SYMBOLS[i] instanceof Output ){
        let isVarDeclared, hasQuotes; // = false;
        let outputStr: string = this.SYMBOLS[i].getOutputExpression();
        if( outputStr.indexOf("\"") == -1 ){
          console.log("No quote");
          hasQuotes = false;
          for( let j=0; j<this.variables.length; j++){
            if( this.SYMBOLS[i].getOutputExpression() == this.variables[j].getName() ){
              isVarDeclared = true;
              varIndex = j;
            }
          }
        } else {
          hasQuotes = true;
          this.outputStatement = outputStr;
          console.log("Quote");
        }
        if( !isVarDeclared && !hasQuotes ){
          alert('Variable is not declared!'); // \"' + this.SYMBOLS[i].getVariableName() + '\"
        } else if( isVarDeclared && !hasQuotes ){
          // Output variable
          console.log('output variable declared! carry on...'); 
          this.validateOutput(varIndex);
        } else if( hasQuotes ){
          // Output String expression
          this.validateOutput(-1);
        }
      }

      // COMMENT
      if( this.SYMBOLS[i] instanceof Comment ){ break; }

      // IF CASE
      if( this.SYMBOLS[i] instanceof IfCase ){
        this.SYMBOLS[i].parseIfCaseExp();
      }

      // WHILE LOOP
      if( this.SYMBOLS[i] instanceof WhileLoop ){
        this.SYMBOLS[i].parseWhileLoopExp();
      }

      // STOP
      if( this.SYMBOLS[i] instanceof Stop ){
        console.log( 'End Program' );
        this.isProgramRunning = false;
        // this.consoleLog.append("End of Debugging\n");
      }
    }

    console.log(this.variables);
    
    // return 'no declare';
  }

}