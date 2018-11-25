export class Process{

  static id: string = 's_process';
  static s_name: string = 'Process';

  variableName: string = '';
  expression: string = '';
  processExpression: string = '';

  processSymbol: any;

  constructor(){}

  setProcessSymbol( symbol: any ){ this.processSymbol = symbol; }
  getProcessSymbol(){ return this.processSymbol; }

  setVariableName(var_name: string){ this.variableName = var_name; }
  getVariableName(){ return this.variableName; }

  setExpression(exp: string){ this.expression = exp; }
  getExpression(){ return this.expression; }

  getProcessExpression(){
    this.processExpression = this.getVariableName() + ' = ' + this.getExpression();
    return this.processExpression;
  }

  parseExpression(){
    // parse the expression
  }

  pseudoCode(){ return '\tProcess ' + this.getProcessExpression() + '\n'; }

  cplusplusCode(){
    return '\t' + this.getProcessExpression() + ';\n';
  }

}