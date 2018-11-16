import { Component, ViewChild } from '@angular/core';
import { ModalController, Fab, ActionSheetController, MenuController, NavParams } from '@ionic/angular';
import { ActionSheetOptions } from '@ionic/core';

import { SYMBOLS } from "../symbol-list";   // importing the symbol array from symbol-list.ts
import { DeclarePage } from '../symbol-dialogs/declare/declare.page';
import { InputPage } from '../symbol-dialogs/input/input.page';
import { ProcessPage } from '../symbol-dialogs/process/process.page';
import { OutputPage } from '../symbol-dialogs/output/output.page';
import { CommentPage } from '../symbol-dialogs/comment/comment.page';
import { IfElsePage } from '../symbol-dialogs/if-else/if-else.page';
import { WhileLoopPage } from '../symbol-dialogs/while-loop/while-loop.page';
// import { ForLoopPage } from '../symbol-dialogs/for-loop/for-loop.page';
// import { DoWhileLoopPage } from '../symbol-dialogs/do-while-loop/do-while-loop.page';

import { Declare } from '../classes/Declare';
import { Input } from '../classes/Input';
import { Output } from '../classes/Output';
import { Process } from '../classes/Process';
import { Comment } from '../classes/Comment';
import { Flowchart } from '../classes/Flowchart';
import { IfCase } from '../classes/IfCase';
import { WhileLoop } from '../classes/WhileLoop';
import { CodeViewerPage } from '../code-viewer/code-viewer.page';
import { AboutPage } from '../about/about.page';
// import 'libraries/scripts/drag&drop.js';

