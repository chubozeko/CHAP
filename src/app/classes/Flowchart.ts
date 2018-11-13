export class Flowchart{

  SYMBOLS: any[];

  constructor(){
    let defaultSymbols = document.getElementsByClassName('symbols');
    this.SYMBOLS.push( defaultSymbols );
  }

  addSymbolToFlowchart( symbol: any, position: number){
    this.SYMBOLS.splice(position, 0, symbol);
  }

  removeSymbolFromFlowchart( symbol: any, position: number ){
    this.SYMBOLS.splice(position, 1, symbol);
  }

}