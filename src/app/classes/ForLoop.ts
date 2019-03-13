export class ForLoop{

  static id: string = 's_for_loop';
  static s_name: string = 'For';

  forLoopExpression: string = '';
  forLoopSymbol: any;

  forVariableName: string = '';
  startValue: number;
  endValue: number;
  stepDirection: string = '';
  stepValue: number = 1;

  trueExpression: string;
  trueLoopBlock: any[];

  falseExpression: string;
  falseLoopBlock: any[];

  constructor(){
    this.forVariableName = '';
    this.startValue = 0;
    this.endValue = 0;
    this.stepDirection = '';
    this.stepValue = 1;
    this.trueLoopBlock = [];
    this.falseLoopBlock = [];
  }

  setVariableName(var_name: string){ this.forVariableName = var_name; }
  getVariableName(){ return this.forVariableName; }

  setStartValue(startVal: number){ this.startValue = startVal; }
  getStartValue(){ return this.startValue; }

  setEndValue(endVal: number){ this.endValue = endVal; }
  getEndValue(){ return this.endValue; }

  setStepDirection(stepDir: string){ this.stepDirection = stepDir; }
  getStepDirection(){ return this.stepDirection; }

  setStepValue(stepVal: number){ this.stepValue = stepVal; }
  getStepValue(){ return this.stepValue; }

  setForExpression(){ 
    this.forLoopExpression = '';
    this.forLoopExpression += this.getVariableName() + ' = ' + this.getStartValue() + ' to ' + this.getEndValue();
    if( this.getStepDirection() == 'Increasing' ){
      this.forLoopExpression += ' increment ' + this.getStepValue();
    } else {
      this.forLoopExpression += ' decrement ' + this.getStepValue();
    }
  }
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