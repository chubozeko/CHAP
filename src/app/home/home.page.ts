import { Component, ViewChild, HostListener, SimpleChanges } from '@angular/core';
import { SYMBOLS } from "../symbol-list"; // importing the symbol array from symbol-list.ts
import 'libraries/scripts/menubareditor.js';
import 'libraries/scripts/drag&drop.js';
import { ModalController, NavParams, FabButton, Fab } from '@ionic/angular';
import { DialogSymbolsPageModule } from '../dialog-symbols/dialog-symbols.module';
import { DialogSymbolsPage } from '../dialog-symbols/dialog-symbols.page';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  @ViewChild('symbolsFAB') symbolsFAB: Fab;

  // @ViewChild(Nav) nav: Nav;
  // rootPage = "DashboardTabsPage";
  workspace = document.getElementById("workspace");
  wsStyles: {};
  title = 'CHAP';
  fileName = '';
  symbols = SYMBOLS;
  newSymbol: any;

  constructor(public modal: ModalController){ //, public navParams: NavParams){
    
  }

  ngOnInit() {
    // Loading of external JavaScript libraries
    // this.loadScript('libraries/scripts/menubareditor.js');
    // this.loadScript('libraries/scripts/drag&drop.js');

    this.workspace = document.getElementById("workspace");
    //this.workspace.addEventListener('click', (e) => this.checkActiveBranches(e) );

    let branches = document.getElementsByClassName("branch-link dropzone");
    for(let i=0; i<branches.length; i++){
      branches[i].addEventListener('click', (e) => this.openSymbolsFAB(e) );
    }

    

  }

  // Open Symbols Palette
  public async openModal(event){
    let t = event.target || event.srcElement || event.currentTarget;
    const myModal = await this.modal.create({
      component: DialogSymbolsPage,
      componentProps: { 
        newSymbol: this.newSymbol, 
        newBranch: document.getElementsByClassName("branch-link dropzone") 
      }
    });

    // Make current Branch ACTIVE
    t.classList.add('active-branch');

    // Display Symbols Palette
    await myModal.present();
  }

  closeModal(event){
    //this.workspace.addEventListener('click', (e) => EditorDirective.prototype.checkForNewBranches(e) );
    //this.newSymbol = this.navParams.get("newSymbol");
    let branches = document.getElementsByClassName("branch-link dropzone active-branch");
    for(let i=0; i<branches.length; i++){
      branches[i].classList.remove('active-branch');
    }
    //console.log(nav);
    this.modal.dismiss();
  }

  openSymbolsFAB(event){

    let t = event.target || event.srcElement || event.currentTarget;
    t.classList.add('active-branch');

    let symbolsFAB = document.getElementById("symbolsFAB");
    if (!symbolsFAB.getAttribute("activated")){
      this.symbolsFAB.activated = true;
      //alert("symbolsFAB");
    }

    
  }

  public addSymbol(id: string, event){

    let flowchart = document.getElementById("workspace");

    let temp = document.getElementById(id);
    let symbol = temp.cloneNode(true);
    symbol.textContent = "";
    let branches = document.getElementsByClassName("branch-link dropzone active-branch");
    let branch = branches[0].cloneNode(true);
    branch.addEventListener('click', (e) => this.openSymbolsFAB(e) );   

    flowchart.insertBefore(symbol, branches[0].nextSibling);
    flowchart.insertBefore(branch, symbol.nextSibling);

    branches = document.getElementsByClassName("branch-link dropzone active-branch");
    for(let i=0; i<branches.length; i++){
      branches[i].classList.remove('active-branch');
    }

  }
  
  // zoomIn(){
  //   this.wsStyles = {
  //     'transform' : 'scale(1.5)',
  //     'transform-origin' : '0 0'
  //   };
  //   alert('whatever');
  // }

  // zoomOut(){
  //   this.wsStyles = {
  //     'transform' : 'scale(0.5)',
  //     'transform-origin' : '0 0'
  //   }
  // }

  

  public checkActiveBranches(e){
    if(this.symbolsFAB.activated){
      let branches = document.getElementsByClassName("branch-link dropzone active-branch");
      for(let i=branches.length-1; i<branches.length; i++){
        branches[i].classList.remove('active-branch');
      }
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
