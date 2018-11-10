import { Component, ViewChild } from '@angular/core';
import { ModalController, Fab, ActionSheetController, MenuController, NavParams } from '@ionic/angular';
import { ActionSheetOptions } from '@ionic/core';

import { SYMBOLS } from "../symbol-list"; // importing the symbol array from symbol-list.ts
import { DeclarePage } from '../symbol-dialogs/declare/declare.page';
import { InputPage } from '../symbol-dialogs/input/input.page';
import { OutputPage } from '../symbol-dialogs/output/output.page';
import { CommentPage } from '../symbol-dialogs/comment/comment.page';
// import { ForLoopPage } from '../symbol-dialogs/for-loop/for-loop.page';
import { WhileLoopPage } from '../symbol-dialogs/while-loop/while-loop.page';
// import { DoWhileLoopPage } from '../symbol-dialogs/do-while-loop/do-while-loop.page';
import { IfElsePage } from '../symbol-dialogs/if-else/if-else.page';
import { ProcessPage } from '../symbol-dialogs/process/process.page';
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

  workspace; branch; selectedSymbol;
  symbols = SYMBOLS;
  newSymbol: any;

  constructor(
    public symbolOptionsAS: ActionSheetController, 
    public menu: MenuController, 
    public modalC: ModalController,
    // public navParams: NavParams
  ){}

  ngOnInit() {
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
    }

    let shapes = document.getElementsByClassName('symbol');
    for(var i=0; i<shapes.length; i++){
      shapes[i].addEventListener("dragstart", (e) => this.startDrag(e), false);
      shapes[i].addEventListener("dragend", (e) => this.endDrag(e), false);
      // shapes[i].addEventListener("dragmove", (e) => this.dragMove(e), false);
    }

  }

  public openMenu(){ this.menu.open(); }

  async openDeclareModal(id){
    const modal = await this.modalC.create({
      component: DeclarePage,
      componentProps: { s_id: id }
    });

    modal.onDidDismiss().then((data) => {
      this.consoleLog(data.data);
      console.log(data.data);
    });

    await modal.present();
  }

  async openInputModal(id){
    const modal = await this.modalC.create({
      component: InputPage,
      componentProps: { s_id: id }
    });

    modal.onDidDismiss().then((data) => {
      this.consoleLog(data.data);
      console.log(data.data);
    });

    await modal.present();
  }

  async openOutputModal(id){
    const modal = await this.modalC.create({
      component: OutputPage,
      componentProps: { s_id: id }
    });

    modal.onDidDismiss().then((data) => {
      this.consoleLog(data.data);
      console.log(data.data);
    });

    await modal.present();
  }

  async openProcessModal(id){
    const modal = await this.modalC.create({
      component: ProcessPage,
      componentProps: { s_id: id }
    });

    modal.onDidDismiss().then((data) => {
      this.consoleLog(data.data);
      console.log(data.data);
    });

    await modal.present();
  }

  async openCommentModal(id){
    const modal = await this.modalC.create({
      component: CommentPage,
      componentProps: { s_id: id }
    });

    modal.onDidDismiss().then((data) => {
      this.consoleLog(data.data);
      console.log(data.data);
    });

    await modal.present();
  }

  async openIfModal(id){
    const modal = await this.modalC.create({
      component: IfElsePage,
      componentProps: { s_id: id }
    });

    modal.onDidDismiss().then((data) => {
      this.consoleLog(data.data);
      console.log(data.data);
    });

    await modal.present();
  }

  async openWhileModal(id){
    const modal = await this.modalC.create({
      component: WhileLoopPage,
      componentProps: { s_id: id }
    });

    modal.onDidDismiss().then((data) => {
      this.consoleLog(data.data);
      console.log(data.data);
    });

    await modal.present();
  }

  // async openForLoopModal(id){
  //   const modal = await this.modalC.create({
  //     component: ForLoopPage,
  //     componentProps: { s_id: id }
  //   });

  //   modal.onDidDismiss().then((data) => {
  //     this.consoleLog(data.data);
  //     console.log(data.data);
  //   });

  //   await modal.present();
  // }

  // async openDoWhileModal(id){
  //   const modal = await this.modalC.create({
  //     component: DoWhileLoopPage,
  //     componentProps: { s_id: id }
  //   });

  //   modal.onDidDismiss().then((data) => {
  //     this.consoleLog(data.data);
  //     console.log(data.data);
  //   });

  //   await modal.present();
  // }

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

  public openSymbolsFAB(event){

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

  public openSymbolDialog(event, id){
    if(id == 's_declare'){
      this.openDeclareModal(id);
    } else if(id == 's_input'){
      this.openInputModal(id);
    } else if(id == 's_output'){
      this.openOutputModal(id);
    } else if(id == 's_comment'){
      this.openCommentModal(id);
    } else if(id == 's_process'){
      this.openProcessModal(id);
    } else if(id == 's_if_case'){
      this.openIfModal(id);
    } else if(id == 's_while_loop'){
      this.openWhileModal(id);
    }
    // } else if(id == 's_for_loop'){
    //   this.openForLoopModal(id);
    // }  else if(id == 's_do_while_loop'){
    //   this.openDoWhileModal(id);
    // }
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
    tempBranch.addEventListener("dragenter", (e) => this.dragEnter(e), false);
    tempBranch.addEventListener("dragleave", (e) => this.dragLeave(e), false);
    tempBranch.addEventListener("dragover", function(e){e.preventDefault();}, false);
    tempBranch.addEventListener("drop", (e) => this.dropped(e), false);

    symbol.addEventListener('dblclick', (e) => this.openSymbolDialog(e, id) );
    symbol.addEventListener('rightclick', (e) => this.openSymbolsAS(e) );
    
    // Add symbol and corresponding arrow/branch to Workspace
    this.workspace.insertBefore(symbol, branches[0].nextSibling);
    this.workspace.insertBefore(tempBranch, symbol.nextSibling);

    // Make all the arrows/branches on the Workspace inactive
    branches = document.getElementsByClassName("arrow dropzone active-arrow");
    for(let i=0; i<branches.length; i++){
      branches[i].classList.remove('active-arrow');
    }

  }

  public consoleLog(lineOutput){
    let consoleCHAP = document.getElementById("console");
    consoleCHAP.append(lineOutput + "\n");
  }

  public clearConsole(){
    let consoleCHAP = document.getElementById("console");
    consoleCHAP.textContent = "";
  }

  public startDrag(e){
    this.selectedSymbol = e.target.id;
    e.dataTransfer.setData('id', this.selectedSymbol);
    this.consoleLog("start drag");
  }

  public moveDrag(e){ e.preventDefault(); }
  
  public endDrag(e){ this.consoleLog("end drag"); }
  
  public dragEnter(e){
    e.preventDefault();
    e.target.classList.add('active-arrow');
    e.target.style.background = "#9CDCFE";

    this.consoleLog("drag enter");
  }
  
  public dragLeave(e){
    e.preventDefault();
    e.target.classList.remove('active-arrow');
    e.target.style.background = "#000000";

    this.consoleLog("drag leave");
  }
  
  public dropped(e){
    e.preventDefault();
    e.target.style.background = "#000000";
    this.addSymbol(this.selectedSymbol, e);

    this.consoleLog("dropped");
  }

  onPress(e){
    e.target.style.border = "2px dashed #000";
    this.openSymbolsAS(e);
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
