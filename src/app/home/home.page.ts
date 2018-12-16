import { Component, ViewChild } from '@angular/core';
import { ModalController, Fab, ActionSheetController, MenuController, NavParams, AlertController } from '@ionic/angular';
import { ActionSheetOptions } from '@ionic/core';
import html2canvas from 'html2canvas';
//import interact from 'interactjs';
const interact = require('interactjs');

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
import { TutorialPage } from '../tutorial/tutorial.page';
import { Stop } from '../classes/Stop';
// import 'libraries/scripts/drag&drop.js';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  @ViewChild('symbolsFAB') symbolsFAB: Fab;
  @ViewChild('tutorialFAB') tutorialFAB: Fab;

  flowchart: Flowchart = new Flowchart(this.alertC);
  title = 'CHAP';
  fileName = '';

  workspace; branch; selectedSymbol;
  symbols = SYMBOLS;
  newSymbol: any;
  dupSymbol: any;

  constructor(
    public symbolOptionsAS: ActionSheetController, 
    public menu: MenuController, 
    public modalC: ModalController,
    public alertC: AlertController
    // public navParams: NavParams
  ){}

  ngOnInit() {
    // Adding Click Listeners to Menu Items
    let debugP = document.getElementById("btn_debugProgram");
    debugP.addEventListener('click', (e) => this.debugProgram(e));
    let genCode = document.getElementById("btn_generateCode");
    genCode.addEventListener('click', (e) => this.generatePseudoCode(e));
    let clearWS = document.getElementById("btn_clearWorkspace");
    clearWS.addEventListener('click', (e) => this.clearWorkspace());
    let aboutPg = document.getElementById("btn_aboutPage");
    aboutPg.addEventListener('click', (e) => this.openAboutPage(e));
    let tutorPg = document.getElementById("btn_tutorialPage");
    tutorPg.addEventListener('click', (e) => this.openTutorialPage(e));
    let newProj = document.getElementById("btn_newProject");
    newProj.addEventListener('click', (e) => this.newProject());
    let saveProj = document.getElementById("btn_saveProject");
    saveProj.addEventListener('click', (e) => this.saveProject());

    // Initializing Workspace & Arrows/Branches & adding buttonClick listeners
    this.flowchart = new Flowchart(this.alertC);
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

    // interact('.symbol')
    //   .on('tap', function (e) {
    //     e.currentTarget.classList.toggle('switch-bg');
    //     e.preventDefault();
    //   })
    //   .on('doubletap', function (e) {
    //     e.currentTarget.classList.toggle('large');
    //     e.currentTarget.classList.remove('rotate');
    //     e.preventDefault();
    //   })
    //   .draggable({
    //     inertia: {
    //       resistance: 10,
    //       minSpeed: 500,
    //       endSpeed: 50
    //     },
    //     restrict: {
    //       restriction: this.workspace,
    //       endOnly: true,
    //       elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
    //     },
    //     autoScroll: true,
    //     onstart: this.startDrag,
    //     onmove: this.moveDrag,
    //     onend: this.endDrag
    //   })
    //   .on('hold', function (event) {
    //     event.currentTarget.classList.toggle('rotate');
    //     event.currentTarget.classList.remove('large');
    //   });
  }

  public openMenu(){ this.menu.open(); }

  async openDeclareModal(symbol, e){
    const modal = await this.modalC.create({
      component: DeclarePage,
      componentProps: { symbol: symbol }
    });

    modal.onDidDismiss().then((data) => {
      let s = document.getElementsByClassName("symbol active-symbol");
      for(let i=0; i<s.length; i++){
        s[i].classList.remove('active-symbol');
      }

      try {
        let dec = data.data as Declare; 
        e.target.innerHTML = dec.getDeclareExpression();
        console.log(data.data);
      } catch (error) { console.log(error); }
    });
    await modal.present();
  }

  async openInputModal(symbol, e){
    const modal = await this.modalC.create({
      component: InputPage,
      componentProps: { symbol: symbol }
    });

    modal.onDidDismiss().then((data) => {
      let s = document.getElementsByClassName("symbol active-symbol");
      for(let i=0; i<s.length; i++){
        s[i].classList.remove('active-symbol');
      }

      try {
        let input = data.data as Input;
        e.target.innerHTML = input.getInputExpression();
        console.log(data.data);
      } catch (error) { console.log(error); }
    });
    await modal.present();
  }

  async openOutputModal(symbol, e){
    const modal = await this.modalC.create({
      component: OutputPage,
      componentProps: { symbol: symbol }
    });

    modal.onDidDismiss().then((data) => {
      let s = document.getElementsByClassName("symbol active-symbol");
      for(let i=0; i<s.length; i++){
        s[i].classList.remove('active-symbol');
      }

      try {
        let output = data.data as Output;
        e.target.innerHTML = output.getOutputExpression();
        console.log(data.data);
      } catch (error) { console.log(error); }
    });
    await modal.present();
  }

  async openProcessModal(symbol, e){
    const modal = await this.modalC.create({
      component: ProcessPage,
      componentProps: { symbol: symbol }
    });

    modal.onDidDismiss().then((data) => {
      let s = document.getElementsByClassName("symbol active-symbol");
      for(let i=0; i<s.length; i++){
        s[i].classList.remove('active-symbol');
      }

      try {
        let proc = data.data as Process;
        e.target.innerHTML = proc.getProcessExpression();
        console.log(data.data);
      } catch (error) { console.log(error); }
    });
    await modal.present();
  }

  async openCommentModal(symbol, e){
    const modal = await this.modalC.create({
      component: CommentPage,
      componentProps: { symbol: symbol }
    });

    modal.onDidDismiss().then((data) => {
      let s = document.getElementsByClassName("symbol active-symbol");
      for(let i=0; i<s.length; i++){
        s[i].classList.remove('active-symbol');
      }

      try {
        let com = data.data as Comment;
        e.target.innerHTML = com.getCommentExpression();
        console.log(data.data);
      } catch (error) { console.log(error); }
    });
    await modal.present();
  }

  async openIfModal(symbol, e){
    console.log(symbol);
    
    const modal = await this.modalC.create({
      component: IfElsePage,
      componentProps: { symbol: symbol }
    });

    modal.onDidDismiss().then((data) => {
      let s = document.getElementsByClassName("symbol active-symbol");
      for(let i=0; i<s.length; i++){
        s[i].classList.remove('active-symbol');
      }

      try {
        let ifcase = data.data as IfCase;
        e.target.innerHTML = ifcase.getIfStatement();
        //this.consoleLog(ifcase.getIfStatement());
        console.log(data.data);
        //console.log(ifcase.getIfStatement());
        
      } catch (error) { console.log(error); }
    });
    await modal.present();
  }

  async openWhileModal(symbol, e){
    const modal = await this.modalC.create({
      component: WhileLoopPage,
      componentProps: { symbol: symbol }
    });

    modal.onDidDismiss().then((data) => {
      let s = document.getElementsByClassName("active-symbol");
      for(let i=0; i<s.length; i++){
        s[i].classList.remove('active-symbol');
      }

      try {
        let whileloop = data.data as WhileLoop;
      // e.target.innerHTML = whileloop.getWhileExpression();
      // this.consoleLog(whileloop.getWhileExpression());
      console.log(data.data);
      } catch (error) { console.log(error); }
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
    event.preventDefault();
    // Get the target symbol & make it active
    let targetSymbol = event.target || event.srcElement || event.currentTarget;
    if(targetSymbol.id == 's_if_case' || targetSymbol.id == 's_for_loop'
      || targetSymbol.id == 's_while_loop' || targetSymbol.id == 's_do_while_loop'){
      targetSymbol.parentElement.classList.add('active-symbol');
    } else {
      targetSymbol.classList.add('active-symbol');
    }

    // Create Symbol Options actionsheet
    let options: ActionSheetOptions = {
      buttons: [
        {
          text: "Delete Symbol",
          handler: () => {
            let asi;
            let selectedSymbol = document.getElementById("workspace").getElementsByClassName("active-symbol");
            let actSym = document.getElementById("workspace").getElementsByClassName("symbol");
            if( selectedSymbol[0].parentElement.id == 'ifTrueBlock' ){
              let syms = selectedSymbol[0].parentElement.getElementsByClassName("symbol");
              for (let i = 0; i < syms.length; i++) { if( syms[i].classList.contains('active-symbol') ){ asi = i; } }
              for (let l = 0; l < this.flowchart.SYMBOLS.length; l++) {
                if( this.flowchart.SYMBOLS[l] instanceof IfCase){ this.flowchart.SYMBOLS[l].removeSymbolFromTrueBlock( asi ); }
              }

              let nextArrow = syms[asi].nextSibling;
              syms[asi].parentElement.removeChild(nextArrow);
              syms[asi].remove();
            } else if( selectedSymbol[0].parentElement.id == 'ifFalseBlock' ){
              let syms = selectedSymbol[0].parentElement.getElementsByClassName("symbol");
              for (let i = 0; i < syms.length; i++) { if( syms[i].classList.contains('active-symbol') ){ asi = i; } }
              for (let l = 0; l < this.flowchart.SYMBOLS.length; l++) {
                if( this.flowchart.SYMBOLS[l] instanceof IfCase){ this.flowchart.SYMBOLS[l].removeSymbolFromFalseBlock( asi ); }
              }

              let nextArrow = syms[asi].nextSibling;
              syms[asi].parentElement.removeChild(nextArrow);
              syms[asi].remove();
            } else {
              let syms = document.getElementById("workspace").getElementsByClassName("symbol");
              for (let i = 0; i < syms.length; i++) { if( syms[i].classList.contains('active-symbol') ){ asi = i-1; } }
              this.flowchart.removeSymbolFromFlowchart( asi );

              let nextArrow = selectedSymbol[0].nextSibling;
              this.workspace.removeChild(nextArrow);
              selectedSymbol[0].remove();
            }
            // let nextArrow = selectedSymbol[0].nextSibling;
            // this.workspace.removeChild(nextArrow);
            // selectedSymbol[0].remove();
            console.log(this.flowchart.SYMBOLS);
            
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

  public openTutorialFAB(event){
    let tutorialFAB = document.getElementById("tutorialFAB");
    if (!tutorialFAB.getAttribute("activated")){
      this.tutorialFAB.activated = true;
    }
  }

  public openSymbolDialog(event, id){
    // Get the target symbol & make it active
    let active_sym_index, tempSym, asi;
    let targetSymbol = event.target || event.srcElement || event.currentTarget;
    if(targetSymbol.id == 's_if_case' || targetSymbol.id == 's_while_loop'){
      targetSymbol.classList.add('active-symbol');
    } else {
      targetSymbol.classList.add('active-symbol');
    }
    
    // Checking the Symbol type and opening corresponding Properties Dialog Modals
    if( targetSymbol.parentElement.id == 'ifTrueBlock' ){
      let syms = event.target.parentElement.getElementsByClassName("symbol");
      for (let i = 0; i < syms.length; i++) {
        if( syms[i].classList.contains('active-symbol') ){ asi = i; }
      }

      for (let l = 0; l < this.flowchart.SYMBOLS.length; l++) {
        const el = this.flowchart.SYMBOLS[l];
        if( el instanceof IfCase){
          tempSym = el.getSymbolFromTrueBlock( asi );
          if(targetSymbol.id == 's_declare'){ this.openDeclareModal(tempSym, event); } 
          else if(targetSymbol.id == 's_input'){ this.openInputModal(tempSym, event); } 
          else if(targetSymbol.id == 's_output'){ this.openOutputModal(tempSym, event); } 
          else if(targetSymbol.id == 's_comment'){ this.openCommentModal(tempSym, event); } 
          else if(targetSymbol.id == 's_process'){ this.openProcessModal(tempSym, event); } 
          else if(targetSymbol.id == 's_if_case'){ this.openIfModal(tempSym, event); } 
          else if(targetSymbol.id == 's_while_loop'){ this.openWhileModal(tempSym, event); }
        }
      }
    }
    else if( targetSymbol.parentElement.id == 'ifFalseBlock'){
      let syms = event.target.parentElement.getElementsByClassName("symbol");
      for (let i = 0; i < syms.length; i++) {
        if( syms[i].classList.contains('active-symbol') ){ asi = i; }
      }

      for (let l = 0; l < this.flowchart.SYMBOLS.length; l++) {
        const el = this.flowchart.SYMBOLS[l];
        if( el instanceof IfCase){
          tempSym = el.getSymbolFromFalseBlock( asi );
          if(targetSymbol.id == 's_declare'){ this.openDeclareModal(tempSym, event); } 
          else if(targetSymbol.id == 's_input'){ this.openInputModal(tempSym, event); } 
          else if(targetSymbol.id == 's_output'){ this.openOutputModal(tempSym, event); } 
          else if(targetSymbol.id == 's_comment'){ this.openCommentModal(tempSym, event); } 
          else if(targetSymbol.id == 's_process'){ this.openProcessModal(tempSym, event); } 
          else if(targetSymbol.id == 's_if_case'){ this.openIfModal(tempSym, event); } 
          else if(targetSymbol.id == 's_while_loop'){ this.openWhileModal(tempSym, event); }
        }
      }
    }
    else {
      let syms = document.getElementById('workspace').getElementsByClassName("symbol");
      for (let i=0; i<syms.length; i++) {
        if( syms[i].classList.contains('active-symbol') ){ active_sym_index = i-1; }
      }
      tempSym = this.flowchart.getSymbolFromFlowchart( active_sym_index );

      if(targetSymbol.id == 's_declare'){ this.openDeclareModal(tempSym, event); }
      else if(targetSymbol.id == 's_input'){ this.openInputModal(tempSym, event); }
      else if(targetSymbol.id == 's_output'){ this.openOutputModal(tempSym, event); } 
      else if(targetSymbol.id == 's_comment'){ this.openCommentModal(tempSym, event); } 
      else if(targetSymbol.id == 's_process'){ this.openProcessModal(tempSym, event); } 
      else if(targetSymbol.id == 's_if_case'){ this.openIfModal(tempSym, event); } 
      else if(targetSymbol.id == 's_while_loop'){ this.openWhileModal(tempSym, event); }
    }
    
    // } else if(targetSymbol.id == 's_for_loop'){
    //   this.openForLoopModal(id);
    // }  else if(targetSymbol.id == 's_do_while_loop'){
    //   this.openDoWhileModal(id);
    // }
  }

  public addSymbol(id: string, e){
    let symClass, temp, symbol, active_index, act_in, symComponent;
    let b = document.getElementsByClassName("arrow dropzone");
    for(let i=0; i<b.length; i++){
      if( b[i].className.endsWith('active-arrow') ){ active_index = i; }
    }

    if(id == 's_declare'){
      let dec = new Declare();
      temp = document.getElementById(id);
      dec.setDeclareSymbol( temp.cloneNode(true) );
      symbol = dec.getDeclareSymbol();
      symbol.innerHTML = "Declare";
      symComponent = dec;
      //this.flowchart.addSymbolToFlowchart( dec, active_index );
    } 
    else if(id == 's_input'){
      let input = new Input();
      temp = document.getElementById(id);
      input.setInputSymbol( temp.cloneNode(true) );
      symbol = input.getInputSymbol();
      symbol.innerHTML = "Input";
      symComponent = input;
      //this.flowchart.addSymbolToFlowchart( input, active_index );
    } 
    else if(id == 's_output'){
      let output = new Output();
      temp = document.getElementById(id);
      output.setOutputSymbol( temp.cloneNode(true) );
      symbol = output.getOutputSymbol();
      symbol.innerHTML = "Output";
      symComponent = output;
      //this.flowchart.addSymbolToFlowchart( output, active_index );
    } 
    else if(id == 's_process'){
      let proc = new Process();
      temp = document.getElementById(id);
      proc.setProcessSymbol( temp.cloneNode(true) );
      symbol = proc.getProcessSymbol();
      symbol.innerHTML = "Process";
      symComponent =  proc;
      //this.flowchart.addSymbolToFlowchart( proc, active_index );
    } 
    else if(id == 's_comment'){
      let com = new Comment();
      temp = document.getElementById(id);
      com.setCommentSymbol( temp.cloneNode(true) );
      symbol = com.getCommentSymbol();
      symbol.innerHTML = "Comment";
      symComponent = com;
      //this.flowchart.addSymbolToFlowchart( com, active_index );
    }
    else if(id == 's_if_case'){
      let ifcase = new IfCase();
      symClass = "if_div";
      temp = document.getElementsByClassName(symClass);
      let t1 = document.getElementById("s_if_case");
      ifcase.setIfCaseSymbol( t1 ); // temp[0].cloneNode(true) );
      symbol = temp[0].cloneNode(true); 
      //symbol = ifcase.getIfCaseSymbol().parentElement;
      symComponent = ifcase;
      //this.flowchart.addSymbolToFlowchart( ifcase, active_index );
    } 
    else if(id == 's_while_loop'){
      let whileloop = new WhileLoop();
      symClass = "while_div";
      temp = document.getElementsByClassName(symClass);
      whileloop.setWhileSymbol( temp[0].cloneNode(true) );
      symbol = whileloop.getWhileSymbol();
      symComponent = whileloop;
      //this.flowchart.addSymbolToFlowchart( whileloop, active_index );
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

    // Get the selected arrow/branch to append symbol after
    let branches = document.getElementsByClassName("arrow dropzone active-arrow");
    let tempBranch = this.branch.cloneNode(true);
    //tempBranch.classList.remove('active-arrow');
    
    // Add buttonClick listeners to new Symbol & Arrow/Branch
    tempBranch.addEventListener('click', (e) => this.openSymbolsFAB(e) );   
    tempBranch.addEventListener("dragenter", (e) => this.dragEnter(e), false);
    tempBranch.addEventListener("dragleave", (e) => this.dragLeave(e), false);
    tempBranch.addEventListener("dragover", function(e){e.preventDefault();}, false);
    tempBranch.addEventListener("drop", (e) => this.dropped(e), false);
    symbol.addEventListener('dblclick', (e) => this.openSymbolDialog(e, id) );
    symbol.addEventListener('contextmenu', (e) => this.openSymbolsAS(e) );
    
    if( branches[0].parentElement.id == 'ifTrueBlock' ){

      let p = branches[0].parentElement.getElementsByClassName("arrow dropzone");
      for(let r=0; r<p.length; r++){
        if( p[r].className.endsWith('active-arrow') ){ act_in = r; }
      }

      tempBranch.classList.remove('active-arrow');
      branches[0].parentElement.insertBefore(symbol, branches[0].nextSibling);
      branches[0].parentElement.insertBefore(tempBranch, symbol.nextSibling);
      
      for (let l = 0; l < this.flowchart.SYMBOLS.length; l++) {
        const el = this.flowchart.SYMBOLS[l];
        if( el instanceof IfCase){
          el.addSymbolToTrueBlock( symComponent, act_in );
        }
      }
      
    } else if( branches[0].parentElement.id == 'ifFalseBlock' ){
      
      let p = branches[0].parentElement.getElementsByClassName("arrow dropzone");
      for(let r=0; r<p.length; r++){
        if( p[r].className.endsWith('active-arrow') ){ act_in = r; }
      }

      tempBranch.classList.remove('active-arrow');
      branches[0].parentElement.insertBefore(symbol, branches[0].nextSibling);
      branches[0].parentElement.insertBefore(tempBranch, symbol.nextSibling);
      
      for (let l = 0; l < this.flowchart.SYMBOLS.length; l++) {
        const el = this.flowchart.SYMBOLS[l];
        if( el instanceof IfCase){
          el.addSymbolToFalseBlock( symComponent, act_in );
        }
      }
      
    } else {
      let ai, totalAD = 0;
      let b1 = this.workspace.getElementsByClassName("arrow dropzone");
      
      for (let l = 0; l < b1.length; l++) {
        if (b1[l].parentElement.id == 'ifTrueBlock' || b1[l].parentElement.id == 'ifFalseBlock'){ totalAD++; }
      }
      
      for(let i=0; i<b1.length; i++){
        if( b1[i].className.endsWith('active-arrow') ){ ai = i-totalAD; }
      }
      // Add symbol and corresponding arrow/branch to Workspace
      this.workspace.insertBefore(symbol, branches[0].nextSibling);
      this.workspace.insertBefore(tempBranch, symbol.nextSibling);

      this.flowchart.addSymbolToFlowchart( symComponent, ai );
    }

    // Make all the arrows/branches on the Workspace inactive
    branches = document.getElementsByClassName("arrow dropzone active-arrow");
    for(let i=0; i<branches.length; i++){
      branches[i].classList.remove('active-arrow');
    }

    let dz = document.getElementsByClassName("arrow dropzone");
      for(let i=0; i<dz.length; i++){
        dz[i].addEventListener('click', (e) => this.openSymbolsFAB(e) );
        dz[i].addEventListener("dragenter", (e) => this.dragEnter(e), false);
        dz[i].addEventListener("dragleave", (e) => this.dragLeave(e), false);
        dz[i].addEventListener("dragover", function(e){e.preventDefault();}, false);
        dz[i].addEventListener("drop", (e) => this.dropped(e), false);
      }

    console.log( this.flowchart.SYMBOLS );
  }

  public consoleLog(lineOutput){
    let consoleCHAP = document.getElementById("console") as HTMLTextAreaElement;
    consoleCHAP.value = consoleCHAP.value + lineOutput + "\n";
  }

  async showAlert(alertTitle: string, alertMsg: string) {
    const alert = await this.alertC.create({
      header: alertTitle,
      message: alertMsg,
      buttons: ['OK']
    });
    await alert.present();
  }

  public clearConsole(){
    let consoleCHAP = document.getElementById("console") as HTMLTextAreaElement;
    consoleCHAP.value = "";
    let consoleInput = document.getElementById("consoleInput") as HTMLInputElement;
    consoleInput.value = "";
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
    this.flowchart = new Flowchart(this.alertC);
  }

  public startDrag(e){
    // let t = e.target || e.srcElement || e.currentTarget,
    //   x = (parseFloat(t.getAttribute('data-x')) || 0) + e.dx,
    //   y = (parseFloat(t.getAttribute('data-y')) || 0) + e.dy;
    // this.dupSymbol = t.cloneNode(true);
    // document.body.appendChild( this.dupSymbol );
    // this.dupSymbol.style.transform = 'translate(' + x + 'px, ' + y + 'px)';
    
    // e.target = this.dupSymbol;
    //e.dataTransfer.setData('id', this.selectedSymbol);
    console.log("start drag" + e.target);
  }

  public moveDrag(e){ 
    e.preventDefault(); 
    let target = e.target || e.srcElement || e.currentTarget,
      // keep the dragged position in the data-x/data-y attributes
      x = (parseFloat(target.getAttribute('data-x')) || 0) + e.dx,
      y = (parseFloat(target.getAttribute('data-y')) || 0) + e.dy;

    // translate the element
    target.style.zIndex = '-1';
    target.style.webkitTransform =
    target.style.transform =
      'translate(' + x + 'px, ' + y + 'px)';

    // update the position attributes
    target.setAttribute('data-x', x);
    target.setAttribute('data-y', y);
  }
  
  public endDrag(e){ 
    e.preventDefault();
   // this.consoleLog("end drag");
  }
  
  public dragEnter(e){
    e.preventDefault();
    e.target.classList.add('active-arrow');
    e.target.style.background = "#9CDCFE";
   // this.consoleLog("drag enter");
  }
  
  public dragLeave(e){
    e.preventDefault();
    e.target.classList.remove('active-arrow');
    e.target.style.background = "#000000";
    //this.consoleLog("drag leave");
  }
  
  public dropped(e){
    e.preventDefault();
    e.target.style.background = "#000000";
    this.addSymbol(this.selectedSymbol, e);
    //this.consoleLog("dropped");
  }

  public onPress(e){
    e.target.style.border = "2px dashed #000";
    //this.openSymbolsAS(e);
    this.consoleLog("press");
  }

  public newProject(){
    let fileN = document.getElementById("fileName") as HTMLInputElement;
    fileN.value = '';
    this.clearWorkspace();
  }

  public saveProject(){
    html2canvas(document.querySelector("#workspace")).then(canvas => {
      let can = canvas as HTMLCanvasElement;
      can.width = 100;
      can.height = 100;
      document.getElementById("workspace").appendChild(can);
    });
    //alert('Screenshot');
  }

  public debugProgram(e){
    this.menu.close();
    this.clearConsole();
    this.flowchart.validateFlowchart();
  }

  public generatePseudoCode(e){
    this.openCodeViewer( this.flowchart, e );
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

  async openTutorialPage(e){
    this.menu.close();
    const modal = await this.modalC.create({
      component: TutorialPage
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
