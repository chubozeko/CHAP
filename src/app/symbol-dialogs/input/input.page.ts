import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-input',
  templateUrl: './input.page.html',
  styleUrls: ['./input.page.scss'],
})
export class InputPage implements OnInit {

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
