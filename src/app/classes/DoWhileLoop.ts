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
    this.trueLoopBlock = [];
    this.falseLoopBlock = [];
  }

  setDoWhileExpression(do_while_exp: string){ this.doWhileExpression = do_while_exp; }
  getDoWhileExpression(){ return this.doWhileExpression; }

  setDoWhileSymbol(doWhileSym: any){ this.doWhileSymbol = doWhileSym; }
  getDoWhileSymbol(){ return this.doWhileSymbol; }

  parseDoWhileExpression(){}

  addSymbolToTrueBlock( symbol: any, position: number){ this.trueLoopBlock.splice(position, 0, symbol); }
  getSymbolFromTrueBlock( index: number ){ return this.trueLoopBlock[index]; }
  removeSymbolFromTrueBlock( position: number ){ this.trueLoopBlock.splice(position, 1); }

  pseudoCode(){ 
    let doWhileTrue = '';
    for (let i = 0; i < this.trueLoopBlock.length; i++) {
      const el = this.trueLoopBlock[i];
      doWhileTrue += '\t' + el.pseudoCode();
    }
    return '\tDo\n' + doWhileTrue + '\tWhile ' + this.getDoWhileExpression() + '\n\tEnd Do While\n'; 
  }

  cplusplusCode(){
    let doWhileTrue = '';
    for (let i = 0; i < this.trueLoopBlock.length; i++) {
      const el = this.trueLoopBlock[i];
      doWhileTrue += '\t' + el.cplusplusCode();
    }
    return '\tdo { \n' + doWhileTrue + '\t} while (' + this.getDoWhileExpression() + ');\n';
  }
  
}