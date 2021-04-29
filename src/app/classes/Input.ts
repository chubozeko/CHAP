//import { Declare } from "./Declare";
import { from } from "rxjs";
import { Variable } from "./Variable";


export class Input {

  static s_name: string = 'Input';
  id: string = 's_input';

  variableName: string = '';
  inputExpression: string = '';

 inputPrompt: string = '';

  inputSymbol: any;

  constructor() { }

  createInputSymbol(inputSym: any) {
    this.inputExpression = inputSym.inputExpression;
    this.inputPrompt = inputSym.inputPrompt;
    this.inputSymbol = inputSym.inputSymbol;
    this.variableName = inputSym.variableName;
  }

  setVariableName(var_name: string) { this.variableName = var_name; }
  getVariableName() { return this.variableName; }

  setInputSymbol(symbol: any) { this.inputSymbol = symbol; }
  getInputSymbol() { return this.inputSymbol; }

  getInputExpression() {
    this.inputExpression = this.getVariableName();
    
    return this.inputExpression;
  }

  parseInputExp(variable: Variable) {
    //this.inputPrompt.fontsize('15px');
   // this.inputPrompt.fontcolor('red');

    this.inputPrompt = "  Enter a Value Of Type " + variable.getDataType() + " For Variable " + variable.getName();
  
    return this.inputPrompt;
  }

  pseudoCode() { return '\tInput ' + this.getInputExpression() + '\n'; }

  cplusplusCode() {
    return '\tcin>>' + this.getVariableName() + ';\n';
  }

  getJavaCode() {
    return '\t\t' + this.getVariableName() + ' = System.console().readLine();\n';
  }

}