import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  public clearWorkspace(){

    let workspace = document.getElementById("workspace");
    let wsSymbols = workspace.getElementsByClassName("symbol");
    for (let i=0; i<wsSymbols.length; i++) {

      if( wsSymbols[i].id != 's_start' && wsSymbols[i].id != 's_stop' ){

        if(wsSymbols[i].id == 's_if_case' || wsSymbols[i].id == 's_for_loop'
        || wsSymbols[i].id == 's_while_loop' || wsSymbols[i].id == 's_do_while_loop'){
          let nextArrow = wsSymbols[i].parentElement.nextSibling;
          workspace.removeChild(nextArrow);
          workspace.removeChild(wsSymbols[i].parentNode);
        } else {
          let nextArrow = wsSymbols[i].nextSibling;
          workspace.removeChild(nextArrow);
          workspace.removeChild(wsSymbols[i]);  
        }
        i=0;
      }
      
    }

    console.log("cleared!");
  }

}
