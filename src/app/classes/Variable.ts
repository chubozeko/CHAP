export class Variable {

  dataType: any;
  name: string;
  value: any;
  isArray: boolean;
  arraySize: number;

  variable: any;

  constructor() { }

  setName(name: string) { this.name = name; }
  getName() { return this.name; }

  setValue(value: any) { this.value = value; }
  getValue() { return this.value; }

  setDataType(dataType: any) { this.dataType = dataType; }
  getDataType() { return this.dataType; }

  setIsArray(isArray: boolean) { this.isArray = isArray; }
  getIsArray() { return this.isArray; }

  createArray(size: number) {
    this.arraySize = size;
    switch (this.getDataType()) {
      case 'Integer': this.variable = new Array(this.arraySize) as number[]; break;
      case 'Real': this.variable = new Array(this.arraySize) as number[]; break;
      case 'String': this.variable = new Array(this.arraySize) as string[]; break;
      case 'Boolean': this.variable = new Array(this.arraySize) as boolean[]; break;
      default: this.variable = new Array(this.arraySize) as any[]; break;
    }
  }

}