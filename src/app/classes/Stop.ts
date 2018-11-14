export class Stop{

  static id: string = 's_stop';
  static s_name: string = 'Stop';
  static startText: string = 'STOP';

  stopSymbol: any = document.getElementById('s_stop');

  constructor(){}

  setStopSymbol( symbol: any ){ this.stopSymbol = symbol; }
  getStopSymbol(){ return this.stopSymboll; }

}