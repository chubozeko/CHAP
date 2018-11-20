export class Declare{

    static id: string = 's_declare';
    static s_name: string = 'Declare';
    
    text = '';
    variableName: string = '';
    data_type: string = '';
    isArray: boolean = false;
    arraySize: number = 0;
    declareExpression: string = '';

    declareVar: any;

    declareSymbol: any;

    constructor(){}

    setDeclareSymbol( symbol: any ){ this.declareSymbol = symbol; }
    getDeclareSymbol(){ return this.declareSymbol; }

    setVariableName(var_name: string){ this.variableName = var_name; }
    getVariableName(){ return this.variableName; }

    setDataType(data_type: string){ this.data_type = data_type; }
    getDataType(){ return this.data_type; }

    getIsArray(){ return this.isArray; }

    getArraySize(){ return this.arraySize; }

    createArray(isArray: boolean, arraySize: number){ this.isArray = isArray; this.arraySize = arraySize; }

    getDeclareExpression(){
        let arrayStr = '';
        if( this.isArray ){ arrayStr = '[' + this.getArraySize() + ']'; }
        else { arrayStr = ''; }
        this.declareExpression = this.getDataType() + ' ' + this.getVariableName() + arrayStr;
        return this.declareExpression;
    }

    toString(){ return '\tDeclare ' + this.getDeclareExpression() + '\n'; }

    parseDeclareExp(){

        if( !this.getIsArray() ){
            switch ( this.getDataType() ) {
                case 'Integer': this.declareVar as number;  break;
                case 'Real': this.declareVar as number;     break;
                case 'String': this.declareVar as string;   break;
                case 'Boolean': this.declareVar as boolean; break;
                default: this.declareVar as any;            break;
            }
            
        } else {
            switch ( this.getDataType() ) {
                case 'Integer': this.declareVar = new Array( this.getArraySize() ) as number[];     break;
                case 'Real': this.declareVar = new Array( this.getArraySize() ) as number[];        break;
                case 'String': this.declareVar = new Array( this.getArraySize() ) as string[];      break;
                case 'Boolean': this.declareVar = new Array( this.getArraySize() ) as boolean[];    break;
                default: this.declareVar = new Array( this.getArraySize() ) as any[];               break;
            }
            
        } 
        return this;
    }

}