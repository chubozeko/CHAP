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

  pseudoCode(){ return '\tOutput ' + this.getOutputExpression().replace(/\&/g,', ') + '\n'; }
  // toString(){ return '\tOutput \'' + this.getOutputExpression() + '\'\n'; }

  cplusplusCode(){
    //let exp = this.getOutputExpression();
    //exp.replace(/\&/g,'<<');
    return '\tcout<<' + this.getOutputExpression().replace(/\&/g,'<<') + '<<endl;\n';
  }

}