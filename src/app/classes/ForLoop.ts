export class ForLoop{

  static id: string = 's_for_loop';
  static s_name: string = 'For';

  forLoopExpression: string;
  forLoopSymbol: any;

  trueExpression: string;
  trueLoopBlock: any[];

  falseExpression: string;
  falseLoopBlock: any[];

  constructor(){}

  setForExpression(for_exp: string){ this.forLoopExpression = for_exp; }
  getForExpression(){ return this.forLoopExpression; }

  setForSymbol(forSym: any){ this.forLoopSymbol = forSym; }
  getForSymbol(){ return this.forLoopSymbol; }

  parseForLoopExpression(){}

  addSymbolToTrueBlock(){}
  getSymbolFromTrueBlock(){}
  removeSymbolFromTrueBlock(){}

  // addSymbolToFalseBlock(){}
  // getSymbolFromFalseBlock(){}
  // removeSymbolFromFalseBlock(){}

  pseudoCode(){ 
    let forTrue = '', forFalse = '';
    for (let i = 0; i < this.trueLoopBlock.length; i++) {
      const el = this.trueLoopBlock[i];
      forTrue += '\t' + el.pseudoCode();
    }
    for (let i = 0; i < this.falseLoopBlock.length; i++) {
      const el = this.falseLoopBlock[i];
      forFalse += '\t' + el.pseudoCode();
    }
    return '\For ' + this.getForExpression() + ' Do\n' + forTrue + '\tEnd For\n'; 
  }

  cplusplusCode(){
    let forTrue = '', forFalse = '';
    for (let i = 0; i < this.trueLoopBlock.length; i++) {
      const el = this.trueLoopBlock[i];
      forTrue += '\t' + el.cplusplusCode();
    }
    for (let i = 0; i < this.falseLoopBlock.length; i++) {
      const el = this.falseLoopBlock[i];
      forFalse += '\t' + el.cplusplusCode();
    }
    return '\for (' + this.getForExpression() + '){\n' + forTrue + '\t} \n';
  }
  
}