import { ModalController } from "@ionic/angular";
import { Comment } from "../classes/Comment";
import { Declare } from "../classes/Declare";
import { DoWhileLoop } from "../classes/DoWhileLoop";
import { ForLoop } from "../classes/ForLoop";
import { IfCase } from "../classes/IfCase";
import { Input } from "../classes/Input";
import { Output } from "../classes/Output";
import { Process } from "../classes/Process";
import { WhileLoop } from "../classes/WhileLoop";
import { CommentPage } from "../symbol-dialogs/comment/comment.page";
import { DeclarePage } from "../symbol-dialogs/declare/declare.page";
import { DoWhileLoopPage } from "../symbol-dialogs/do-while-loop/do-while-loop.page";
import { ForLoopPage } from "../symbol-dialogs/for-loop/for-loop.page";
import { IfElsePage } from "../symbol-dialogs/if-else/if-else.page";
import { InputPage } from "../symbol-dialogs/input/input.page";
import { OutputPage } from "../symbol-dialogs/output/output.page";
import { ProcessPage } from "../symbol-dialogs/process/process.page";
import { WhileLoopPage } from "../symbol-dialogs/while-loop/while-loop.page";
import { Resizer } from "./resizer";

export class SymbolModals {

  resizer: Resizer = new Resizer();

  constructor(
    public modalC: ModalController  
  ) { }

  async openDeclareModal(symbol, e) {
    const modal = await this.modalC.create({
      component: DeclarePage,
      componentProps: { symbol: symbol },
    });
  
    modal.onDidDismiss().then((data) => {
      let s = document.getElementsByClassName("symbol active-symbol");
      for (let i = 0; i < s.length; i++) {
        s[i].classList.remove("active-symbol");
      }
  
      try {
        let dec = data.data as Declare;
        e.target.innerHTML = dec.getDeclareExpression();
        this.resizer.resizeSymbols(e.target);
        console.log(data.data);
      } catch (error) {
        console.log(error);
      }
    });
    await modal.present();
  }
  
  async openInputModal(symbol, e) {
    const modal = await this.modalC.create({
      component: InputPage,
      componentProps: { symbol: symbol },
    });
  
    modal.onDidDismiss().then((data) => {
      let s = document.getElementsByClassName("symbol active-symbol");
      for (let i = 0; i < s.length; i++) {
        s[i].classList.remove("active-symbol");
      }
  
      try {
        let input = data.data as Input;
        e.target.innerHTML = input.getInputExpression();
        this.resizer.resizeSymbols(e.target);
        console.log(data.data);
      } catch (error) {
        console.log(error);
      }
    });
    await modal.present();
  }
  
  async openOutputModal(symbol, e) {
    const modal = await this.modalC.create({
      component: OutputPage,
      componentProps: { symbol: symbol },
    });
  
    modal.onDidDismiss().then((data) => {
      let s = document.getElementsByClassName("symbol active-symbol");
      for (let i = 0; i < s.length; i++) {
        s[i].classList.remove("active-symbol");
      }
  
      try {
        let output = data.data as Output;
        e.target.innerHTML = output.getOutputExpression();
        this.resizer.resizeSymbols(e.target);
        console.log(data.data);
      } catch (error) {
        console.log(error);
      }
    });
    await modal.present();
  }
  
  async openProcessModal(symbol, e) {
    const modal = await this.modalC.create({
      component: ProcessPage,
      componentProps: { symbol: symbol },
    });
  
    modal.onDidDismiss().then((data) => {
      let s = document.getElementsByClassName("symbol active-symbol");
      for (let i = 0; i < s.length; i++) {
        s[i].classList.remove("active-symbol");
      }
  
      try {
        let proc = data.data as Process;
        e.target.innerHTML = proc.getProcessExpression();
        this.resizer.resizeSymbols(e.target);
        console.log(data.data);
      } catch (error) {
        console.log(error);
      }
    });
    await modal.present();
  }
  
  async openCommentModal(symbol, e) {
    const modal = await this.modalC.create({
      component: CommentPage,
      componentProps: { symbol: symbol },
    });
  
    modal.onDidDismiss().then((data) => {
      let s = document.getElementsByClassName("symbol active-symbol");
      for (let i = 0; i < s.length; i++) {
        s[i].classList.remove("active-symbol");
      }
  
      try {
        let com = data.data as Comment;
        e.target.innerHTML = com.getCommentExpression();
        this.resizer.resizeSymbols(e.target);
        console.log(data.data);
      } catch (error) {
        console.log(error);
      }
    });
    await modal.present();
  }
  
  async openIfModal(symbol, e) {
    const modal = await this.modalC.create({
      component: IfElsePage,
      componentProps: { symbol: symbol },
    });
  
    modal.onDidDismiss().then((data) => {
      let s = document.getElementsByClassName("symbol active-symbol");
      for (let i = 0; i < s.length; i++) {
        s[i].classList.remove("active-symbol");
      }
  
      try {
        let ifcase = data.data as IfCase;
        e.target.innerHTML = ifcase.getIfStatement();
        this.resizer.resizeSymbols(e.target);
        console.log(data.data);
      } catch (error) {
        console.log(error);
      }
    });
    await modal.present();
  }
  
  async openWhileModal(symbol, e) {
    const modal = await this.modalC.create({
      component: WhileLoopPage,
      componentProps: { symbol: symbol },
    });
  
    modal.onDidDismiss().then((data) => {
      let s = document.getElementsByClassName("active-symbol");
      for (let i = 0; i < s.length; i++) {
        s[i].classList.remove("active-symbol");
      }
  
      try {
        let whileloop = data.data as WhileLoop;
        e.target.innerHTML = whileloop.getWhileExpression();
        this.resizer.resizeSymbols(e.target);
        console.log(data.data);
      } catch (error) {
        console.log(error);
      }
    });
    await modal.present();
  }
  
  async openForLoopModal(symbol, e) {
    const modal = await this.modalC.create({
      component: ForLoopPage,
      componentProps: { symbol: symbol },
    });
  
    modal.onDidDismiss().then((data) => {
      let s = document.getElementsByClassName("symbol active-symbol");
      for (let i = 0; i < s.length; i++) {
        s[i].classList.remove("active-symbol");
      }
  
      try {
        let forloop = data.data as ForLoop;
        e.target.innerHTML = forloop.getForExpression();
        this.resizer.resizeSymbols(e.target);
        console.log(data.data);
      } catch (error) {
        console.log(error);
      }
    });
    await modal.present();
  }
  
  async openDoWhileModal(symbol, e) {
    const modal = await this.modalC.create({
      component: DoWhileLoopPage,
      componentProps: { symbol: symbol },
    });
  
    modal.onDidDismiss().then((data) => {
      let s = document.getElementsByClassName("active-symbol");
      for (let i = 0; i < s.length; i++) {
        s[i].classList.remove("active-symbol");
      }
  
      try {
        let dowhileloop = data.data as DoWhileLoop;
        e.target.innerHTML = dowhileloop.getDoWhileExpression();
        this.resizer.resizeSymbols(e.target);
        console.log(data.data);
      } catch (error) {
        console.log(error);
      }
    });
    await modal.present();
  }
}


