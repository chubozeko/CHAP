import { Variable } from "./Variable";

export class Declare {

    static s_name: string = 'Declare';
    id: string = 's_declare';

    text = '';
    variableName: string = '';
    data_type: string = '';
    isArray: boolean = false;
    arraySize: number = 0;
    declareExpression: string = '';

    declareVar: any;

    declareSymbol: any;

    constructor() { }

    createDeclareSymbol(
        declareSym: any) {
        this.text = declareSym.text;
        this.variableName = declareSym.variableName;
        this.data_type = declareSym.data_type;
        this.isArray = declareSym.isArray;
        this.arraySize = declareSym.arraySize;
        this.declareExpression = declareSym.declareExpression;
        this.declareSymbol = declareSym.declareSymbol;
    }

    setDeclareSymbol(symbol: any) { this.declareSymbol = symbol; }
    getDeclareSymbol() { return this.declareSymbol; }

    setVariableName(var_name: string) { this.variableName = var_name; }
    getVariableName() { return this.variableName; }

    setDataType(data_type: string) { this.data_type = data_type; }
    getDataType() { return this.data_type; }

    getIsArray() { return this.isArray; }

    getArraySize() { return this.arraySize; }

    createArray(isArray: boolean, arraySize: number) { this.isArray = isArray; this.arraySize = arraySize; }

    getDeclareExpression() {
        let arrayStr = '';
        if (this.isArray) { arrayStr = '[' + this.getArraySize() + ']'; }
        else { arrayStr = ''; }
        this.declareExpression = this.getDataType() + ' ' + this.getVariableName() + arrayStr;
        return this.declareExpression;
    }

    async parseDeclareExp() {
        let vars: Variable[] = [];

        let varNames = this.getVariableName().split(",");
        for (let i = 0; i < varNames.length; i++) {
            let var1 = new Variable();
            if (!this.getIsArray()) {
                switch (this.getDataType()) {
                    case 'Integer': this.declareVar as number; break;
                    case 'Real': this.declareVar as number; break;
                    case 'String': this.declareVar as string; break;
                    case 'Boolean': this.declareVar as boolean; break;
                    default: this.declareVar as any; break;
                }
                var1.setIsArray(false);
            } else {
                switch (this.getDataType()) {
                    case 'Integer': this.declareVar = new Array(this.getArraySize()) as number[]; break;
                    case 'Real': this.declareVar = new Array(this.getArraySize()) as number[]; break;
                    case 'String': this.declareVar = new Array(this.getArraySize()) as string[]; break;
                    case 'Boolean': this.declareVar = new Array(this.getArraySize()) as boolean[]; break;
                    default: this.declareVar = new Array(this.getArraySize()) as any[]; break;
                }
                var1.setIsArray(true);
                var1.createArray(this.getArraySize());
            }
            var1.setName(varNames[i].trim());
            var1.setDataType(this.getDataType());
            vars.splice(vars.length, 0, var1);
        }

        return vars;
    }

    pseudoCode() { return '\tDeclare ' + this.getDeclareExpression() + '\n'; }

    cplusplusCode() {
        let exp = '';
        switch (this.getDataType()) {
            case 'Integer': exp = exp + 'int '; break;
            case 'Real': exp = exp + 'double '; break;
            case 'String': exp = exp + 'string '; break;
            case 'Boolean': exp = exp + 'bool '; break;
            default: exp = exp + ''; break;
        }
        exp = exp + this.getVariableName();
        if (this.isArray) { exp = exp + '[' + this.getArraySize() + ']'; }
        else { exp = exp + ''; }
        return '\t' + exp + ';\n';
    }

    getJavaCode() {
        let exp = '';
        switch (this.getDataType()) {
            case 'Integer': exp = exp + 'int '; break;
            case 'Real': exp = exp + 'double '; break;
            case 'String': exp = exp + 'String '; break;
            case 'Boolean': exp = exp + 'boolean '; break;
            default: exp = exp + ''; break;
        }
        exp = exp + this.getVariableName();
        if (this.isArray) { exp = exp + '[' + this.getArraySize() + ']'; }
        else { exp = exp + ''; }
        return '\t\t' + exp + ';\n';
    }

}