export class WhileLoop{

  static id: string = 's_while_loop';
  static s_name: string = 'While';

  whileExpression: string;
  whileSymbol: any;

  trueExpression: string;
  trueLoopBlock: any[];

  falseExpression: string;
  falseLoopBlock: any[];

  constructor(){}

  setWhileExpression(while_exp: string){ this.whileExpression = while_exp; }
  getWhileExpression(){ return this.whileExpression; }

  setWhileSymbol(whileSym: any){ this.whileSymbol = whileSym; }
  getWhileSymbol(){ return this.whileSymbol; }

  // parseTrueExpression(result: any, vars: any[]){}

  parseExpression(){}
  
}