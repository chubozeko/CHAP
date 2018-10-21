import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, ModalController } from '@ionic/angular';
import { SYMBOLS } from "../symbol-list"; // importing the symbol array from symbol-list.ts
import { EditorDirective } from '../editor.directive';
//import { HomePage } from "../home/home.page";
//import { prototype } from 'jasmine';


@Component({
  selector: 'app-dialog-symbols',
  templateUrl: './dialog-symbols.page.html',
  styleUrls: ['./dialog-symbols.page.scss'],
})
export class DialogSymbolsPage implements OnInit {

  symbols = SYMBOLS;
  workspace = document.getElementById("workspace");

  constructor(public navCtrl: NavController, public navParams: NavParams, public modal: ModalController) {

  }

  ngOnInit() {
  }

  // // Open Symbols Palette
  // public async openModal(event){
  //   let t = event.target || event.srcElement || event.currentTarget;
  //   const myModal = await this.modal.create({
  //     component: DialogSymbolsPage
  //   });

  //   // Make current Branch ACTIVE
  //   t.classList.add('active-branch');

  //   // Display Symbols Palette
  //   await myModal.present();
  // }

  closeModal(event){
    //this.workspace.addEventListener('click', (e) => EditorDirective.prototype.checkForNewBranches(e) );
    //this.newSymbol = this.navParams.get("newSymbol");
    let branches = document.getElementsByClassName("branch-link dropzone active-branch");
    for(let i=0; i<branches.length; i++){
      branches[i].classList.remove('active-branch');
    }
    //console.log(this.newSymbol);
    this.modal.dismiss();
  }

  public addSymbol(id: string, event){
    
    let flowchart = document.getElementById("workspace");

    let temp = document.getElementById(id);
    let symbol = temp.cloneNode(true);
    let branches = document.getElementsByClassName("branch-link dropzone active-branch");
    let branch = branches[0].cloneNode(true);

    this.navParams.data = { newSymbol: symbol, newBranch: branch };
    console.log(this.navParams.get("newSymbol"));
    //let flowchart = document.getElementById("workspace");
    let tempSym = this.navParams.get("newSymbol");
    let tempBranch = this.navParams.get("newBranch");
    

    flowchart.insertBefore(tempSym, branches[0].nextSibling);
    flowchart.insertBefore(tempBranch, document.getElementById(id).nextSibling);

    // branches = document.getElementsByClassName("branch-link dropzone active-branch");
    // for(let i=0; i<branches.length; i++){
    //   // branches[i].addEventListener('click', (e) => this.openModal(e) );
    //   // checkForNewBranches();
      
    //   branches[i].classList.remove('active-branch');
    // }

    

    this.closeModal(event);

    //flowchart.innerText = tempSym;
  }

}
