import { Component, Injectable, OnInit } from "@angular/core";
import { ModalController, NavController, NavParams } from "@ionic/angular";
import { AboutPage } from "../about/about.page";
import { AuthService } from "../auth.service";
import { LoginPage } from "../login/login.page";
import { SignupPage } from "../signup/signup.page";
import { TutorialPage } from "../tutorial/tutorial.page";

@Component({
  selector: "app-welcome",
  templateUrl: "./welcome.page.html",
  styleUrls: ["./welcome.page.scss"],
})
@Injectable()
export class WelcomePage implements OnInit {

  slides: HTMLIonSlidesElement;
  slideOpts = {
    effect: 'flip'
  };

  constructor(
    private auth: AuthService,
    public modal: ModalController,
    public navCtrl: NavController) { }

  ngOnInit() {
    // let w_login = document.getElementById("w_login");
    // w_login.addEventListener("click", (e) => this.openLoginModal(e));
    // let w_signup = document.getElementById("w_signup");
    // w_signup.addEventListener("click", (e) => this.openSignUpModal(e));
    let w_tutorial = document.getElementById("w_tutorial");
    w_tutorial.addEventListener("click", (e) => this.openTutorialModal(e));
    let w_about = document.getElementById("w_about");
    w_about.addEventListener("click", (e) => this.openAboutUsModal(e));
    let w_chapTrial = document.getElementById("w_chapTrial");
    w_chapTrial.addEventListener("click", (e) => this.openCHAPTrial(e));

    this.slides = document.getElementById("coverSlides") as HTMLIonSlidesElement;
  }

  prevSlide() { this.slides.slidePrev(500); }
  nextSlide() { this.slides.slideNext(500); }

  async openLoginModal(e) {
    const modal = await this.modal.create({
      component: LoginPage,
      // componentProps: {  }
    });
    modal.onDidDismiss().then((data) => {
      if (data.data != undefined) {
        if (data.data.openSignUp) {
          this.openSignUpModal(e);
        }
      }
    });
    await modal.present();
  }

  async openSignUpModal(e) {
    const modal = await this.modal.create({
      component: SignupPage,
      cssClass: 'welcomeModal'
      // componentProps: {  }
    });
    modal.onDidDismiss().then((data) => {
      if (data.data != undefined) {
        if (data.data.openLogIn) {
          this.openLoginModal(e);
        }
      }
    });
    await modal.present();
  }

  async openTutorialModal(e) {
    const modal = await this.modal.create({
      component: TutorialPage,
      cssClass: 'welcomeModal'
      // componentProps: {  }
    });
    modal.onDidDismiss().then((data) => { });
    await modal.present();
  }

  async openAboutUsModal(e) {
    const modal = await this.modal.create({
      component: AboutPage,
      cssClass: 'welcomeModal'
      // componentProps: {  }
    });
    modal.onDidDismiss().then((data) => { });
    await modal.present();
  }

  public closeModal() {
    this.modal.dismiss();
  }

  openCHAPTrial(e) {
    console.log("CHAP Trial Version");
    this.auth.mode = "trial";
    this.auth.isLoggedIn = false;
    this.navCtrl.navigateRoot("/home");
    console.log('auth: ', this.auth);
  }
}
