import { Component, OnInit, ViewChild } from "@angular/core";
import {
  ModalController,
  NavController,
  AlertController,
  LoadingController,
  Platform,
  NavParams,
  ToastController
} from "@ionic/angular";
import { HttpClient, HttpHeaders, HttpRequest } from "@angular/common/http";
import { AuthService } from "../auth.service";
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
} from "@angular/forms";
import { SignupPage } from "../signup/signup.page";
import "rxjs/add/operator/map";
import { RequestOptions } from "@angular/http";
import { Toast } from "@ionic-native/toast/ngx";
import { Navigation } from "selenium-webdriver";

const cors = require("cors");

@Component({
  selector: "app-login",
  templateUrl: "./login.page.html",
  styleUrls: ["./login.page.scss"],
})
export class LoginPage implements OnInit {
  @ViewChild("email") username;
  @ViewChild("password") password;

  data: string;
  loginForm: FormGroup;
  items: Array<any> = [];
  corsOptions;
  phpCode;
  cssUrl;

  constructor(
    private http: HttpClient,
    private auth: AuthService,
    public formBuilder: FormBuilder,
    public navCtrl: NavController,
    private alertCtrl: AlertController,
    public loading: LoadingController,
    public platform: Platform,
    public toast: Toast,
    public toastC: ToastController,
    public modalC: ModalController
  ) //public navP: NavParams
  {
    this.loginForm = this.formBuilder.group({
      email: new FormControl(""),
      passwordbox: new FormControl(""),
      btn1LOG: new FormControl(),
      btn: new FormControl(),
      facebook: new FormControl("facebook"),
      google: new FormControl("google"),
      linkedin: new FormControl("linkedin"),
    });
  }

  ngOnInit() {
    this.checkInternetConnection();

    const allowedOrigins = [
      "capacitor://localhost",
      "ionic://localhost",
      "http://localhost",
      "http://localhost:8080",
      "http://localhost:8100",
    ];
    // Reflect the origin if it's in the allowed list or not defined (cURL, Postman, etc.)
    this.corsOptions = {
      origin: (origin, callback) => {
        if (allowedOrigins.includes(origin) || !origin) {
          callback(null, true);
        } else {
          callback(new Error("Origin not allowed by CORS"));
        }
      },
    };

    // Adding Click Listeners to Buttons
    // let btnSignUp = document.getElementById("btn_signup");
    // btnSignUp.addEventListener("click", (e) => this.signUpToCHAP(e));
    let btnLogin = document.getElementById("btn_login");
    btnLogin.addEventListener("click", (e) => this.logInToCHAP(e));
    // let btnOffline = document.getElementById("btn_offline");
    // btnOffline.addEventListener("click", (e) => this.useCHAPOffline(e));
    let btn_LoginClose = document.getElementById("btn_LoginClose");
    btn_LoginClose.addEventListener("click", (e) => this.closeModal(e));
    let a_createAccount = document.getElementById("a_createAccount");
    a_createAccount.addEventListener("click", (e) => {
      let data = {
        openSignUp: true
      };
      this.modalC.dismiss(data);
    });
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
              this.auth.isLoggedIn = false;
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

  useCHAPOffline(e) {
    this.auth.mode = "offline";
    this.auth.isLoggedIn = false;
    this.navCtrl.navigateRoot("/home");
  }

  openAdminPanel() {
    this.checkInternetConnection();
    // Check if it is in Online
    if (this.auth.mode == "online") {
      window.open("http://admin.chapchap.ga", "_self");
    }
  }

  signUpToCHAP(e) {
    this.checkInternetConnection();
    // Check if it is in Online
    if (this.auth.mode == "online") {
      this.navCtrl.navigateRoot("/signup");
    }
  }

  async logInToCHAP(e) {
    this.checkInternetConnection();
    if (this.auth.mode == "online") {
      // check to confirm the username and password fields are filled
      if (this.username.value == "") {
        let alert = await this.alertCtrl.create({
          header: "ATTENTION",
          message: "Username field is empty",
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
      } else {
        var headers = new HttpHeaders();
        headers.append("Accept", "application/json");
        headers.append("Content-Type", "application/json");

        //let options = new HttpRequest({ headers: headers });
        let data = {
          username: this.username.value,
          password: this.password.value,
        };

        let loader = await this.loading.create({
          message: "Processing...",
        });

        loader.present().then(() => {
          this.http
            .post("http://www.chapchap.ga/login.php", data, {})
            //this.http.post('https://chapweb.000webhostapp.com/login.php', data, {})
            //this.http.post('http://localhost:80/chap_2/login.php', data, {})
            .map((res: any) => res)
            .subscribe(async (res) => {
              console.log(res);
              loader.dismiss();

              if (res.message == "Your Login success") {
                if (this.platform.is("android") || this.platform.is("ios")) {
                  this.toast
                    .show("Login Successful!.", "3000", "bottom")
                    .subscribe((toast) => {
                      console.log(toast);
                    });
                } else {
                  // let alert = await this.alertCtrl.create({
                  //   header: "Login Successful",
                  //   message: "Welcome to CHAP,  " + res.name,
                  //   buttons: ["OK"],
                  // });
                  // alert.present();
                  const toast = await this.toastC.create({
                    message: 'Login Successful! Welcome to CHAP, ' + res.name + '.',
                    duration: 3000
                  });
                  toast.present();
                }
                //let params = new NavParams({ session: res.session });
                //this.navP.data = params;
                this.auth.sessionToken = { session: res.session };
                this.auth.isLoggedIn = true;
                this.closeModal(e);
                this.navCtrl.navigateRoot("/home");
              } else if (res.message == "Open ADMINPANEL.php") {
                if (this.platform.is("android") || this.platform.is("ios")) {
                  this.toast
                    .show("Redirecting to Admin Panel...", "3000", "bottom")
                    .subscribe((toast) => {
                      console.log(toast);
                    });
                } else {
                  let alert = await this.alertCtrl.create({
                    header: "ADMIN LOGIN",
                    message: "Redirecting to Admin Panel...",
                    buttons: ["OK"],
                  });
                  alert.present();
                }
                this.closeModal(e);
                this.openAdminPanel();
              } else {
                if (this.platform.is("android") || this.platform.is("ios")) {
                  this.toast
                    .show("ERROR: " + res.message, "3000", "bottom")
                    .subscribe((toast) => {
                      console.log(toast);
                    });
                } else {
                  let alert = await this.alertCtrl.create({
                    header: "ERROR",
                    message: res.message,
                    buttons: ["OK"],
                  });
                  alert.present();
                }
              }
            });
        });
      }
    } else {
    }
  }

  public closeModal(e) {
    this.modalC.dismiss();
  }
}
