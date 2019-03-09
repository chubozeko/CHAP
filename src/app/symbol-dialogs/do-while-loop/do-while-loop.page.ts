import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-do-while-loop',
  templateUrl: './do-while-loop.page.html',
  styleUrls: ['./do-while-loop.page.scss'],
})
export class DoWhileLoopPage implements OnInit {

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
