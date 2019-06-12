import { Component, ViewChild, SystemJsNgModuleLoader, Injectable } from "@angular/core";
import { ModalController, Fab, ActionSheetController, MenuController, NavParams, AlertController, ToastController } from "@ionic/angular";
import { ActionSheetOptions } from "@ionic/core";
import html2canvas from "html2canvas";
const interact = require("interactjs");
import { File } from '@ionic-native/file/ngx';
import { Chooser } from '@ionic-native/chooser/ngx';
import { HttpClient } from '@angular/common/http';
import { SYMBOLS } from "../symbol-list"; // importing the symbol array from symbol-list.ts
import { DeclarePage } from "../symbol-dialogs/declare/declare.page";
import { InputPage } from "../symbol-dialogs/input/input.page";
import { ProcessPage } from "../symbol-dialogs/process/process.page";
import { OutputPage } from "../symbol-dialogs/output/output.page";
import { CommentPage } from "../symbol-dialogs/comment/comment.page";
import { IfElsePage } from "../symbol-dialogs/if-else/if-else.page";
import { WhileLoopPage } from "../symbol-dialogs/while-loop/while-loop.page";
import { ForLoopPage } from "../symbol-dialogs/for-loop/for-loop.page";
import { DoWhileLoopPage } from "../symbol-dialogs/do-while-loop/do-while-loop.page";
import { Declare } from "../classes/Declare";
import { Input } from "../classes/Input";
import { Output } from "../classes/Output";
import { Process } from "../classes/Process";
import { Comment } from "../classes/Comment";
import { Flowchart } from "../classes/Flowchart";
import { IfCase } from "../classes/IfCase";
import { WhileLoop } from "../classes/WhileLoop";
import { CodeViewerPage } from "../code-viewer/code-viewer.page";
import { AboutPage } from "../about/about.page";
import { TutorialPage } from "../tutorial/tutorial.page";
import { Stop } from "../classes/Stop";
import { Start } from "../classes/Start";
import { ForLoop } from "../classes/ForLoop";
import { DoWhileLoop } from "../classes/DoWhileLoop";
import { DragulaService } from "ng2-dragula";
import { from } from "rxjs";
import { OpenProjectPage } from "../open-project/open-project.page";

@Component({
  selector: "app-home",
  templateUrl: "home.page.html",
  styleUrls: ["home.page.scss"]
})
@Injectable()
export class HomePage {
  @ViewChild("symbolsFAB") symbolsFAB: Fab;

  flowchart: Flowchart = new Flowchart(this.alertC);
  title = "CHAP";
  fileName = "";
  consoleButtonText = "Close Console";
  fs;
  workspace;
  branch;
  selectedSymbol;
  symbols = SYMBOLS;
  newSymbol: any;
  dupSymbol: any;

  constructor(
    public symbolOptionsAS: ActionSheetController,
    public menu: MenuController,
    public modalC: ModalController,
    public alertC: AlertController,
    private dragulaService: DragulaService,
    private toastC: ToastController,
    public chooser: Chooser,
    private http: HttpClient,
    private file: File
    // public navParams: NavParams
  ) { }

  ngOnInit() {
    // Adding Click Listeners to Menu Items
    let debugP = document.getElementById("btn_debugProgram");
    debugP.addEventListener("click", e => this.debugProgram(e));
    let genCode = document.getElementById("btn_generateCode");
    genCode.addEventListener("click", e => this.generatePseudoCode(e));
    let clearWS = document.getElementById("btn_clearWorkspace");
    clearWS.addEventListener("click", e => this.clearWorkspace());
    let aboutPg = document.getElementById("btn_aboutPage");
    aboutPg.addEventListener("click", e => this.openAboutPage(e));
    let tutorPg = document.getElementById("btn_tutorialPage");
    tutorPg.addEventListener("click", e => this.openTutorialPage(e));
    let newProj = document.getElementById("btn_newProject");
    newProj.addEventListener("click", e => this.newProject());
    let openProj = document.getElementById("btn_openProject");
    openProj.addEventListener("click", e => this.openProject());
    let saveProj = document.getElementById("btn_saveProject");
    saveProj.addEventListener('click', (e) => this.saveProject());
    let closeM = document.getElementById("btn_closeMenu");
    closeM.addEventListener("click", e => this.closeMenu());
    let downloadAPK = document.getElementById("btn_downloadAPK");
    downloadAPK.addEventListener("click", (e) => {
      window.open("https://drive.google.com/open?id=1iIYNSe-IuyAbd63iCE94GprxtDCQHqtS", "_blank");
    });
    // let printFC = document.getElementById("btn_printFlowchart");
    // printFC.addEventListener('click', (e) => this.printFlowchart());

    // Initializing Workspace & Arrows/Branches & adding buttonClick listeners
    this.flowchart = new Flowchart(this.alertC);
    this.workspace = document.getElementById("workspace");
    this.branch = document.getElementById("arrow");
    this.branch.addEventListener("click", e => this.openSymbolsFAB(e));

    let branches = document.getElementsByClassName("dropzone");
    for (let i = 0; i < branches.length; i++) {
      branches[i].addEventListener("click", e => this.openSymbolsFAB(e));
    }

    /*** Dragula DRAG & DROP configs ***/
    this.subscribeToDragula();
  }

  public subscribeToDragula() {
    this.dragulaService.drag('symbol')
      .subscribe(({ name, el, source }) => {
        this.selectedSymbol = el.children[0].id;
      });

    this.dragulaService.drop('symbol')
      .subscribe(({ name, el, target, source }) => {
        target.setAttribute('style', 'background: #000000');
        target.removeChild(target.children[0]);
        this.addSymbol(this.selectedSymbol, el.children[0]);
        this.symbolsFAB.close();
      });

    this.dragulaService.over('symbol')
      .subscribe(({ name, el, container, source }) => {
        if (container.className == 'arrow dropzone') {
          container.classList.add("active-arrow");
          container.setAttribute('style', 'background: #9CDCFE');
        }
      });

    this.dragulaService.out('symbol')
      .subscribe(({ name, el, container, source }) => {
        if (container.className == 'arrow dropzone active-arrow') {
          container.classList.remove("active-arrow");
          container.setAttribute('style', 'background: #000000');
        }
      });

    this.dragulaService.createGroup('symbol', {
      copy: true,
      removeOnSpill: true,
      isContainer: (el) => {
        return el.classList.contains('arrow dropzone');
      }
    });
  }

