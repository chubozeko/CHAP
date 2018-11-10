export class Process{

  static id: string = 's_process';
  static s_name: string = 'Process';

  variableName: string;
  expression: string;

  constructor(){}

  setVariableName(var_name: string){ this.variableName = var_name; }
  getVariableName(){ return this.variableName; }

  setExpression(exp: string){ this.expression = exp; }
  getExpression(){ return this.expression; }

  parseExpression(){
    // parse the expression
  }
}