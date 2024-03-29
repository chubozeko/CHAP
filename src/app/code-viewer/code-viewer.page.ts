import { Component, OnInit } from '@angular/core';
import { Flowchart } from '../classes/Flowchart';
import { NavParams, ModalController, AlertController, ToastController, Platform } from '@ionic/angular';
import { Toast } from '@ionic-native/toast/ngx';
import { File } from '@ionic-native/file/ngx';
import { Code } from './code';

@Component({
  selector: 'app-code-viewer',
  templateUrl: './code-viewer.page.html',
  styleUrls: ['./code-viewer.page.scss'],
})
export class CodeViewerPage implements OnInit {

  programmingLang: string = '';
  displayCode: string = '';
  pseudocode: string = '';
  cpluspluscode: string = '';
  javaCode: string = '';
  lineNumbers: string = '  ';
  flowchart: Flowchart;
  codeFileName: string = '';
  saveFolder = 'CHAP Project Files';
  isTrialVersion: boolean;

  code: Array<Code> = [];

  constructor(
    public modal: ModalController,
    public navP: NavParams,
    public alertC: AlertController,
    private toastC: ToastController,
    private file: File,
    public platform: Platform,
    public toast: Toast
  ) {
    this.flowchart = navP.get('flowchart');
    this.isTrialVersion = navP.get('isTrialVersion');
    this.programmingLang = 'PseudoCode';
    //this.code = new Array<Code>();
  }

  ngOnInit() {
    let language = (document.getElementById("prog_lang") as HTMLIonSelectElement);
    language.value = 'PseudoCode';
    if (language.value == 'PseudoCode') {
      this.lineNumbers = '  ';
      let code = this.flowchart.displayFlowchartPseudoCode();
      let temp = code.split('\n');
      for (let i = 0; i < temp.length; i++) {
        this.lineNumbers += i + 1 + ' \n ';
        let codeLine = new Code();
        codeLine.lineNr = i + 1;
        codeLine.codeLine = temp[i];
        this.code.push(codeLine);
      }
      this.pseudocode = this.flowchart.displayFlowchartPseudoCode();
      this.displayCode = this.pseudocode;
    }
    else if (language.value == 'C++') {
      this.lineNumbers = '  ';
      let code = this.flowchart.displayCPlusPlusCode();
      let temp = code.split('\n');
      for (let i = 0; i < temp.length; i++) {
        this.lineNumbers += i + 1 + ' \n ';
        let codeLine = new Code();
        codeLine.lineNr = i + 1;
        codeLine.codeLine = temp[i];
        this.code.push(codeLine);
      }
      this.cpluspluscode = this.flowchart.displayCPlusPlusCode();
      if (!this.isTrialVersion) {
        this.displayCode = this.cpluspluscode;
      } else {
        let codeTextContent = document.getElementById("codeTextContent");
        codeTextContent.style.userSelect = 'none';
        this.displayCode = 'This is the Trial version. Sign up to view and download the C++ code.';
      }
    } else if (language.value == 'Java') {
      this.lineNumbers = '  ';
      let code = this.flowchart.displayJavaCode();
      let temp = code.split('\n');
      for (let i = 0; i < temp.length; i++) {
        this.lineNumbers += i + 1 + '  \n  ';
        let codeLine = new Code();
        codeLine.lineNr = i + 1;
        codeLine.codeLine = temp[i];
        this.code.push(codeLine);
      }
      this.javaCode = this.flowchart.displayJavaCode();
      if (!this.isTrialVersion) {
        this.displayCode = this.javaCode;
      } else {
        let codeTextContent = document.getElementById("codeTextContent");
        codeTextContent.style.userSelect = 'none';
        this.displayCode = 'This is the Trial version. Sign up to view and download the Java code.';
      }
    }
  }

  public changeCode() {
    this.code.splice(0, this.code.length);
    let language = (document.getElementById("prog_lang") as HTMLIonSelectElement);
    if (language.value == 'PseudoCode') {
      this.lineNumbers = '  ';
      let code = this.flowchart.displayFlowchartPseudoCode();
      let temp = code.split('\n');
      for (let i = 0; i < temp.length; i++) {
        this.lineNumbers += i + 1 + ' \n ';
        let codeLine = new Code();
        codeLine.lineNr = i + 1;
        if (temp[i] == "") {
          codeLine.codeLine = "\n";
        } else {
          codeLine.codeLine = temp[i];
        }
        this.code.push(codeLine);
      }
      this.pseudocode = this.flowchart.displayFlowchartPseudoCode();
      this.displayCode = this.pseudocode;
    }
    else if (language.value == 'C++') {
      this.lineNumbers = '  ';
      let code = this.flowchart.displayCPlusPlusCode();
      let temp = code.split('\n');
      for (let i = 0; i < temp.length; i++) {
        this.lineNumbers += i + 1 + ' \n ';
        let codeLine = new Code();
        codeLine.lineNr = i + 1;
        if (temp[i] == "") {
          codeLine.codeLine = "\n";
        } else {
          codeLine.codeLine = temp[i];
        }
        this.code.push(codeLine);
      }
      this.cpluspluscode = this.flowchart.displayCPlusPlusCode();
      if (!this.isTrialVersion) {
        this.displayCode = this.cpluspluscode;
      } else {
        let codeTextContent = document.getElementById("codeTextContent");
        codeTextContent.style.userSelect = 'none';
        this.displayCode = 'This is the Trial version. Sign up to view and download the C++ code.';
      }
    } else if (language.value == 'Java') {
      this.lineNumbers = '  ';
      let code = this.flowchart.displayJavaCode();
      let temp = code.split('\n');
      for (let i = 0; i < temp.length; i++) {
        this.lineNumbers += i + 1 + '  \n  ';
        let codeLine = new Code();
        codeLine.lineNr = i + 1;
        if (temp[i] == "") {
          codeLine.codeLine = "\n";
        } else {
          codeLine.codeLine = temp[i];
        }
        this.code.push(codeLine);
      }
      this.javaCode = this.flowchart.displayJavaCode();
      if (!this.isTrialVersion) {
        this.displayCode = this.javaCode;
      } else {
        let codeTextContent = document.getElementById("codeTextContent");
        codeTextContent.style.userSelect = 'none';
        this.displayCode = 'This is the Trial version. Sign up to view and download the Java code.';
      }
    }
  }

