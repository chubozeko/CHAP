import { Component } from '@angular/core';

import { Platform, MenuController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { HomePage } from './home/home.page';
import { Flowchart } from './classes/Flowchart';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ["splashscreen.scss"]
})
export class AppComponent {

  flowchart: Flowchart;
  temp: HomePage;

  splash = false; // true;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    public menu: MenuController
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      //this.splashScreen.hide();
      setTimeout(() => this.splash = false, 4000);
    });
  }

}
