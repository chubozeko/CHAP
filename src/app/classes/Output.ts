export class Output{

  static id: string = 's_output';
  static s_name: string = 'Output';

  outputExp: string = '';

  outputSymbol: any;

  constructor(){}

  setOutputExpression(exp: string){ this.outputExp = exp; }
  getOutputExpression(){ return this.outputExp; }

  setOutputSymbol( symbol: any ){ this.outputSymbol = symbol; }
  getOutputSymbol(){ return this.outputSymbol; }

  parseExpression(){
    // parse the output expression
  }

  pseudoCode(){ return '\tOutput ' + this.getOutputExpression() + '\n'; }
  // toString(){ return '\tOutput \'' + this.getOutputExpression() + '\'\n'; }

  cplusplusCode(){
    return '\tcout<<' + this.getOutputExpression() + '<<endl;\n';
  }

}