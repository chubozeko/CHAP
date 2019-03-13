export class WhileLoop{

  static id: string = 's_while_loop';
  static s_name: string = 'While';

  whileExpression: string;
  whileSymbol: any;

  trueExpression: string;
  trueLoopBlock: any[];

  falseExpression: string;
  falseLoopBlock: any[];

  constructor(){
    this.whileExpression = '';
  }

  setWhileExpression(while_exp: string){ this.whileExpression = while_exp; }
  getWhileExpression(){ return this.whileExpression; }

  setWhileSymbol(whileSym: any){ this.whileSymbol = whileSym; }
  getWhileSymbol(){ return this.whileSymbol; }

  parseWhileExpression(){}

  addSymbolToTrueBlock(){}
  getSymbolFromTrueBlock(){}
  removeSymbolFromTrueBlock(){}

  // addSymbolToFalseBlock(){}
  // getSymbolFromFalseBlock(){}
  // removeSymbolFromFalseBlock(){}

  pseudoCode(){ 
    let whiletrue = '', whilefalse = '';
    for (let i = 0; i < this.trueLoopBlock.length; i++) {
      const el = this.trueLoopBlock[i];
      whiletrue += '\t' + el.pseudoCode();
    }
    for (let i = 0; i < this.falseLoopBlock.length; i++) {
      const el = this.falseLoopBlock[i];
      whilefalse += '\t' + el.pseudoCode();
    }
    return '\tWhile ' + this.getWhileExpression() + ' Do\n' + whiletrue + '\tEnd While\n'; 
  }

  cplusplusCode(){
    let whiletrue = '', whilefalse = '';
    for (let i = 0; i < this.trueLoopBlock.length; i++) {
      const el = this.trueLoopBlock[i];
      whiletrue += '\t' + el.cplusplusCode();
    }
    for (let i = 0; i < this.falseLoopBlock.length; i++) {
      const el = this.falseLoopBlock[i];
      whilefalse += '\t' + el.cplusplusCode();
    }
    return '\twhile (' + this.getWhileExpression() + '){\n' + whiletrue + '\t} \n';
  }
  
}