  public openMenu() {
    this.menu.open();
  }

  public closeMenu() {
    this.menu.close();
  }

  async openDeclareModal(symbol, e) {
    const modal = await this.modalC.create({
      component: DeclarePage,
      componentProps: { symbol: symbol }
    });

    modal.onDidDismiss().then(data => {
      let s = document.getElementsByClassName("symbol active-symbol");
      for (let i = 0; i < s.length; i++) {
        s[i].classList.remove("active-symbol");
      }

      try {
        let dec = data.data as Declare;
        e.target.innerHTML = dec.getDeclareExpression();
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
      componentProps: { symbol: symbol }
    });

    modal.onDidDismiss().then(data => {
      let s = document.getElementsByClassName("symbol active-symbol");
      for (let i = 0; i < s.length; i++) {
        s[i].classList.remove("active-symbol");
      }

      try {
        let input = data.data as Input;
        e.target.innerHTML = input.getInputExpression();
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
      componentProps: { symbol: symbol }
    });

    modal.onDidDismiss().then(data => {
      let s = document.getElementsByClassName("symbol active-symbol");
      for (let i = 0; i < s.length; i++) {
        s[i].classList.remove("active-symbol");
      }

      try {
        let output = data.data as Output;
        e.target.innerHTML = output.getOutputExpression();
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
      componentProps: { symbol: symbol }
    });

    modal.onDidDismiss().then(data => {
      let s = document.getElementsByClassName("symbol active-symbol");
      for (let i = 0; i < s.length; i++) {
        s[i].classList.remove("active-symbol");
      }

      try {
        let proc = data.data as Process;
        e.target.innerHTML = proc.getProcessExpression();
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
      componentProps: { symbol: symbol }
    });

    modal.onDidDismiss().then(data => {
      let s = document.getElementsByClassName("symbol active-symbol");
      for (let i = 0; i < s.length; i++) {
        s[i].classList.remove("active-symbol");
      }

      try {
        let com = data.data as Comment;
        e.target.innerHTML = com.getCommentExpression();
        console.log(data.data);
      } catch (error) {
        console.log(error);
      }
    });
    await modal.present();
  }

  async openIfModal(symbol, e) {
    //console.log(symbol);
    const modal = await this.modalC.create({
      component: IfElsePage,
      componentProps: { symbol: symbol }
    });

    modal.onDidDismiss().then(data => {
      let s = document.getElementsByClassName("symbol active-symbol");
      for (let i = 0; i < s.length; i++) {
        s[i].classList.remove("active-symbol");
      }

      try {
        let ifcase = data.data as IfCase;
        e.target.innerHTML = ifcase.getIfStatement();
        console.log(data.data);
      } catch (error) {
        console.log(error);
      }
    });
    await modal.present();
  }

  async openWhileModal(symbol, e) {
    console.log(symbol);
    const modal = await this.modalC.create({
      component: WhileLoopPage,
      componentProps: { symbol: symbol }
    });

    modal.onDidDismiss().then(data => {
      let s = document.getElementsByClassName("active-symbol");
      for (let i = 0; i < s.length; i++) {
        s[i].classList.remove("active-symbol");
      }

      try {
        let whileloop = data.data as WhileLoop;
        e.target.innerHTML = whileloop.getWhileExpression();
        console.log(data.data);
      } catch (error) {
        console.log(error);
      }
    });
    await modal.present();
  }

  async openForLoopModal(symbol, e) {
    // console.log(symbol);
    const modal = await this.modalC.create({
      component: ForLoopPage,
      componentProps: { symbol: symbol }
    });

    modal.onDidDismiss().then(data => {
      let s = document.getElementsByClassName("symbol active-symbol");
      for (let i = 0; i < s.length; i++) {
        s[i].classList.remove("active-symbol");
      }

      try {
        let forloop = data.data as ForLoop;
        e.target.innerHTML = forloop.getForExpression();
        console.log(data.data);
      } catch (error) {
        console.log(error);
      }
    });
    await modal.present();
  }

  async openDoWhileModal(symbol, e) {
    console.log(symbol);
    const modal = await this.modalC.create({
      component: DoWhileLoopPage,
      componentProps: { symbol: symbol }
    });

    modal.onDidDismiss().then(data => {
      let s = document.getElementsByClassName("active-symbol");
      for (let i = 0; i < s.length; i++) {
        s[i].classList.remove("active-symbol");
      }

      try {
        let dowhileloop = data.data as DoWhileLoop;
        e.target.innerHTML = dowhileloop.getDoWhileExpression();
        console.log(data.data);
      } catch (error) {
        console.log(error);
      }
    });
    await modal.present();
  }

  async openSymbolsAS(event) {
    event.preventDefault();
    // Get the target symbol & make it active
    let targetSymbol = event.target || event.srcElement || event.currentTarget;
    if (
      targetSymbol.id == "s_if_case" ||
      targetSymbol.id == "s_for_loop" ||
      targetSymbol.id == "s_while_loop" ||
      targetSymbol.id == "s_do_while_loop"
    ) {
      targetSymbol.parentElement.classList.add("active-symbol");
    } else {
      targetSymbol.classList.add("active-symbol");
    }

    if (
      targetSymbol.id == "s_declare" ||
      targetSymbol.id == "s_input" ||
      targetSymbol.id == "s_output" ||
      targetSymbol.id == "s_comment" ||
      targetSymbol.id == "s_process" ||
      targetSymbol.id == "s_if_case" ||
      targetSymbol.id == "s_for_loop" ||
      targetSymbol.id == "s_while_loop" ||
      targetSymbol.id == "s_do_while_loop"
    ) {
      // Create Symbol Options actionsheet
      let options: ActionSheetOptions = {
        buttons: [
          {
            text: "Delete Symbol",
            handler: () => {
              let asi,
                selectedSymbol = document
                  .getElementById("workspace")
                  .getElementsByClassName("active-symbol");
              if (selectedSymbol[0].parentElement.id == "ifTrueBlock") {
                let syms = selectedSymbol[0].parentElement.getElementsByClassName(
                  "symbol"
                );
                // Remove symbol from If-Case-True-Block
                for (let i = 0; i < syms.length; i++) {
                  if (syms[i].classList.contains("active-symbol")) {
                    asi = i;
                  }
                }
                for (let l = 0; l < this.flowchart.SYMBOLS.length; l++) {
                  if (this.flowchart.SYMBOLS[l] instanceof IfCase) {
                    this.flowchart.SYMBOLS[l].removeSymbolFromTrueBlock(asi);
                  }
                }
                // Remove symbol and trailing arrow from If-True-Block in Workspace
                let nextArrow = syms[asi].nextSibling;
                syms[asi].parentElement.removeChild(nextArrow);
                syms[asi].remove();
              } else if (selectedSymbol[0].parentElement.id == "ifFalseBlock") {
                let syms = selectedSymbol[0].parentElement.getElementsByClassName(
                  "symbol"
                );
                // Remove symbol from If-Case-False-Block
                for (let i = 0; i < syms.length; i++) {
                  if (syms[i].classList.contains("active-symbol")) {
                    asi = i;
                  }
                }
                for (let l = 0; l < this.flowchart.SYMBOLS.length; l++) {
                  if (this.flowchart.SYMBOLS[l] instanceof IfCase) {
                    this.flowchart.SYMBOLS[l].removeSymbolFromFalseBlock(asi);
                  }
                }
                // Remove symbol and trailing arrow from If-False-Block in Workspace
                let nextArrow = syms[asi].nextSibling;
                syms[asi].parentElement.removeChild(nextArrow);
                syms[asi].remove();
              } else if (selectedSymbol[0].parentElement.id == "forTrueBlock") {
                let syms = selectedSymbol[0].parentElement.getElementsByClassName(
                  "symbol"
                );
                // Remove symbol from For-Loop-Block
                for (let i = 0; i < syms.length; i++) {
                  if (syms[i].classList.contains("active-symbol")) {
                    asi = i;
                  }
                }
                for (let l = 0; l < this.flowchart.SYMBOLS.length; l++) {
                  if (this.flowchart.SYMBOLS[l] instanceof ForLoop) {
                    this.flowchart.SYMBOLS[l].removeSymbolFromTrueBlock(asi);
                  }
                }
                // Remove symbol and trailing arrow from For-Loop-Block in Workspace
                let nextArrow = syms[asi].nextSibling;
                syms[asi].parentElement.removeChild(nextArrow);
                syms[asi].remove();
              } else if (
                selectedSymbol[0].parentElement.id == "whileTrueBlock"
              ) {
                let syms = selectedSymbol[0].parentElement.getElementsByClassName(
                  "symbol"
                );
                // Remove symbol from While-Loop-Block
                for (let i = 0; i < syms.length; i++) {
                  if (syms[i].classList.contains("active-symbol")) {
                    asi = i;
                  }
                }
                for (let l = 0; l < this.flowchart.SYMBOLS.length; l++) {
                  if (this.flowchart.SYMBOLS[l] instanceof WhileLoop) {
                    this.flowchart.SYMBOLS[l].removeSymbolFromTrueBlock(asi);
                  }
                }
                // Remove symbol and trailing arrow from While-Loop-Block in Workspace
                let nextArrow = syms[asi].nextSibling;
                syms[asi].parentElement.removeChild(nextArrow);
                syms[asi].remove();
              } else if (
                selectedSymbol[0].parentElement.id == "doWhileTrueBlock"
              ) {
                let syms = selectedSymbol[0].parentElement.getElementsByClassName(
                  "symbol"
                );
                // Remove symbol from Do-While-Loop-Block
                for (let i = 0; i < syms.length; i++) {
                  if (syms[i].classList.contains("active-symbol")) {
                    asi = i;
                  }
                }
                for (let l = 0; l < this.flowchart.SYMBOLS.length; l++) {
                  if (this.flowchart.SYMBOLS[l] instanceof DoWhileLoop) {
                    this.flowchart.SYMBOLS[l].removeSymbolFromTrueBlock(asi);
                  }
                }
                // Remove symbol and trailing arrow from Do-While-Loop-Block in Workspace
                let nextArrow = syms[asi].nextSibling;
                syms[asi].parentElement.removeChild(nextArrow);
                syms[asi].remove();
              } else {
                let syms = document
                  .getElementById("workspace")
                  .getElementsByClassName("symbol");
                // Remove symbol from Flowchart
                for (let i = 0; i < syms.length; i++) {
                  if (syms[i].classList.contains("active-symbol")) {
                    asi = i - 1;
                  }
                }
                this.flowchart.removeSymbolFromFlowchart(asi);
                // Remove symbol and trailing arrow from Workspace
                let nextArrow = selectedSymbol[0].nextSibling;
                this.workspace.removeChild(nextArrow);
                selectedSymbol[0].remove();
              }
              console.log(this.flowchart.SYMBOLS);
            }
          }
        ]
      };
      // Create and Display Symbols Options actionsheet
      const actionSheet = await this.symbolOptionsAS.create(options);
      await actionSheet.present();
    }
  }

  public openSymbolsFAB(event) {
    // Get the target arrow
    let t = event.target || event.srcElement || event.currentTarget;
    // Get symbols FAB
    let symbolsFAB = document.getElementById("symbolsFAB");
    // Get the active arrow/branch
    let arrows = document.getElementsByClassName("dropzone active-arrow");
    // Check if there are other active arrows/branches
    if (arrows.length < 1) {
      t.classList.add("active-arrow");
      if (!symbolsFAB.getAttribute("activated")) {
        this.symbolsFAB.activated = true;
      }
    } else {
      let branches = document.getElementsByClassName("dropzone active-arrow");
      for (let i = 0; i < branches.length; i++) {
        branches[i].classList.remove("active-arrow");
      }
      t.classList.add("active-arrow");
      // Open symbols FAB
      if (!symbolsFAB.getAttribute("activated")) {
        this.symbolsFAB.activated = true;
      }
    }
  }

  async openSymbolDialog(event, id) {
    // Get the target symbol & make it active
    let active_sym_index, tempSym, asi;
    let targetSymbol = event.target || event.srcElement || event.currentTarget;
    if (
      targetSymbol.id == "s_if_case" ||
      targetSymbol.id == "s_while_loop" ||
      targetSymbol.id == "s_do_while_loop" ||
      targetSymbol.id == "s_for_loop"
    ) {
      targetSymbol.classList.add("active-symbol");
    } else {
      targetSymbol.classList.add("active-symbol");
    }

    // Checking the Symbol type and opening corresponding Properties Dialog Modals
    if (targetSymbol.parentElement.id == "ifTrueBlock") {
      let syms = event.target.parentElement.getElementsByClassName("symbol");
      for (let i = 0; i < syms.length; i++) {
        if (syms[i].classList.contains("active-symbol")) {
          asi = i;
        }
      }
      for (let l = 0; l < this.flowchart.SYMBOLS.length; l++) {
        const el = this.flowchart.SYMBOLS[l];
        if (el instanceof IfCase) {
          tempSym = el.getSymbolFromTrueBlock(asi);
          if (targetSymbol.id == "s_declare") {
            this.openDeclareModal(tempSym, event);
          } else if (targetSymbol.id == "s_input") {
            this.openInputModal(tempSym, event);
          } else if (targetSymbol.id == "s_output") {
            this.openOutputModal(tempSym, event);
          } else if (targetSymbol.id == "s_comment") {
            this.openCommentModal(tempSym, event);
          } else if (targetSymbol.id == "s_process") {
            this.openProcessModal(tempSym, event);
          } else if (targetSymbol.id == "s_if_case") {
            this.openIfModal(tempSym, event);
          } else if (targetSymbol.id == "s_for_loop") {
            this.openForLoopModal(tempSym, event);
          } else if (targetSymbol.id == "s_while_loop") {
            this.openWhileModal(tempSym, event);
          } else if (targetSymbol.id == "s_do_while_loop") {
            this.openDoWhileModal(tempSym, event);
          }
        }
      }
    } else if (targetSymbol.parentElement.id == "ifFalseBlock") {
      let syms = event.target.parentElement.getElementsByClassName("symbol");
      for (let i = 0; i < syms.length; i++) {
        if (syms[i].classList.contains("active-symbol")) {
          asi = i;
        }
      }
      for (let l = 0; l < this.flowchart.SYMBOLS.length; l++) {
        const el = this.flowchart.SYMBOLS[l];
        if (el instanceof IfCase) {
          tempSym = el.getSymbolFromFalseBlock(asi);
          if (targetSymbol.id == "s_declare") {
            this.openDeclareModal(tempSym, event);
          } else if (targetSymbol.id == "s_input") {
            this.openInputModal(tempSym, event);
          } else if (targetSymbol.id == "s_output") {
            this.openOutputModal(tempSym, event);
          } else if (targetSymbol.id == "s_comment") {
            this.openCommentModal(tempSym, event);
          } else if (targetSymbol.id == "s_process") {
            this.openProcessModal(tempSym, event);
          } else if (targetSymbol.id == "s_if_case") {
            this.openIfModal(tempSym, event);
          } else if (targetSymbol.id == "s_for_loop") {
            this.openForLoopModal(tempSym, event);
          } else if (targetSymbol.id == "s_while_loop") {
            this.openWhileModal(tempSym, event);
          } else if (targetSymbol.id == "s_do_while_loop") {
            this.openDoWhileModal(tempSym, event);
          }
        }
      }
    } else if (targetSymbol.parentElement.id == "forTrueBlock") {
      let syms = event.target.parentElement.getElementsByClassName("symbol");
      for (let i = 0; i < syms.length; i++) {
        if (syms[i].classList.contains("active-symbol")) {
          asi = i;
        }
      }
      for (let l = 0; l < this.flowchart.SYMBOLS.length; l++) {
        const el = this.flowchart.SYMBOLS[l];
        if (el instanceof ForLoop) {
          tempSym = el.getSymbolFromTrueBlock(asi);
          if (targetSymbol.id == "s_declare") {
            this.openDeclareModal(tempSym, event);
          } else if (targetSymbol.id == "s_input") {
            this.openInputModal(tempSym, event);
          } else if (targetSymbol.id == "s_output") {
            this.openOutputModal(tempSym, event);
          } else if (targetSymbol.id == "s_comment") {
            this.openCommentModal(tempSym, event);
          } else if (targetSymbol.id == "s_process") {
            this.openProcessModal(tempSym, event);
          } else if (targetSymbol.id == "s_if_case") {
            this.openIfModal(tempSym, event);
          } else if (targetSymbol.id == "s_for_loop") {
            this.openForLoopModal(tempSym, event);
          } else if (targetSymbol.id == "s_while_loop") {
            this.openWhileModal(tempSym, event);
          } else if (targetSymbol.id == "s_do_while_loop") {
            this.openDoWhileModal(tempSym, event);
          }
        }
      }
    } else if (targetSymbol.parentElement.id == "whileTrueBlock") {
      let syms = event.target.parentElement.getElementsByClassName("symbol");
      for (let i = 0; i < syms.length; i++) {
        if (syms[i].classList.contains("active-symbol")) {
          asi = i;
        }
      }
      for (let l = 0; l < this.flowchart.SYMBOLS.length; l++) {
        const el = this.flowchart.SYMBOLS[l];
        if (el instanceof WhileLoop) {
          tempSym = el.getSymbolFromTrueBlock(asi);
          if (targetSymbol.id == "s_declare") {
            this.openDeclareModal(tempSym, event);
          } else if (targetSymbol.id == "s_input") {
            this.openInputModal(tempSym, event);
          } else if (targetSymbol.id == "s_output") {
            this.openOutputModal(tempSym, event);
          } else if (targetSymbol.id == "s_comment") {
            this.openCommentModal(tempSym, event);
          } else if (targetSymbol.id == "s_process") {
            this.openProcessModal(tempSym, event);
          } else if (targetSymbol.id == "s_if_case") {
            this.openIfModal(tempSym, event);
          } else if (targetSymbol.id == "s_for_loop") {
            this.openForLoopModal(tempSym, event);
          } else if (targetSymbol.id == "s_while_loop") {
            this.openWhileModal(tempSym, event);
          } else if (targetSymbol.id == "s_do_while_loop") {
            this.openDoWhileModal(tempSym, event);
          }
        }
      }
    } else if (targetSymbol.parentElement.id == "doWhileTrueBlock") {
      let syms = event.target.parentElement.getElementsByClassName("symbol");
      for (let i = 0; i < syms.length; i++) {
        if (syms[i].classList.contains("active-symbol")) {
          asi = i;
        }
      }
      for (let l = 0; l < this.flowchart.SYMBOLS.length; l++) {
        const el = this.flowchart.SYMBOLS[l];
        if (el instanceof DoWhileLoop) {
          tempSym = el.getSymbolFromTrueBlock(asi);
          if (targetSymbol.id == "s_declare") {
            this.openDeclareModal(tempSym, event);
          } else if (targetSymbol.id == "s_input") {
            this.openInputModal(tempSym, event);
          } else if (targetSymbol.id == "s_output") {
            this.openOutputModal(tempSym, event);
          } else if (targetSymbol.id == "s_comment") {
            this.openCommentModal(tempSym, event);
          } else if (targetSymbol.id == "s_process") {
            this.openProcessModal(tempSym, event);
          } else if (targetSymbol.id == "s_if_case") {
            this.openIfModal(tempSym, event);
          } else if (targetSymbol.id == "s_for_loop") {
            this.openForLoopModal(tempSym, event);
          } else if (targetSymbol.id == "s_while_loop") {
            this.openWhileModal(tempSym, event);
          } else if (targetSymbol.id == "s_do_while_loop") {
            this.openDoWhileModal(tempSym, event);
          }
        }
      }
    } else {
      let syms = document
        .getElementById("workspace")
        .getElementsByClassName("symbol");
      let nrOfDoWhileSyms = 0;
      for (let i = 0; i < syms.length; i++) {
        if (syms[i].parentElement.id == "doWhileTrueBlock") nrOfDoWhileSyms++;
        else if (syms[i].classList.contains("active-symbol")) {
          active_sym_index = i - nrOfDoWhileSyms - 1;
        }
      }
      tempSym = this.flowchart.getSymbolFromFlowchart(active_sym_index);

      if (targetSymbol.id == "s_declare") {
        this.openDeclareModal(tempSym, event);
      } else if (targetSymbol.id == "s_input") {
        this.openInputModal(tempSym, event);
      } else if (targetSymbol.id == "s_output") {
        this.openOutputModal(tempSym, event);
      } else if (targetSymbol.id == "s_comment") {
        this.openCommentModal(tempSym, event);
      } else if (targetSymbol.id == "s_process") {
        this.openProcessModal(tempSym, event);
      } else if (targetSymbol.id == "s_if_case") {
        this.openIfModal(tempSym, event);
      } else if (targetSymbol.id == "s_for_loop") {
        this.openForLoopModal(tempSym, event);
      } else if (targetSymbol.id == "s_while_loop") {
        this.openWhileModal(tempSym, event);
      } else if (targetSymbol.id == "s_do_while_loop") {
        this.openDoWhileModal(tempSym, event);
      }
    }
  }

  public addSymbol(id: string, e) {
    let symClass, temp, symbol, active_index, act_in, symComponent;
    let b = document.getElementsByClassName("arrow dropzone");
    for (let i = 0; i < b.length; i++) {
      if (b[i].className.endsWith("active-arrow")) {
        active_index = i;
      }
    }

    if (id == "s_declare") {
      let dec = new Declare();
      temp = document.getElementById(id);
      dec.setDeclareSymbol(temp.cloneNode(true));
      symbol = dec.getDeclareSymbol();
      symbol.innerHTML = "Declare";
      symComponent = dec;
    } else if (id == "s_input") {
      let input = new Input();
      temp = document.getElementById(id);
      input.setInputSymbol(temp.cloneNode(true));
      symbol = input.getInputSymbol();
      symbol.innerHTML = "Input";
      symComponent = input;
    } else if (id == "s_output") {
      let output = new Output();
      temp = document.getElementById(id);
      output.setOutputSymbol(temp.cloneNode(true));
      symbol = output.getOutputSymbol();
      symbol.innerHTML = "Output";
      symComponent = output;
    } else if (id == "s_process") {
      let proc = new Process();
      temp = document.getElementById(id);
      proc.setProcessSymbol(temp.cloneNode(true));
      symbol = proc.getProcessSymbol();
      symbol.innerHTML = "Process";
      symComponent = proc;
    } else if (id == "s_comment") {
      let com = new Comment();
      temp = document.getElementById(id);
      com.setCommentSymbol(temp.cloneNode(true));
      symbol = com.getCommentSymbol();
      symbol.innerHTML = "Comment";
      symComponent = com;
    } else if (id == "s_if_case") {
      let ifcase = new IfCase();
      symClass = "if_div";
      temp = document
        .getElementById("control_loop_list")
        .getElementsByClassName(symClass);
      let t1 = document.getElementById("s_if_case");
      ifcase.setIfCaseSymbol(t1);
      symbol = temp[0].cloneNode(true);
      symComponent = ifcase;
    } else if (id == "s_while_loop") {
      let whileloop = new WhileLoop();
      symClass = "while_div";
      temp = document
        .getElementById("control_loop_list")
        .getElementsByClassName(symClass);
      let t2 = document.getElementById("s_while_loop");
      whileloop.setWhileSymbol(t2);
      symbol = temp[0].cloneNode(true);
      symComponent = whileloop;
    } else if (id == "s_for_loop") {
      let forloop = new ForLoop();
      symClass = "for_div";
      temp = document
        .getElementById("control_loop_list")
        .getElementsByClassName(symClass);
      let t3 = document.getElementById("s_for_loop");
      forloop.setForSymbol(t3);
      symbol = temp[0].cloneNode(true);
      symComponent = forloop;
    } else if (id == "s_do_while_loop") {
      let doWhileLoop = new DoWhileLoop();
      symClass = "do_while_div";
      temp = document
        .getElementById("control_loop_list")
        .getElementsByClassName(symClass);
      let t4 = document.getElementById("s_do_while_loop");
      doWhileLoop.setDoWhileSymbol(t4);
      symbol = temp[0].cloneNode(true);
      symComponent = doWhileLoop;
    }

    // Get the selected arrow/branch to append symbol after
    let branches = document.getElementsByClassName(
      "arrow dropzone active-arrow"
    );
    let tempBranch = this.branch.cloneNode(true);
    //tempBranch.classList.remove('active-arrow');

    /* Checking which BLOCK the symbol should be added to */
    /* --- Switch blocks --- */

    switch (branches[0].parentElement.id) {
      case "ifTrueBlock":
        let par1 = branches[0].parentElement.getElementsByClassName(
          "arrow dropzone"
        );
        for (let r = 0; r < par1.length; r++) {
          if (par1[r].className.endsWith("active-arrow")) {
            act_in = r;
          }
        }
        tempBranch.classList.remove("active-arrow");
        branches[0].parentElement.insertBefore(symbol, branches[0].nextSibling);
        branches[0].parentElement.insertBefore(tempBranch, symbol.nextSibling);
        for (let l = 0; l < this.flowchart.SYMBOLS.length; l++) {
          const el = this.flowchart.SYMBOLS[l];
          if (el instanceof IfCase) {
            el.addSymbolToTrueBlock(symComponent, act_in);
          }
        }
        break;
      case "ifFalseBlock":
        let par2 = branches[0].parentElement.getElementsByClassName(
          "arrow dropzone"
        );
        for (let r = 0; r < par2.length; r++) {
          if (par2[r].className.endsWith("active-arrow")) {
            act_in = r;
          }
        }
        tempBranch.classList.remove("active-arrow");
        branches[0].parentElement.insertBefore(symbol, branches[0].nextSibling);
        branches[0].parentElement.insertBefore(tempBranch, symbol.nextSibling);
        for (let l = 0; l < this.flowchart.SYMBOLS.length; l++) {
          const el = this.flowchart.SYMBOLS[l];
          if (el instanceof IfCase) {
            el.addSymbolToFalseBlock(symComponent, act_in);
          }
        }
        break;
      case "forTrueBlock":
        let par3 = branches[0].parentElement.getElementsByClassName(
          "arrow dropzone"
        );
        for (let r = 0; r < par3.length; r++) {
          if (par3[r].className.endsWith("active-arrow")) {
            act_in = r;
          }
        }
        tempBranch.classList.remove("active-arrow");
        branches[0].parentElement.insertBefore(symbol, branches[0].nextSibling);
        branches[0].parentElement.insertBefore(tempBranch, symbol.nextSibling);
        for (let l = 0; l < this.flowchart.SYMBOLS.length; l++) {
          const el = this.flowchart.SYMBOLS[l];
          if (el instanceof ForLoop) {
            el.addSymbolToTrueBlock(symComponent, act_in);
          }
        }
        break;
      case "whileTrueBlock":
        let par4 = branches[0].parentElement.getElementsByClassName(
          "arrow dropzone"
        );
        for (let r = 0; r < par4.length; r++) {
          if (par4[r].className.endsWith("active-arrow")) {
            act_in = r;
          }
        }
        tempBranch.classList.remove("active-arrow");
        branches[0].parentElement.insertBefore(symbol, branches[0].nextSibling);
        branches[0].parentElement.insertBefore(tempBranch, symbol.nextSibling);
        for (let l = 0; l < this.flowchart.SYMBOLS.length; l++) {
          const el = this.flowchart.SYMBOLS[l];
          if (el instanceof WhileLoop) {
            el.addSymbolToTrueBlock(symComponent, act_in);
          }
        }
        break;
      case "doWhileTrueBlock":
        let par5 = branches[0].parentElement.getElementsByClassName(
          "arrow dropzone"
        );
        for (let r = 0; r < par5.length; r++) {
          if (par5[r].className.endsWith("active-arrow")) {
            act_in = r;
          }
        }
        tempBranch.classList.remove("active-arrow");
        branches[0].parentElement.insertBefore(symbol, branches[0].nextSibling);
        branches[0].parentElement.insertBefore(tempBranch, symbol.nextSibling);
        for (let l = 0; l < this.flowchart.SYMBOLS.length; l++) {
          const el = this.flowchart.SYMBOLS[l];
          if (el instanceof DoWhileLoop) {
            el.addSymbolToTrueBlock(symComponent, act_in);
          }
        }
        break;
      default:
        let ai,
          totalAD = 0;
        let b1 = this.workspace.getElementsByClassName("arrow dropzone");

        interact(symbol)
          .gesturable({
            hold: 1500
          })
          .on(
            "tap",
            e =>
              function () {
                e.preventDefault();
              }
          )
          .on("doubletap", e => this.openSymbolDialog(e, id))
          .on("hold", e => this.openSymbolsAS(e));

        for (let l = 0; l < b1.length; l++) {
          //if (b1[l].parentElement.id == 'ifTrueBlock' || b1[l].parentElement.id == 'ifFalseBlock'){ totalAD++; }
          switch (b1[l].parentElement.id) {
            case "ifTrueBlock":
              totalAD++;
              break;
            case "ifFalseBlock":
              totalAD++;
              break;
            case "forTrueBlock":
              totalAD++;
              break;
            case "whileTrueBlock":
              totalAD++;
              break;
            case "doWhileTrueBlock":
              totalAD++;
              break;
            default:
              break;
          }
        }

        for (let i = 0; i < b1.length; i++) {
          if (b1[i].className.endsWith("active-arrow")) {
            ai = i - totalAD;
          }
        }

        tempBranch.classList.remove("active-arrow");
        this.dragulaService.find('symbol').drake.containers.push(tempBranch);

        // Add symbol and corresponding arrow/branch to Workspace
        this.workspace.insertBefore(symbol, branches[0].nextSibling);
        this.workspace.insertBefore(tempBranch, symbol.nextSibling);

        this.flowchart.addSymbolToFlowchart(symComponent, ai);
        break;
    }

    // Make all the arrows/branches on the Workspace inactive
    branches = document.getElementsByClassName("arrow dropzone active-arrow");
    for (let i = 0; i < branches.length; i++) {
      if (branches[i].className == 'arrow dropzone active-arrow') {
        branches[i].classList.remove("active-arrow");
      }
    }
    let dz = document.getElementsByClassName("arrow dropzone");
    for (let i = 0; i < dz.length; i++) {
      dz[i].addEventListener("click", e => this.openSymbolsFAB(e));
    }

    console.log(this.flowchart.SYMBOLS);

  }

  public consoleLog(lineOutput) {
    let consoleCHAP = document.getElementById("console") as HTMLTextAreaElement;
    consoleCHAP.value = consoleCHAP.value + lineOutput + "\n";
  }

  async showAlert(alertTitle: string, alertMsg: string) {
    const alert = await this.alertC.create({
      header: alertTitle,
      message: alertMsg,
      buttons: ["OK"]
    });
    await alert.present();
  }

  public toggleConsole() {
    let console1 = document.getElementById("console");
    let consoleBtns = document.getElementById("consoleBtns");
    if (console1.classList.contains('toggleConsole')) {
      console1.classList.remove('toggleConsole');
      console1.style.display = 'block';
      console1.style.position = 'absolute';
      console1.style.bottom = '0';
      consoleBtns.style.position = 'absolute';
      consoleBtns.style.right = '5px';
      consoleBtns.style.bottom = console1.offsetHeight + 'px';
      this.consoleButtonText = "Close Console";
    } else {
      console1.classList.add('toggleConsole');
      console1.style.display = 'none';
      consoleBtns.style.position = 'absolute';
      consoleBtns.style.right = '5px';
      consoleBtns.style.bottom = '5px';
      this.consoleButtonText = "Open Console";
    }
  }

  public clearConsole() {
    let consoleCHAP = document.getElementById("console") as HTMLTextAreaElement;
    consoleCHAP.value = "";
  }

  public clearWorkspace() {
    this.menu.close();
    this.clearConsole();
    let startSym, stopSym, arrowInit;
    let workspace = document.getElementById("workspace");
    let wsSymbols = workspace.getElementsByClassName("symbol");
    for (let l = 0; l < wsSymbols.length; l++) {
      if (wsSymbols[l].id == "s_start") {
        startSym = wsSymbols[l];
      } else if (wsSymbols[l].id == "s_stop") {
        stopSym = wsSymbols[l];
      }
    }
    arrowInit = document.getElementById("arrow");

    workspace.innerHTML = '';
    workspace.appendChild(startSym);
    workspace.appendChild(arrowInit);
    workspace.appendChild(stopSym);
    this.flowchart = new Flowchart(this.alertC);
  }

  public newProject() {
    let fileN = document.getElementById("fileName") as HTMLInputElement;
    fileN.value = "";
    this.clearWorkspace();
  }

  async openProject() {
    this.menu.close();
    const modal = await this.modalC.create({
      component: OpenProjectPage,
      componentProps: {}
    });
    modal.onDidDismiss().then(data => {
      if (data.data != undefined) {
        let chapFileName = data.data.name.replace('.chap', '');
        let fr = new FileReader();
        fr.readAsText(data.data);
        fr.onloadend = () => {
          this.loadProject(chapFileName, fr.result);
        };
      }
    });
    await modal.present();
  }

  public loadProject(chapFileName, fileData) {
    let dataSyms, arrowT, els, p;
    dataSyms = JSON.parse(fileData);

    this.newProject();
    for (let i = 0; i < dataSyms.length; i++) {
      let sym: any;
      switch (dataSyms[i].id) {
        case 's_declare':
          sym = new Declare();
          sym.createDeclareSymbol(dataSyms[i]);
          arrowT = document.getElementsByClassName('arrow dropzone');
          arrowT[i].classList.add("active-arrow");
          this.addSymbol(sym.id, arrowT[i]);
          this.flowchart.removeSymbolFromFlowchart(i);
          els = document.getElementsByClassName('symbol');
          p = i + 1;
          els[p].innerHTML = sym.getDeclareExpression();
          break;
        case 's_input':
          sym = new Input();
          sym.createInputSymbol(dataSyms[i]);
          arrowT = document.getElementsByClassName('arrow dropzone');
          arrowT[i].classList.add("active-arrow");
          this.addSymbol(sym.id, arrowT[i]);
          this.flowchart.removeSymbolFromFlowchart(i);
          els = document.getElementsByClassName('symbol');
          p = i + 1;
          els[p].innerHTML = sym.getInputExpression();
          break;
        case 's_output':
          sym = new Output();
          sym.createOutputSymbol(dataSyms[i]);
          arrowT = document.getElementsByClassName('arrow dropzone');
          arrowT[i].classList.add("active-arrow");
          this.addSymbol(sym.id, arrowT[i]);
          this.flowchart.removeSymbolFromFlowchart(i);
          els = document.getElementsByClassName('symbol');
          p = i + 1;
          els[p].innerHTML = sym.getOutputExpression();
          break;
        case 's_process':
          sym = new Process();
          sym.createProcessSymbol(dataSyms[i]);
          arrowT = document.getElementsByClassName('arrow dropzone');
          arrowT[i].classList.add("active-arrow");
          this.addSymbol(sym.id, arrowT[i]);
          this.flowchart.removeSymbolFromFlowchart(i);
          els = document.getElementsByClassName('symbol');
          p = i + 1;
          els[p].innerHTML = sym.getProcessExpression();
          break;
        case 's_comment':
          sym = new Comment();
          sym.createCommentSymbol(dataSyms[i]);
          arrowT = document.getElementsByClassName('arrow dropzone');
          arrowT[i].classList.add("active-arrow");
          this.addSymbol(sym.id, arrowT[i]);
          this.flowchart.removeSymbolFromFlowchart(i);
          els = document.getElementsByClassName('symbol');
          p = i + 1;
          els[p].innerHTML = sym.getCommentExpression();
          break;
        case 's_if_case':
          sym = new IfCase();
          sym.createIfCaseSymbol(dataSyms[i]);
          arrowT = document.getElementsByClassName('arrow dropzone');
          arrowT[i].classList.add("active-arrow");
          this.addSymbol(sym.id, arrowT[i]);
          this.flowchart.removeSymbolFromFlowchart(i);
          els = document.getElementsByClassName('symbol');
          p = i + 1;
          els[p].innerHTML = sym.getIfStatement();
          break;
        case 's_for_loop':
          sym = new ForLoop();
          sym.createForLoopSymbol(dataSyms[i]);
          arrowT = document.getElementsByClassName('arrow dropzone');
          arrowT[i].classList.add("active-arrow");
          this.addSymbol(sym.id, arrowT[i]);
          this.flowchart.removeSymbolFromFlowchart(i);
          els = document.getElementsByClassName('symbol');
          p = i + 1;
          els[p].innerHTML = sym.getForExpression();
          break;
        case 's_while_loop':
          sym = new WhileLoop();
          sym.createWhileLoopSymbol(dataSyms[i]);
          arrowT = document.getElementsByClassName('arrow dropzone');
          arrowT[i].classList.add("active-arrow");
          this.addSymbol(sym.id, arrowT[i]);
          this.flowchart.removeSymbolFromFlowchart(i);
          els = document.getElementsByClassName('symbol');
          p = i + 1;
          els[p].innerHTML = sym.getWhileExpression();
          break;
        case 's_do_while_loop':
          sym = new DoWhileLoop();
          sym.createDoWhileLoopSymbol(dataSyms[i]);
          arrowT = document.getElementsByClassName('arrow dropzone');
          arrowT[i].classList.add("active-arrow");
          this.addSymbol(sym.id, arrowT[i]);
          this.flowchart.removeSymbolFromFlowchart(i);
          els = document.getElementsByClassName('symbol');
          p = i + 1;
          els[p].innerHTML = sym.getDoWhileExpression();
          break;
        default:
          break;
      }
      this.flowchart.addSymbolToFlowchart(sym, i);
    }
    this.fileName = chapFileName;
    let fName = document.getElementById('fileName') as HTMLInputElement;
    fName.value = this.fileName;
  }

  public saveProject() {
    let fileName, flowchartJSON;

    this.menu.close();
    let fName = document.getElementById('fileName') as HTMLInputElement;
    this.fileName = fName.value;

    if (this.fileName == "") {
      this.showAlert(
        'Failed to Save',
        `Please enter a name for the project in the TextBox above, before saving it.`
      );
    } else {
      fileName = this.fileName + '.chap';
      flowchartJSON = JSON.stringify(this.flowchart.SYMBOLS);
      this.saveTextAsFile(flowchartJSON, fileName);
    }
  }

  public saveTextAsFile(data, filename) {
    if (!data) {
      console.error('Console.save: No data');
      return;
    }
    if (!filename) filename = 'console.json';
    var blob = new Blob([data], { type: 'text/plain' }),
      e = document.createEvent('MouseEvents'),
      a = document.createElement('a');

    // FOR IE:
    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveOrOpenBlob(blob, filename);
    } else {
      var e = document.createEvent('MouseEvents'), a = document.createElement('a');
      a.download = filename;
      a.href = window.URL.createObjectURL(blob);
      a.dataset.downloadurl = ['text/plain', a.download, a.href].join(':');
      e.initEvent('click', true, false);
      a.dispatchEvent(e);
    }
  }

  public debugProgram(e) {
    this.menu.close();
    this.clearConsole();
    this.flowchart.validateFlowchart(0, this.flowchart.SYMBOLS.length);
  }

  public generatePseudoCode(e) {
    this.openCodeViewer(this.flowchart, e);
    this.menu.close();
  }

  async openCodeViewer(flowchart, e) {
    const modal = await this.modalC.create({
      component: CodeViewerPage,
      componentProps: { flowchart: flowchart }
    });
    modal.onDidDismiss().then(data => {
      let fc = data.data as Flowchart;
    });
    await modal.present();
  }

  async openAboutPage(e) {
    this.menu.close();
    const modal = await this.modalC.create({
      component: AboutPage
    });
    await modal.present();
  }

  async openTutorialPage(e) {
    this.menu.close();
    const modal = await this.modalC.create({
      component: TutorialPage
    });
    await modal.present();
  }

  public printFlowchart() {
    this.closeMenu();

    html2canvas(document.body).then(canvas => {
      // canvas.style.width = '500px';
      // canvas.style.height = '500px';
      // canvas.style.display = 'block';
      // document.body.appendChild(canvas);
      // canvas.appendChild(document.getElementById("workspace"));

      var image = canvas.toDataURL('image/png');
      //.replace('image/png', 'image/octet-stream');
      console.log(image);
      // window.location.href = image;
      // window.open('', image);

      // this.saveAsImageFile(image, 'fileName');
    });
  }

  public saveAsImageFile(data, filename) {
    if (!data) {
      console.error('Console.save: No data');
      return;
    }
    if (!filename) filename = 'temp.png';
    var blob = new Blob([data], { type: 'image/png' }),
      e = document.createEvent('MouseEvents'),
      a = document.createElement('a');

    // FOR IE:
    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveOrOpenBlob(blob, filename);
    } else {
      var e = document.createEvent('MouseEvents'), a = document.createElement('a');
      a.download = filename;
      a.href = window.URL.createObjectURL(blob);
      a.dataset.downloadurl = ['image/png', a.download, a.href].join(':');
      e.initEvent('click', true, false);
      a.dispatchEvent(e);
    }
  }

  // To be able to use external JavaScript libraries with TypeScript, they must be loaded
  public loadScript(url: string) {
    const body = <HTMLDivElement>document.body;
    const script = document.createElement("script");
    script.innerHTML = "";
    script.src = url;
    script.async = false;
    script.defer = true;
    script.type = "text/javascript";
    body.appendChild(script);
  }
}
