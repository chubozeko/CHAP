import { Component, OnInit } from '@angular/core';
import { Flowchart } from '../classes/Flowchart';
import { NavParams, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-code-viewer',
  templateUrl: './code-viewer.page.html',
  styleUrls: ['./code-viewer.page.scss'],
})
export class CodeViewerPage implements OnInit {

  pseudocode: string = '';
  flowchart: Flowchart;

  constructor(public modal: ModalController, public navP: NavParams) { 
    this.flowchart = navP.get('flowchart');
  }

  ngOnInit() {
    this.pseudocode = this.flowchart.displayFlowchartPseudoCode();
  }

  public closeModal(){ this.modal.dismiss(); }

}
