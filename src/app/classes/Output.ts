export class Output {

  static s_name: string = 'Output';
  id: string = 's_output';

  outputExp: string = '';

  outputSymbol: any;

  constructor() { }

  createOutputSymbol(outputSym: any) {
    this.outputExp = outputSym.outputExp;
    this.outputSymbol = outputSym.outputSymbol;
  }

  setOutputExpression(exp: string) { this.outputExp = exp; }
  getOutputExpression() { return this.outputExp; }

  setOutputSymbol(symbol: any) { this.outputSymbol = symbol; }
  getOutputSymbol() { return this.outputSymbol; }

  parseExpression() {
    // parse the output expression
  }

  pseudoCode() { return '\tOutput ' + this.getOutputExpression().replace(/\&/g, ', ') + '\n'; }

  cplusplusCode() {
    return '\tcout<<' + this.getOutputExpression().replace(/\&/g, '<<') + '<<endl;\n';
  }

  getJavaCode() {
    return '\t\tSystem.out.println(' + this.getOutputExpression().replace(/\&/g, ' + ') + ');\n';
  }

}