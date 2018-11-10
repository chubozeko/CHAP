export class Output{

  static id: string = 's_output';
  static s_name: string = 'Output';

  outputExp: string;

  constructor(){}

  setOutputExpression(exp: string){ this.outputExp = exp; }
  getOutputExpression(){ return this.outputExp; }

  parseExpression(){
    // parse the output expression
  }

}