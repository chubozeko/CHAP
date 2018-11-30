export class Process{

  static id: string = 's_process';
  static s_name: string = 'Process';

  variableName: string = '';
  expression: string = '';
  processExpression: string = '';

  processValue;

  processSymbol: any;

  constructor(){ this.processValue = new Array(); }

  setProcessSymbol( symbol: any ){ this.processSymbol = symbol; }
  getProcessSymbol(){ return this.processSymbol; }

  setVariableName(var_name: string){ this.variableName = var_name; }
  getVariableName(){ return this.variableName; }

  setExpression(exp: string){ this.expression = exp; }
  getExpression(){ return this.expression; }

  getProcessExpression(){
    this.processExpression = this.getVariableName() + ' = ' + this.getExpression();
    return this.processExpression;
  }

  parseExpression( dataType: string ){
    // parse the expression
    let str = [], strX = [], values = [], operators = [], parsedValues = [];

    if( this.expression.indexOf(' ') != -1 ){
      str = this.expression.split(' ');
    } else if( this.expression.indexOf('\"') != -1){
      str[0] = this.expression.replace(/"/g,'');
    } else {
      str = this.expression.split('');
      // // Check for operators
      // if( (this.expression.indexOf('+') != -1) || (this.expression.indexOf('-') != -1) ||
      //     (this.expression.indexOf('*') != -1) || (this.expression.indexOf('/') != -1) ){ 
      //   strX[0] = this.expression;
      // } else { }
    }

    let si = 0;
    for (let i=0; i<this.expression.length; i++) {
      let char = this.expression[i];
      if( (char == '+') || (char == '-') || (char == '*') || (char == '/') ){
        operators.splice( operators.length, 0, char );
        let x = this.expression.substring(si, i);
        values.splice( values.length, 0, x.trim() );
        si = i+1;
      }
      
    }

    // for(let i=0; i<str.length; i++){
    //   if( str[i] == '+' ){ operators.splice( operators.length, 0, str[i] ); }
    //   else if( str[i] == '-' ){ operators.splice( operators.length, 0, str[i] ); }
    //   else if( str[i] == '*' ){ operators.splice( operators.length, 0, str[i] ); }
    //   else if( str[i] == '/' ){ operators.splice( operators.length, 0, str[i] ); }
    //   else { values.splice( values.length, 0, str[i] ); }
    // }

    switch(dataType){
      case 'Integer': 
        for (let i = 0; i < values.length; i++) { parsedValues.splice( parsedValues.length, 0, parseInt(values[i]) ); }
      break;
      case 'Real': 
        for (let i = 0; i < values.length; i++) { parsedValues.splice( parsedValues.length, 0, parseFloat(values[i]) ); }
      break;
      case 'String': 
        for (let i = 0; i < values.length; i++) { parsedValues.splice( parsedValues.length, 0, values[i].toString() ); }
      break;
      case 'Boolean': 
        for (let i = 0; i < values.length; i++) {
          if( values[i] == "true" ) parsedValues.splice( parsedValues.length, 0, true );
          if( values[i] == "false" ) parsedValues.splice( parsedValues.length, 0, false );
        }
      break;
      default: break;
    }

    console.log(str);
    console.log(values);
    console.log(operators);

    return parsedValues[0];
    
    
  }

  calculateIntegerExpression( num1: number, num2: number, operator: string ){
    let result: number;
	  switch (operator){
		  case '+':	result = num1 + num2;	break;
		  case '-':	result = num1 - num2;	break;
		  case '*':	result = num1 * num2;	break;
		  case '/':	result = num1 / num2;	break;
		  default:	break;
	  }
	  return result;
  }

  calculateRealExpression( num1: number, num2: number, operator: string ){
    let result: number;
	  switch (operator){
		  case '+':	result = num1 + num2;	break;
		  case '-':	result = num1 - num2;	break;
		  case '*':	result = num1 * num2;	break;
		  case '/':	result = num1 / num2;	break;
		  default:	break;
	  }
	  return result;
  }

  calculateBooleanExpression( bool1: number, bool2: number, operator: string ){}

  calculateStringExpression( str1: number, str2: number, operator: string ){}

  pseudoCode(){ return '\tProcess ' + this.getProcessExpression() + '\n'; }

  cplusplusCode(){
    return '\t' + this.getProcessExpression() + ';\n';
  }

}