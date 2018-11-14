import { Start } from "./Start";
import { Stop } from "./Stop";

export class Flowchart{

  SYMBOLS: any[];

  constructor(){
    let defaultSymbols = document.getElementsByClassName('symbols');
    for (let i = 0; i < defaultSymbols.length; i++) {
      this.SYMBOLS.splice( i, 0, defaultSymbols[i] );
    }

    let start = new Start();
    let stop = new Stop();
    this.SYMBOLS = [ start, stop ];
  }

  addSymbolToFlowchart( symbol: any, position: number){
    this.SYMBOLS.splice(position, 0, symbol);
  }

  removeSymbolFromFlowchart( symbol: any, position: number ){
    this.SYMBOLS.splice(position, 1, symbol);
  }

  getSymbolFromFlowchart( index: number ){
    return this.SYMBOLS[index];
  }

  clearFlowchart(){
    let start = new Start();
    let stop = new Stop();
    this.SYMBOLS = [ start, stop ];
  }

}