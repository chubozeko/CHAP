export class IfCase{

  static id: string = 's_if_case';
  static s_name: string = 'If';

  ifStatement: string = '';
  ifcaseSymbol: any;

  trueExpression: string;
  trueBlockSymbols: any[];

  falseExpression: string;
  falseBlockSymbols: any[];

  constructor(){
    this.trueBlockSymbols = [];
    this.falseBlockSymbols = [];
  }

  setIfStatement(if_exp: string){ this.ifStatement = if_exp; }
  getIfStatement(){ return this.ifStatement; }

  setIfCaseSymbol(ifSym: any){ this.ifcaseSymbol = ifSym; }
  getIfCaseSymbol(){ return this.ifcaseSymbol; }

  addSymbolToTrueBlock( symbol: any, position: number){ this.trueBlockSymbols.splice(position, 0, symbol); }
  getSymbolFromTrueBlock( index: number ){ return this.trueBlockSymbols[index]; }

  addSymbolToFalseBlock( symbol: any, position: number){ this.falseBlockSymbols.splice(position, 0, symbol); }
  getSymbolFromFalseBlock( index: number ){ return this.falseBlockSymbols[index]; }

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
        } else {
          let v = exps[i];
          let temp: any;
          if ( !isNaN(parseInt(v)) || !isNaN(parseFloat(v)) ){
            let a = v.split('.');
            if( a.length>1 ) temp = parseFloat(v); else temp = parseInt(v);
          } else if( v=='true' ){ temp = true; } 
          else if( v=='false' ){ temp = false; } 
          else { temp = v.toString(); }
          exps.splice( i, 1, temp );
        }
      }
    }

    // Calculate expression
    while( opers.length != 0 ){
      if( opers.indexOf('%') != -1 ){ j = opers.indexOf('%'); }
      else if( opers.indexOf('/') != -1 ){ j = opers.indexOf('/'); }
      else if( opers.indexOf('*') != -1 ){ j = opers.indexOf('*'); }
      else if( opers.indexOf('+') != -1 ){ j = opers.indexOf('+'); }
      else if( opers.indexOf('-') != -1 ){ j = opers.indexOf('-'); }
      else if( opers.indexOf('<') != -1 ){ j = opers.indexOf('<'); }
      else if( opers.indexOf('<=') != -1 ){ j = opers.indexOf('<='); }
      else if( opers.indexOf('>') != -1 ){ j = opers.indexOf('>'); }
      else if( opers.indexOf('>=') != -1 ){ j = opers.indexOf('>='); }
      else if( opers.indexOf('==') != -1 ){ j = opers.indexOf('=='); }
      else if( opers.indexOf('!=') != -1 ){ j = opers.indexOf('!='); }
      else if( opers.indexOf('&&') != -1 ){ j = opers.indexOf('&&'); }
      else if( opers.indexOf('||') != -1 ){ j = opers.indexOf('||'); }

      op = opers[j];
      oper1 = exps[j];
      oper2 = exps[j+1];
  
      switch(typeof(oper1)){
        case "number": result = this.calculateIntegerExpression(oper1, oper2, op); break;
        //case "number": result = this.calculateRealExpression(oper1, oper2, op); break;
        case "string": result = this.calculateStringExpression(oper1, oper2, op); break;
        case "boolean": result = this.calculateBooleanExpression(oper1, oper2, op); break;
        default: break;
      }
    
      opers.splice( j, 1 );
      exps.splice( j, 2, result );
  
      console.log('Values: ');
      console.log(parsedValues);
      console.log('Operators: ');
      console.log(opers);
    } 

    console.log(exps);
    console.log(opers);

    if( exps[0] == true ) return this.trueBlockSymbols;
    else if( exps[0] == false ) return this.falseBlockSymbols;   
  }

  calculateIntegerExpression( num1: number, num2: number, operator: string ){
    let result: any;
	  switch (operator){
		  case '+':	result = num1 + num2;	break;
		  case '-':	result = num1 - num2;	break;
		  case '*':	result = num1 * num2;	break;
      case '/':	result = num1 / num2;	break;
      case '%':	result = num1 % num2;	break;
      case '<':	result = num1 < num2;	break;
      case '>':	result = num1 > num2;	break;
      case '<=':	result = num1 <= num2;	break;
      case '>=':	result = num1 >= num2; break;
      case '!=':	result = num1 != num2;	break;
      case '==':	result = num1 == num2;	break;
      case '&&':	result = num1 && num2;	break;
      case '||':	result = num1 || num2;	break;
		  default:	break;
    }
    if (typeof(result) == "number") return Math.floor(result);
    else return result;
  }

  calculateRealExpression( num1: number, num2: number, operator: string ){
    let result: any;
	  switch (operator){
		  case '+':	result = num1 + num2;	break;
		  case '-':	result = num1 - num2;	break;
		  case '*':	result = num1 * num2;	break;
      case '/':	result = num1 / num2;	break;
      case '%':	result = num1 % num2;	break;
      case '<':	result = num1 < num2;	break;
      case '>':	result = num1 > num2;	break;
      case '<=':	result = num1 <= num2;	break;
      case '>=':	result = num1 >= num2; break;
      case '!=':	result = num1 != num2;	break;
      case '==':	result = num1 == num2;	break;
      case '&&':	result = num1 && num2;	break;
      case '||':	result = num1 || num2;	break;
		  default:	break;
    }
    return result;
  }

  calculateBooleanExpression( bool1: boolean, bool2: boolean, operator: string ){
    let result: any;
	  switch (operator){
      case '!=':	result = bool1 != bool2;	break;
      case '==':	result = bool1 == bool2;	break;
      case '&&':	result = bool1 && bool2;	break;
      case '||':	result = bool1 || bool2;	break;
		  default: console.log('Invalid expression for Booleans!'); break;
    }
    return result;
  }

  calculateStringExpression( str1: string, str2: string, operator: string ){
    let result: any;
	  switch (operator){
      case '<':	result = str1 < str2;	break;
      case '>':	result = str1 > str2;	break;
      case '<=':	result = str1 <= str2;	break;
      case '>=':	result = str1 >= str2; break;
      case '!=':	result = str1 != str2;	break;
      case '==':	result = str1 == str2;	break;
      case '&&':	result = str1 && str2;	break;
      case '||':	result = str1 || str2;	break;
		  default: console.log('Invalid expression for Strings!');	break;
    }
    return result;
  }

  pseudoCode(){ return '\tIf ' + this.getIfStatement() + '\n'; }

  cplusplusCode(){
    return '\t' + this.getIfStatement() + ';\n';
  }

}