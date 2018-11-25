import { Start } from "./Start";
import { Stop } from "./Stop";
import { Declare } from "./Declare";
import { Process } from "./Process";
import { Output } from "./Output";
import { Input } from "./Input";
import { Comment } from "./Comment";
import { IfCase } from "./IfCase";
import { WhileLoop } from "./WhileLoop";
import { Variable } from "@angular/compiler/src/render3/r3_ast";

export class Flowchart{

  SYMBOLS: any[];

  variables: any[];
  comments: string[];

  consoleLog; //: HTMLTextAreaElement;

  constructor(){
    let defaultSymbols = document.getElementsByClassName('symbols');
    for (let i = 0; i < defaultSymbols.length; i++) {
      this.SYMBOLS.splice( i, 0, defaultSymbols[i] );
    }

    let start = new Start();
    let stop = new Stop();
    this.SYMBOLS = [ start, stop ];
    this.variables = [];

    this.consoleLog = document.getElementById("console") as HTMLTextAreaElement;
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
      let cons = document.getElementById("console") as HTMLTextAreaElement;  

      // Get the last line from the Console: variable_value
      let conStr = cons.value.split('\n');
      let var_val = conStr[conStr.length-2];

      // Checking the data type of an entered variable into the Console
      let var_value1: any;
      if( !isNaN( parseInt(var_val) ) ){ var_value1 = parseInt(var_val); }
      else if( !isNaN( parseFloat(var_val) ) ){ var_value1 = parseFloat(var_val); }
      else if( var_val == "true" ){ var_value1 = true; }
      else if( var_val == "false" ){ var_value1 = false; }
      else { var_value1 = var_val.toString(); }

      // if(typeof var_value1 == 'number'){ console.log( var_value1 + ' is a number' ); } 
      // else if(typeof var_value1 == 'number'){ console.log( var_value1 + ' is a real number' ); } 
      // else if(typeof var_value1 == 'string'){ console.log( var_value1 + ' is a string' ); } 
      // else if(typeof var_value1 == 'boolean' ){ console.log( var_value1 + ' is a boolean' ); }

      var1.value = var_value1;

      console.log(this.variables);

      cons.disabled = true;
      cons.contentEditable = 'false';
    }
  }

  validateFlowchart(){
    for(let i=1; i<this.SYMBOLS.length; i++){

      if( this.SYMBOLS[i] instanceof Declare ){
        this.variables.splice(this.variables.length, 0, this.SYMBOLS[i].parseDeclareExp() );
      } 

      if( this.SYMBOLS[i] instanceof Input ){

        let isVarDeclared = false;
        for( let j=0; j<this.variables.length; j++){
          if( this.SYMBOLS[i].getVariableName() == this.variables[j].getName() ){
            isVarDeclared = true;

            // Enable Console for editing
            this.consoleLog.disabled = false;
            this.consoleLog.contentEditable = 'true';

            // Display Input prompt
            this.consoleLog.append( this.SYMBOLS[i].parseInputExp( this.variables[j] ) + "\n");
            this.consoleLog.addEventListener("keyup", (e) => this.enterPressedOnConsole(e, this.variables[j]) );

          }
        }
        if(!isVarDeclared){
          alert('Variable \"' + this.SYMBOLS[i].getVariableName() + '\" is not declared!');
        } else { 
          console.log('carry on...'); 
          //this.consoleLog.append( this.SYMBOLS[i].parseInputExp(  ) + "\n>");
        }

        // return 'Enter a value of type ' + 
        
      }

      if( this.SYMBOLS[i] instanceof Process ){

        let isVarDeclared = false;
        for( let j=0; j<this.variables.length; j++){
          if( this.SYMBOLS[i].getVariableName() == this.variables[j] ){
            isVarDeclared = true;
          }
        }
        if(!isVarDeclared){
          alert('Variable \"' + this.SYMBOLS[i].getVariableName() + '\" is not declared!');
        } else { console.log('carry on...'); }

        // this.SYMBOLS[i].parseProcessExp();
      }

      if( this.SYMBOLS[i] instanceof Output ){
        this.SYMBOLS[i].parseOutputExp();
      }

      if( this.SYMBOLS[i] instanceof Comment ){ break; }

      if( this.SYMBOLS[i] instanceof IfCase ){
        this.SYMBOLS[i].parseIfCaseExp();
      }

      if( this.SYMBOLS[i] instanceof WhileLoop ){
        this.SYMBOLS[i].parseWhileLoopExp();
      }
    }
    // return 'no declare';
  }

}