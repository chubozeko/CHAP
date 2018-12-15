export class IfCase{

  static id: string = 's_if_case';
  static s_name: string = 'If';

  ifStatement: string = '';
  ifcaseSymbol: any;

  trueExpression: string;
  trueBlockSymbols: any[];

  falseExpression: string;
  falseBlockSymbols: any[];

  constructor(){}

  setIfStatement(if_exp: string){ this.ifStatement = if_exp; }
  getIfStatement(){ return this.ifStatement; }

  setIfCaseSymbol(ifSym: any){ this.ifcaseSymbol = ifSym; }
  getIfCaseSymbol(){ return this.ifcaseSymbol; }

  parseIfStatement(){

    let strSplit = [], values = [], operators = [], parsedValues = [];
    let op = '', oper1, oper2, result, j = 0;

    // // Check for operators
    // if( (this.expression.indexOf('+') != -1) || (this.expression.indexOf('-') != -1) ||
    // (this.expression.indexOf('*') != -1) || (this.expression.indexOf('/') != -1) ){ 
    //   // Split expression by operators
    //   strSplit = this.expression.split(/[\+\-\*\/]+/g);
    //   // Stored operators in an Array called "operators"
    //   operators = this.expression.match(/[\+\-\*\/]+/g);
    //   // Store operands in an Array called "values"
    //   for (let i = 0; i < strSplit.length; i++) { values[i] = strSplit[i].trim(); }
    // } else { 
    //   values.splice( values.length, 0, this.expression.trim() );
    //     // T: add variable.value to values[]
    //     // F: alert('Variable not declared in expression')
    //   // Make this.expression = this.variables[index].value
    // }

    // // Check if it is a variable name
    // for (let i = 0; i < values.length; i++) {
    //   for (let j = 0; j < variables.length; j++) {
    //     if( variables[j].getName() == values[i] ){
    //       values.splice( i, 1, variables[j].value );
    //     }
    //   }
    // }

    // // Convert "values[]" to desired data type
    // switch(dataType){
    //   case 'Integer': 
    //     for (let i = 0; i < values.length; i++) { parsedValues.splice( parsedValues.length, 0, parseInt(values[i]) ); }
    //   break;
    //   case 'Real': 
    //     for (let i = 0; i < values.length; i++) { parsedValues.splice( parsedValues.length, 0, parseFloat(values[i]) ); }
    //   break;
    //   case 'String': 
    //     for (let i = 0; i < values.length; i++) { parsedValues.splice( parsedValues.length, 0, values[i].toString() ); }
    //   break;
    //   case 'Boolean': 
    //     for (let i = 0; i < values.length; i++) {
    //       if( values[i] == "true" ) parsedValues.splice( parsedValues.length, 0, true );
    //       if( values[i] == "false" ) parsedValues.splice( parsedValues.length, 0, false );
    //     }
    //   break;
    //   default: break;
    // }

    // console.log('Operators: ');
    // console.log(operators);

    // console.log('Values: ');
    // console.log(parsedValues);

    // while( operators.length != 0 ){
    //   if( operators.indexOf('/') != -1 ){ j = operators.indexOf('/'); } 
    //   else if( operators.indexOf('*') != -1 ){ j = operators.indexOf('*'); }
    //   else if( operators.indexOf('+') != -1 ){ j = operators.indexOf('+'); }
    //   else if( operators.indexOf('-') != -1 ){ j = operators.indexOf('-'); }

    //   op = operators[j];
    //   oper1 = parsedValues[j];
    //   oper2 = parsedValues[j+1];
  
    //   switch(dataType){
    //     case 'Integer': result = this.calculateIntegerExpression(oper1, oper2, op); break;
    //     case 'Real': result = this.calculateRealExpression(oper1, oper2, op); break;
    //     case 'String': result = this.calculateStringExpression(oper1, oper2, op); break;
    //     case 'Boolean': result = this.calculateBooleanExpression(oper1, oper2, op); break;
    //     default: break;
    //   }
    
    //   operators.splice( j, 1 );
    //   parsedValues.splice( j, 2, result );
  
    //   console.log('Values: ');
    //   console.log(parsedValues);
    //   console.log('Operators: ');
    //   console.log(operators);
    // }  
    
    // console.log(parsedValues);
    // return parsedValues[0];
    
  }

}