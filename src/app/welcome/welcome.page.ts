import { Component, Injectable, OnInit } from "@angular/core";
import { ModalController, NavController, NavParams } from "@ionic/angular";
import { LoginPage } from "../login/login.page";
import { SignupPage } from "../signup/signup.page";

@Component({
  selector: "app-welcome",
  templateUrl: "./welcome.page.html",
  styleUrls: ["./welcome.page.scss"],
})
@Injectable()
export class WelcomePage implements OnInit {
  constructor(public modal: ModalController, public navCtrl: NavController) {}

  ngOnInit() {
    let w_login = document.getElementById("w_login");
    w_login.addEventListener("click", (e) => this.openLoginModal(e));
    let w_signup = document.getElementById("w_signup");
    w_signup.addEventListener("click", (e) => this.openSignUpModal(e));
  }

  async openLoginModal(e) {
    const modal = await this.modal.create({
      component: LoginPage,
      // componentProps: {  }
    });
    modal.onDidDismiss().then((data) => {});
    await modal.present();
  }

  async openSignUpModal(e) {
    const modal = await this.modal.create({
      component: SignupPage,
      // componentProps: {  }
    });
    modal.onDidDismiss().then((data) => {});
    await modal.present();
  }

  public closeModal() {
    this.modal.dismiss();
  }
}
