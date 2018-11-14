import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { Comment } from '../../classes/Comment';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.page.html',
  styleUrls: ['./comment.page.scss'],
})
export class CommentPage implements OnInit {

  symbol: Comment;
  constructor(public modal: ModalController, public navP: NavParams) { 
    this.symbol = navP.get('symbol');
  }

  ngOnInit() {
    let com_text = (document.getElementById("comment_text") as HTMLInputElement);
    com_text.value = this.symbol.getCommentText();
  }

  public applyAndCloseModal(){

    let com_text = (document.getElementById("comment_text") as HTMLInputElement);
    this.symbol.setCommentText( com_text.value );

    this.modal.dismiss( this.symbol );
  }

  public closeModal(){ this.modal.dismiss(); }

}
