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
import { DoWhileLoop } from "./DoWhileLoop";
import { ForLoop } from "./ForLoop";

export class Flowchart{

  SYMBOLS: any[];
  tempSymbols: any[];
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
    // let defaultSymbols = document.getElementsByClassName('symbols');
    // for (let i = 0; i < defaultSymbols.length; i++) {
    //   this.SYMBOLS.splice( i, 0, defaultSymbols[i] );
    // }
    let start = new Start();
    let stop = new Stop();
    this.SYMBOLS = [];
    this.variables = [];
    this.tempSymbols = [];

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

  addSymbolToFlowchart( symbol: any, position: number){ 
    this.SYMBOLS.splice(position, 0, symbol); 
  }

  removeSymbolFromFlowchart( position: number ){ 
    this.SYMBOLS.splice(position, 1); 
  }

  getSymbolFromFlowchart( index: number ){ 
    return this.SYMBOLS[index]; 
  }

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
    
    for (let q = 0; q < this.SYMBOLS.length; q++) {
      this.tempSymbols.splice( q, 0, this.SYMBOLS[q] ); 
    }

    if(startIndex == 0){
      this.variables = [];
    }
    let varIndex = 0;

    for(let i=startIndex; i<this.tempSymbols.length; i++){

      // START
      if( this.tempSymbols[i] instanceof Start ){
        console.log( 'Start Program' );
        this.isProgramRunning = true;
      } else

      // DECLARE
      if( this.tempSymbols[i] instanceof Declare ){
        let vars = this.tempSymbols[i].parseDeclareExp();
        for (let a = 0; a < vars.length; a++) {
          this.variables.splice(this.variables.length, 0, vars[a] ); 
        }
      } else

      // INPUT
      if( this.tempSymbols[i] instanceof Input ){
        let isVarDeclared = false;
        for( let j=0; j<this.variables.length; j++ ){
          if( this.tempSymbols[i].getVariableName() == this.variables[j].getName() ){
            isVarDeclared = true;
            varIndex = j;
          }
        }
        if(!isVarDeclared){
          this.showAlert('Invalid Statement at \'Input\'','Variable \"' + this.tempSymbols[i].getVariableName() + '\" is not declared!');
        } else { 
          console.log('input variable declared! carry on...');
          if( !this.isInputEntered )
            this.validateInput(varIndex, i);
        }
      } else

      // PROCESS
      if( this.tempSymbols[i] instanceof Process ){
        let isVarDeclared = false;
        for( let j=0; j<this.variables.length; j++){
          if( this.tempSymbols[i].getVariableName() == this.variables[j].getName() ){
            isVarDeclared = true;
            varIndex = j;
          }
        }
        if(!isVarDeclared){
          this.showAlert('Invalid Statement at \'Process\'','Variable \"' + this.tempSymbols[i].getVariableName() + '\" is not declared!');
        } else {
          console.log('process variable declared. carry on...');
          this.validateProcess( this.tempSymbols[i], varIndex );
        }
      } else

      // OUTPUT
      if( this.tempSymbols[i] instanceof Output ){
        let isVarDeclared, hasQuotes = 0, outputS = ''; 
        let outputStr: string = this.tempSymbols[i].getOutputExpression();
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
          let s1 = this.tempSymbols[i].getOutputExpression();
          let s2 = s1.split('&');
          for (let i = 0; i < s2.length; i++) {
            let str = s2[i].trim();
            for( let l=0; l<this.variables.length; l++){
              if( str == this.variables[l].getName() ){
                if( this.variables[l].value == undefined && isNaN(this.variables[l].value) ) { outputS = ''; } else
                  outputS += this.variables[l].value;
              }
            }
          }
        } else if( hasQuotes>0 ){
          // Output String expression
          let s1 = this.tempSymbols[i].getOutputExpression();
          let s2 = s1.split('&');
          for (let i = 0; i < s2.length; i++) {
            let str = s2[i].trim();
            if( str.indexOf("\"") != -1 ){
              let str2 = str.replace(/\"/g,'');
              outputS += str2;
            } else {
              for( let l=0; l<this.variables.length; l++){
                if( str == this.variables[l].getName() ){
                  if( this.variables[l].value == undefined && isNaN(this.variables[l].value) ){ outputS = ''; } else
                    outputS += this.variables[l].value;
                }
              }
            }
          }
        }

        this.consoleLog.value += outputS;
      } else

      // COMMENT
      if( this.tempSymbols[i] instanceof Comment ){ break; } else

      // IF CASE
      if( this.tempSymbols[i] instanceof IfCase ){
        let ifBlock = this.tempSymbols[i].parseIfCaseExpression( this.variables );
        // Add ifBlock symbols to Flowchart instead of IfCase
        this.tempSymbols.splice( i, 1 );
        for (let k = 0; k < ifBlock.length; k++) {
          this.tempSymbols.splice( i+k, 0, ifBlock[k] );
        }
        --i;
      } else

      // WHILE LOOP
      if( this.tempSymbols[i] instanceof WhileLoop ){

        let whileBoolean;
        do {
          let whileBlock = this.tempSymbols[i].parseWhileLoopExpression( this.variables );
          if( whileBlock.length != 0 ) whileBoolean = true;
          else whileBoolean = false;

          // Add whileBlock symbols to Flowchart instead of WhileLoop
          this.tempSymbols.splice( i, 1 );
          for (let k = 0; k < whileBlock.length; k++) {
            this.tempSymbols.splice( i+k, 0, whileBlock[k] );
          }
          --i;
        } while ( whileBoolean );

      } else

      // FOR LOOP
      if( this.tempSymbols[i] instanceof ForLoop ){
        //this.tempSymbols[i].parseForLoopExp();
      } else

      // DO WHILE LOOP
      if( this.tempSymbols[i] instanceof DoWhileLoop ){
        //this.tempSymbols[i].parseDoWhileLoopExp();
      } else

      // STOP
      if( this.tempSymbols[i] instanceof Stop ){
        console.log( 'End Program' );
        this.isProgramRunning = false;
      }
    }

    console.log("Variables");
    console.log(this.variables);
    console.log("Symbols");
    console.log(this.SYMBOLS);
    console.log("Temporary symbols");
    console.log(this.tempSymbols);
  }

}