  async downloadCode() {
    if (this.programmingLang == 'PseudoCode') {
      this.saveProject('Pseudo', '.txt');
    } else if (this.programmingLang == 'C++' && !this.isTrialVersion) {
      this.saveProject('C++', '.cpp');
    } else if (this.programmingLang == 'Java' && !this.isTrialVersion) {
      this.saveProject('Java', '.java');
    } else if (this.isTrialVersion && this.programmingLang != 'PseudoCode') {
      const alert = await this.alertC.create({
        header: 'Failed to Download ' + this.programmingLang + ' Code.',
        message: `This is the Trial version. Sign up to download the code.`,
        buttons: [
          {
            text: "OK",
            role: "cancel",
            cssClass: "secondary",
          }
        ]
      });
      await alert.present();
    }
  }

  async showSaveAlert(fileType) {
    const alert = await this.alertC.create({
      header: 'Failed to Save',
      message: `Please enter a file name for the source code before saving it.`,
      inputs: [
        {
          name: "fileName",
          type: "text"
        }
      ],
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
          cssClass: "secondary",
        },
        {
          text: "OK",
          handler: data => {
            this.codeFileName = data.fileName;

            if (this.platform.is("android")) {
              this.saveToAndroid(this.displayCode, this.codeFileName + fileType, fileType);
            } else if (this.platform.is("ios")) {
              this.saveToIOS(this.displayCode, this.codeFileName + fileType, fileType);
            } else if (this.platform.is("desktop")) {
              this.saveTextAsFile(this.displayCode, this.codeFileName + fileType);
            }
          }
        }
      ]
    });

    alert.onDidDismiss().then(data => { });
    await alert.present();
  }

  async saveProject(fileType: string, fileExtension: string) {
    let fileName;
    let fName = document.getElementById('fileName') as HTMLInputElement;

    if (fName.value == '') {
      await this.showSaveAlert(fileType);
    } else {
      fileName = fName.value + fileExtension;

      if (this.platform.is("android")) {
        this.saveToAndroid(this.displayCode, fileName, fileType);
      } else if (this.platform.is("ios")) {
        this.saveToIOS(this.displayCode, fileName, fileType);
      } else if (this.platform.is("desktop")) {
        this.saveTextAsFile(this.displayCode, fileName);
      }
    }
  }

  public saveTextAsFile(data, filename) {
    if (!data) {
      console.error('Console.save: No data');
      return;
    }
    var blob = new Blob([data], { type: 'text/plain' }),
      e = document.createEvent('MouseEvents'),
      a = document.createElement('a');

    // FOR IE:
    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveOrOpenBlob(blob, filename);
    } else {
      var e = document.createEvent('MouseEvents'), a = document.createElement('a');
      a.download = filename;
      a.href = window.URL.createObjectURL(blob);
      a.dataset.downloadurl = ['text/plain', a.download, a.href].join(':');
      e.initEvent('click', true, false);
      a.dispatchEvent(e);
    }
  }

  public saveToAndroid(displayCode: string, fileName: string, fileType: string) {
    this.file.writeFile(
      `${this.file.externalRootDirectory}/${this.saveFolder}`,
      `${fileName}`,
      displayCode,
      { replace: true, append: false }
    ).then(res => {
      let fName = document.getElementById('fileName') as HTMLInputElement;
      this.toast.show('The ' + fileType + ' code for \"' + fName.value + '\" has successfully saved.', '3000', 'bottom').subscribe(
        toast => {
          console.log(toast);
        }
      );
    });
  }

  public saveToIOS(displayCode: string, fileName: string, fileType: string) {
    this.file.writeFile(
      `${this.file.externalRootDirectory}/${this.saveFolder}`,
      `${fileName}`,
      displayCode,
      { replace: true, append: false }
    ).then(res => {
      let fName = document.getElementById('fileName') as HTMLInputElement;
      this.toast.show('The ' + fileType + ' code for \"' + fName.value + '\" has successfully saved.', '3000', 'bottom').subscribe(
        toast => {
          console.log(toast);
        }
      );
    });
  }

  public closeModal() { this.modal.dismiss(); }

}
