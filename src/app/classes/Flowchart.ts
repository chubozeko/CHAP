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
import { AlertController } from "@ionic/angular";

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
  //alertC: AlertController;

  constructor(public alertC: AlertController){
    let defaultSymbols = document.getElementsByClassName('symbols');
    for (let i = 0; i < defaultSymbols.length; i++) {
      this.SYMBOLS.splice( i, 0, defaultSymbols[i] );
    }

    let start = new Start();
    let stop = new Stop();
    this.SYMBOLS = [];
    this.variables = [];

    console.log(this.SYMBOLS.length);

    this.consoleLog = document.getElementById("console") as HTMLTextAreaElement;
  }

  async showAlert(alertTitle: string, alertMsg: string) {
    const alert = await this.alertC.create({
      header: alertTitle,
      message: alertMsg,
      buttons: ['OK']
    });
    await alert.present();
  }

  async showInputPrompt(alertTitle: string, varIndex: number, symIndex: number) {
    const alert = await this.alertC.create({
      header: alertTitle,
      inputs: [{
        name: 'inputText',
        type: 'text'
      }],
      buttons: [{
        text: 'Cancel',
        role: 'cancel',
        cssClass: 'secondary',
        handler: (data) => {
          console.log('Cancel ' + data.inputText);
        }
      }, 
      {
        text: 'OK',
        handler: (data) => {
          this.isInputEntered = false;
          console.log('Ok ' + data.inputText);
          this.inputParsing( this.variables[varIndex], data.inputText );
          this.consoleLog = document.getElementById("console") as HTMLTextAreaElement;
          this.consoleLog.value = "";
          this.validateFlowchart(++symIndex);
        }
      }]
    });

    alert.onDidDismiss().then((data) => {
      console.log("hello");
    });
      
    await alert.present();
  }

  addSymbolToFlowchart( symbol: any, position: number){ this.SYMBOLS.splice(position, 0, symbol); }

  removeSymbolFromFlowchart( position: number ){ this.SYMBOLS.splice(position, 1); }

  getSymbolFromFlowchart( index: number ){ return this.SYMBOLS[index]; }

  clearFlowchart(){
    let start = new Start();
    let stop = new Stop();
    this.SYMBOLS = [ start, stop ];
  }

  displayFlowchartPseudoCode(){
    let pseudocode = '';
    pseudocode += new Start().pseudoCode();
    for (let i = 0; i < this.SYMBOLS.length; i++) {
      const syms = this.SYMBOLS[i];
      pseudocode = pseudocode + syms.pseudoCode();
    }
    pseudocode += new Stop().pseudoCode();
    return pseudocode;
  }

  displayCPlusPlusCode(){
    let cppcode = '';
    cppcode += new Start().cplusplusCode();
    for (let i = 0; i < this.SYMBOLS.length; i++) {
      const syms = this.SYMBOLS[i];
      cppcode = cppcode + syms.cplusplusCode();
    }
    cppcode += new Stop().cplusplusCode();
    return cppcode;
  }

  declareVariable( declareSymbol: Declare, pos: number ){
    this.variables.splice( pos, 0, declareSymbol.parseDeclareExp() );
  }

  inputParsing(var1: Variable, var_val: any){
    // Checking the data type of an entered variable into the Console
    let var_value1: any;
    if( !isNaN( parseInt(var_val) ) ){ var_value1 = parseInt(var_val); }
    else if( !isNaN( parseFloat(var_val) ) ){ var_value1 = parseFloat(var_val); }
    else if( var_val == "true" ){ var_value1 = true; }
    else if( var_val == "false" ){ var_value1 = false; }
    else { var_value1 = var_val.toString(); }

    if ( var1.getDataType() == 'Integer' && typeof var_value1 == 'number' ){ var1.value = var_value1; }
    else if ( var1.getDataType() == 'Real' && typeof var_value1 == 'number' ){ var1.value = var_value1; }
    else if ( var1.getDataType() == 'String' && typeof var_value1 == 'string' ){ var1.value = var_value1; }
    else if ( var1.getDataType() == 'Boolean' && typeof var_value1 == 'boolean' ){ var1.value = var_value1; }
    else { this.showAlert("Invalid datatype entered!",""); }

    console.log(this.variables);
  }

  async validateInput(varIndex: number, symIndex: number){
    // Display Input prompt
    this.inputPromptStatement = Input.prototype.parseInputExp( this.variables[varIndex] ) + "\n";
    this.isInputEntered = true;
    this.showInputPrompt( this.inputPromptStatement, varIndex, symIndex );
  }

  validateProcess(symbol: Process, varIndex: number){ 
    this.variables[varIndex].value = symbol.parseExpression( this.variables, this.variables[varIndex].getDataType() );
  }

  async validateFlowchart(startIndex: number){
    if(startIndex == 0){
      this.variables = [];
    }
    let varIndex = 0;

    for(let i=startIndex; i<this.SYMBOLS.length; i++){

      // START
      if( this.SYMBOLS[i] instanceof Start ){
        console.log( 'Start Program' );
        this.isProgramRunning = true;
      } else

      // DECLARE
      if( this.SYMBOLS[i] instanceof Declare ){
        let vars = this.SYMBOLS[i].parseDeclareExp();
        for (let a = 0; a < vars.length; a++) {
          this.variables.splice(this.variables.length, 0, vars[a] ); 
        }
      } else

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
          this.showAlert('Invalid Statement at \'Input\'','Variable \"' + this.SYMBOLS[i].getVariableName() + '\" is not declared!');
        } else { 
          console.log('input variable declared! carry on...');
          if( !this.isInputEntered )
            this.validateInput(varIndex, i);
        }
      } else

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
          this.showAlert('Invalid Statement at \'Process\'','Variable \"' + this.SYMBOLS[i].getVariableName() + '\" is not declared!');
        } else {
          console.log('process variable declared. carry on...');
          this.validateProcess( this.SYMBOLS[i], varIndex );
        }

      } else

      // OUTPUT
      if( this.SYMBOLS[i] instanceof Output ){
        let isVarDeclared, hasQuotes = 0, outputS = ''; 
        let outputStr: string = this.SYMBOLS[i].getOutputExpression();
        let str = outputStr.split('&');
        for (let k = 0; k < str.length; k++) {
          let s1 = str[k].trim();
          if( s1.indexOf("\"") == -1 ){
            console.log("No quotes");
            for( let j=0; j<this.variables.length; j++){
              if( s1 == this.variables[j].getName() ){
                isVarDeclared = true;
                varIndex = j;
              }
            }
          } else {
            hasQuotes++;
            this.outputStatement = outputStr;
            console.log("Quotes");
          }
        }

        if( !isVarDeclared && hasQuotes==0 ){
          this.showAlert('Invalid Statement at \'Output\'','Variable is not declared!');
        } else if( isVarDeclared && hasQuotes==0 ){
          // Output variable
          console.log('output variable declared! carry on...');
          let s1 = this.SYMBOLS[i].getOutputExpression();
          let s2 = s1.split('&');
          for (let i = 0; i < s2.length; i++) {
            let str = s2[i].trim();
            for( let l=0; l<this.variables.length; l++){
              if( str == this.variables[l].getName() ){
                if( this.variables[l].value == undefined || isNaN(this.variables[l].value) ) { outputS = ''; } else
                  outputS += this.variables[l].value;
              }
            }
          }
        } else if( hasQuotes>0 ){
          // Output String expression
          let s1 = this.SYMBOLS[i].getOutputExpression();
          let s2 = s1.split('&');
          for (let i = 0; i < s2.length; i++) {
            let str = s2[i].trim();
            if( str.indexOf("\"") != -1 ){
              let str2 = str.replace(/\"/g,'');
              outputS += str2;
            } else {
              for( let l=0; l<this.variables.length; l++){
                if( str == this.variables[l].getName() ){
                  if( this.variables[l].value == undefined || isNaN(this.variables[l].value) ){ outputS = ''; } else
                    outputS += this.variables[l].value;
                }
              }
            }
          }
        }

        this.consoleLog.value += outputS;
      } else

      // COMMENT
      if( this.SYMBOLS[i] instanceof Comment ){ break; } else

      // IF CASE
      if( this.SYMBOLS[i] instanceof IfCase ){
        //let ifState = this.SYMBOLS[i].getIfStatement();
        let ifBlock = this.SYMBOLS[i].parseIfCaseExpression( this.variables );
        // Add ifBlock symbols to Flowchart instead of IfCase
        this.SYMBOLS.splice( i, 1 );
        for (let k = 0; k < ifBlock.length; k++) {
          this.SYMBOLS.splice( i+k, 0, ifBlock[k] );
        }
        //this.SYMBOLS.splice( i, 1, ifBlock );
        console.log(this.SYMBOLS);
        i = 0;
      } else

      // WHILE LOOP
      if( this.SYMBOLS[i] instanceof WhileLoop ){
        this.SYMBOLS[i].parseWhileLoopExp();
      } else

      // STOP
      if( this.SYMBOLS[i] instanceof Stop ){
        console.log( 'End Program' );
        this.isProgramRunning = false;
      }
    }

    console.log(this.variables);
    
  }

}