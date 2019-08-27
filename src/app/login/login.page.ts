import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  items: Array<any> = [];

  constructor(public modalC: ModalController, private http: HttpClient) { }

  ngOnInit() {
  }

  /**
    * Triggered when template view is about to be entered
    * Returns and parses the PHP data through the load() method
    * @public
    * @method ionViewWillEnter
    * @return {None}
    */
  ionViewWillEnter(): void {
    this.load();
  }
  /**
   * Retrieve the JSON encoded data from the remote server
   * Using Angular's Http class and an Observable - then
   * assign this to the items array for rendering to the HTML template
   * @public
   * @method load
   * @return {None}
   */
  load(): void {
    this.http
      //.get('https://htcprojecttest.000webhostapp.com/index.php')
      .get('https://htcprojecttest.000webhostapp.com/index.php')
      .subscribe((data: any) => {
        console.dir(data);
        this.items = data;
      },
        (error: any) => {
          console.dir(error);
        });
  }

}
