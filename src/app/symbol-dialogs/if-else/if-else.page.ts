import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-if-else',
  templateUrl: './if-else.page.html',
  styleUrls: ['./if-else.page.scss'],
})
export class IfElsePage implements OnInit {

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
