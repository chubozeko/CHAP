import { Component, ViewChild } from '@angular/core';
import { ModalController, Fab, ActionSheetController } from '@ionic/angular';
import { ActionSheetOptions } from '@ionic/core';


import { SYMBOLS } from "../symbol-list"; // importing the symbol array from symbol-list.ts
import 'libraries/scripts/menubareditor.js';
// import 'libraries/scripts/drag&drop.js';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  @ViewChild('symbolsFAB') symbolsFAB: Fab;

  title = 'CHAP';
  fileName = '';
  consoleDefaultText = '// Console Output \n> ';

  workspace; branch; selectedSymbol;
  mouseOffset = { x: 0, y: 0 }; isSymbolPressed = false;
  symbols = SYMBOLS;
  newSymbol: any;

  constructor(public symbolOptionsAS: ActionSheetController){}

  ngOnInit() {
    // Loading of external JavaScript libraries
    // this.loadScript('libraries/scripts/menubareditor.js');
    // this.loadScript('libraries/scripts/drag&drop.js');
    console.log("hello world");

    // Initializing Workspace & Arrows/Branches & adding buttonClick listeners
    this.workspace = document.getElementById("workspace");
    
    this.branch = document.getElementById("arrow");
    this.branch.addEventListener('click', (e) => this.openSymbolsFAB(e) );

    let branches = document.getElementsByClassName("dropzone");
    for(let i=0; i<branches.length; i++){
      branches[i].addEventListener('click', (e) => this.openSymbolsFAB(e) );
      branches[i].addEventListener("dragenter", (e) => this.dragEnter(e), false);
      branches[i].addEventListener("dragleave", (e) => this.dragLeave(e), false);
      branches[i].addEventListener("dragover", function(e){e.preventDefault();}, false);
      branches[i].addEventListener("drop", (e) => this.dropped(e), false);
      
      //branches[i].addEventListener("touchcancel", handleCancel, false);
      branches[i].addEventListener("touchleave", (e) => this.dragLeave(e), false);
      branches[i].addEventListener("touchenter", (e) => this.dragEnter(e), false);
    }

    let shapes = document.getElementsByClassName('symbol');
    for(var i=0; i<shapes.length; i++){
      shapes[i].addEventListener("dragstart", (e) => this.startDrag(e), false);
      shapes[i].addEventListener("dragend", (e) => this.endDrag(e), false);

      shapes[i].addEventListener("touchstart", (e) => this.startDrag(e), false);
      shapes[i].addEventListener("touchmove", (e) => this.moveDrag(e), false);
      shapes[i].addEventListener("touchend", (e) => this.endDrag(e), false);
    }

  }

  

  async openSymbolsAS(event){

    // Get the target symbol
    let targetSymbol = event.target || event.srcElement || event.currentTarget;

    if(targetSymbol.id == 's_if_case' || targetSymbol.id == 's_for_loop'
      || targetSymbol.id == 's_while_loop' || targetSymbol.id == 's_do_while_loop'){
      targetSymbol.parentElement.classList.add('active-symbol');
    } else {
      targetSymbol.classList.add('active-symbol');
    }

    // Create Symbol Options actionsheet
    let options: ActionSheetOptions = {
      // header: "",
      // subHeader: "",
      buttons: [
        {
          text: "Delete Symbol",
          handler: () => {
            let selectedSymbol = document.getElementsByClassName("active-symbol");
            let nextArrow = selectedSymbol[0].nextSibling;
            this.workspace.removeChild(nextArrow);
            selectedSymbol[0].remove();
          }
        }
      ]
    }
    // Create and Display Symbols Options actionsheet
    const actionSheet = await this.symbolOptionsAS.create(options);
    await actionSheet.present();

  }

  openSymbolsFAB(event){

    // Get the target arrow
    let t = event.target || event.srcElement || event.currentTarget;
    // Get symbols FAB
    let symbolsFAB = document.getElementById("symbolsFAB");
    // Get the active arrow/branch
    let arrows = document.getElementsByClassName("dropzone active-arrow");
    // Check if there are other active arrows/branches
    if(arrows.length < 1){
      t.classList.add('active-arrow');
      if (!symbolsFAB.getAttribute("activated")){
        this.symbolsFAB.activated = true;
      }
    } else {
      let branches = document.getElementsByClassName("dropzone active-arrow");
      for(let i=0; i<branches.length; i++){
        branches[i].classList.remove('active-arrow');
      }
      t.classList.add('active-arrow');
      // Open symbols FAB
      if (!symbolsFAB.getAttribute("activated")){
        this.symbolsFAB.activated = true;
      }
    }

  }

  public addSymbol(id: string, event){

    let symClass, temp, symbol;
    if(id == 's_if_case'){
      symClass = "if_div";
      temp = document.getElementsByClassName(symClass);
      symbol = temp[0].cloneNode(true);
    } else if(id == 's_for_loop'){
      symClass = "for_div";
      temp = document.getElementsByClassName(symClass);
      symbol = temp[0].cloneNode(true);
    } else if(id == 's_while_loop'){
      symClass = "while_div";
      temp = document.getElementsByClassName(symClass);
      symbol = temp[0].cloneNode(true);
    } else if(id == 's_do_while_loop'){
      symClass = "do_while_div";
      temp = document.getElementsByClassName(symClass);
      symbol = temp[0].cloneNode(true);
    } else {
      temp = document.getElementById(id);
      symbol = temp.cloneNode(true);
      symbol.textContent = "";
    }

    // Get and create a new symbol with given id from symbols FAB

    // Get the selected arrow/branch to append symbol after
    let branches = document.getElementsByClassName("arrow dropzone active-arrow");
    let tempBranch = this.branch.cloneNode(true);
    
    // Add buttonClick listeners to new Symbol & Arrow/Branch
    tempBranch.addEventListener('click', (e) => this.openSymbolsFAB(e) );   
    tempBranch.addEventListener('click', (e) => this.openSymbolsFAB(e) );
    tempBranch.addEventListener("dragenter", (e) => this.dragEnter(e), false);
    tempBranch.addEventListener("dragleave", (e) => this.dragLeave(e), false);
    tempBranch.addEventListener("dragover", function(e){e.preventDefault();}, false);
    tempBranch.addEventListener("drop", (e) => this.dropped(e), false);

    symbol.addEventListener('dblclick', (e) => this.openSymbolsAS(e) );

    // Add symbol and corresponding arrow/branch to Workspace
    this.workspace.insertBefore(symbol, branches[0].nextSibling);
    this.workspace.insertBefore(tempBranch, symbol.nextSibling);

    // Make all the arrows/branches on the Workspace inactive
    branches = document.getElementsByClassName("arrow dropzone active-arrow");
    for(let i=0; i<branches.length; i++){
      branches[i].classList.remove('active-arrow');
    }

  }

  public onPress(e){
    
    let item = e.target;
    if(item.className == 'symbol'){
      this.isSymbolPressed = true; 
    }
    // this.selectedSymbol = item;
    item.style.position = "absolute";
    // this.mouseOffset = { x: item.offsetLeft - e.clientX, y: item.offsetTop - e.clientY };
    item.style.border = "2px solid #01c5c4";

    let consoleCHAP = document.getElementById("console");
    consoleCHAP.append("touched\n");
    console.log("press " + this.isSymbolPressed);
  }

  public onPressUp(e){
    this.isSymbolPressed = false;
    let item = e.target;
    //item.style.position = "relative";
    //item.style.backgroundColor = "#F44336";
    item.style.border = "0";
    console.log("press up");
  }

  public startDrag(e){
    this.selectedSymbol = e.target.id;
    e.dataTransfer.setData('id', this.selectedSymbol);

    let consoleCHAP = document.getElementById("console");
    consoleCHAP.append("start drag\n> ");
  }

  public moveDrag(e){
    e.preventDefault();
    let item = e.target;
    // if(this.isMouseDown){
    //   // Move Item
    //   item.style.left = e.clientX + this.mouseOffset.x + "px";
    //   item.style.top = e.clientY + this.mouseOffset.y - 10 + "px";
    // }

    // If there's exactly one finger inside this element
    if (e.targetTouches.length == 1){ // && this.isSymbolPressed) {
      let touch = e.targetTouches[0];
    // Place element where the finger is
      item.style.left = e.clientX + touch.pageX + 'px';
      item.style.top = e.clientY + touch.pageY + 'px';

    let consoleCHAP = document.getElementById("console");
    consoleCHAP.append("touched\n");
    //alert("touched");
    }
  }
  
  public endDrag(e){
    console.log('end drag');

    let consoleCHAP = document.getElementById("console");
    consoleCHAP.append("end drag\n> ");
  }
  
  public dragEnter(e){
    e.preventDefault();
    e.target.classList.add('active-arrow');
    e.target.style.background = "#9CDCFE";

    let consoleCHAP = document.getElementById("console");
    consoleCHAP.append("drag enter\n> ");
  }
  
  public dragLeave(e){
    e.preventDefault();
    e.target.classList.remove('active-arrow');
    e.target.style.background = "#000000";

    let consoleCHAP = document.getElementById("console");
    consoleCHAP.append("drag leave\n> ");
  }
  
  public dropped(e){
    e.preventDefault();
    e.target.style.background = "#000000";
    this.addSymbol(this.selectedSymbol, e);
    console.log('dropped');
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
