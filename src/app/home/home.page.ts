import { Component, ViewChild, SystemJsNgModuleLoader, Injectable } from "@angular/core";
import { ModalController, Fab, ActionSheetController, MenuController, NavParams, AlertController, ToastController, Platform, NavController } from "@ionic/angular";
import { ActionSheetOptions } from "@ionic/core";
import html2canvas from "html2canvas";
const interact = require("interactjs");
import { File, FileWriter } from '@ionic-native/file/ngx';
import { Chooser } from '@ionic-native/chooser/ngx';
import { Toast } from '@ionic-native/toast/ngx';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DragulaService } from "ng2-dragula";
import { from } from "rxjs";
import { type } from "os";

import { SplashScreen } from '@ionic-native/splash-screen/ngx';
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
import { OpenProjectPage } from "../open-project/open-project.page";
import { AuthService } from '../auth.service';
import { toBase64String } from "@angular/compiler/src/output/source_map";
import { FeedbackPage } from "../feedback/feedback.page";

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
  toolbarTooltip = "";
  consoleButtonText = "Open Console";
  isConsoleOpen = false;
  isSymbolsFABOpen = false;
  isCutCopyReady = false;
  fs;
  workspace;
  branch;
  selectedSymbol;
  symbols = SYMBOLS;
  newSymbol: any;
  dupSymbol: any;
  saveFolder = 'CHAP Project Files';

  paste_sym_buffer: Array<Declare | Input | Output | Process | IfCase | ForLoop | WhileLoop | DoWhileLoop | Comment>;

  items: Array<any> = [];

  constructor(
    public symbolOptionsAS: ActionSheetController,
    public arrowsOptionsAS: ActionSheetController,
    public menu: MenuController,
    public modalC: ModalController,
    public alertC: AlertController,
    private dragulaService: DragulaService,
    private toastC: ToastController,
    public chooser: Chooser,
    private http: HttpClient,
    private file: File,
    public platform: Platform,
    public toast: Toast,
    public navCtrl: NavController,
    private auth: AuthService
    //public navParams: NavParams
  ) { }

  ionViewWillEnter() {

  }

  ngOnInit() {
    // Adding Hover Listeners to Toolbar Buttons
    let tbButtons = document.getElementsByClassName("tooltip");
    for (let i = 0; i < tbButtons.length; i++) {
      // Mouse Over (Hover)
      tbButtons[i].addEventListener("mouseover", (e) => {
        this.toolbarTooltip = tbButtons[i].getElementsByClassName("tooltiptext")[0].innerHTML;
      });
      // Mouse Exit
      tbButtons[i].addEventListener("mouseleave", (e) => {
        this.toolbarTooltip = "";
      });
    }

    // Adding Hover Listeners to Symbols List
    let symList = document.getElementsByClassName("s_tooltip");
    for (let i = 0; i < symList.length; i++) {
      // Mouse Over (Hover)
      symList[i].addEventListener("mouseover", (e) => {
        this.toolbarTooltip = symList[i].innerHTML;
      });
      // Mouse Exit
      symList[i].addEventListener("mouseleave", (e) => {
        this.toolbarTooltip = "";
      });
    }

    // Adding Click Listeners to Menu Items
    let debugP = document.getElementById("btn_debugProgram");
    debugP.addEventListener("click", () => this.debugProgram());
    let genCode = document.getElementById("btn_generateCode");
    genCode.addEventListener("click", () => this.generatePseudoCode());
    let clearWS = document.getElementById("btn_clearWorkspace");
    clearWS.addEventListener("click", () => this.clearWorkspace());
    let aboutPg = document.getElementById("btn_aboutPage");
    aboutPg.addEventListener("click", () => this.openAboutPage());
    let tutorPg = document.getElementById("btn_tutorialPage");
    tutorPg.addEventListener("click", () => this.openTutorialPage());
    let newProj = document.getElementById("btn_newProject");
    newProj.addEventListener("click", () => this.newProject());
    let openProj = document.getElementById("btn_openProject");
    openProj.addEventListener("click", () => this.openProjectOptions());
    let saveProj = document.getElementById("btn_saveProject");
    saveProj.addEventListener('click', () => this.saveProjectOptions());
    let closeM = document.getElementById("btn_closeMenu");
    closeM.addEventListener("click", () => this.closeMenu());
    // let downloadAPK = document.getElementById("btn_downloadAPK");
    // downloadAPK.addEventListener("click", (e) => {
    //   window.open("https://drive.google.com/open?id=1iIYNSe-IuyAbd63iCE94GprxtDCQHqtS", "_blank");
    // });
    let sFAB = document.getElementById("symbolsFAB");
    sFAB.addEventListener("click", e => this.toggleSymbolsFAB());
    // let printFC = document.getElementById("btn_printFlowchart");
    // printFC.addEventListener('click', (e) => this.printFlowchart());
    let feedbackBtn = document.getElementById("btn_feedbackPage");
    feedbackBtn.addEventListener('click', (e) => this.openFeedback());
    let logOut = document.getElementById("btn_logOut");
    logOut.addEventListener("click", e => this.logOut());
    let goOnline = document.getElementById("btn_goOnline");
    goOnline.addEventListener("click", e => {
      this.closeMenu();
      //this.auth.mode = 'online';
      this.navCtrl.navigateRoot('/login');
    });

    // Initializing Workspace & Arrows/Branches & adding buttonClick listeners
    this.flowchart = new Flowchart(this.alertC);
    this.workspace = document.getElementById("workspace");
    this.branch = document.getElementById("arrow");
    this.branch.addEventListener("click", e => this.openSymbolsFAB(e));
    interact(this.branch)
      .gesturable({ hold: 1500 })
      .on("tap", e => this.openSymbolsFAB(e))
      .on("hold", e => this.openArrowsAS(e));

    /*** Dragula DRAG & DROP configs ***/
    this.subscribeToDragula();

    // Initialize Paste buffers
    this.paste_sym_buffer = new Array<Declare | Input | Output | Process | IfCase | ForLoop | WhileLoop | DoWhileLoop | Comment>();

    // if (this.platform.is("android")) { this.fileName = 'android'; }
    // else if (this.platform.is("ios")) { this.fileName = 'ios'; }
    // else if (this.platform.is("desktop")) { this.fileName = 'desktop'; }
    // else if (this.platform.is("pwa")) { this.fileName = 'pwa'; }

    // FOR ANDROID: Creating Save Folder if directory does not exist
    if (this.platform.is("android")) {
      this.file.createDir(
        `${this.file.externalRootDirectory}`,
        this.saveFolder,
        false
      ).then(res => {
        console.log('Directory exists');
      }).catch(err => {
        console.log('Directory does not exist');
      });
    }

    // Check if it is Offline Mode
    if (this.auth.mode == 'offline') {
      logOut.style.display = 'none';
      goOnline.style.display = 'block';
    } else {
      logOut.style.display = 'block';
      goOnline.style.display = 'none';
    }

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

    if (this.dragulaService.find('symbol') == null) {
      this.dragulaService.createGroup('symbol', {
        copy: true,
        removeOnSpill: true,
        isContainer: (el) => {
          return el.classList.contains('arrow dropzone');
        }
      });
    }
  }

  public openMenu() {
    let logOut = document.getElementById("btn_logOut");
    let goOnline = document.getElementById("btn_goOnline");
    // Check if it is Offline Mode
    if (this.auth.mode == 'offline') {
      logOut.style.display = 'none';
      goOnline.style.display = 'block';
    } else {
      logOut.style.display = 'block';
      goOnline.style.display = 'none';
    }
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
        this.resizeSymbols(e.target);
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
        this.resizeSymbols(e.target);
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
        this.resizeSymbols(e.target);
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
        this.resizeSymbols(e.target);
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
        this.resizeSymbols(e.target);
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
        this.resizeSymbols(e.target);
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
        this.resizeSymbols(e.target);
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
        this.resizeSymbols(e.target);
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
        this.resizeSymbols(e.target);
        console.log(data.data);
      } catch (error) {
        console.log(error);
      }
    });
    await modal.present();
  }

  public resizeSymbols(symbol) {
    if ((symbol.parentElement.parentElement.classList.contains("if_div"))
      || (symbol.parentElement.classList.contains("if_div"))) {
      this.resizeIfCaseBlocks(symbol);
    } else if ((symbol.parentElement.parentElement.classList.contains("for_div"))
      || (symbol.parentElement.classList.contains("for_div"))) {
      this.resizeForLoopBlocks(symbol);
    } else if ((symbol.parentElement.parentElement.classList.contains("while_div"))
      || (symbol.parentElement.classList.contains("while_div"))) {
      this.resizeWhileLoopBlocks(symbol);
    } else if ((symbol.parentElement.parentElement.classList.contains("do_while_div"))
      || (symbol.parentElement.classList.contains("do_while_div"))) {
      this.resizeDoWhileLoopBlocks(symbol);
    }
  }

  public resizeIfCaseBlocks(symbol) {
    // If Case Symbols
    if (symbol.parentElement.parentElement.classList.contains("if_div")) {
      if (symbol.parentElement.id == "ifTrueBlock" || symbol.parentElement.id == "ifFalseBlock") {
        let ifDiv = symbol.parentElement.parentElement as HTMLDivElement;
        let ifSymbol = ifDiv.getElementsByClassName("if_sym")[0] as HTMLDivElement;
        let falseBlock = ifDiv.getElementsByClassName("ifFalseBlock")[0] as HTMLDivElement;
        let trueBlock = ifDiv.getElementsByClassName("ifTrueBlock")[0] as HTMLDivElement;
        // Resize to the Block with the larger width
        let gridStr: string = "";
        if (trueBlock.offsetWidth > falseBlock.offsetWidth) {
          gridStr = trueBlock.offsetWidth + "px max-content "
            + ifSymbol.offsetWidth + "px max-content "
            + trueBlock.offsetWidth + "px";
          ifDiv.style.gridTemplateColumns = gridStr;
          trueBlock.style.margin = "0px";
          falseBlock.style.margin = "auto";
        } else if (falseBlock.offsetWidth > trueBlock.offsetWidth) {
          gridStr = falseBlock.offsetWidth + "px max-content "
            + ifSymbol.offsetWidth + "px max-content "
            + falseBlock.offsetWidth + "px";
          ifDiv.style.gridTemplateColumns = gridStr;
          trueBlock.style.margin = "auto";
          falseBlock.style.margin = "0px";
        } else {
          gridStr = falseBlock.offsetWidth + "px max-content "
            + ifSymbol.offsetWidth + "px max-content "
            + trueBlock.offsetWidth + "px";
          ifDiv.style.gridTemplateColumns = gridStr;
          trueBlock.style.margin = "0px";
          falseBlock.style.margin = "0px";
        }
      }
      this.resizeIfCaseArrows(symbol.parentElement, true);
    } else if (symbol.parentElement.classList.contains("if_div")) {
      // If Symbol
      let ifDiv = symbol.parentElement as HTMLDivElement;
      let falseBlock = ifDiv.getElementsByClassName("ifFalseBlock")[0] as HTMLDivElement;
      let trueBlock = ifDiv.getElementsByClassName("ifTrueBlock")[0] as HTMLDivElement;
      let gridStr = "";
      if (trueBlock.offsetWidth > falseBlock.offsetWidth) {
        gridStr = trueBlock.offsetWidth + "px max-content "
          + symbol.offsetWidth + "px max-content "
          + trueBlock.offsetWidth + "px";
      } else if (trueBlock.offsetWidth < falseBlock.offsetWidth) {
        gridStr = falseBlock.offsetWidth + "px max-content "
          + symbol.offsetWidth + "px max-content "
          + falseBlock.offsetWidth + "px";
      } else {
        gridStr = falseBlock.offsetWidth + "px max-content "
          + symbol.offsetWidth + "px max-content "
          + trueBlock.offsetWidth + "px";
      }
      ifDiv.style.gridTemplateColumns = gridStr;
      symbol.style.margin = "0px";
      this.resizeIfCaseArrows(symbol, false);
    }
  }

  public resizeForLoopBlocks(symbol) {
    // For Loop Symbols
    if (symbol.parentElement.parentElement.classList.contains("for_div")) {
      if (symbol.parentElement.id == "forTrueBlock" || symbol.parentElement.id == "forFalseBlock") {
        let forDiv = symbol.parentElement.parentElement as HTMLDivElement;
        let forSymbol = forDiv.getElementsByClassName("for_sym")[0] as HTMLDivElement;
        let falseBlock = forDiv.getElementsByClassName("forFalseBlock")[0] as HTMLDivElement;
        let trueBlock = forDiv.getElementsByClassName("forTrueBlock")[0] as HTMLDivElement;
        // Resize to the Block with the larger width
        let gridStr: string = "";
        gridStr = trueBlock.offsetWidth + "px max-content "
          + forSymbol.offsetWidth + "px max-content "
          + trueBlock.offsetWidth + "px";
        forDiv.style.gridTemplateColumns = gridStr;
        trueBlock.style.margin = "0px";
        falseBlock.style.margin = "0px";
      }
      this.resizeForLoopArrows(symbol.parentElement, true);
    } else if (symbol.parentElement.classList.contains("for_div")) {
      // For Symbol
      let forDiv = symbol.parentElement as HTMLDivElement;
      let falseBlock = forDiv.getElementsByClassName("forFalseBlock")[0] as HTMLDivElement;
      let trueBlock = forDiv.getElementsByClassName("forTrueBlock")[0] as HTMLDivElement;
      let gridStr = "";
      gridStr = trueBlock.offsetWidth + "px max-content "
        + symbol.offsetWidth + "px max-content "
        + trueBlock.offsetWidth + "px";
      forDiv.style.gridTemplateColumns = gridStr;
      symbol.style.margin = "0px";
      this.resizeForLoopArrows(symbol.parentElement, false);
    }
  }

  public resizeWhileLoopBlocks(symbol) {
    // While Loop Symbols
    if (symbol.parentElement.parentElement.classList.contains("while_div")) {
      if (symbol.parentElement.id == "whileTrueBlock") {
        let whileDiv = symbol.parentElement.parentElement as HTMLDivElement;
        let whileSymbol = whileDiv.getElementsByClassName("while_sym")[0] as HTMLDivElement;
        let falseBlock = whileDiv.getElementsByClassName("whileFalseBlock")[0] as HTMLDivElement;
        let trueBlock = whileDiv.getElementsByClassName("whileTrueBlock")[0] as HTMLDivElement;
        // Resize to the Block with the larger width
        let gridStr: string = "";
        gridStr = trueBlock.offsetWidth + "px max-content "
          + whileSymbol.offsetWidth + "px max-content "
          + trueBlock.offsetWidth + "px";
        whileDiv.style.gridTemplateColumns = gridStr;
        trueBlock.style.margin = "0px";
        falseBlock.style.margin = "0px";
      }
      this.resizeWhileLoopArrows(symbol.parentElement, true);
    } else if (symbol.parentElement.classList.contains("while_div")) {
      // While Symbol
      let whileDiv = symbol.parentElement as HTMLDivElement;
      let falseBlock = whileDiv.getElementsByClassName("whileFalseBlock")[0] as HTMLDivElement;
      let trueBlock = whileDiv.getElementsByClassName("whileTrueBlock")[0] as HTMLDivElement;
      let gridStr = "";
      gridStr = trueBlock.offsetWidth + "px max-content "
        + symbol.offsetWidth + "px max-content "
        + trueBlock.offsetWidth + "px";
      whileDiv.style.gridTemplateColumns = gridStr;
      symbol.style.margin = "0px";
      this.resizeWhileLoopArrows(symbol.parentElement, false);
    }
  }

  public resizeDoWhileLoopBlocks(symbol) {
    // Do While Loop Symbols
    if (symbol.parentElement.parentElement.classList.contains("do_while_div")) {
      if (symbol.parentElement.id == "doWhileTrueBlock") {
        let doWhileDiv = symbol.parentElement.parentElement as HTMLDivElement;
        let doWhileSymbol = doWhileDiv.getElementsByClassName("do_while_sym")[0] as HTMLDivElement;
        let falseBlock = doWhileDiv.getElementsByClassName("doWhileFalseBlock")[0] as HTMLDivElement;
        let trueBlock = doWhileDiv.getElementsByClassName("doWhileTrueBlock")[0] as HTMLDivElement;
        // Resize to the Block with the larger width
        let gridStr: string = "";
        gridStr = trueBlock.offsetWidth + "px max-content "
          + doWhileSymbol.offsetWidth + "px max-content "
          + trueBlock.offsetWidth + "px";
        doWhileDiv.style.gridTemplateColumns = gridStr;
        trueBlock.style.margin = "0px";
        falseBlock.style.margin = "0px";
      }
    } else if (symbol.parentElement.classList.contains("do_while_div")) {
      // Do While Symbol
      let doWhileDiv = symbol.parentElement as HTMLDivElement;
      let falseBlock = doWhileDiv.getElementsByClassName("doWhileFalseBlock")[0] as HTMLDivElement;
      let trueBlock = doWhileDiv.getElementsByClassName("doWhileTrueBlock")[0] as HTMLDivElement;
      let gridStr = "";
      gridStr = trueBlock.offsetWidth + "px max-content "
        + symbol.offsetWidth + "px max-content "
        + trueBlock.offsetWidth + "px";
      doWhileDiv.style.gridTemplateColumns = gridStr;
      symbol.style.margin = "0px";
    }
  }

  public resizeIfCaseArrows(symbol, resizeBlocks: boolean) {
    // If Case Symbols
    if (resizeBlocks) {
      // Resize arrows to the Left and Right
      let ifDiv = symbol.parentElement as HTMLDivElement;
      let leftArrowPieces = ifDiv.getElementsByClassName("arrowPiece left");
      for (let i = 0; i < leftArrowPieces.length; i++) {
        let aPiece = leftArrowPieces[i] as HTMLDivElement;
        let gridStr = "";
        let z = (aPiece.offsetWidth / 2) - (35 / 2);
        gridStr = z + "px 35px " + z + "px";
        aPiece.style.gridTemplateColumns = gridStr;
        let arrowP = aPiece.getElementsByClassName("dropzone");
        for (let j = 0; j < arrowP.length; j++) {
          let p = arrowP[j] as HTMLDivElement;
          p.style.width = z + "px";
        }
      }
      let rightArrowPieces = ifDiv.getElementsByClassName("arrowPiece right");
      for (let i = 0; i < rightArrowPieces.length; i++) {
        let aPiece = rightArrowPieces[i] as HTMLDivElement;
        let gridStr = "";
        let z = (aPiece.offsetWidth / 2) - (35 / 2);
        gridStr = z + "px 35px " + z + "px";
        aPiece.style.gridTemplateColumns = gridStr;
        let arrowP = aPiece.getElementsByClassName("dropzone");
        for (let j = 0; j < arrowP.length; j++) {
          let p = arrowP[j] as HTMLDivElement;
          p.style.width = z + "px";
        }
      }

    } else {
      // Resize arrows below If Symbol
      let ifDiv = symbol.parentElement as HTMLDivElement;
      let arrowPiece = ifDiv.getElementsByClassName("arrowPiece bottom_center")[0] as HTMLDivElement;
      let gridStr = "";
      let z = (arrowPiece.offsetWidth / 2) - (35 / 2);
      gridStr = z + "px 35px " + z + "px";
      arrowPiece.style.gridTemplateColumns = gridStr;
      let right1 = arrowPiece.getElementsByClassName("arrow_right")[0] as HTMLDivElement;
      let left1 = arrowPiece.getElementsByClassName("arrow_left")[0] as HTMLDivElement;
      right1.style.width = z + "px";
      left1.style.width = z + "px";
    }
  }

  public resizeForLoopArrows(symbol, resizeBlocks: boolean) {
    // For Loop Symbols
    if (resizeBlocks) {
      // Resize arrows to the Left and Right
      let forDiv = symbol.parentElement as HTMLDivElement;
      let rightArrowPieces = forDiv.getElementsByClassName("arrowPiece right");
      for (let i = 0; i < rightArrowPieces.length; i++) {
        let aPiece = rightArrowPieces[i] as HTMLDivElement;
        let gridStr = "";
        let z = (aPiece.offsetWidth / 2) - (35 / 2);
        gridStr = z + "px 35px " + z + "px";
        aPiece.style.gridTemplateColumns = gridStr;
        let arrowP = aPiece.getElementsByClassName("dropzone");
        for (let j = 0; j < arrowP.length; j++) {
          let p = arrowP[j] as HTMLDivElement;
          p.style.width = z + "px";
        }
      }
    } else {
      // Resize arrows below For Symbol
      let forDiv = symbol.parentElement as HTMLDivElement;
      let arrowPiece = forDiv.getElementsByClassName("arrowPiece bottom_center")[0] as HTMLDivElement;
      let gridStr = "";
      let z = (arrowPiece.offsetWidth / 2) - (70 / 2);
      gridStr = z + "px 70px " + z + "px";
      arrowPiece.style.gridTemplateColumns = gridStr;
      let right1 = arrowPiece.getElementsByClassName("arrow_horizontal")[0] as HTMLDivElement;
      let left1 = arrowPiece.getElementsByClassName("blank_arrow_left")[0] as HTMLDivElement;
      right1.style.width = z + "px";
      left1.style.width = z + "px";
    }
  }

  public resizeWhileLoopArrows(symbol, resizeBlocks: boolean) {
    // While Loop Symbols
    if (resizeBlocks) {
      // Resize arrows to the Left and Right
      let whileDiv = symbol.parentElement as HTMLDivElement;
      let rightArrowPieces = whileDiv.getElementsByClassName("arrowPiece right");
      for (let i = 0; i < rightArrowPieces.length; i++) {
        let aPiece = rightArrowPieces[i] as HTMLDivElement;
        let gridStr = "";
        let z = (aPiece.offsetWidth / 2) - (35 / 2);
        gridStr = z + "px 35px " + z + "px";
        aPiece.style.gridTemplateColumns = gridStr;
        let arrowP = aPiece.getElementsByClassName("dropzone");
        for (let j = 0; j < arrowP.length; j++) {
          let p = arrowP[j] as HTMLDivElement;
          p.style.width = z + "px";
        }
      }
    } else {
      // Resize arrows below For Symbol
      let whileDiv = symbol.parentElement as HTMLDivElement;
      let arrowPiece = whileDiv.getElementsByClassName("arrowPiece bottom_center")[0] as HTMLDivElement;
      let gridStr = "";
      let z = (arrowPiece.offsetWidth / 2) - (70 / 2);
      gridStr = z + "px 70px " + z + "px";
      arrowPiece.style.gridTemplateColumns = gridStr;
      let right1 = arrowPiece.getElementsByClassName("arrow_horizontal")[0] as HTMLDivElement;
      let left1 = arrowPiece.getElementsByClassName("blank_arrow_left")[0] as HTMLDivElement;
      right1.style.width = z + "px";
      left1.style.width = z + "px";
    }
  }

  async openSymbolsAS(event) {
    let syms1 = document
      .getElementById("workspace")
      .getElementsByClassName("symbol");
    for (let i = 0; i < syms1.length; i++) {
      if (syms1[i].classList.contains("active-symbol")) {
        syms1[i].classList.remove("active-symbol");
      }
    }
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
            text: "Cut",
            icon: 'cut',
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
                    // Add symbol to Paste buffer
                    this.paste_sym_buffer.push(this.flowchart.SYMBOLS[l].getSymbolFromTrueBlock(asi));
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
                    // Add symbol to Paste buffer
                    this.paste_sym_buffer.push(this.flowchart.SYMBOLS[l].getSymbolFromFalseBlock(asi));
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
                    // Add symbol to Paste buffer
                    this.paste_sym_buffer.push(this.flowchart.SYMBOLS[l].getSymbolFromTrueBlock(asi));
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
                    // Add symbol to Paste buffer
                    this.paste_sym_buffer.push(this.flowchart.SYMBOLS[l].getSymbolFromTrueBlock(asi));
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
                    // Add symbol to Paste buffer
                    this.paste_sym_buffer.push(this.flowchart.SYMBOLS[l].getSymbolFromTrueBlock(asi));
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
                // Add symbol to Paste buffer
                this.paste_sym_buffer.push(this.flowchart.getSymbolFromFlowchart(asi));
                this.flowchart.removeSymbolFromFlowchart(asi);
                // Remove symbol and trailing arrow from Workspace
                let nextArrow = selectedSymbol[0].nextSibling;
                this.workspace.removeChild(nextArrow);
                selectedSymbol[0].remove();
              }
              let syms = document
                .getElementById("workspace")
                .getElementsByClassName("symbol");
              for (let i = 0; i < syms.length; i++) {
                if (syms[i].classList.contains("active-symbol")) {
                  syms[i].classList.remove("active-symbol");
                }
              }
              console.log(this.flowchart.SYMBOLS);
              console.log('Paste buffers: ');
              console.log(this.paste_sym_buffer);
              this.isCutCopyReady = true;
            }
          },
          {
            text: "Copy",
            icon: 'copy',
            handler: () => {
              let asi,
                selectedSymbol = document
                  .getElementById("workspace")
                  .getElementsByClassName("active-symbol");
              if (selectedSymbol[0].parentElement.id == "ifTrueBlock") {
                let syms = selectedSymbol[0].parentElement.getElementsByClassName(
                  "symbol"
                );
                // Copy symbol from If-Case-True-Block
                for (let i = 0; i < syms.length; i++) {
                  if (syms[i].classList.contains("active-symbol")) {
                    asi = i;
                  }
                }
                for (let l = 0; l < this.flowchart.SYMBOLS.length; l++) {
                  if (this.flowchart.SYMBOLS[l] instanceof IfCase) {
                    // Add symbol to Paste buffer
                    this.paste_sym_buffer.push(this.flowchart.SYMBOLS[l].getSymbolFromTrueBlock(asi));
                  }
                }
              } else if (selectedSymbol[0].parentElement.id == "ifFalseBlock") {
                let syms = selectedSymbol[0].parentElement.getElementsByClassName(
                  "symbol"
                );
                // Copy symbol from If-Case-False-Block
                for (let i = 0; i < syms.length; i++) {
                  if (syms[i].classList.contains("active-symbol")) {
                    asi = i;
                  }
                }
                for (let l = 0; l < this.flowchart.SYMBOLS.length; l++) {
                  if (this.flowchart.SYMBOLS[l] instanceof IfCase) {
                    // Add symbol to Paste buffer
                    this.paste_sym_buffer.push(this.flowchart.SYMBOLS[l].getSymbolFromFalseBlock(asi));
                  }
                }
              } else if (selectedSymbol[0].parentElement.id == "forTrueBlock") {
                let syms = selectedSymbol[0].parentElement.getElementsByClassName(
                  "symbol"
                );
                // Copy symbol from For-Loop-Block
                for (let i = 0; i < syms.length; i++) {
                  if (syms[i].classList.contains("active-symbol")) {
                    asi = i;
                  }
                }
                for (let l = 0; l < this.flowchart.SYMBOLS.length; l++) {
                  if (this.flowchart.SYMBOLS[l] instanceof ForLoop) {
                    // Add symbol to Paste buffer
                    this.paste_sym_buffer.push(this.flowchart.SYMBOLS[l].getSymbolFromTrueBlock(asi));
                  }
                }
              } else if (
                selectedSymbol[0].parentElement.id == "whileTrueBlock"
              ) {
                let syms = selectedSymbol[0].parentElement.getElementsByClassName(
                  "symbol"
                );
                // Copy symbol from While-Loop-Block
                for (let i = 0; i < syms.length; i++) {
                  if (syms[i].classList.contains("active-symbol")) {
                    asi = i;
                  }
                }
                for (let l = 0; l < this.flowchart.SYMBOLS.length; l++) {
                  if (this.flowchart.SYMBOLS[l] instanceof WhileLoop) {
                    // Add symbol to Paste buffer
                    this.paste_sym_buffer.push(this.flowchart.SYMBOLS[l].getSymbolFromTrueBlock(asi));
                  }
                }
              } else if (
                selectedSymbol[0].parentElement.id == "doWhileTrueBlock"
              ) {
                let syms = selectedSymbol[0].parentElement.getElementsByClassName(
                  "symbol"
                );
                // Copy symbol from Do-While-Loop-Block
                for (let i = 0; i < syms.length; i++) {
                  if (syms[i].classList.contains("active-symbol")) {
                    asi = i;
                  }
                }
                for (let l = 0; l < this.flowchart.SYMBOLS.length; l++) {
                  if (this.flowchart.SYMBOLS[l] instanceof DoWhileLoop) {
                    // Add symbol to Paste buffer
                    this.paste_sym_buffer.push(this.flowchart.SYMBOLS[l].getSymbolFromTrueBlock(asi));
                  }
                }
              } else {
                let syms = document
                  .getElementById("workspace")
                  .getElementsByClassName("symbol");
                // Copy symbol from Flowchart
                for (let i = 0; i < syms.length; i++) {
                  if (syms[i].classList.contains("active-symbol")) {
                    asi = i - 1;
                  }
                }
                // Add symbol to Paste buffer
                this.paste_sym_buffer.push(this.flowchart.getSymbolFromFlowchart(asi));
              }
              let syms = document
                .getElementById("workspace")
                .getElementsByClassName("symbol");
              for (let i = 0; i < syms.length; i++) {
                if (syms[i].classList.contains("active-symbol")) {
                  syms[i].classList.remove("active-symbol");
                }
              }
              console.log(this.flowchart.SYMBOLS);
              console.log('Paste buffers: ');
              console.log(this.paste_sym_buffer);
              this.isCutCopyReady = true;
            }
          },
          {
            text: "Delete",
            role: 'destructive',
            icon: 'trash',
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
              let syms = document
                .getElementById("workspace")
                .getElementsByClassName("symbol");
              for (let i = 0; i < syms.length; i++) {
                if (syms[i].classList.contains("active-symbol")) {
                  syms[i].classList.remove("active-symbol");
                }
              }
              console.log(this.flowchart.SYMBOLS);
            }
          }
        ]
      };
      // Create and Display Symbols Options actionsheet
      const actionSheet = await this.symbolOptionsAS.create(options);
      actionSheet.onDidDismiss().then(data => {
        let syms1 = document
          .getElementById("workspace")
          .getElementsByClassName("symbol");
        for (let i = 0; i < syms1.length; i++) {
          if (syms1[i].classList.contains("active-symbol")) {
            syms1[i].classList.remove("active-symbol");
          }
        }
      });
      await actionSheet.present();
    }
  }

  async openArrowsAS(event) {
    let bs = document.getElementsByClassName("arrow dropzone");
    for (let i = 0; i < bs.length; i++) {
      if (bs[i].classList.contains("active-arrow")) {
        bs[i].classList.remove("active-arrow");
      }
    }

    event.preventDefault();
    // Get the target symbol & make it active
    let targetArrow = event.target || event.srcElement || event.currentTarget;
    targetArrow.classList.add("active-arrow");
    if (this.isCutCopyReady) {
      // Create Arrow Options actionsheet
      let options: ActionSheetOptions = {
        buttons: [
          {
            text: "Paste",
            icon: 'clipboard',
            handler: () => {
              let sym: any;
              let active_index: number;
              let tempSym = this.paste_sym_buffer.pop();
              let b = document.getElementsByClassName("arrow dropzone");
              for (let i = 0; i < b.length; i++) {
                if (b[i].className.endsWith("active-arrow")) {
                  active_index = i;
                }
              }
              switch (tempSym.id) {
                case 's_declare':
                  sym = new Declare();
                  sym.createDeclareSymbol(tempSym);
                  this.addSymbol(sym.id, targetArrow);
                  this.flowchart.removeSymbolFromFlowchart(active_index);
                  targetArrow.nextSibling.innerHTML = sym.getDeclareExpression();
                  break;
                case 's_input':
                  sym = new Input();
                  sym.createInputSymbol(tempSym);
                  this.addSymbol(sym.id, targetArrow);
                  this.flowchart.removeSymbolFromFlowchart(active_index);
                  targetArrow.nextSibling.innerHTML = sym.getInputExpression();
                  break;
                case 's_output':
                  sym = new Output();
                  sym.createOutputSymbol(tempSym);
                  this.addSymbol(sym.id, targetArrow);
                  this.flowchart.removeSymbolFromFlowchart(active_index);
                  targetArrow.nextSibling.innerHTML = sym.getOutputExpression();
                  break;
                case 's_process':
                  sym = new Process();
                  sym.createProcessSymbol(tempSym);
                  this.addSymbol(sym.id, targetArrow);
                  this.flowchart.removeSymbolFromFlowchart(active_index);
                  targetArrow.nextSibling.innerHTML = sym.getProcessExpression();
                  break;
                case 's_comment':
                  sym = new Comment();
                  sym.createCommentSymbol(tempSym);
                  this.addSymbol(sym.id, targetArrow);
                  this.flowchart.removeSymbolFromFlowchart(active_index);
                  targetArrow.nextSibling.innerHTML = sym.getCommentExpression();
                  break;
                case 's_if_case':
                  sym = new IfCase();
                  sym.createIfCaseSymbol(tempSym);
                  this.addSymbol(sym.id, targetArrow);
                  this.flowchart.removeSymbolFromFlowchart(active_index);
                  targetArrow.nextSibling.innerHTML = sym.getIfStatement();
                  break;
                case 's_for_loop':
                  sym = new ForLoop();
                  sym.createForLoopSymbol(tempSym);
                  this.addSymbol(sym.id, targetArrow);
                  this.flowchart.removeSymbolFromFlowchart(active_index);
                  targetArrow.nextSibling.innerHTML = sym.getForExpression();
                  break;
                case 's_while_loop':
                  sym = new WhileLoop();
                  sym.createWhileLoopSymbol(tempSym);
                  this.addSymbol(sym.id, targetArrow);
                  this.flowchart.removeSymbolFromFlowchart(active_index);
                  targetArrow.nextSibling.innerHTML = sym.getWhileExpression();
                  break;
                case 's_do_while_loop':
                  sym = new DoWhileLoop();
                  sym.createDoWhileLoopSymbol(tempSym);
                  this.addSymbol(sym.id, targetArrow);
                  this.flowchart.removeSymbolFromFlowchart(active_index);
                  targetArrow.nextSibling.innerHTML = sym.getDoWhileExpression();
                  break;
                default:
                  break;
              }
              this.flowchart.addSymbolToFlowchart(sym, active_index);
              let bs = document.getElementsByClassName("arrow dropzone");
              for (let i = 0; i < b.length; i++) {
                if (bs[i].classList.contains("active-arrow")) {
                  bs[i].classList.remove("active-arrow");
                }
              }
              this.paste_sym_buffer.push(tempSym);
              this.toggleSymbolsFAB();
              console.log(this.flowchart.SYMBOLS);
              console.log('Paste buffers: ');
              console.log(this.paste_sym_buffer);
              // this.isCutCopyReady = false;
            }
          }
        ]
      };
      // Create and Display Symbols Options actionsheet
      const actionSheet = await this.arrowsOptionsAS.create(options);
      actionSheet.onDidDismiss().then(data => {
        let bs = document.getElementsByClassName("arrow dropzone");
        for (let i = 0; i < bs.length; i++) {
          if (bs[i].classList.contains("active-arrow")) {
            bs[i].classList.remove("active-arrow");
          }
        }
      });
      await actionSheet.present();
    }

  }

  public toggleSymbolsFAB() {
    let symbolsList = document.getElementById("symbolsList");
    let symbolsFAB = document.getElementById("symbolsFAB");
    let symbolsTitle = document.getElementById("symbolsTitle");
    if (symbolsFAB.classList.contains('toggleSymFAB')) {
      let ss = document.getElementsByClassName("wrapper");
      ss[0].classList.remove('showSymbolPanel');
      // Close Symbols List
      symbolsFAB.classList.remove('toggleSymFAB');
      symbolsFAB.innerHTML = '<img src="./assets/icon/symbols_icon.png" alt="">';
      symbolsList.style.display = 'none';
      symbolsTitle.style.display = 'none';
      this.isSymbolsFABOpen = false;
      if (this.isConsoleOpen) {
        document.getElementById("console").style.marginLeft = '100px';
      }
    } else {
      let ss = document.getElementsByClassName("wrapper");
      ss[0].classList.add('showSymbolPanel');
      // Show Symbols List
      symbolsFAB.classList.add('toggleSymFAB');
      symbolsFAB.innerHTML = '<ion-icon name="close"></ion-icon>';
      symbolsList.style.display = 'block';
      symbolsTitle.style.display = 'block';
      this.isSymbolsFABOpen = true;
      // symbolsList.style.position = 'absolute';
      // symbolsList.style.bottom = '80px';
      if (this.isConsoleOpen) {
        document.getElementById("console").style.marginLeft = '0px';
      }
    }
  }

  public openSymbolsFAB(event) {
    // Get the target arrow
    let t = event.target || event.srcElement || event.currentTarget;
    // Get symbols FAB
    let symbolsFAB = document.getElementById("symbolsFAB");
    let symbolsList = document.getElementById("symbolsList");
    let symbolsTitle = document.getElementById("symbolsTitle");
    // Get the active arrow/branch
    let arrows = document.getElementsByClassName("dropzone active-arrow");
    // Check if there are other active arrows/branches
    if (arrows.length < 1) {
      t.classList.add("active-arrow");

      if (!symbolsFAB.classList.contains('toggleSymFAB')) {
        let ss = document.getElementsByClassName("wrapper");
        ss[0].classList.add('showSymbolPanel');
        // Show Symbols List
        symbolsFAB.classList.add('toggleSymFAB');
        symbolsFAB.innerHTML = '<ion-icon name="close"></ion-icon>';
        symbolsList.style.display = 'block';
        symbolsTitle.style.display = 'block';
        // symbolsList.style.position = 'absolute';
        // symbolsList.style.bottom = '80px';
      }

    } else {
      let branches = document.getElementsByClassName("dropzone active-arrow");
      for (let i = 0; i < branches.length; i++) {
        branches[i].classList.remove("active-arrow");
      }
      t.classList.add("active-arrow");
      // Open symbols FAB
      this.toggleSymbolsFAB();

      if (!symbolsFAB.classList.contains('toggleSymFAB')) {
        let ss = document.getElementsByClassName("wrapper");
        ss[0].classList.add('showSymbolPanel');
        // Show Symbols List
        symbolsFAB.classList.add('toggleSymFAB');
        symbolsFAB.innerHTML = '<ion-icon name="close"></ion-icon>';
        symbolsList.style.display = 'block';
        symbolsTitle.style.display = 'block';
        // symbolsList.style.position = 'absolute';
        // symbolsList.style.bottom = '80px';
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
      // add inner arrows to dragula containers
      let innerArrows = symbol.getElementsByClassName("arrow dropzone");
      for (let a = 0; a < innerArrows.length; a++) {
        this.dragulaService.find('symbol').drake.containers.push(innerArrows[a]);
      }
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
      // add inner arrows to dragula containers
      let innerArrows = symbol.getElementsByClassName("arrow dropzone");
      for (let a = 0; a < innerArrows.length; a++) {
        this.dragulaService.find('symbol').drake.containers.push(innerArrows[a]);
      }
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
      // add inner arrows to dragula containers
      let innerArrows = symbol.getElementsByClassName("arrow dropzone");
      for (let a = 0; a < innerArrows.length; a++) {
        this.dragulaService.find('symbol').drake.containers.push(innerArrows[a]);
      }
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
      // add inner arrows to dragula containers
      let innerArrows = symbol.getElementsByClassName("arrow dropzone");
      for (let a = 0; a < innerArrows.length; a++) {
        this.dragulaService.find('symbol').drake.containers.push(innerArrows[a]);
      }
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
        this.dragulaService.find('symbol').drake.containers.push(tempBranch);
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
        this.dragulaService.find('symbol').drake.containers.push(tempBranch);
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
        this.dragulaService.find('symbol').drake.containers.push(tempBranch);
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
        this.dragulaService.find('symbol').drake.containers.push(tempBranch);
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
        this.dragulaService.find('symbol').drake.containers.push(tempBranch);
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
      interact(dz[i]).unset();
      interact(dz[i])
        .gesturable({ hold: 1500 })
        .on("tap", e => this.openSymbolsFAB(e))
        .on("hold", e => this.openArrowsAS(e));
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
      if (!this.isSymbolsFABOpen)
        console1.style.marginLeft = '100px';
      else
        console1.style.marginLeft = '0px';
      consoleBtns.style.position = 'absolute';
      consoleBtns.style.right = '5px';
      consoleBtns.style.bottom = console1.offsetHeight + 'px';
      this.consoleButtonText = "Close Console";
      this.isConsoleOpen = true;
    } else {
      console1.classList.add('toggleConsole');
      console1.style.display = 'none';
      consoleBtns.style.position = 'absolute';
      consoleBtns.style.right = '5px';
      consoleBtns.style.bottom = '5px';
      this.consoleButtonText = "Open Console";
      this.isConsoleOpen = false;
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
    let symbolsList = document.getElementById("symbolsList");
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
    // workspace.appendChild(symbolsList);
    this.flowchart = new Flowchart(this.alertC);
  }

  public newProject() {
    let fileN = document.getElementById("fileName") as HTMLInputElement;
    fileN.value = "";
    this.clearWorkspace();
  }

  async openProjectOptions() {
    this.menu.close();
    // Open Project From...
    const actionSheet = await this.arrowsOptionsAS.create({
      header: 'Open Project From...',
      buttons: [{
        text: 'Internal Storage',
        icon: 'folder-open',
        handler: () => {
          this.openProject();
        }
      }, {
        text: 'Database',
        icon: 'cloud-outline',
        handler: () => {
          this.checkInternetConnection();
          this.openProjectFromDatabase();
        }
      }, {
        text: 'Cancel',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          console.log('Cancel');
        }
      }]
    });
    await actionSheet.present();
  }

  async openProject() {
    const modal = await this.modalC.create({
      component: OpenProjectPage,
      componentProps: { openFrom: 'internal' }
    });
    modal.onDidDismiss().then(data => {
      if (data.data != undefined) {
        let chapFileName = data.data.name.replace('.chap', '');
        this.loadProject(chapFileName, data.data.data);
      }
    });
    await modal.present();
  }

  async openProjectFromDatabase() {
    // Check if it is in Offline Mode
    if (this.auth.mode == 'offline') {
      let alert = await this.alertC.create({
        header: "Offline Mode",
        message: "Please turn on your internet connection to use CHAP online.",
        buttons: [
          {
            text: 'Go Online',
            handler: () => {
              //this.auth.mode = 'online';
              this.navCtrl.navigateRoot('/login');
            }
          }, {
            text: 'Close',
            role: 'cancel',
            handler: () => { }
          }
        ]
      });
      alert.present();
    } else if (this.auth.isLoggedIn) {
      const modal = await this.modalC.create({
        component: OpenProjectPage,
        componentProps: {
          openFrom: 'online',
          userID: this.auth.sessionToken.session.user_id
        }
      });
      modal.onDidDismiss().then(data => {
        if (data.data != undefined) {
          let chapFileName = data.data.name.replace('.chap', '');
          this.loadProject(chapFileName, data.data.data);
        }
      });
      await modal.present();
    } else {
      let alert = await this.alertC.create({
        header: "Cannot Open Online Projects",
        message: "Please log in to use CHAP online.",
        buttons: [
          {
            text: 'Login',
            handler: () => {
              //this.auth.mode = 'online';
              this.navCtrl.navigateRoot('/login');
            }
          }, {
            text: 'Use Offline Mode',
            role: 'cancel',
            handler: () => { }
          }
        ]
      });
      alert.present();
    }
  }

  public loadProject(chapFileName, fileData: string) {
    this.newProject();
    let dataSyms, arrowT, els, p, tlb, flb;
    console.log(fileData);
    dataSyms = JSON.parse(fileData);
    console.log('symbols data', dataSyms);

    for (let i = 0; i < dataSyms.length; i++) {
      let sym: any;
      switch (dataSyms[i].id) {
        case 's_declare':
          sym = new Declare();
          sym.createDeclareSymbol(dataSyms[i]);
          arrowT = document.getElementsByClassName('arrow dropzone');
          arrowT[i].classList.add("active-arrow");
          this.addSymbol(sym.id, arrowT[i]);
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
          els = document.getElementsByClassName('symbol');
          p = i + 1;
          let tempX = sym.getOutputExpression().replace(/`/g, '"');
          sym.setOutputExpression(tempX);
          els[p].innerHTML = sym.getOutputExpression();
          break;
        case 's_process':
          sym = new Process();
          sym.createProcessSymbol(dataSyms[i]);
          arrowT = document.getElementsByClassName('arrow dropzone');
          arrowT[i].classList.add("active-arrow");
          this.addSymbol(sym.id, arrowT[i]);
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
          els = document.getElementsByClassName('symbol');
          p = i + 1;
          els[p].innerHTML = sym.getIfStatement();
          tlb = els[p].parentElement.querySelector("#ifTrueBlock");
          this.loadLoopSymbols(sym.trueBlockSymbols, tlb);
          flb = els[p].parentElement.querySelector("#ifFalseBlock");
          this.loadLoopSymbols(sym.falseBlockSymbols, flb);
          break;
        case 's_for_loop':
          sym = new ForLoop();
          sym.createForLoopSymbol(dataSyms[i]);
          arrowT = document.getElementsByClassName('arrow dropzone');
          arrowT[i].classList.add("active-arrow");
          this.addSymbol(sym.id, arrowT[i]);
          els = document.getElementsByClassName('symbol');
          p = i + 1;
          els[p].innerHTML = sym.getForExpression();
          tlb = els[p].parentElement.querySelector("#forTrueBlock");
          this.loadLoopSymbols(sym.trueLoopBlock, tlb);
          break;
        case 's_while_loop':
          sym = new WhileLoop();
          sym.createWhileLoopSymbol(dataSyms[i]);
          arrowT = document.getElementsByClassName('arrow dropzone');
          arrowT[i].classList.add("active-arrow");
          this.addSymbol(sym.id, arrowT[i]);
          els = document.getElementsByClassName('symbol');
          p = i + 1;
          els[p].innerHTML = sym.getWhileExpression();
          tlb = els[p].parentElement.querySelector("#whileTrueBlock");
          this.loadLoopSymbols(sym.trueLoopBlock, tlb);
          break;
        case 's_do_while_loop':
          sym = new DoWhileLoop();
          sym.createDoWhileLoopSymbol(dataSyms[i]);
          arrowT = document.getElementsByClassName('arrow dropzone');
          arrowT[i].classList.add("active-arrow");
          this.addSymbol(sym.id, arrowT[i]);
          els = document.getElementsByClassName('symbol');
          p = i + 1;
          els[p].innerHTML = sym.getDoWhileExpression();
          tlb = els[p].parentElement.querySelector("#doWhileTrueBlock");
          this.loadLoopSymbols(sym.trueLoopBlock, tlb);
          break;
        default:
          break;
      }
      this.flowchart.SYMBOLS.splice(i, 1, sym);
    }
    this.fileName = chapFileName;
    let fName = document.getElementById('fileName') as HTMLInputElement;
    fName.value = this.fileName;
    this.toggleSymbolsFAB();

    this.toast.show('\"' + chapFileName + '.chap\" has successfully opened.', '3000', 'bottom').subscribe(
      toast => {
        console.log(toast);
      }
    );
  }

  public loadLoopSymbols(dataSyms, loopBlock) {
    let arrowT, els, tlb, flb;

    for (let i = 0; i < dataSyms.length; i++) {
      let sym: any;
      switch (dataSyms[i].id) {
        case 's_declare':
          sym = new Declare();
          sym.createDeclareSymbol(dataSyms[i]);
          arrowT = loopBlock.getElementsByClassName('arrow dropzone');
          arrowT[i].classList.add("active-arrow");
          this.addSymbol(sym.id, arrowT[i]);
          els = loopBlock.getElementsByClassName('symbol');
          els[i].innerHTML = sym.getDeclareExpression();
          break;
        case 's_input':
          sym = new Input();
          sym.createInputSymbol(dataSyms[i]);
          arrowT = loopBlock.getElementsByClassName('arrow dropzone');
          arrowT[i].classList.add("active-arrow");
          this.addSymbol(sym.id, arrowT[i]);
          els = loopBlock.getElementsByClassName('symbol');
          els[i].innerHTML = sym.getInputExpression();
          break;
        case 's_output':
          sym = new Output();
          sym.createOutputSymbol(dataSyms[i]);
          arrowT = loopBlock.getElementsByClassName('arrow dropzone');
          arrowT[i].classList.add("active-arrow");
          this.addSymbol(sym.id, arrowT[i]);
          els = loopBlock.getElementsByClassName('symbol');
          let tempX = sym.getOutputExpression().replace(/`/g, '"');
          sym.setOutputExpression(tempX);
          els[i].innerHTML = sym.getOutputExpression();
          break;
        case 's_process':
          sym = new Process();
          sym.createProcessSymbol(dataSyms[i]);
          arrowT = loopBlock.getElementsByClassName('arrow dropzone');
          arrowT[i].classList.add("active-arrow");
          this.addSymbol(sym.id, arrowT[i]);
          els = loopBlock.getElementsByClassName('symbol');
          els[i].innerHTML = sym.getProcessExpression();
          break;
        case 's_comment':
          sym = new Comment();
          sym.createCommentSymbol(dataSyms[i]);
          arrowT = loopBlock.getElementsByClassName('arrow dropzone');
          arrowT[i].classList.add("active-arrow");
          this.addSymbol(sym.id, arrowT[i]);
          els = loopBlock.getElementsByClassName('symbol');
          els[i].innerHTML = sym.getCommentExpression();
          break;
        case 's_if_case':
          sym = new IfCase();
          sym.createIfCaseSymbol(dataSyms[i]);
          arrowT = loopBlock.getElementsByClassName('arrow dropzone');
          arrowT[i].classList.add("active-arrow");
          this.addSymbol(sym.id, arrowT[i]);
          els = loopBlock.getElementsByClassName('symbol');
          els[i].innerHTML = sym.getIfStatement();
          tlb = els[i].parentElement.querySelector("#ifTrueBlock");
          this.loadLoopSymbols(sym.trueBlockSymbols, tlb);
          flb = els[i].parentElement.querySelector("#ifFalseBlock");
          this.loadLoopSymbols(sym.falseBlockSymbols, flb);
          break;
        case 's_for_loop':
          sym = new ForLoop();
          sym.createForLoopSymbol(dataSyms[i]);
          arrowT = loopBlock.getElementsByClassName('arrow dropzone');
          arrowT[i].classList.add("active-arrow");
          this.addSymbol(sym.id, arrowT[i]);
          els = loopBlock.getElementsByClassName('symbol');
          els[i].innerHTML = sym.getForExpression();
          tlb = els[i].parentElement.querySelector("#forTrueBlock");
          this.loadLoopSymbols(sym.trueLoopBlock, tlb);
          break;
        case 's_while_loop':
          sym = new WhileLoop();
          sym.createWhileLoopSymbol(dataSyms[i]);
          arrowT = loopBlock.getElementsByClassName('arrow dropzone');
          arrowT[i].classList.add("active-arrow");
          this.addSymbol(sym.id, arrowT[i]);
          els = loopBlock.getElementsByClassName('symbol');
          els[i].innerHTML = sym.getWhileExpression();
          tlb = els[i].parentElement.querySelector("#whileTrueBlock");
          this.loadLoopSymbols(sym.trueLoopBlock, tlb);
          break;
        case 's_do_while_loop':
          sym = new DoWhileLoop();
          sym.createDoWhileLoopSymbol(dataSyms[i]);
          arrowT = loopBlock.getElementsByClassName('arrow dropzone');
          arrowT[i].classList.add("active-arrow");
          this.addSymbol(sym.id, arrowT[i]);
          els = loopBlock.getElementsByClassName('symbol');
          els[i].innerHTML = sym.getDoWhileExpression();
          tlb = els[i].parentElement.querySelector("##doWhileTrueBlock");
          this.loadLoopSymbols(sym.trueLoopBlock, tlb);
          break;
        default:
          break;
      }
      dataSyms.splice(i, 1, sym);
    }
  }

  async saveProjectOptions() {
    this.menu.close();
    // Open Project From...
    const actionSheet = await this.arrowsOptionsAS.create({
      header: 'Save Project to...',
      buttons: [{
        text: 'Internal Storage',
        icon: 'folder',
        handler: () => {
          this.saveProject();
        }
      }, {
        text: 'Database',
        icon: 'cloud-upload',
        handler: () => {
          this.checkInternetConnection();
          this.saveProjectToDatabase();
        }
      }, {
        text: 'Cancel',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          console.log('Cancel');
        }
      }]
    });
    await actionSheet.present();
  }

  public saveProject() {
    let fileName, flowchartJSON;
    // this.menu.close();
    let fName = document.getElementById('fileName') as HTMLInputElement;
    this.fileName = fName.value;

    if (this.fileName == "") {
      this.showAlert(
        'Failed to Save',
        `Please enter a name for the project in the TextBox above, before saving it.`
      );
    } else {
      fileName = this.fileName + '.chap';
      this.flowchart.prepareFlowchartForSaving();
      flowchartJSON = JSON.stringify(this.flowchart.SYMBOLS);

      if (this.platform.is("android")) {
        this.saveToAndroid(flowchartJSON, fileName);
      } else if (this.platform.is("ios")) {
        this.saveToIOS(flowchartJSON, fileName);
      } else if (this.platform.is("desktop")) {
        this.saveTextAsFile(flowchartJSON, fileName);
      }
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

    console.log('base64:', btoa(data));

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

      console.log('A link', a.href);
    }
  }

  public saveToAndroid(fileData, filename) {
    this.file.writeFile(
      `${this.file.externalRootDirectory}/${this.saveFolder}`,
      `${filename}`,
      fileData,
      { replace: true, append: false }
    ).then(res => {
      this.toast.show('The project \"' + filename + '\" has successfully saved.', '3000', 'bottom').subscribe(
        toast => {
          console.log(toast);
        }
      );
    });
  }

  public saveToIOS(flowchartJSON, filename) {

  }

  async saveProjectToDatabase() {
    // Check if it is in Offline Mode
    if (this.auth.mode == 'offline') {
      let alert = await this.alertC.create({
        header: "Offline Mode",
        message: "Please turn on your internet connection to use CHAP online.",
        buttons: [
          {
            text: 'Go Online',
            handler: () => {
              //this.auth.mode = 'online';
              this.navCtrl.navigateRoot('/login');
            }
          }, {
            text: 'Close',
            role: 'cancel',
            handler: () => { }
          }
        ]
      });
      alert.present();
    } else if (this.auth.isLoggedIn) {
      let fileName, flowchartJSON;

      let fName = document.getElementById('fileName') as HTMLInputElement;
      this.fileName = fName.value;

      if (this.fileName == "") {
        this.showAlert(
          'Failed to Save',
          `Please enter a name for the project in the TextBox above, before saving it.`
        );
      } else {
        fileName = this.fileName + '.chap';
        this.flowchart.prepareFlowchartForSaving();
        flowchartJSON = JSON.stringify(this.flowchart.SYMBOLS);

        let uploadFile = {
          userid: this.auth.sessionToken.session.user_id,
          name: fileName,
          type: 'text/plain',
          blob: flowchartJSON
        };
        console.log('upload data', uploadFile);

        var headers = new HttpHeaders();
        headers.append("Accept", 'application/json');
        headers.append('Content-Type', 'application/json');

        this.http.post('http://www.chapchap.ga/saveProject.php', uploadFile, {})
          //this.http.post('https://chapweb.000webhostapp.com/saveProject.php', uploadFile, {})
          //this.http.post('http://localhost:80/chap_2/saveProject.php', uploadFile, {})
          .map((res: any) => res)
          .subscribe(async res => {
            console.log(res);

            if (res.message == "Save successful") {
              if (this.platform.is("android") || this.platform.is("ios")) {
                this.toast.show('Save successful!.', '3000', 'bottom').subscribe(
                  toast => {
                    console.log(toast);
                  }
                );
              } else {
                let alert = await this.alertC.create({
                  header: "File Uploaded to database",
                  message: "Save successful",
                  buttons: ['OK']
                });
                alert.present();
              }
            } else if (res.message == "Invaild File Upload! Please Re-Check your File.") {
              if (this.platform.is("android") || this.platform.is("ios")) {
                this.toast.show('Invaild File Upload! Please Re-Check your File.', '3000', 'bottom').subscribe(
                  toast => {
                    console.log(toast);
                  }
                );
              } else {
                let alert = await this.alertC.create({
                  header: "ERROR",
                  message: "Invaild File Upload! Please Re-Check your File.",
                  buttons: ['OK']
                });
                alert.present();
              }
            } else {
              if (this.platform.is("android") || this.platform.is("ios")) {
                this.toast.show(res.message, '3000', 'bottom').subscribe(
                  toast => {
                    console.log(toast);
                  }
                );
              } else {
                let alert = await this.alertC.create({
                  header: "ERROR",
                  message: (res.message),
                  buttons: ['OK']
                });
                alert.present();
              }
            }
          });
      }
    } else {
      let alert = await this.alertC.create({
        header: "Cannot Save Online",
        message: "Please log in to save your CHAP projects online.",
        buttons: [
          {
            text: 'Login',
            handler: () => {
              //this.auth.mode = 'online';
              this.navCtrl.navigateRoot('/login');
            }
          }, {
            text: 'Use Offline Mode',
            role: 'cancel',
            handler: () => { }
          }
        ]
      });
      alert.present();
    }
  }

  public debugProgram() {
    this.menu.close();
    this.clearConsole();
    if (this.isConsoleOpen == false) {
      this.toggleConsole();
    }
    this.flowchart.validateFlowchart(0, this.flowchart.SYMBOLS.length);
  }

  public generatePseudoCode() {
    this.openCodeViewer(this.flowchart);
    this.menu.close();
  }

  async openCodeViewer(flowchart) {
    const modal = await this.modalC.create({
      component: CodeViewerPage,
      componentProps: { flowchart: flowchart }
    });
    modal.onDidDismiss().then(data => {
      let fc = data.data as Flowchart;
    });
    await modal.present();
  }

  async openAboutPage() {
    this.menu.close();
    const modal = await this.modalC.create({
      component: AboutPage
    });
    await modal.present();
  }

  async openTutorialPage() {
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

  async logOut() {
    this.checkInternetConnection();
    // Check if it is in Offline Mode
    if (this.auth.mode == 'offline') {
      let alert = await this.alertC.create({
        header: "Offline Mode",
        message: "Please turn on your internet connection to use CHAP online.",
        buttons: [
          {
            text: 'Go Online',
            handler: () => {
              //this.auth.mode = 'online';
              this.navCtrl.navigateRoot('/login');
            }
          }, {
            text: 'Close',
            role: 'cancel',
            handler: () => { }
          }
        ]
      });
      alert.present();
    } else {
      let alert = await this.alertC.create({
        header: "Log Out",
        message: "Are you sure you want to log out?",
        buttons: [
          {
            text: 'Yes',
            handler: () => {
              console.log('Log Out');
              var headers = new HttpHeaders();
              headers.append("Accept", 'application/json');
              headers.append('Content-Type', 'application/json');

              console.log(this.auth.sessionToken.session);
              this.http.post('http://www.chapchap.ga/logout.php', this.auth.sessionToken.session, {})
                //this.http.post('https://chapweb.000webhostapp.com/logout.php', data, {})
                //this.http.post('http://localhost:80/chap_2/logout.php', data, {})
                .map((res: any) => res)
                .subscribe(async res => {
                  console.log(res);

                  if (res.message == "Log Out") {
                    this.closeMenu();
                    this.navCtrl.navigateRoot('/login');
                  } else {
                    let alert = await this.alertC.create({
                      header: "ERROR",
                      message: (res.message),
                      buttons: ['OK']
                    });
                    alert.present();
                  }
                });
            }
          },
          {
            text: 'No',
            role: 'cancel',
            handler: () => { console.log('Cancel'); }
          }]
      });
      alert.present();
    }
  }

  async checkInternetConnection() {
    if (!navigator.onLine) {
      this.auth.mode = 'offline';
    } else {
      this.auth.mode = 'online';
    }
  }

  async openFeedback() {
    this.closeMenu();

    const modal = await this.modalC.create({
      component: FeedbackPage,
      componentProps: {
        userID: this.auth.sessionToken.session.user_id
      }
    });

    modal.onDidDismiss().then(data => {

    });
    await modal.present();
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
