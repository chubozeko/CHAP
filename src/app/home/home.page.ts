import { Component, ViewChild, HostListener } from '@angular/core';
import { SYMBOLS } from "../symbol-list"; // importing the symbol array from symbol-list.ts
import 'libraries/scripts/menubareditor.js';
import 'libraries/scripts/drag&drop.js';
import { ModalController } from '@ionic/angular';
import { DialogSymbolsPageModule } from '../dialog-symbols/dialog-symbols.module';
import { DialogSymbolsPage } from '../dialog-symbols/dialog-symbols.page';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(public modal: ModalController){}

  async openModal(event){
    const myModal = await this.modal.create({
      component: DialogSymbolsPage
    });

    let t = event.target || event.srcElement || event.currentTarget;
    t.classList.add('active-branch');
    //alert(t.className);

    await myModal.present();
  }

  // @ViewChild(Nav) nav: Nav;
  // rootPage = "DashboardTabsPage";

  wsStyles: {};
  title = 'CHAP';
  fileName = '';
  symbols = SYMBOLS;
  
  zoomIn(){
    this.wsStyles = {
      'transform' : 'scale(1.5)',
      'transform-origin' : '0 0'
    };
    alert('whatever');
  }

  zoomOut(){
    this.wsStyles = {
      'transform' : 'scale(0.5)',
      'transform-origin' : '0 0'
    }
  }

  ngOnInit() {
    // Loading of external JavaScript libraries
    // this.loadScript('libraries/scripts/menubareditor.js');
    // this.loadScript('libraries/scripts/drag&drop.js');
  }

  // To be able to use external JavaScript libraries with TypeScript, they must be loaded
  public loadScript(url: string) {
    const body = <HTMLDivElement> document.body;
    const script = document.createElement('script');
    script.innerHTML = '';
    script.src = url;
    script.async = false;
    script.defer = true;
    script.type = 'text/javascript';
    body.appendChild(script);
  }

}
