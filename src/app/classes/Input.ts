import { Declare } from "./Declare";

export class Input{

  static id: string = 's_input';
  static s_name: string = 'Input';

  variableName: string = '';
  inputExpression: string = '';

  inputSymbol: any;

  constructor(){}

  setVariableName(var_name: string){ this.variableName = var_name; }
  getVariableName(){ return this.variableName; }

  setInputSymbol( symbol: any ){ this.inputSymbol = symbol; }
  getInputSymbol(){ return this.inputSymbol; }

  getInputExpression(){
    this.inputExpression = this.getVariableName();
    return this.inputExpression;
  }

  toString(){ return '\tInput ' + this.getInputExpression() + '\n'; }

  parseInputExp( declare: Declare ){
    return 'Enter a value of type ' + declare.getDataType() + ' for variable ' + declare.getVariableName(); 
  }
  
}