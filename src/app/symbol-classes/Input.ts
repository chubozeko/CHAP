export class Input{

  static id: string = 's_input';
  static s_name: string = 'Input';

  variableName: string;

  constructor(){}

  setVariableName(var_name: string){ this.variableName = var_name; }
  getVariableName(){ this.variableName; }
  
}