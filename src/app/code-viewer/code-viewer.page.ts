import { Component, OnInit } from '@angular/core';
import { Flowchart } from '../classes/Flowchart';
import { NavParams, ModalController } from '@ionic/angular';

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
  lineNumbers: string = '  ';
  flowchart: Flowchart;

  constructor(public modal: ModalController, public navP: NavParams) { 
    this.flowchart = navP.get('flowchart');
    this.programmingLang = 'PseudoCode';
  }

  ngOnInit() {

    let language = (document.getElementById("prog_lang") as HTMLIonSelectElement);
    language.value = 'PseudoCode';
    if( language.value == 'PseudoCode' ){
      this.lineNumbers = '  ';
      let code = this.flowchart.displayFlowchartPseudoCode();
      let temp = code.split('\n');
      for (let i = 0; i < temp.length; i++) {
        this.lineNumbers += i+1 + ' \n ';
      }
      this.pseudocode = this.flowchart.displayFlowchartPseudoCode();
      this.displayCode = this.pseudocode;
    }
    else if( language.value == 'C++' ) {
      this.lineNumbers = '  ';
      let code = this.flowchart.displayCPlusPlusCode();
      let temp = code.split('\n');
      for (let i = 0; i < temp.length; i++) {
        this.lineNumbers += i+1 + ' \n ';
      }
      this.cpluspluscode = this.flowchart.displayCPlusPlusCode();
      this.displayCode = this.cpluspluscode;
    }

    // let code = this.flowchart.displayFlowchartPseudoCode();
    // let temp = code.split('\n');
    // for (let i = 0; i < temp.length; i++) {
    //   this.lineNumbers += i+1 + '  \n  ';
    // }
    // this.pseudocode = this.flowchart.displayFlowchartPseudoCode();
    // this.cpluspluscode = this.flowchart.displayCPlusPlusCode();
  }

  public changeCode(){
    let language = (document.getElementById("prog_lang") as HTMLIonSelectElement);
    if( language.value == 'PseudoCode' ){
      this.lineNumbers = '  ';
      let code = this.flowchart.displayFlowchartPseudoCode();
      let temp = code.split('\n');
      for (let i = 0; i < temp.length; i++) {
        this.lineNumbers += i+1 + '  \n  ';
      }
      this.pseudocode = this.flowchart.displayFlowchartPseudoCode();
      this.displayCode = this.pseudocode;
    }
    else if( language.value == 'C++' ) {
      this.lineNumbers = '  ';
      let code = this.flowchart.displayCPlusPlusCode();
      let temp = code.split('\n');
      for (let i = 0; i < temp.length; i++) {
        this.lineNumbers += i+1 + '  \n  ';
      }
      this.cpluspluscode = this.flowchart.displayCPlusPlusCode();
      this.displayCode = this.cpluspluscode;
    }
  }

  public closeModal(){ this.modal.dismiss(); }

}
