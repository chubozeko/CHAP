import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController, AlertController, LoadingController } from '@ionic/angular';
import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import 'rxjs/add/operator/map';
// import { HomePage } from '../home/home';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
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
    private http: HttpClient,
    public loading: LoadingController) { }

  ngOnInit() {
    // Adding Click Listeners to Buttons
    let btnCreateAcc = document.getElementById("btn_createAccount");
    btnCreateAcc.addEventListener("click", e => this.createAccount(e));
    let btnBackToLogin = document.getElementById("btn_backToLogin");
    btnBackToLogin.addEventListener("click", e => this.backToLogIn(e));

    this.gender = (document.getElementById("gender") as HTMLIonSelectElement);
    this.cntry = (document.getElementById("cntry") as HTMLIonSelectElement);
    //language.value = 'PseudoCode';
  }

  backToLogIn(e) {
    this.navCtrl.navigateRoot('/login');
  }

  async createAccount(e) {
    // check to confirm the username, email, telephone and password fields are filled
    if (this.fullname.value == "") {
      let alert = await this.alertCtrl.create({
        header: "ATTENTION",
        message: "Fullname field is empty",
        buttons: ['OK']
      });
      alert.present();
    } else if (this.surname.value == "") {
      let alert = await this.alertCtrl.create({
        header: "ATTENTION",
        message: "Surname field is empty",
        buttons: ['OK']
      });
      alert.present();
    } else if (this.gender.value == "") {
      let alert = await this.alertCtrl.create({
        header: "ATTENTION",
        message: "Gender field is empty",
        buttons: ['OK']
      });
      alert.present();
    } else if (this.cntry.value == "") {
      let alert = await this.alertCtrl.create({
        header: "ATTENTION",
        message: "Country field is empty",
        buttons: ['OK']
      });
      alert.present();
    } else if (this.email.value == "") {
      let alert = await this.alertCtrl.create({
        header: "ATTENTION",
        message: "Email field is empty",
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
    } else if (this.CNFRPASS.value == "") {
      let alert = await this.alertCtrl.create({
        header: "ATTENTION",
        message: "Confirm Password field is empty",
        buttons: ['OK']
      });
      alert.present();
    } else {
      var headers = new Headers();
      headers.append("Accept", 'application/json');
      headers.append("Content-Type", 'application/json');
      // let options = new RequestOptions({ headers: headers });
      let data = {
        fullname: this.fullname.value,
        surname: this.surname.value,
        email: this.email.value,
        password: this.password.value,
        cntry: this.cntry.value,
        gender: this.gender.value,
        confirmpass: this.CNFRPASS.value
      };

      let loader = await this.loading.create({
        message: 'Processing please wait...',
      });
      loader.present().then(() => {
        this.http.post('http://www.chapchap.ga/register.php', data, {})
          //this.http.post('https://chapweb.000webhostapp.com/register.php', data, {})
          //this.http.post('http://localhost:80/chap_2/register.php', data, {})
          .map((res: any) => res)
          .subscribe(async res => {
            loader.dismiss();
            if (res == "Registration successful") {
              let alert = await this.alertCtrl.create({
                header: "CONGRATS",
                message: (res),
                buttons: ['OK']
              });
              alert.present();
            } else {
              let alert = await this.alertCtrl.create({
                header: "ERROR",
                message: (res),
                buttons: ['OK']
              });
              alert.present();
            }
          });
      });
    }
  }

}


