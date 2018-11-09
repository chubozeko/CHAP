import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.page.html',
  styleUrls: ['./comment.page.scss'],
})
export class CommentPage implements OnInit {

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
