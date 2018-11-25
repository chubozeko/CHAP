export class Variable {

  dataType: any;
  name: string;
  value: any;

  constructor() { }

  setName(name: string){ this.name = name; }
  getName(){ return this.name; }

  setValue(value: any){ this.value = value; }
  getValue(){ return this.value; }

  setDataType(dataType: any){ this.dataType = dataType; }
  getDataType(){ return this.dataType; }
  
}