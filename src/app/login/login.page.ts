import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
const cors = require('cors');

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  //templateUrl: './chap_ums/index.php',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  items: Array<any> = [];
  corsOptions;

  constructor(public modalC: ModalController, private http: HttpClient) { }

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
    let btnSignUp = document.getElementById("btn");
    btnSignUp.addEventListener("click", e => this.signUpToCHAP(e));
    let btnLogin = document.getElementById("btn1LOG");
    btnLogin.addEventListener("click", e => this.logInToCHAP(e));

  }

  ionViewWillEnter(): void {
    this.load();
  }

  load() {
    // try {
    //   const url = 'https://api.example.com';
    //   const params = {};
    //   const headers = {};

    //   const response = await this.http.get(url, headers);

    //   console.log(response);
    //   //console.log(JSON.parse(response.data)); // JSON data returned by server
    //   //console.log(response.headers);

    // } catch (error) {
    //   console.error(error.status);
    //   console.error(error.error); // Error message as string
    //   console.error(error.headers);
    // }

    // Enable preflight requests for all routes
    this.http.options('*', cors(this.corsOptions));

    this.http.get('./login/chap_ums/index.php', cors(this.corsOptions))
      .subscribe((data: any) => {
        alert(data);
      },
        (error: any) => {
          console.dir(error);
        });

    this.http.post('http://localhost/login/chap_ums/index.php', {})
      .subscribe((data: any) => {
        alert(data);
      },
        (error: any) => {
          console.dir(error);
        });
  }

  signUpToCHAP(e) {
    window.setTimeout(function () { location.href = '/login/chap_ums/createaccount.php'; }, 0x01);
    alert('SIGNUP');
  }

  logInToCHAP(e) {
    alert('LOGIN');
  }

}
