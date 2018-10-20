import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, ModalController } from '@ionic/angular';
import { SYMBOLS } from "../symbol-list"; // importing the symbol array from symbol-list.ts
//import { HomePage } from "../home/home.page";
//import { prototype } from 'jasmine';


@Component({
  selector: 'app-dialog-symbols',
  templateUrl: './dialog-symbols.page.html',
  styleUrls: ['./dialog-symbols.page.scss'],
})
export class DialogSymbolsPage implements OnInit {

  symbols = SYMBOLS;

  constructor(public navCtrl: NavController, public navParams: NavParams, public modal: ModalController) {

  }

  ngOnInit() {
  }

  addSymbol(id: string, text: string, event){
    

    // let symbol = document.createElement("div");
    // symbol.id = id;
    // symbol.className = "draggable";

    let temp = document.getElementById(id);
    let symbol = temp.cloneNode(true);

    let flowchart = document.getElementById("workspace");
    let branches = document.getElementsByClassName("branch-link dropzone active-branch");
    let branch = branches[0];
    flowchart.insertBefore(symbol, branch.nextSibling);

    let new_branch = branches[0].cloneNode(true);
    
    //new_branch //.classList.remove('active-branch');
    //new_branch.innerHTML = '<div (click)="openModal($event)" id="branch1" ></div>'; //class="branch-link dropzone"
    //new_branch.className = "branch-link dropzone";
    //let temp = new_branch.content.firstChild;
    //new_branch = "branch1";
    
    flowchart.insertBefore(new_branch, symbol.nextSibling);

    branches = document.getElementsByClassName("branch-link dropzone active-branch");
    for(let i=0; i<branches.length; i++){
      branches[i].classList.remove('active-branch');
    }

    this.dismiss(event);
    //alert('You have added a ' + text + ' symbol.');
  }

  dismiss(event){
    let branches = document.getElementsByClassName("branch-link dropzone active-branch");
    for(let i=0; i<branches.length; i++){
      branches[i].classList.remove('active-branch');
    }
    this.modal.dismiss();
  }

}
