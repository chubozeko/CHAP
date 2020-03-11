import { Component, OnInit } from '@angular/core';
import { ModalController, Platform, NavParams, AlertController } from '@ionic/angular';
import { Toast } from '@ionic-native/toast/ngx';
import { HttpHeaders, HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.page.html',
  styleUrls: ['./feedback.page.scss'],
})
export class FeedbackPage implements OnInit {

  userID: number;
  feedback;
  comment_ph: string = "";

  constructor(
    public modal: ModalController,
    public alertC: AlertController,
    private http: HttpClient,
    public toast: Toast,
    public platform: Platform,
    public navP: NavParams
  ) {
    this.userID = navP.get('userID');
  }

  ngOnInit() {
    this.comment_ph = `Leave a comment or share your opinions on CHAP: `;
  }

  public submitComment() {
    let rating = (document.getElementById("fb_rating") as HTMLIonRangeElement);
    let comment = (document.getElementById("ta_comment") as HTMLIonTextareaElement);

    this.feedback = {
      userid: this.userID,
      comment: comment.value,
      rating: rating.value
    }

    console.log(this.feedback);

    var headers = new HttpHeaders();
    headers.append("Accept", 'application/json');
    headers.append('Content-Type', 'application/json');

    this.http.post('http://www.chapchap.ga/submitFeedback.php', this.feedback, {})
      //this.http.post('https://chapweb.000webhostapp.com/submitFeedback.php', this.feedback, {})
      //this.http.post('http://localhost:80/chap_2/submitFeedback.php', this.feedback, {})
      .map((res: any) => res)
      .subscribe(async res => {
        console.log(res);

        if (res.message == "Feedback submitted") {
          if (this.platform.is("android") || this.platform.is("ios")) {
            this.toast.show('Thank you for your feedback!', '3000', 'bottom').subscribe(
              toast => {
                console.log(toast);
              }
            );
          } else {
            let alert = await this.alertC.create({
              header: "Feedback received.",
              message: "Thank you for your feedback!",
              buttons: ['OK']
            });
            alert.present();
          }
          this.closeModal();
        } else if (res.message == "Invalid Feedback! Please give us a rating or comment.") {
          if (this.platform.is("android") || this.platform.is("ios")) {
            this.toast.show('Invalid Feedback! Please give us a rating or comment.', '3000', 'bottom').subscribe(
              toast => {
                console.log(toast);
              }
            );
          } else {
            let alert = await this.alertC.create({
              header: "Invalid Feedback!",
              message: "Please give us a rating or comment.",
              buttons: ['OK']
            });
            alert.present();
          }
        } else {
          if (this.platform.is("android") || this.platform.is("ios")) {
            this.toast.show(res.message, '3000', 'bottom').subscribe(
              toast => {
                console.log(toast);
              }
            );
          } else {
            let alert = await this.alertC.create({
              header: "ERROR",
              message: (res.message),
              buttons: ['OK']
            });
            alert.present();
          }
        }
      });
  }

  public closeModal() { this.modal.dismiss(this.feedback); }

}
