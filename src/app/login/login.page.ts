import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalController, NavController, AlertController, LoadingController } from '@ionic/angular';
import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { AuthService } from '../auth.service';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { SignupPage } from '../signup/signup.page';
import 'rxjs/add/operator/map';
import { RequestOptions } from '@angular/http';

const cors = require('cors');

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
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

  constructor(public modalC: ModalController,
    private http: HttpClient,
    private auth: AuthService,
    public formBuilder: FormBuilder,
    public navCtrl: NavController,
    private alertCtrl: AlertController,
    public loading: LoadingController) {

    this.loginForm = this.formBuilder.group({
      email: new FormControl(''),
      passwordbox: new FormControl(''),
      btn1LOG: new FormControl(),
      btn: new FormControl(),
      facebook: new FormControl('facebook'),
      google: new FormControl('google'),
      linkedin: new FormControl('linkedin')
    });
  }

  ngOnInit() {
    const allowedOrigins = [
      'capacitor://localhost',
      'ionic://localhost',
      'http://localhost',
      'http://localhost:8080',
      'http://localhost:8100'
    ];
    // Reflect the origin if it's in the allowed list or not defined (cURL, Postman, etc.)
    this.corsOptions = {
      origin: (origin, callback) => {
        if (allowedOrigins.includes(origin) || !origin) {
          callback(null, true);
        } else {
          callback(new Error('Origin not allowed by CORS'));
        }
      }
    }

    // Adding Click Listeners to Buttons
    let btnSignUp = document.getElementById("btn_signup");
    btnSignUp.addEventListener("click", e => this.signUpToCHAP(e));
    let btnLogin = document.getElementById("btn_login");
    btnLogin.addEventListener("click", e => this.logInToCHAP(e));
  }

  openAdminPanel() {
    window.open('http://admin.chapchap.ga', '_self');
  }

  signUpToCHAP(e) {
    this.navCtrl.navigateRoot('/signup');
  }

  async logInToCHAP(e) {
    // check to confirm the username and password fields are filled
    if (this.username.value == "") {
      let alert = await this.alertCtrl.create({
        header: 'ATTENTION',
        message: 'Username field is empty',
        buttons: ['OK']
      });
      alert.present();
    } else if (this.password.value == "") {
      let alert = await this.alertCtrl.create({
        header: "ATTENTION",
        message: "Password field is empty",
        buttons: ['OK']
      });
      alert.present();
    } else {
      var headers = new HttpHeaders();
      headers.append("Accept", 'application/json');
      headers.append('Content-Type', 'application/json');

      //let options = new HttpRequest({ headers: headers });
      let data = {
        username: this.username.value,
        password: this.password.value
      };

      let loader = await this.loading.create({
        message: 'Processing...',
      });

      loader.present().then(() => {
        this.http.post('http://www.chapchap.ga/login.php', data, {})
          //this.http.post('https://chapweb.000webhostapp.com/login.php', data, {})
          //this.http.post('http://localhost:80/chap_2/login.php', data, {})
          .map((res: any) => res)
          .subscribe(async res => {
            console.log(res);
            loader.dismiss();

            if (res.message == "Your Login success") {
              let alert = await this.alertCtrl.create({
                header: "CONGRATS",
                message: "Your Login was Successful",
                buttons: ['OK']
              });
              alert.present();
              this.navCtrl.navigateRoot('/home');
            } else if (res.message == "Open ADMINPANEL.php") {
              let alert = await this.alertCtrl.create({
                header: "ADMIN LOGIN",
                message: "Redirecting to Admin Panel...",
                buttons: ['OK']
              });
              alert.present();
              this.openAdminPanel();
            } else {
              let alert = await this.alertCtrl.create({
                header: "ERROR",
                message: (res.message),
                buttons: ['OK']
              });
              alert.present();
            }
          });
      });
    }

  }

}