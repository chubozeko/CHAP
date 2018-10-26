import { Component, ViewChild } from '@angular/core';
import { ModalController, Fab, ActionSheetController } from '@ionic/angular';
import { ActionSheetOptions } from '@ionic/core';

import { SYMBOLS } from "../symbol-list"; // importing the symbol array from symbol-list.ts
import 'libraries/scripts/menubareditor.js';
import 'libraries/scripts/drag&drop.js';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  @ViewChild('symbolsFAB') symbolsFAB: Fab;

  workspace; branch; 
  title = 'CHAP';
  fileName = '';
  symbols = SYMBOLS;
  newSymbol: any;

  constructor(public modal: ModalController, public symbolOptionsAS: ActionSheetController){}

  ngOnInit() {
    // Loading of external JavaScript libraries
    // this.loadScript('libraries/scripts/menubareditor.js');
    // this.loadScript('libraries/scripts/drag&drop.js');

    this.workspace = document.getElementById("workspace");
    this.branch = document.getElementById("arrow");
    this.branch.addEventListener('click', (e) => this.openSymbolsFAB(e) );

    let branches = document.getElementsByClassName("branch-link dropzone");
    for(let i=0; i<branches.length; i++){
      branches[i].addEventListener('click', (e) => this.openSymbolsFAB(e) );
    }

  }

  async openSymbolsAS(event){

    let targetSymbol = event.target || event.srcElement || event.currentTarget;
    targetSymbol.classList.add('active-symbol');

    let options: ActionSheetOptions = {
      // header: "",
      // subHeader: "",
      buttons: [
        {
          text: "Delete Symbol",
          handler: () => {
            let selectedSymbol = document.getElementsByClassName("draggable active-symbol");
            let nextArrow = selectedSymbol[0].nextSibling;
            this.workspace.removeChild(nextArrow);
            selectedSymbol[0].remove();
          }
        }
      ]
    }
    const actionSheet = await this.symbolOptionsAS.create(options);
    await actionSheet.present();

  }

  openSymbolsFAB(event){

    let t = event.target || event.srcElement || event.currentTarget;
    let symbolsFAB = document.getElementById("symbolsFAB");
    let arrows = document.getElementsByClassName("branch-link dropzone active-branch");
    if(arrows.length < 1){
      t.classList.add('active-branch');
      if (!symbolsFAB.getAttribute("activated")){
        this.symbolsFAB.activated = true;
      }
    } else {
      let branches = document.getElementsByClassName("branch-link dropzone active-branch");
      for(let i=0; i<branches.length; i++){
        branches[i].classList.remove('active-branch');
      }
      t.classList.add('active-branch');

      if (!symbolsFAB.getAttribute("activated")){
        this.symbolsFAB.activated = true;
      }
    }

  }

  public addSymbol(id: string, event){

    let temp = document.getElementById(id);
    let symbol = temp.cloneNode(true);
    symbol.textContent = "";
    let branches = document.getElementsByClassName("branch-link dropzone active-branch");
    
    let tempBranch = this.branch.cloneNode(true);
    
    tempBranch.addEventListener('click', (e) => this.openSymbolsFAB(e) );   
    symbol.addEventListener('dblclick', (e) => this.openSymbolsAS(e) );

    this.workspace.insertBefore(symbol, branches[0].nextSibling);
    this.workspace.insertBefore(tempBranch, symbol.nextSibling);

    branches = document.getElementsByClassName("branch-link dropzone active-branch");
    for(let i=0; i<branches.length; i++){
      branches[i].classList.remove('active-branch');
    }

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
