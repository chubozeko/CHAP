export class IfCase{

  static id: string = 's_if_case';
  static s_name: string = 'If';

  ifStatement: string;

  trueExpression: string;
  trueBlock: any[];

  falseExpression: string;
  falseBlock: any[];

  constructor(){}

  setIfStatement(if_exp: string){ this.ifStatement = if_exp; }
  getIfStatement(){ return this.ifStatement; }

  parseIfStatement(){
    // parse if-statement into True & False

    // this.trueExpression

    // this.falseExpression
    
  }

}