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

    // this.auth.loadPHP('index.php').subscribe((data: any) => {
    //   console.log(data.toString());
    //   // this.phpCode = data.toString();
    //   // let divv = document.getElementById('innerPHP');
    //   // divv.innerHTML = data.toString();
    //   // console.log(this.phpCode);
    // },
    //   (error: any) => {
    //     console.dir(error);
    //   });
  }

  // ionViewWillEnter(): void {
  //   this.load();
  // }

  // load() {
  //   // try {
  //   //   const url = 'https://api.example.com';
  //   //   const params = {};
  //   //   const headers = {};

  //   //   const response = await this.http.get(url, headers);

  //   //   console.log(response);
  //   //   //console.log(JSON.parse(response.data)); // JSON data returned by server
  //   //   //console.log(response.headers);

  //   // } catch (error) {
  //   //   console.error(error.status);
  //   //   console.error(error.error); // Error message as string
  //   //   console.error(error.headers);
  //   // }

  //   // Enable preflight requests for all routes
  //   this.http.options('*', cors(this.corsOptions));

  //   this.http.get('./login/chap_ums/index.php', cors(this.corsOptions))
  //     .subscribe((data: any) => {
  //       alert(data);
  //     },
  //       (error: any) => {
  //         console.dir(error);
  //       });

  //   this.http.post('http://localhost/login/chap_ums/index.php', {})
  //     .subscribe((data: any) => {
  //       alert(data);
  //     },
  //       (error: any) => {
  //         console.dir(error);
  //       });
  // }

  signUpToCHAP(e) {
    this.navCtrl.navigateRoot('/signup');
  }

  async logInToCHAP(e) {
    // console.log('LOGIN', this.loginForm.value);
    // console.log('email: ', this.loginForm.value.email);
    // console.log('password: ', this.loginForm.value.passwordbox);
    // // Post to 'socket.php'
    // this.auth.loadPHP('socket.php', this.loginForm.value).subscribe((data: any) => {
    //   console.log("socket.php POST data", data.toString());
    // }, (error: any) => { console.dir(error); });

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
        message: 'Processing please wait...',
      });

      loader.present().then(() => {
        //this.http.post('https://chapweb.000webhostapp.com/login.php', data, {})
        this.http.post('http://localhost:80/chap_2/login.php', data, {})
          .map((res: any) => res)
          .subscribe(async res => {
            console.log(res);
            loader.dismiss();

            if (res == "Your Login success") {
              let alert = await this.alertCtrl.create({
                header: "CONGRATS",
                message: (res),
                buttons: ['OK']
              });
              alert.present();
              this.navCtrl.navigateRoot('/home');
            } else {
              let alert = await this.alertCtrl.create({
                header: "ERROR",
                message: "Your Login Email or Password is invalid",
                buttons: ['OK']
              });
              alert.present();
            }
          });
      });
    }

  }

}