export class Start{

  static id: string = 's_start';
  static s_name: string = 'Start';
  static startText: string = 'START';

  startSymbol: any = document.getElementById('s_start');

  constructor(){}

  setStartSymbol( symbol: any ){ this.startSymbol = symbol; }
  getStartSymbol(){ return this.startSymbol; }

}