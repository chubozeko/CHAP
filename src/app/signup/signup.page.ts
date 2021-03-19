import { Component, OnInit, ViewChild } from "@angular/core";
import {
  NavController,
  AlertController,
  LoadingController, ModalController, ToastController
} from "@ionic/angular";
import { HttpClient, HttpHeaders, HttpRequest } from "@angular/common/http";
import { AuthService } from "../auth.service";
import "rxjs/add/operator/map";
// import { HomePage } from '../home/home';

@Component({
  selector: "app-signup",
  templateUrl: "./signup.page.html",
  styleUrls: ["./signup.page.scss"],
})
export class SignupPage implements OnInit {
  @ViewChild("fullname") fullname;
  @ViewChild("surname") surname;
  @ViewChild("gender") gender;
  @ViewChild("cntry") cntry;
  @ViewChild("email") email;
  @ViewChild("password") password;
  @ViewChild("CNFRPASS") CNFRPASS;

  constructor(
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    public modalC: ModalController,
    private http: HttpClient,
    public loading: LoadingController,
    public toastC: ToastController,
    private auth: AuthService,
  ) { }

  ngOnInit() {
    // Adding Click Listeners to Buttons
    let btnCreateAcc = document.getElementById("btn_createAccount");
    btnCreateAcc.addEventListener("click", (e) => this.createAccount(e));
    let btn_SignUpClose = document.getElementById("btn_SignUpClose");
    btn_SignUpClose.addEventListener("click", (e) => {
      this.modalC.dismiss();
    });

    this.gender = document.getElementById("gender") as HTMLIonSelectElement;
    this.cntry = document.getElementById("cntry") as HTMLIonSelectElement;
    //language.value = 'PseudoCode';
  }

  async checkInternetConnection() {
    if (!navigator.onLine) {
      this.auth.mode = "offline";
      //Do task when no internet connection
      let alert = await this.alertCtrl.create({
        header: "Network Error",
        message: "Please check your internet connection to use CHAP online.",
        buttons: [
          {
            text: "Use CHAP Offline",
            cssClass: "error",
            handler: () => {
              this.auth.mode = "offline";
              this.navCtrl.navigateRoot("/home");
            },
          },
          {
            text: "Close",
            role: "cancel",
            handler: () => { },
          },
        ],
      });
      alert.present();
    } else {
      this.auth.mode = "online";
    }
  }

  backToLogIn(e) {
    this.navCtrl.navigateRoot("/login");
  }

  async createAccount(e) {
    this.checkInternetConnection();
    if (this.auth.mode == "online") {
      // check to confirm the username, email, telephone and password fields are filled
      if (this.fullname.value == "") {
        let alert = await this.alertCtrl.create({
          header: "ATTENTION",
          message: "Fullname field is empty",
          buttons: ["OK"],
        });
        alert.present();
      } else if (this.surname.value == "") {
        let alert = await this.alertCtrl.create({
          header: "ATTENTION",
          message: "Surname field is empty",
          buttons: ["OK"],
        });
        alert.present();
      } else if (this.gender.value == "") {
        let alert = await this.alertCtrl.create({
          header: "ATTENTION",
          message: "Gender field is empty",
          buttons: ["OK"],
        });
        alert.present();
      } else if (this.cntry.value == "") {
        let alert = await this.alertCtrl.create({
          header: "ATTENTION",
          message: "Country field is empty",
          buttons: ["OK"],
        });
        alert.present();
      } else if (this.email.value == "") {
        let alert = await this.alertCtrl.create({
          header: "ATTENTION",
          message: "Email field is empty",
          buttons: ["OK"],
        });
        alert.present();
      } else if (this.password.value == "") {
        let alert = await this.alertCtrl.create({
          header: "ATTENTION",
          message: "Password field is empty",
          buttons: ["OK"],
        });
        alert.present();
      } else if (this.CNFRPASS.value == "") {
        let alert = await this.alertCtrl.create({
          header: "ATTENTION",
          message: "Confirm Password field is empty",
          buttons: ["OK"],
        });
        alert.present();
      } else {
        var headers = new Headers();
        headers.append("Accept", "application/json");
        headers.append("Content-Type", "application/json");
        // let options = new RequestOptions({ headers: headers });
        let data = {
          fullname: this.fullname.value,
          surname: this.surname.value,
          email: this.email.value,
          password: this.password.value,
          cntry: this.cntry.value,
          gender: this.gender.value,
          confirmpass: this.CNFRPASS.value,
        };

        let loader = await this.loading.create({
          message: "Processing please wait...",
        });
        loader.present().then(() => {
          this.http.post("https://www.chapprogramming.com/register.php", data, {})
          // this.http.post("https://www.chapchap.ga/register.php", data, {})
          // this.http.post('https://chapweb.000webhostapp.com/register.php', data, {})
          // this.http.post('http://localhost:80/chap_2/register.php', data, {})
            .map((res: any) => res)
            .subscribe(async (res) => {
              loader.dismiss();
              if (res == "Registration successful") {
                // let alert = await this.alertCtrl.create({
                //   header: "CONGRATS",
                //   message: res,
                //   buttons: ["OK"],
                // });
                // alert.present();
                const toast = await this.toastC.create({
                  message: 'Registration successful!',
                  duration: 3000
                });
                toast.present();
                let data = {
                  openLogIn: true
                };
                this.modalC.dismiss(data);
              } else {
                let alert = await this.alertCtrl.create({
                  header: "ERROR",
                  message: res,
                  buttons: ["OK"],
                });
                alert.present();
              }
            });
        });
      }
    }
  }
}
