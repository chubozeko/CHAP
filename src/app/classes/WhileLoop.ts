export class WhileLoop{

  static id: string = 's_while_loop';
  static s_name: string = 'While';

  whileExpression: string;
  trueExpression: string;
  falseExpression: string;

  constructor(){}

  setWhileExpression(while_exp: string){ this.whileExpression = while_exp; }
  getWhileExpression(){ return this.whileExpression; }

  // parseTrueExpression(result: any, vars: any[]){}

  parseExpression(){}
  
}