// Display an alert box after 3 seconds (3000 milliseconds):
//  setTimeout(function(){ alert("Hello"); }, 3000);

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  @ViewChild('symbolsFAB') symbolsFAB: Fab;

  flowchart: Flowchart = new Flowchart();
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
    
    // Adding Click Listeners to Menu Items
    let genCode = document.getElementById("btn_generateCode");
    genCode.addEventListener('click', (e) => this.generatePseudoCode(e));
    let clearWS = document.getElementById("btn_clearWorkspace");
    clearWS.addEventListener('click', (e) => this.clearWorkspace());
    let aboutPg = document.getElementById("btn_aboutPage");
    aboutPg.addEventListener('click', (e) => this.openAboutPage(e));

    // Initializing Workspace & Arrows/Branches & adding buttonClick listeners
    this.flowchart = new Flowchart();
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

  async openDeclareModal(symbol, e){
    const modal = await this.modalC.create({
      component: DeclarePage,
      componentProps: { symbol: symbol }
    });

    modal.onDidDismiss().then((data) => {
      let dec = data.data as Declare;
      e.target.innerHTML = dec.getDeclareExpression();
      this.consoleLog(dec.getDeclareExpression());
      console.log(data.data);
    });

    await modal.present();
  }

  async openInputModal(symbol, e){
    const modal = await this.modalC.create({
      component: InputPage,
      componentProps: { symbol: symbol }
    });

    modal.onDidDismiss().then((data) => {
      let input = data.data as Input;
      e.target.innerHTML = input.getInputExpression();
      this.consoleLog(input.getInputExpression());
      console.log(data.data);
    });

    await modal.present();
  }

  async openOutputModal(symbol, e){
    const modal = await this.modalC.create({
      component: OutputPage,
      componentProps: { symbol: symbol }
    });

    modal.onDidDismiss().then((data) => {
      let output = data.data as Output;
      e.target.innerHTML = output.getOutputExpression();
      this.consoleLog(output.getOutputExpression());
      console.log(data.data);
    });

    await modal.present();
  }

  async openProcessModal(symbol, e){
    const modal = await this.modalC.create({
      component: ProcessPage,
      componentProps: { symbol: symbol }
    });

    modal.onDidDismiss().then((data) => {
      let proc = data.data as Process;
      e.target.innerHTML = proc.getProcessExpression();
      this.consoleLog(proc.getProcessExpression());
      console.log(data.data);
    });

    await modal.present();
  }

  async openCommentModal(symbol, e){
    const modal = await this.modalC.create({
      component: CommentPage,
      componentProps: { symbol: symbol }
    });

    modal.onDidDismiss().then((data) => {
      let com = data.data as Comment;
      e.target.innerHTML = com.getCommentExpression();
      this.consoleLog(com.getCommentExpression());
      console.log(data.data);
    });

    await modal.present();
  }

  async openIfModal(symbol, e){
    const modal = await this.modalC.create({
      component: IfElsePage,
      componentProps: { symbol: symbol }
    });

    modal.onDidDismiss().then((data) => {
      let ifcase = data.data as IfCase;
      // e.target.innerHTML = ifcase.getIfCaseExpression();
      // this.consoleLog(ifcase.getIfCaseExpression());
      this.consoleLog(data.data);
      console.log(data.data);
    });

    await modal.present();
  }

  async openWhileModal(symbol, e){
    const modal = await this.modalC.create({
      component: WhileLoopPage,
      componentProps: { symbol: symbol }
    });

    modal.onDidDismiss().then((data) => {
      let whileloop = data.data as WhileLoop;
      // e.target.innerHTML = whileloop.getWhileExpression();
      // this.consoleLog(whileloop.getWhileExpression());
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

    // Get the target symbol
    let active_sym_index, tempSym;
    let targetSymbol = event.target || event.srcElement || event.currentTarget;
    if(targetSymbol.id == 's_if_case' || targetSymbol.id == 's_while_loop'){
      targetSymbol.parentElement.classList.add('active-symbol');
    } else {
      targetSymbol.classList.add('active-symbol');
    }
    let syms = document.getElementsByClassName("symbol");
    for (let i = 0; i < syms.length; i++) {
      if( syms[i].className == 'symbol active-symbol' ){ active_sym_index = i; }
    }

    if(id == 's_declare'){
      this.consoleLog('active symbol: ' + active_sym_index);
      tempSym = this.flowchart.getSymbolFromFlowchart( active_sym_index );
      this.openDeclareModal(tempSym, event);
    } 
    else if(id == 's_input'){
      this.consoleLog('active symbol: ' + active_sym_index);
      tempSym = this.flowchart.getSymbolFromFlowchart( active_sym_index );
      this.openInputModal(tempSym, event);
    } 
    else if(id == 's_output'){
      this.consoleLog('active symbol: ' + active_sym_index);
      tempSym = this.flowchart.getSymbolFromFlowchart( active_sym_index );
      this.openOutputModal(tempSym, event);
    } 
    else if(id == 's_comment'){
      this.consoleLog('active symbol: ' + active_sym_index);
      tempSym = this.flowchart.getSymbolFromFlowchart( active_sym_index );
      this.openCommentModal(tempSym, event);
    } 
    else if(id == 's_process'){4
      this.consoleLog('active symbol: ' + active_sym_index);
      tempSym = this.flowchart.getSymbolFromFlowchart( active_sym_index );
      this.openProcessModal(tempSym, event);
    } 
    else if(id == 's_if_case'){
      this.consoleLog('active symbol: ' + active_sym_index);
      tempSym = this.flowchart.getSymbolFromFlowchart( active_sym_index );
      this.openIfModal(tempSym, event);
    } 
    else if(id == 's_while_loop'){
      this.consoleLog('active symbol: ' + active_sym_index);
      tempSym = this.flowchart.getSymbolFromFlowchart( active_sym_index );
      this.openWhileModal(tempSym, event);
    }
    // } else if(id == 's_for_loop'){
    //   this.openForLoopModal(id);
    // }  else if(id == 's_do_while_loop'){
    //   this.openDoWhileModal(id);
    // }
  }

  public addSymbol(id: string, e){
    
    let symClass, temp, symbol, active_index;

    let b = document.getElementsByClassName("arrow dropzone");
    for(let i=0; i<b.length; i++){
      if( b[i].className.endsWith('active-arrow') ){ active_index = i+1; }
    }

    if(id == 's_declare'){
      let dec = new Declare();
      temp = document.getElementById(id);
      dec.setDeclareSymbol( temp.cloneNode(true) );
      symbol = dec.getDeclareSymbol();
      symbol.innerHTML = "Declare";
      this.flowchart.addSymbolToFlowchart( dec, active_index );
    } 
    else if(id == 's_input'){
      let input = new Input();
      temp = document.getElementById(id);
      input.setInputSymbol( temp.cloneNode(true) );
      symbol = input.getInputSymbol();
      symbol.innerHTML = "Input";
      this.flowchart.addSymbolToFlowchart( input, active_index );
    } 
    else if(id == 's_output'){
      let output = new Output();
      temp = document.getElementById(id);
      output.setOutputSymbol( temp.cloneNode(true) );
      symbol = output.getOutputSymbol();
      symbol.innerHTML = "Output";
      this.flowchart.addSymbolToFlowchart( output, active_index );
    } 
    else if(id == 's_process'){
      let proc = new Process();
      temp = document.getElementById(id);
      proc.setProcessSymbol( temp.cloneNode(true) );
      symbol = proc.getProcessSymbol();
      symbol.innerHTML = "Process";
      this.flowchart.addSymbolToFlowchart( proc, active_index );
    } 
    else if(id == 's_comment'){
      let com = new Comment();
      temp = document.getElementById(id);
      com.setCommentSymbol( temp.cloneNode(true) );
      symbol = com.getCommentSymbol();
      symbol.innerHTML = "Comment";
      this.flowchart.addSymbolToFlowchart( com, active_index );
    }
    else if(id == 's_if_case'){
      symClass = "if_div";
      temp = document.getElementsByClassName(symClass);
      symbol = temp[0].cloneNode(true);
    } 
    else if(id == 's_while_loop'){
      symClass = "while_div";
      temp = document.getElementsByClassName(symClass);
      symbol = temp[0].cloneNode(true);
    } 
    // else if(id == 's_for_loop'){
    //   symClass = "for_div";
    //   temp = document.getElementsByClassName(symClass);
    //   symbol = temp[0].cloneNode(true);
    // } else if(id == 's_do_while_loop'){
    //   symClass = "do_while_div";
    //   temp = document.getElementsByClassName(symClass);
    //   symbol = temp[0].cloneNode(true);
    // }
    
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

    this.consoleLog('active arrow index: ' + active_index + '; symbol cnt: ' + this.flowchart.SYMBOLS.length);

  }

  public consoleLog(lineOutput){
    let consoleCHAP = document.getElementById("console");
    consoleCHAP.append(lineOutput + "\n");
  }

  public clearConsole(){
    let consoleCHAP = document.getElementById("console");
    consoleCHAP.textContent = "";
  }

  public clearWorkspace(){
    this.menu.close();
    this.clearConsole();
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
    this.flowchart = new Flowchart();
  }

  public startDrag(e){
    this.selectedSymbol = e.target.id;
    e.dataTransfer.setData('id', this.selectedSymbol);
    this.consoleLog("start drag");
  }

  public moveDrag(e){ e.preventDefault(); }
  
  public endDrag(e){ 
    e.preventDefault();
    this.consoleLog("end drag");
  }
  
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

  public generatePseudoCode(e){
    this.openCodeViewer( this.flowchart, e );
    // this.consoleLog( this.flowchart.displayFlowchartPseudoCode() );
    this.menu.close();
  }

  async openCodeViewer(flowchart, e){
    const modal = await this.modalC.create({
      component: CodeViewerPage,
      componentProps: { flowchart: flowchart }
    });

    await modal.present();
  }

  async openAboutPage(e){
    this.menu.close();
    const modal = await this.modalC.create({
      component: AboutPage
    });

    await modal.present();
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
