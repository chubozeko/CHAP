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

  addSymbolToTrueBlock( symbol: any, position: number){ this.trueLoopBlock.splice(position, 0, symbol); }
  getSymbolFromTrueBlock( index: number ){ return this.trueLoopBlock[index]; }
  removeSymbolFromTrueBlock( position: number ){ this.trueLoopBlock.splice(position, 1); }

  pseudoCode(){ 
    let forTrue = '';
    for (let i = 0; i < this.trueLoopBlock.length; i++) {
      const el = this.trueLoopBlock[i];
      forTrue += '\t' + el.pseudoCode();
    }
    return '\tFor ' + this.getForExpression() + ' Do\n' + forTrue + '\tEnd For\n'; 
  }

  cplusplusCode(){
    let forTrue = '', forExp = '';
    for (let i = 0; i < this.trueLoopBlock.length; i++) {
      const el = this.trueLoopBlock[i];
      forTrue += '\t' + el.cplusplusCode();
    }
    forExp += this.getVariableName() + '=' + this.getStartValue() + '; ';
    forExp += this.getVariableName() + '<' + this.getEndValue() + '; ';
    if(this.getStepDirection() == 'Increasing'){
      forExp += this.getVariableName() + '=' + this.getVariableName() + '+' + this.getStepValue();
    } else if(this.getStepDirection() == 'Decreasing'){
      forExp += this.getVariableName() + '=' + this.getVariableName() + '-' + this.getStepValue();
    }
    return '\tfor (' + forExp + '){\n' + forTrue + '\t} \n';
  }
  
}