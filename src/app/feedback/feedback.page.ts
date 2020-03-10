import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.page.html',
  styleUrls: ['./feedback.page.scss'],
})
export class FeedbackPage implements OnInit {

  commentValue: string = "";

  constructor(public modal: ModalController) { }

  ngOnInit() {
  }

  public submitComment() {
    let comment = (document.getElementById("ta_comment") as HTMLIonTextareaElement);
    this.commentValue = comment.value;

    console.log(this.commentValue);
  }

  public closeModal() { this.modal.dismiss(); }

}
