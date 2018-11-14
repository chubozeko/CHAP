import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-while-loop',
  templateUrl: './while-loop.page.html',
  styleUrls: ['./while-loop.page.scss'],
})
export class WhileLoopPage implements OnInit {

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
