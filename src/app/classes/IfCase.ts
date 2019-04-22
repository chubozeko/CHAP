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
  removeSymbolFromTrueBlock( position: number ){ this.trueBlockSymbols.splice(position, 1); }

  addSymbolToFalseBlock( symbol: any, position: number){ this.falseBlockSymbols.splice(position, 0, symbol); }
  getSymbolFromFalseBlock( index: number ){ return this.falseBlockSymbols[index]; }
  removeSymbolFromFalseBlock( position: number ){ this.falseBlockSymbols.splice(position, 1); }

  parseIfCaseExpression( variables: any[] ){

    let opers = [], parsedValues = [], exps = [], exps1 = [];
    let op = '', oper1, oper2, result, j = 0;

    // LOGICAL Operators: &&, ||, !
    if( (this.ifStatement.indexOf('&&') != -1) || (this.ifStatement.indexOf('||') != -1) || (this.ifStatement.indexOf('!') != -1)
      || (this.ifStatement.indexOf('<') != -1) || (this.ifStatement.indexOf('>') != -1) || (this.ifStatement.indexOf('==') != -1)
      || (this.ifStatement.indexOf('<=') != -1) || (this.ifStatement.indexOf('>=') != -1) || (this.ifStatement.indexOf('!=') != -1)
      || (this.ifStatement.indexOf('+') != -1) || (this.ifStatement.indexOf('-') != -1) || (this.ifStatement.indexOf('*') != -1)
      || (this.ifStatement.indexOf('/') != -1) || (this.ifStatement.indexOf('%') != -1) ){ 
      // Split by logical operators
      exps1 = this.ifStatement.split(/[\&\|\!\>\<\=\+\-\*\/\%]+/g);
      for (let i = 0; i < exps1.length; i++) { exps[i] = exps1[i].trim(); }
      // Store logical operators in "opers"
      opers = this.ifStatement.match(/[\&\|\!\>\<\=\+\-\*\/\%]+/g);
    } else {
      exps.splice( exps.length, 0, this.ifStatement.trim() );
    }

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

    console.log("Expressions:");
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

  pseudoCode(){ 
    let iftrue = '', iffalse = '';
    for (let i = 0; i < this.trueBlockSymbols.length; i++) {
      const el = this.trueBlockSymbols[i];
      iftrue += '\t' + el.pseudoCode();
    }
    for (let i = 0; i < this.falseBlockSymbols.length; i++) {
      const el = this.falseBlockSymbols[i];
      iffalse += '\t' + el.pseudoCode();
    }
    return '\tIf ' + this.getIfStatement() + ' Then\n' + iftrue + '\tElse\n' + iffalse + '\tEnd If\n'; 
  }

  cplusplusCode(){
    let iftrue = '', iffalse = '';
    for (let i = 0; i < this.trueBlockSymbols.length; i++) {
      const el = this.trueBlockSymbols[i];
      iftrue += '\t' + el.cplusplusCode();
    }
    for (let i = 0; i < this.falseBlockSymbols.length; i++) {
      const el = this.falseBlockSymbols[i];
      iffalse += '\t' + el.cplusplusCode();
    }
    return '\tif (' + this.getIfStatement() + '){\n' + iftrue + '\telse {\n' + iffalse + '\t} \n';
  }

}
















// ERROR Error: Uncaught (in promise): TypeError: this.tempSymbols[i].parseWhileLoopExpression is not a function
// TypeError: this.tempSymbols[i].parseWhileLoopExpression is not a function
//     at Flowchart.<anonymous> (Flowchart.ts:304)
//     at step (DoWhileLoop.ts:1)
//     at Object.next (DoWhileLoop.ts:1)
//     at DoWhileLoop.ts:1
//     at new ZoneAwarePromise (zone.js:891)
//     at push../src/app/classes/Flowchart.ts.__awaiter (DoWhileLoop.ts:1)
//     at Flowchart.push../src/app/classes/Flowchart.ts.Flowchart.validateFlowchart (Flowchart.ts:162)
//     at HomePage.push../src/app/home/home.page.ts.HomePage.debugProgram (home.page.ts:960)
//     at HTMLElement.<anonymous> (home.page.ts:64)
//     at ZoneDelegate.push../node_modules/zone.js/dist/zone.js.ZoneDelegate.invokeTask (zone.js:421)
//     at resolvePromise (zone.js:814)
//     at new ZoneAwarePromise (zone.js:894)
//     at push../src/app/classes/Flowchart.ts.__awaiter (DoWhileLoop.ts:1)
//     at Flowchart.push../src/app/classes/Flowchart.ts.Flowchart.validateFlowchart (Flowchart.ts:162)
//     at HomePage.push../src/app/home/home.page.ts.HomePage.debugProgram (home.page.ts:960)
//     at HTMLElement.<anonymous> (home.page.ts:64)
//     at ZoneDelegate.push../node_modules/zone.js/dist/zone.js.ZoneDelegate.invokeTask (zone.js:421)
//     at Object.onInvokeTask (core.js:14051)
//     at ZoneDelegate.push../node_modules/zone.js/dist/zone.js.ZoneDelegate.invokeTask (zone.js:420)
//     at Zone.push../node_modules/zone.js/dist/zone.js.Zone.runTask (zone.js:188)