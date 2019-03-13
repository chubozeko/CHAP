export class DoWhileLoop{

  static id: string = 's_do_while_loop';
  static s_name: string = 'Do';

  doWhileExpression: string;
  doWhileSymbol: any;

  trueExpression: string;
  trueLoopBlock: any[];

  falseExpression: string;
  falseLoopBlock: any[];

  constructor(){
    this.doWhileExpression = '';
  }

  setDoWhileExpression(do_while_exp: string){ this.doWhileExpression = do_while_exp; }
  getDoWhileExpression(){ return this.doWhileExpression; }

  setDoWhileSymbol(doWhileSym: any){ this.doWhileSymbol = doWhileSym; }
  getDoWhileSymbol(){ return this.doWhileSymbol; }

  parseDoWhileExpression(){}

  addSymbolToTrueBlock(){}
  getSymbolFromTrueBlock(){}
  removeSymbolFromTrueBlock(){}

  // addSymbolToFalseBlock(){}
  // getSymbolFromFalseBlock(){}
  // removeSymbolFromFalseBlock(){}

  pseudoCode(){ 
    let doWhileTrue = '', doWhileFalse = '';
    for (let i = 0; i < this.trueLoopBlock.length; i++) {
      const el = this.trueLoopBlock[i];
      doWhileTrue += '\t' + el.pseudoCode();
    }
    for (let i = 0; i < this.falseLoopBlock.length; i++) {
      const el = this.falseLoopBlock[i];
      doWhileFalse += '\t' + el.pseudoCode();
    }
    return '\tWhile ' + this.getDoWhileExpression() + ' Do\n' + doWhileTrue + '\tEnd While\n'; 
  }

  cplusplusCode(){
    let doWhileTrue = '', doWhileFalse = '';
    for (let i = 0; i < this.trueLoopBlock.length; i++) {
      const el = this.trueLoopBlock[i];
      doWhileTrue += '\t' + el.cplusplusCode();
    }
    for (let i = 0; i < this.falseLoopBlock.length; i++) {
      const el = this.falseLoopBlock[i];
      doWhileFalse += '\t' + el.cplusplusCode();
    }
    return '\twhile (' + this.getDoWhileExpression() + '){\n' + doWhileTrue + '\t} \n';
  }
  
}