export class Declare{

    static id: string = 's_declare';
    static s_name: string = 'Declare';
    
    text = '';
    variableName: string;
    data_type: string;
    isArray: boolean;
    arraySize: number;

    constructor(){}

    setVariableName(var_name: string){ this.variableName = var_name; }
    getVariableName(){ return this.variableName; }

    setDataType(data_type: string){ this.data_type = data_type; }
    getDataType(){ return this.data_type; }

    createArray(isArray: boolean, arraySize: number){
        this.isArray = isArray;
        this.arraySize = arraySize;
    }

}