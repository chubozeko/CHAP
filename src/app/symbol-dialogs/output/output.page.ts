import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-output',
  templateUrl: './output.page.html',
  styleUrls: ['./output.page.scss'],
})
export class OutputPage implements OnInit {

  sid;

  constructor(public modal: ModalController, public navP: NavParams) { 
    this.sid = navP.get('s_id'); 
  }

  ngOnInit() {
  }

  public closeModal(){
    this.modal.dismiss( this.sid );
  }

}
