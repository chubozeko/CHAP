import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.page.html',
  styleUrls: ['./feedback.page.scss'],
})
export class FeedbackPage implements OnInit {

  feedback;
  comment_ph: string = "";

  constructor(public modal: ModalController) { }

  ngOnInit() {
    this.comment_ph = `Leave a comment or share your opinions on CHAP: `;
  }

  public submitComment() {
    let rating = (document.getElementById("fb_rating") as HTMLIonRangeElement);
    let comment = (document.getElementById("ta_comment") as HTMLIonTextareaElement);
    // this.feedback.rating = rating.value;
    // this.feedback.comment = comment.value;

    this.feedback = {
      rating: rating.value,
      comment: comment.value
    }

    console.log(this.feedback);
  }

  public closeModal() { this.modal.dismiss(this.feedback); }

}
