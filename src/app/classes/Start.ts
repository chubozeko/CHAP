export class Start {

  static id: string = 's_start';
  s_id: string = 's_start';
  static s_name: string = 'Start';
  static startText: string = 'START';

  startSymbol: any = document.getElementById('s_start');

  constructor() {

  }

  setStartSymbol(symbol: any) { this.startSymbol = symbol; }
  getStartSymbol() { return this.startSymbol; }

  pseudoCode() { return 'Start\n'; }

  cplusplusCode() {
    return '#include <iostream> \n#include <cstdlib>\n#include <string> \n\nusing namespace std;\n\nint main(void)\n{ \n';
  }

  getJavaCode() {
    let fName = document.getElementById('fileName') as HTMLInputElement;
    let className = fName.value.replace(/ /g, "");
    if (className == '') {
      return `import java.io.*; \nimport java.util.*; \nimport java.lang.Math; \n\npublic class JavaClass {\n\tpublic static void main(String[] args) {\n`;
    } else {
      return `import java.io.*; \nimport java.util.*; \nimport java.lang.Math; \n\npublic class ` + className + ` {\n\tpublic static void main(String[] args) {\n`;
    }
  }

}