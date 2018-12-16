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

  parseIfCaseExpression( variables: any[] ){

    let strSplit = [], values = [], opers = [], parsedValues = [];
    let op = '', oper1, oper2, result, j = 0;

    let exps = [], exps1 = [], conds = [], conds1 = [], condOps = [], conState = [], conState1 = [], conStateOps = [];

    // LOGICAL Operators: &&, ||, !
    if( (this.ifStatement.indexOf('&&') != -1) || (this.ifStatement.indexOf('||') != -1) || (this.ifStatement.indexOf('!') != -1)
      || (this.ifStatement.indexOf('<') != -1) || (this.ifStatement.indexOf('>') != -1) || (this.ifStatement.indexOf('==') != -1)
      || (this.ifStatement.indexOf('<=') != -1) || (this.ifStatement.indexOf('>=') != -1) || (this.ifStatement.indexOf('!=') != -1)
      || (this.ifStatement.indexOf('+') != -1) || (this.ifStatement.indexOf('-') != -1) || (this.ifStatement.indexOf('*') != -1)
      || (this.ifStatement.indexOf('/') != -1) || (this.ifStatement.indexOf('%') != -1) ){ 
      // Split by logical operators
      //exps1 = this.ifStatement.split(/[\&\|\!]+/g);
      exps1 = this.ifStatement.split(/[\&\|\!\>\<\=\+\-\*\/\%]+/g);
      for (let i = 0; i < exps1.length; i++) { exps[i] = exps1[i].trim(); }
      // Store logical operators in "opers"
      //opers = this.ifStatement.match(/[\&\|\!]+/g);
      opers = this.ifStatement.match(/[\&\|\!\>\<\=\+\-\*\/\%]+/g);
    } else {
      exps.splice( exps.length, 0, this.ifStatement.trim() );
    }

    // // CONDITIONAL Operators: <, >, ==, <=, >=, !=
    // for (let j = 0; j < exps.length; j++) {
    //   // Split by conditional operators
    //   conds1 = exps[j].split(/[\>\<\=\!]+/g);
    //   for (let k = 0; k < conds1.length; k++) { conds.splice( conds.length, 0, conds1[k].trim() ); }
    //   // Store conditional operators in "condOps"
    //   condOps.splice( condOps.length, 0, exps[j].match(/[\>\<\=\!]+/g)[0] );
    // }

    // // REGULAR Operators: +, -, *, /, %
    // for (let k = 0; k < conds.length; k++) {
    //   const con = conds[k];
    //   if( (con.indexOf('+') != -1) || (con.indexOf('-') != -1) || (con.indexOf('*') != -1) || (con.indexOf('/') != -1) || (con.indexOf('%') != -1) ){
    //     // Split conditional expressions by operators
    //     conState1 = con.split(/[\+\-\*\/\%]+/g);
    //     for (let l = 0; l < conState1.length; l++) { conState.splice( conState.length, 0, conState1[l].trim() ); }
    //     // Stored operators in an Array called "conStateOps"
    //     condOps.splice(k, 0, con.match(/[\+\-\*\/\%]+/g)[0] );
    //   } else {
    //     conState.splice( conState.length, 0, con.trim() );
    //   }
      
    // }

    // Check if it is a variable name & parse to desired data type
    for (let i = 0; i < exps.length; i++) {
      for (let j = 0; j < variables.length; j++) {
        if( variables[j].getName() == exps[i] ){
          if ( variables[j].getDataType() == 'Integer' ) exps.splice( i, 1, parseInt(variables[j].value) );
          else if ( variables[j].getDataType() == 'Real' ) exps.splice( i, 1, parseFloat(variables[j].value) );
          else if ( variables[j].getDataType() == 'String' ) exps.splice( i, 1, variables[j].value.toString() );
          else if ( variables[j].getDataType() == 'Boolean' ){
            if( variables[j] == "true" ) exps.splice( i, 1, true );
            if( variables[j] == "false" ) exps.splice( i, 1, false );
          }
        }
      }
    }

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

    console.log(exps);
    console.log(opers);
    console.log(conds);
    console.log(condOps);
    console.log(conState);
    console.log(conStateOps);
    
    
    
    

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