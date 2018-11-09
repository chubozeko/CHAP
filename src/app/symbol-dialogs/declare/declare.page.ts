import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-declare',
  templateUrl: './declare.page.html',
  styleUrls: ['./declare.page.scss'],
})
export class DeclarePage implements OnInit {

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
