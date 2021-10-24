import {
  Component,
  ViewChild,
  Injectable,
} from "@angular/core";
import {
  ModalController,
  Fab,
  ActionSheetController,
  MenuController,
  AlertController,
  Platform,
  NavController,
  PopoverController,
} from "@ionic/angular";
import html2canvas from "html2canvas";
const interact = require("interactjs");
import { File } from "@ionic-native/file/ngx";
import { Chooser } from "@ionic-native/chooser/ngx";
import { Toast } from "@ionic-native/toast/ngx";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { DragulaService } from "ng2-dragula";
import { Symbols } from "../classes/Symbols";
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
import { ForLoop } from "../classes/ForLoop";
import { DoWhileLoop } from "../classes/DoWhileLoop";
import { OpenProjectPage } from "../open-project/open-project.page";
import { AuthService } from "../auth.service";
import { FeedbackPage } from "../feedback/feedback.page";
import { OperationPage } from "../symbol-dialogs/operation/operation.page";
import { CoverPagePage } from "../cover-page/cover-page.page";
import { PromptPage } from "../prompt/prompt.page";
import { THEMES } from "../themes/themes";
import { ThemesPage } from "../themes/themes.page";
import { LoopblockstateService } from "../loopblockstate.service";
import { SymbolData } from "../symbol-data";
import { Resizer } from "./resizer";
import { SymbolModals } from "./symbol-modals";
import { Saver } from "./saver";
import { Opener } from "./opener";
import { SymbolId } from "./symbol-ids";

@Component({
  selector: "app-home",
  templateUrl: "home.page.html",
  styleUrls: ["home.page.scss", "../splashscreen.scss"],
})
@Injectable()
export class HomePage {
  @ViewChild("symbolsFAB", {static: false}) symbolsFAB: Fab;
  symModals: SymbolModals = new SymbolModals(this.modalC);
  resizer: Resizer = new Resizer();
  saver: Saver = new Saver(this.alertC, this.arrowsOptionsAS, this.auth, this.file, this.http, this.menu, this.navCtrl, this.toast);
  opener: Opener = new Opener(this.alertC, this.auth, this.modalC, this.navCtrl, this.toast);
  symbolId: SymbolId = new SymbolId();

  flowchart: Flowchart = new Flowchart(this.alertC, this.loopBlockState);
  title = "CHAP";
  fileName = "";
  toolbarTooltip = "";
  consoleButtonText = "Open Console";
  isConsoleOpen = false;
  isSymbolsFABOpen = false;
  isCutCopyReady = false;
  workspace;
  branch;
  selectedSymbol;
  symbols = SymbolData;
  saveFolder = "CHAP Project Files";
  themes = THEMES;
  themeIndex: number = 0;
  splash = true;
  isSymbolBeingDragged = false;
  isRightClickPromptShowing = false;
  popOver;
  infoMessage = "";
  paste_sym_buffer: Array<Symbols>;

  constructor(
    public symbolOptionsAS: ActionSheetController,
    public arrowsOptionsAS: ActionSheetController,
    public menu: MenuController,
    public modalC: ModalController,
    public alertC: AlertController,
    private dragulaService: DragulaService,
    public chooser: Chooser,
    private http: HttpClient,
    private file: File,
    public platform: Platform,
    public toast: Toast,
    public navCtrl: NavController,
    private auth: AuthService,
    public popCtrl: PopoverController,
    private loopBlockState: LoopblockstateService
  ) { }

  setColor(id: string) {
    switch (id) {
      case "s_declare": return this.themes[this.themeIndex].colours.declare;
      case "s_input": return this.themes[this.themeIndex].colours.input;
      case "s_output": return this.themes[this.themeIndex].colours.output;
      case "s_process": return this.themes[this.themeIndex].colours.process;
      case "s_if_case": return this.themes[this.themeIndex].colours.ifcase;
      case "s_for_loop": return this.themes[this.themeIndex].colours.forloop;
      case "s_while_loop": return this.themes[this.themeIndex].colours.whileloop;
      case "s_do_while_loop": return this.themes[this.themeIndex].colours.dowhileloop;
      case "s_comment": return this.themes[this.themeIndex].colours.comment;
      case "s_start": return this.themes[this.themeIndex].colours.start;
      case "s_stop": return this.themes[this.themeIndex].colours.stop;
    }

  }

  loadTheme() {
    // Start Symbols
    let t10 = document.getElementsByClassName("s_start") as HTMLCollectionOf<HTMLDivElement>;
    for (let t = 0; t < t10.length; t++) {
      t10[t].style.backgroundColor = this.themes[this.themeIndex].colours.start;
    }
    // Stop Symbols
    let t11 = document.getElementsByClassName("s_stop") as HTMLCollectionOf<HTMLDivElement>;
    for (let t = 0; t < t11.length; t++) {
      t11[t].style.backgroundColor = this.themes[this.themeIndex].colours.stop;
    }
    // If Case Symbols
    let t1 = document.getElementsByClassName("s_if_case") as HTMLCollectionOf<HTMLDivElement>;
    for (let t = 0; t < t1.length; t++) {
      t1[t].style.backgroundColor = this.themes[this.themeIndex].colours.ifcase;
    }
    // For Loop Symbols
    let t2 = document.getElementsByClassName("s_for_loop") as HTMLCollectionOf<HTMLDivElement>;
    for (let t = 0; t < t2.length; t++) {
      t2[t].style.backgroundColor = this.themes[this.themeIndex].colours.forloop;
    }
    // While Loop Symbols
    let t3 = document.getElementsByClassName("s_while_loop") as HTMLCollectionOf<HTMLDivElement>;
    for (let t = 0; t < t3.length; t++) {
      t3[t].style.backgroundColor = this.themes[this.themeIndex].colours.whileloop;
    }
    // Do While Loop Symbols
    let t4 = document.getElementsByClassName("s_do_while_loop") as HTMLCollectionOf<HTMLDivElement>;
    for (let t = 0; t < t4.length; t++) {
      t4[t].style.backgroundColor = this.themes[this.themeIndex].colours.dowhileloop;
    }
    // Declare Symbols
    let t5 = document.getElementsByClassName("s_declare") as HTMLCollectionOf<HTMLDivElement>;
    for (let t = 0; t < t5.length; t++) {
      t5[t].style.backgroundColor = this.themes[this.themeIndex].colours.declare;
    }
    // Input Symbols
    let t6 = document.getElementsByClassName("s_input") as HTMLCollectionOf<HTMLDivElement>;
    for (let t = 0; t < t6.length; t++) {
      t6[t].style.backgroundColor = this.themes[this.themeIndex].colours.input;
    }
    // Output Symbols
    let t7 = document.getElementsByClassName("s_output") as HTMLCollectionOf<HTMLDivElement>;
    for (let t = 0; t < t7.length; t++) {
      t7[t].style.backgroundColor = this.themes[this.themeIndex].colours.output;
    }
    // Process Symbols
    let t8 = document.getElementsByClassName("s_process") as HTMLCollectionOf<HTMLDivElement>;
    for (let t = 0; t < t8.length; t++) {
      t8[t].style.backgroundColor = this.themes[this.themeIndex].colours.process;
    }
    // Comment Symbols
    let t9 = document.getElementsByClassName("s_comment") as HTMLCollectionOf<HTMLDivElement>;
    for (let t = 0; t < t9.length; t++) {
      t9[t].style.backgroundColor = this.themes[this.themeIndex].colours.comment;
    }
  }

  ngOnInit() {
    this.loadTheme();
    setTimeout(() => {
      this.splash = false;
      this.openIntroTutorial();
    }, 4000);

    // Adding Hover Listeners to Toolbar Buttons
    let tbButtons = document.getElementsByClassName("tooltip");
    for (let i = 0; i < tbButtons.length; i++) {
      // Mouse Over (Hover)
      tbButtons[i].addEventListener("mouseover", (e) => {
        this.toolbarTooltip = tbButtons[i].getElementsByClassName(
          "tooltiptext"
        )[0].innerHTML;
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
    clearWS.addEventListener("click", () => this.clearWorkspaceAlert(false));
    let aboutPg = document.getElementById("btn_aboutPage");
    aboutPg.addEventListener("click", () => this.openAboutPage());
    let tutorPg = document.getElementById("btn_tutorialPage");
    tutorPg.addEventListener("click", () => this.openTutorialPage());
    let newProj = document.getElementById("btn_newProject");
    newProj.addEventListener("click", () => this.newProject());
    let openProj = document.getElementById("btn_openProject");
    openProj.addEventListener("click", () => this.openProjectOptions());
    let saveProj = document.getElementById("btn_saveProject");
    saveProj.addEventListener("click", () => this.saveProjectOptions());
    let closeM = document.getElementById("btn_closeMenu");
    closeM.addEventListener("click", () => this.closeMenu());
    let themePage = document.getElementById("btn_themePage");
    themePage.addEventListener("click", (e) => this.openChooseTheme());
    // let downloadAPK = document.getElementById("btn_downloadAPK");
    // downloadAPK.addEventListener("click", (e) => {
    //   window.open("https://drive.google.com/open?id=1iIYNSe-IuyAbd63iCE94GprxtDCQHqtS", "_blank");
    // });
    let sFAB = document.getElementById("symbolsFAB");
    sFAB.addEventListener("click", (e) => this.toggleSymbolsFAB());
    //
     let printFC = document.getElementById("btn_printFlowchart"); 
    // printFC.addEventListener('click', (e) => this.printFlowchart());
    let quickGuide = document.getElementById("btn_gettingStartedPage");
    quickGuide.addEventListener('click', (e) => this.openIntroTutorial());
    let feedbackBtn = document.getElementById("btn_feedbackPage");
    feedbackBtn.addEventListener("click", (e) => this.openFeedback());
    let logOut = document.getElementById("btn_logOut");
    logOut.addEventListener("click", (e) => this.logOut());
    let goOnline = document.getElementById("btn_goOnline");
    goOnline.addEventListener("click", (e) => {
      this.closeMenu();
      //this.auth.mode = 'online';
      this.navCtrl.navigateRoot("/login");
    });
    let backToWelcome = document.getElementById("btn_backToWelcome");
    backToWelcome.addEventListener("click", (e) => {
      if (this.auth.isLoggedIn) {
        this.logOut();
      } else {
        this.closeMenu();
        this.navCtrl.navigateRoot("/welcome");
      }
    });

    // Initializing Workspace & Arrows/Branches & adding buttonClick listeners
    this.loopBlockState.initialize();
    this.flowchart = new Flowchart(this.alertC, this.loopBlockState);
    this.workspace = document.getElementById("workspace");
    let bs = document.getElementsByClassName("arrow dropzone");
    for (let b = 0; b < bs.length; b++) {
      bs[b].addEventListener("contextmenu", (e) => {
        e.preventDefault();
        this.openArrowsAS(e);
      });
      bs[b].addEventListener("mouseover", (e) => {
        let prompt = document.getElementById("infoPrompt");
        prompt.style.display = "flex";
        this.infoMessage = "Double-Click on an Arrow to Open small Symbol List";
        setTimeout(() => {
          prompt.style.display = "none";
          this.infoMessage = "";
        }, 3000);
      });
      bs[b].addEventListener("mouseout", (e) => {
        let prompt = document.getElementById("infoPrompt");
        prompt.style.display = "none";
        this.infoMessage = "";
      });
      interact(bs[b])
        .gesturable({ hold: 1500 })
        .on("doubletap", (e) => this.openSymbolPopUp(e))
        .on("tap", (e) => this.openSymbolsFAB(e))
        .on("hold", (e) => this.openArrowsAS(e));
    }
    this.branch = bs[0];

    /*** Dragula DRAG & DROP configs ***/
    this.subscribeToDragula();

    // Initialize Paste buffers
    this.paste_sym_buffer = new Array<
      | Declare
      | Input
      | Output
      | Process
      | IfCase
      | ForLoop
      | WhileLoop
      | DoWhileLoop
      | Comment
    >();

    if (this.platform.is("android")) { this.fileName = 'android'; }
    else if (this.platform.is("ios")) { this.fileName = 'ios'; }
    else if (this.platform.is("desktop")) { this.fileName = 'desktop'; }
    else if (this.platform.is("pwa")) { this.fileName = 'pwa'; }

    // FOR ANDROID: Creating Save Folder if directory does not exist
    if (this.platform.is("android")) {
      this.file
        .createDir(`${this.file.externalRootDirectory}`, this.saveFolder, false)
        .then((res) => {
          console.log("Directory exists");
        })
        .catch((err) => {
          console.log("Directory does not exist");
        });
    }
    // Check if it is Offline Mode or Trial Mode
    if (this.auth.mode == "offline") {
      logOut.style.display = "none";
      goOnline.style.display = "block";
      feedbackBtn.style.display = "none";
    } else if (this.auth.mode == "online") {
      logOut.style.display = "block";
      goOnline.style.display = "none";
      feedbackBtn.style.display = "block";
    } else if (this.auth.mode == "trial") {
      logOut.style.display = "none";
      goOnline.style.display = "none";
      feedbackBtn.style.display = "none";
    }
  }

  public subscribeToDragula() {
    
    this.dragulaService.drag("symbol").subscribe(({ name, el, source }) => {
      this.selectedSymbol = el.children[0].id;
      this.isSymbolBeingDragged = true;

      let prompt = document.getElementById("infoPrompt");
      prompt.style.display = "flex";
      this.infoMessage = "Drag and Drop Symbols onto an Arrow to add a Symbol";
    });

    this.dragulaService.dragend("symbol").subscribe(({ name, el }) => {
      this.isSymbolBeingDragged = false;

      let prompt = document.getElementById("infoPrompt");
      prompt.style.display = "none ";
      this.infoMessage = "";
    });

    this.dragulaService
      .drop("symbol")
      .subscribe(({ name, el, target, source }) => {
        target.setAttribute("style", "background: #000000");
        target.removeChild(target.children[0]);
        this.addSymbol(this.selectedSymbol);
        this.popOver = null;
        this.popCtrl.dismiss();
        this.isSymbolBeingDragged = false;
      });

    this.dragulaService
      .over("symbol")
      .subscribe(({ name, el, container, source }) => {
        if (container.className == "arrow dropzone") {
          // Make Arrow active
          container.classList.add("active-arrow");
          container.setAttribute("style", "background: #9CDCFE");
        }
      });

    this.dragulaService
      .out("symbol")
      .subscribe(({ name, el, container, source }) => {
        if (container.className == "arrow dropzone active-arrow") {
          // Make Arrow Inactive
          container.classList.remove("active-arrow");
          container.setAttribute("style", "background: #000000");
        }
      });

    if (this.dragulaService.find("symbol") == null) {
      this.dragulaService.createGroup("symbol", {
        copy: true,
        removeOnSpill: true,
        isContainer: (el) => {
          return el.classList.contains("arrow dropzone");
        },
      });
    }
  }

  public openMenu() {
    let logOut = document.getElementById("btn_logOut");
    let goOnline = document.getElementById("btn_goOnline");
    // Check if it is Offline Mode
    if (this.auth.mode == "offline") {
      logOut.style.display = "none";
      goOnline.style.display = "block";
    } else if (this.auth.mode == "online") {
      logOut.style.display = "block";
      goOnline.style.display = "none";
    } else if (this.auth.mode == "trial") {
      logOut.style.display = "none";
      goOnline.style.display = "none";
    }
    this.menu.open();
  }

  public closeMenu() {
    this.menu.close();
  }

  async openIntroTutorial() {
    const modal = await this.modalC.create({
      component: CoverPagePage,
    });
    modal.onDidDismiss().then((data) => { });
    await modal.present();
  }

  async openChooseTheme() {
    this.closeMenu();
    const modal = await this.modalC.create({
      component: ThemesPage,
      componentProps: { themeIndex: this.themeIndex }
    });
    modal.onDidDismiss().then((data) => {
      try {
        if (data.data != undefined) {
          this.themeIndex = data.data.themeIndex;
          this.loadTheme();
        }
      } catch (error) { console.log(error); }
    });
    await modal.present();
  }

  async openSymbolPopUp(event) {
    if (!this.isSymbolBeingDragged) {
      // Get the active arrows and disable them if any
      let arrows = document.getElementsByClassName("dropzone active-arrow");
      if (arrows.length > 0) {
        for (let i = 0; i < arrows.length; i++) {
          arrows[i].classList.remove("active-arrow");
        }
      }
      // Get target arrow and make it active
      let targetArrow = event.target || event.srcElement || event.currentTarget;
      targetArrow.classList.add("active-arrow");

      if (this.popOver) { this.popCtrl.dismiss() }
      this.popOver = await this.popCtrl.create({
        component: OperationPage,
        componentProps: { event: event, themeIndex: this.themeIndex },
        cssClass: 'symPopUp',
        event: event,
        translucent: true,
        showBackdrop: false,
      });
      this.popOver.onDidDismiss().then((data) => {
        try {
          if (data.data != undefined) {
            this.addSymbol(data.data.id);
          }
        } catch (error) { console.log(error); }
      });
      event.stopImmediatePropagation();
      return await this.popOver.present();
    }
    event.stopImmediatePropagation();
  }

  public closeSymbolPopUp(event) {
    if (!this.isSymbolBeingDragged) {
      this.popCtrl.dismiss();
    }
  }

  async openSymbolsAS(event) {
    if (!this.isRightClickPromptShowing) {
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
        if (this.popOver) {
          this.popCtrl.dismiss();
        }
        this.popOver = await this.popCtrl.create({
          component: PromptPage,
          componentProps: { event: event, type: 'symbol' },
          cssClass: "symbolPromptAS",
          event: event,
          translucent: true,
          showBackdrop: false,
        });
        this.popOver.onDidDismiss().then((data) => {
          try {
            if (data.data != undefined) {
              if (data.data == 'cut') {
                let asi,
                  selectedSymbol = document
                    .getElementById("workspace")
                    .getElementsByClassName("active-symbol");
                if (selectedSymbol[0].parentElement.id == "ifTrueBlock") {
                  let syms = selectedSymbol[0].parentElement.getElementsByClassName(
                    "symbol"
                  );
                  let curBlock = selectedSymbol[0].parentElement;
                  // Remove symbol from If-Case-True-Block
                  for (let i = 0; i < syms.length; i++) {
                    if (syms[i].classList.contains("active-symbol")) {
                      asi = i;
                    }
                  }
                  for (let l = 0; l < this.flowchart.SYMBOLS.length; l++) {
                    if (this.flowchart.SYMBOLS[l] instanceof IfCase) {
                      // Add symbol to Paste buffer
                      this.paste_sym_buffer.push(
                        this.flowchart.SYMBOLS[l].getSymbolFromTrueBlock(asi)
                      );
                      this.flowchart.SYMBOLS[l].removeSymbolFromTrueBlock(asi);
                    }
                  }
                  // Remove symbol and trailing arrow from If-True-Block in Workspace
                  let nextArrow = syms[asi].nextSibling;
                  syms[asi].parentElement.removeChild(nextArrow);
                  syms[asi].remove();
                  // Resize ** [CHUBO! = resize before removing symbol]
                  this.resizer.resizeIfCaseBlocks(curBlock.getElementsByClassName("arrow")[0]);
                } else if (selectedSymbol[0].parentElement.id == "ifFalseBlock") {
                  let syms = selectedSymbol[0].parentElement.getElementsByClassName(
                    "symbol"
                  );
                  let curBlock = selectedSymbol[0].parentElement;
                  // Remove symbol from If-Case-False-Block
                  for (let i = 0; i < syms.length; i++) {
                    if (syms[i].classList.contains("active-symbol")) {
                      asi = i;
                    }
                  }
                  for (let l = 0; l < this.flowchart.SYMBOLS.length; l++) {
                    if (this.flowchart.SYMBOLS[l] instanceof IfCase) {
                      // Add symbol to Paste buffer
                      this.paste_sym_buffer.push(
                        this.flowchart.SYMBOLS[l].getSymbolFromFalseBlock(asi)
                      );
                      this.flowchart.SYMBOLS[l].removeSymbolFromFalseBlock(asi);
                    }
                  }
                  // Remove symbol and trailing arrow from If-False-Block in Workspace
                  let nextArrow = syms[asi].nextSibling;
                  syms[asi].parentElement.removeChild(nextArrow);
                  syms[asi].remove();
                  // Resize
                  this.resizer.resizeIfCaseBlocks(curBlock.getElementsByClassName("arrow")[0]);
                } else if (selectedSymbol[0].parentElement.id == "forTrueBlock") {
                  let syms = selectedSymbol[0].parentElement.getElementsByClassName(
                    "symbol"
                  );
                  let curBlock = selectedSymbol[0].parentElement;
                  // Remove symbol from For-Loop-Block
                  for (let i = 0; i < syms.length; i++) {
                    if (syms[i].classList.contains("active-symbol")) {
                      asi = i;
                    }
                  }
                  for (let l = 0; l < this.flowchart.SYMBOLS.length; l++) {
                    if (this.flowchart.SYMBOLS[l] instanceof ForLoop) {
                      // Add symbol to Paste buffer
                      this.paste_sym_buffer.push(
                        this.flowchart.SYMBOLS[l].getSymbolFromTrueBlock(asi)
                      );
                      this.flowchart.SYMBOLS[l].removeSymbolFromTrueBlock(asi);
                    }
                  }
                  // Remove symbol and trailing arrow from For-Loop-Block in Workspace
                  let nextArrow = syms[asi].nextSibling;
                  syms[asi].parentElement.removeChild(nextArrow);
                  syms[asi].remove();
                  // Resize
                  this.resizer.resizeForLoopBlocks(curBlock.getElementsByClassName("arrow")[0]);
                } else if (
                  selectedSymbol[0].parentElement.id == "whileTrueBlock"
                ) {
                  let syms = selectedSymbol[0].parentElement.getElementsByClassName(
                    "symbol"
                  );
                  let curBlock = selectedSymbol[0].parentElement;
                  // Remove symbol from While-Loop-Block
                  for (let i = 0; i < syms.length; i++) {
                    if (syms[i].classList.contains("active-symbol")) {
                      asi = i;
                    }
                  }
                  for (let l = 0; l < this.flowchart.SYMBOLS.length; l++) {
                    if (this.flowchart.SYMBOLS[l] instanceof WhileLoop) {
                      // Add symbol to Paste buffer
                      this.paste_sym_buffer.push(
                        this.flowchart.SYMBOLS[l].getSymbolFromTrueBlock(asi)
                      );
                      this.flowchart.SYMBOLS[l].removeSymbolFromTrueBlock(asi);
                    }
                  }
                  // Remove symbol and trailing arrow from While-Loop-Block in Workspace
                  let nextArrow = syms[asi].nextSibling;
                  syms[asi].parentElement.removeChild(nextArrow);
                  syms[asi].remove();
                  // Resize
                  this.resizer.resizeWhileLoopBlocks(curBlock.getElementsByClassName("arrow")[0]);
                } else if (
                  selectedSymbol[0].parentElement.id == "doWhileTrueBlock"
                ) {
                  let syms = selectedSymbol[0].parentElement.getElementsByClassName(
                    "symbol"
                  );
                  let curBlock = selectedSymbol[0].parentElement;
                  // Remove symbol from Do-While-Loop-Block
                  for (let i = 0; i < syms.length; i++) {
                    if (syms[i].classList.contains("active-symbol")) {
                      asi = i;
                    }
                  }
                  for (let l = 0; l < this.flowchart.SYMBOLS.length; l++) {
                    if (this.flowchart.SYMBOLS[l] instanceof DoWhileLoop) {
                      // Add symbol to Paste buffer
                      this.paste_sym_buffer.push(
                        this.flowchart.SYMBOLS[l].getSymbolFromTrueBlock(asi)
                      );
                      this.flowchart.SYMBOLS[l].removeSymbolFromTrueBlock(asi);
                    }
                  }
                  // Remove symbol and trailing arrow from Do-While-Loop-Block in Workspace
                  let nextArrow = syms[asi].nextSibling;
                  syms[asi].parentElement.removeChild(nextArrow);
                  syms[asi].remove();
                  // Resize
                  this.resizer.resizeDoWhileLoopBlocks(curBlock.getElementsByClassName("arrow")[0]);
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
                  this.paste_sym_buffer.push(
                    this.flowchart.getSymbolFromFlowchart(asi)
                  );
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
                console.log("Paste buffers: ");
                console.log(this.paste_sym_buffer);
                this.isCutCopyReady = true;
              } else if (data.data == 'copy') {
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
                      this.paste_sym_buffer.push(
                        this.flowchart.SYMBOLS[l].getSymbolFromTrueBlock(asi)
                      );
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
                      this.paste_sym_buffer.push(
                        this.flowchart.SYMBOLS[l].getSymbolFromFalseBlock(asi)
                      );
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
                      this.paste_sym_buffer.push(
                        this.flowchart.SYMBOLS[l].getSymbolFromTrueBlock(asi)
                      );
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
                      this.paste_sym_buffer.push(
                        this.flowchart.SYMBOLS[l].getSymbolFromTrueBlock(asi)
                      );
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
                      this.paste_sym_buffer.push(
                        this.flowchart.SYMBOLS[l].getSymbolFromTrueBlock(asi)
                      );
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
                  this.paste_sym_buffer.push(
                    this.flowchart.getSymbolFromFlowchart(asi)
                  );
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
                console.log("Paste buffers: ");
                console.log(this.paste_sym_buffer);
                this.isCutCopyReady = true;
              } else if (data.data == 'delete') {
                let asi,
                  selectedSymbol = document
                    .getElementById("workspace")
                    .getElementsByClassName("active-symbol");
                if (selectedSymbol[0].parentElement.id == "ifTrueBlock") {
                  let syms = selectedSymbol[0].parentElement.getElementsByClassName(
                    "symbol"
                  );
                  let curBlock = selectedSymbol[0].parentElement;
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
                  // Resize
                  this.resizer.resizeIfCaseBlocks(curBlock.getElementsByClassName("arrow")[0]);
                } else if (selectedSymbol[0].parentElement.id == "ifFalseBlock") {
                  let syms = selectedSymbol[0].parentElement.getElementsByClassName(
                    "symbol"
                  );
                  let curBlock = selectedSymbol[0].parentElement;
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
                  // Resize
                  this.resizer.resizeIfCaseBlocks(curBlock.getElementsByClassName("arrow")[0]);
                } else if (selectedSymbol[0].parentElement.id == "forTrueBlock") {
                  let syms = selectedSymbol[0].parentElement.getElementsByClassName(
                    "symbol"
                  );
                  let curBlock = selectedSymbol[0].parentElement;
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
                  // Resize
                  this.resizer.resizeForLoopBlocks(curBlock.getElementsByClassName("arrow")[0]);
                } else if (
                  selectedSymbol[0].parentElement.id == "whileTrueBlock"
                ) {
                  let syms = selectedSymbol[0].parentElement.getElementsByClassName(
                    "symbol"
                  );
                  let curBlock = selectedSymbol[0].parentElement;
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
                  // Resize
                  this.resizer.resizeWhileLoopBlocks(curBlock.getElementsByClassName("arrow")[0]);
                } else if (
                  selectedSymbol[0].parentElement.id == "doWhileTrueBlock"
                ) {
                  let syms = selectedSymbol[0].parentElement.getElementsByClassName(
                    "symbol"
                  );
                  let curBlock = selectedSymbol[0].parentElement;
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
                  // Resize
                  this.resizer.resizeDoWhileLoopBlocks(curBlock.getElementsByClassName("arrow")[0]);
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
          } catch (error) { console.log(error); }
          this.isRightClickPromptShowing = false;
        });
        event.stopImmediatePropagation();
        this.isRightClickPromptShowing = true;
        return await this.popOver.present();
      }
    }
    event.stopImmediatePropagation();
  }

  async openArrowsAS(event) {
    if (!this.isRightClickPromptShowing) {
      // Disable all active arrows
      let arrows = document.getElementsByClassName("arrow dropzone");
      for (let i = 0; i < arrows.length; i++) {
        arrows[i].classList.remove("active-arrow");
      }
      event.preventDefault();
      // Get the target symbol & make it active
      let targetArrow = event.target || event.srcElement || event.currentTarget;
      targetArrow.classList.add("active-arrow");

      if (this.isCutCopyReady) {
        if (this.popOver) {
          this.popCtrl.dismiss();
        }
        this.popOver = await this.popCtrl.create({
          component: PromptPage,
          componentProps: { event: event, type: 'arrow' },
          cssClass: "symbolPromptAS",
          event: event,
          translucent: true,
          showBackdrop: false,
        });
        this.popOver.onDidDismiss().then((data) => {
          try {
            if (data.data != undefined) {
              if (data.data == 'paste') {
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
                  case "s_declare":
                    sym = new Declare();
                    sym.createDeclareSymbol(tempSym);
                    this.addSymbol(sym.id);
                    this.flowchart.removeSymbolFromFlowchart(active_index);
                    targetArrow.nextSibling.innerHTML = sym.getDeclareExpression();
                    break;
                  case "s_input":
                    sym = new Input();
                    sym.createInputSymbol(tempSym);
                    this.addSymbol(sym.id);
                    this.flowchart.removeSymbolFromFlowchart(active_index);
                    targetArrow.nextSibling.innerHTML = sym.getInputExpression();
                    break;
                  case "s_output":
                    sym = new Output();
                    sym.createOutputSymbol(tempSym);
                    this.addSymbol(sym.id);
                    this.flowchart.removeSymbolFromFlowchart(active_index);
                    targetArrow.nextSibling.innerHTML = sym.getOutputExpression();
                    break;
                  case "s_process":
                    sym = new Process();
                    sym.createProcessSymbol(tempSym);
                    this.addSymbol(sym.id);
                    this.flowchart.removeSymbolFromFlowchart(active_index);
                    targetArrow.nextSibling.innerHTML = sym.getProcessExpression();
                    break;
                  case "s_comment":
                    sym = new Comment();
                    sym.createCommentSymbol(tempSym);
                    this.addSymbol(sym.id);
                    this.flowchart.removeSymbolFromFlowchart(active_index);
                    targetArrow.nextSibling.innerHTML = sym.getCommentExpression();
                    break;
                  case "s_if_case":
                    sym = new IfCase();
                    sym.createIfCaseSymbol(tempSym);
                    this.addSymbol(sym.id);
                    this.flowchart.removeSymbolFromFlowchart(active_index);
                    targetArrow.nextSibling.innerHTML = sym.getIfStatement();
                    break;
                  case "s_for_loop":
                    sym = new ForLoop();
                    sym.createForLoopSymbol(tempSym);
                    this.addSymbol(sym.id);
                    this.flowchart.removeSymbolFromFlowchart(active_index);
                    targetArrow.nextSibling.innerHTML = sym.getForExpression();
                    break;
                  case "s_while_loop":
                    sym = new WhileLoop();
                    sym.createWhileLoopSymbol(tempSym);
                    this.addSymbol(sym.id);
                    this.flowchart.removeSymbolFromFlowchart(active_index);
                    targetArrow.nextSibling.innerHTML = sym.getWhileExpression();
                    break;
                  case "s_do_while_loop":
                    sym = new DoWhileLoop();
                    sym.createDoWhileLoopSymbol(tempSym);
                    this.addSymbol(sym.id);
                    this.flowchart.removeSymbolFromFlowchart(active_index);
                    targetArrow.nextSibling.innerHTML = sym.getDoWhileExpression();
                    break;
                  default:
                    break;
                }
                this.flowchart.addSymbolToFlowchart(sym, active_index);
                this.resizer.resizeSymbols(targetArrow);
                let bs = document.getElementsByClassName("arrow dropzone");
                for (let i = 0; i < b.length; i++) {
                  if (bs[i].classList.contains("active-arrow")) {
                    bs[i].classList.remove("active-arrow");
                  }
                }
                this.paste_sym_buffer.push(tempSym);
                // this.toggleSymbolsFAB();
                console.log(this.flowchart.SYMBOLS);
                console.log("Paste buffers: ");
                console.log(this.paste_sym_buffer);
                // this.isCutCopyReady = false;
              }
            }
          } catch (error) { console.log(error); }
          this.isRightClickPromptShowing = false;
        });
        event.stopImmediatePropagation();
        this.isRightClickPromptShowing = true;
        return await this.popOver.present();
      }
    }
    event.stopImmediatePropagation();
  }

  public toggleSymbolsFAB(stayOpen?: boolean) {
    let symbolsList = document.getElementById("symbolsList");
    let symbolsFAB = document.getElementById("symbolsFAB");
    let symbolsTitle = document.getElementById("symbolsTitle");
    let wrapper = document.getElementsByClassName("wrapper")[0];
    if (symbolsFAB.classList.contains("toggleSymFAB") && !stayOpen) {
      // Close Symbols FAB List
      wrapper.classList.remove("showSymbolPanel");
      symbolsFAB.classList.remove("toggleSymFAB");
      symbolsFAB.innerHTML =
        '<img src="./assets/icon/symbols_icon.png" alt="">';
      symbolsList.style.display = "none";
      symbolsTitle.style.display = "none";
      this.isSymbolsFABOpen = false;
      if (this.isConsoleOpen) {
        document.getElementById("console").style.marginLeft = "100px";
      }
    } else {
      // Open Symbols FAB List
      wrapper.classList.add("showSymbolPanel");
      symbolsFAB.classList.add("toggleSymFAB");
      symbolsFAB.innerHTML = '<ion-icon name="close"></ion-icon>';
      symbolsList.style.display = "block";
      symbolsTitle.style.display = "block";
      this.isSymbolsFABOpen = true;
      if (this.isConsoleOpen) {
        document.getElementById("console").style.marginLeft = "0px";
      }
    }
  }

  public openSymbolsFAB(event) {
    // Get the active arrows and disable them if any
    let arrows = document.getElementsByClassName("dropzone active-arrow");
    if (arrows.length > 0) {
      for (let i = 0; i < arrows.length; i++) {
        arrows[i].classList.remove("active-arrow");
      }
    }
    // Get the target arrow and make it active
    let targetArrow = event.target || event.srcElement || event.currentTarget;
    targetArrow.classList.add("active-arrow");
    // Toggle symbols FAB
    this.toggleSymbolsFAB(true);
  }

  async openSymbolDialog(event, id) {
    // Get the target symbol & make it active
    let active_sym_index, tempSym, asi;
    let targetSymbol = event.target || event.srcElement || event.currentTarget;
    if (targetSymbol.classList.contains("symbol"))
      targetSymbol.classList.add("active-symbol");

    // Checking the Symbol type and opening corresponding Properties Dialog Modals
    if (targetSymbol.parentElement.className.includes("ifTrueBlock") ) {
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
          if (targetSymbol.className.includes(  "s_declare")) {
            this.symModals.openDeclareModal(tempSym, event);
          } else if (targetSymbol.className.includes( "s_input")) {
            this.symModals.openInputModal(tempSym, event);
          } else if (targetSymbol.className.includes( "s_output")) {
            this.symModals.openOutputModal(tempSym, event);
          } else if (targetSymbol.className.includes( "s_comment")) {
            this.symModals.openCommentModal(tempSym, event);
          } else if (targetSymbol.className.includes( "s_process") ){
            this.symModals.openProcessModal(tempSym, event);
          } else if (targetSymbol.className.includes( "s_if_case") ){
            this.symModals.openIfModal(tempSym, event);
          } else if (targetSymbol.className.includes( "s_for_loop") ){
            this.symModals.openForLoopModal(tempSym, event);
          } else if (targetSymbol.className.includes(  "s_while_loop")) {
            this.symModals.openWhileModal(tempSym, event);
          } else if (targetSymbol.className.includes( "s_do_while_loop")) {
            this.symModals.openDoWhileModal(tempSym, event);
          }
        }
    //break;
    }
    } else if (targetSymbol.parentElement.className.includes("ifFalseBlock"))  {
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
          if (targetSymbol.className.includes("s_declare") ){
            this.symModals.openDeclareModal(tempSym, event);
          } else if (targetSymbol.className.includes("s_input") ){
            this.symModals.openInputModal(tempSym, event);
          } else if (targetSymbol.className.includes("s_output") ){
            this.symModals.openOutputModal(tempSym, event);
          } else if (targetSymbol.className.includes("s_comment") ){
            this.symModals.openCommentModal(tempSym, event);
          } else if (targetSymbol.className.includes( "s_process") ){
            this.symModals.openProcessModal(tempSym, event);
          } else if (targetSymbol.className.includes("s_if_case") ){
            this.symModals.openIfModal(tempSym, event);
          } else if (targetSymbol.className.includes("s_for_loop")) {
            this.symModals.openForLoopModal(tempSym, event);
          } else if (targetSymbol.className.includes("s_while_loop")) {
            this.symModals.openWhileModal(tempSym, event);
          } else if (targetSymbol.className.includes( "s_do_while_loop")) {
            this.symModals.openDoWhileModal(tempSym, event);
          }
        }
      }
    } else if (targetSymbol.parentElement.className.includes("forTrueBlock") ){
      let syms = event.target.parentElement.getElementsByClassName("symbol");
      for (let i = 0; i < syms.length; i++) {
        if (syms[i].classList.contains("active-symbol")) {
          asi = i;
        }
      }
      console.log('asi = ' + asi)
      for (let l = 0; l < this.flowchart.SYMBOLS.length; l++) {
        const el = this.flowchart.SYMBOLS[l];
        if (el instanceof ForLoop) {
          tempSym = el.getSymbolFromTrueBlock(asi);
          if (targetSymbol.className.includes("s_declare") ){
            this.symModals.openDeclareModal(tempSym, event);
          } else if (targetSymbol.className.includes("s_input") ){
            this.symModals.openInputModal(tempSym, event);
          } else if (targetSymbol.className.includes("s_output") ){
            this.symModals.openOutputModal(tempSym, event);
          } else if (targetSymbol.className.includes("s_comment") ){
            this.symModals.openCommentModal(tempSym, event);
          } else if (targetSymbol.className.includes( "s_process") ){
            this.symModals.openProcessModal(tempSym, event);
          } else if (targetSymbol.className.includes("s_if_case") ){
            this.symModals.openIfModal(tempSym, event);
          } else if (targetSymbol.className.includes("s_for_loop")) {
            this.symModals.openForLoopModal(tempSym, event);
          } else if (targetSymbol.className.includes("s_while_loop")) {
            this.symModals.openWhileModal(tempSym, event);
          } else if (targetSymbol.className.includes( "s_do_while_loop")) {
            this.symModals.openDoWhileModal(tempSym, event);
          }
        }
      }
    } else if (targetSymbol.parentElement.className.includes("whileTrueBlock") ){
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
          if (targetSymbol.className.includes ("s_declare") ) {
            this.symModals.openDeclareModal(tempSym, event);
          } else if (targetSymbol.className.includes ("s_input") ) {
            this.symModals.openInputModal(tempSym, event);
          } else if (targetSymbol.className.includes( "s_output")) {
            this.symModals.openOutputModal(tempSym, event);
          } else if (targetSymbol.className.includes("s_comment")) {
            this.symModals.openCommentModal(tempSym, event);
          } else if (targetSymbol.className.includes("s_process") ){
            this.symModals.openProcessModal(tempSym, event);
          } else if (targetSymbol.className.includes("s_if_case") ) {
            this.symModals.openIfModal(tempSym, event);
          } else if (targetSymbol.className.includes("s_for_loop") ){
            this.symModals.openForLoopModal(tempSym, event);
          } else if (targetSymbol.className.includes ("s_while_loop")) {
            this.symModals.openWhileModal(tempSym, event);
          } else if (targetSymbol.id == "s_do_while_loop") {
            this.symModals.openDoWhileModal(tempSym, event);
          }
        }
      }
    } else if (targetSymbol.parentElement.className.includes("doWhileTrueBlock") ){
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
          if (targetSymbol.className.includes ("s_declare") ) {
            this.symModals.openDeclareModal(tempSym, event);
          } else if (targetSymbol.className.includes ("s_input") ) {
            this.symModals.openInputModal(tempSym, event);
          } else if (targetSymbol.className.includes( "s_output")) {
            this.symModals.openOutputModal(tempSym, event);
          } else if (targetSymbol.className.includes("s_comment")) {
            this.symModals.openCommentModal(tempSym, event);
          } else if (targetSymbol.className.includes("s_process") ){
            this.symModals.openProcessModal(tempSym, event);
          } else if (targetSymbol.className.includes("s_if_case") ) {
            this.symModals.openIfModal(tempSym, event);
          } else if (targetSymbol.className.includes("s_for_loop") ){
            this.symModals.openForLoopModal(tempSym, event);
          } else if (targetSymbol.className.includes ("s_while_loop")) {
            this.symModals.openWhileModal(tempSym, event);
          } else if (targetSymbol.id == "s_do_while_loop") {
            this.symModals.openDoWhileModal(tempSym, event);
          }
        }
      }
    } else {
      let syms = document
        .getElementById("workspace")
        .getElementsByClassName("symbol");
      let nrOfLoopBlockSyms = 0;
      for (let i = 0; i < syms.length; i++) {
        if (syms[i].parentElement.id == "ifTrueBlock" || syms[i].parentElement.id == "ifFalseBlock" || 
        syms[i].parentElement.id == "forTrueBlock" || syms[i].parentElement.id == "whileTrueBlock" || 
        syms[i].parentElement.id == "doWhileTrueBlock")
        { nrOfLoopBlockSyms++; }
        else if (syms[i].classList.contains("active-symbol")) {
          active_sym_index = i + nrOfLoopBlockSyms;
        }
      }
      tempSym = this.flowchart.getSymbolFromFlowchart(active_sym_index);

      if (targetSymbol.className.includes ("s_declare") ) {
        this.symModals.openDeclareModal(tempSym, event);
      } else if (targetSymbol.className.includes ("s_input") ) {
        this.symModals.openInputModal(tempSym, event);
      } else if (targetSymbol.className.includes( "s_output")) {
        this.symModals.openOutputModal(tempSym, event);
      } else if (targetSymbol.className.includes("s_comment")) {
        this.symModals.openCommentModal(tempSym, event);
      } else if (targetSymbol.className.includes("s_process") ){
        this.symModals.openProcessModal(tempSym, event);
      } else if (targetSymbol.className.includes("s_if_case") ) {
        this.symModals.openIfModal(tempSym, event);
      } else if (targetSymbol.className.includes("s_for_loop") ){
        this.symModals.openForLoopModal(tempSym, event);
      } else if (targetSymbol.className.includes ("s_while_loop")) {
        this.symModals.openWhileModal(tempSym, event);
      } else if (targetSymbol.id == "s_do_while_loop") {
        this.symModals.openDoWhileModal(tempSym, event);
      }
      
    }
   
  }

  public addSymbol(id: string, currentSymbol?: Symbols) {
    let temp, symbol, activeArrowIndex, act_in, symComponent;

    let arrows = document.getElementsByClassName("arrow dropzone");
    for (let i = 0; i < arrows.length; i++) {
      if (arrows[i].className.endsWith("active-arrow")) {
        activeArrowIndex = i;
      }
    }

    if (id == "s_declare") {
      // frontend
      temp = document.getElementById(id);
      symbol = temp.cloneNode(true);
      symbol.innerHTML = "Declare";
      // backend
      let dec = new Declare();
      dec.setDeclareSymbol(symbol);
      symComponent = dec;
    } else if (id == "s_input") {
      // frontend
      temp = document.getElementById(id);
      symbol = temp.cloneNode(true);
      symbol.innerHTML = "Input";
      // backend
      let input = new Input();
      input.setInputSymbol(symbol);
      symComponent = input;
    } else if (id == "s_output") {
      // frontend
      temp = document.getElementById(id);
      symbol = temp.cloneNode(true);
      symbol.innerHTML = "Output";
      // backend
      let output = new Output();
      output.setOutputSymbol(symbol);
      symComponent = output;
    } else if (id == "s_process") {
      // frontend
      temp = document.getElementById(id);
      symbol = temp.cloneNode(true);
      symbol.innerHTML = "Process";
      // backend
      let proc = new Process();
      proc.setProcessSymbol(symbol);
      symComponent = proc;
    } else if (id == "s_comment") {
      // frontend
      temp = document.getElementById(id);
      symbol = temp.cloneNode(true);
      symbol.innerHTML = "Comment";
      // backend
      let com = new Comment();
      com.setCommentSymbol(symbol);
      symComponent = com;
    } else if (id == "s_if_case") {
      // frontend
      temp = document
        .getElementById("control_loop_list")
        .getElementsByClassName("if_div");
      symbol = temp[0].cloneNode(true);
      // - add inner arrows to dragula containers
      let innerArrows = symbol.getElementsByClassName("arrow dropzone");
      for (let a = 0; a < innerArrows.length; a++) {
        this.dragulaService
          .find("symbol")
          .drake.containers.push(innerArrows[a]);
        // - add event listeners to inner arrows
        this.addEventListenersToArrow(innerArrows[a]);
      }
      // backend
      let ifcase = new IfCase();
      ifcase.setIfCaseSymbol(symbol);
      symComponent = ifcase;
    } else if (id == "s_while_loop") {
      // frontend
      temp = document
        .getElementById("control_loop_list")
        .getElementsByClassName("while_div");
      symbol = temp[0].cloneNode(true);
      // - add inner arrows to dragula containers
      let innerArrows = symbol.getElementsByClassName("arrow dropzone");
      for (let a = 0; a < innerArrows.length; a++) {
        this.dragulaService
          .find("symbol")
          .drake.containers.push(innerArrows[a]);
        // - add event listeners to inner arrows
        this.addEventListenersToArrow(innerArrows[a]);
      }
      // backend
      let whileloop = new WhileLoop();
      whileloop.setWhileSymbol(symbol);
      symComponent = whileloop;
    } else if (id == "s_for_loop") {
      // frontend
      temp = document
        .getElementById("control_loop_list")
        .getElementsByClassName("for_div");
      symbol = temp[0].cloneNode(true);
      // - add inner arrows to dragula containers
      let innerArrows = symbol.getElementsByClassName("arrow dropzone");
      for (let a = 0; a < innerArrows.length; a++) {
        this.dragulaService
          .find("symbol")
          .drake.containers.push(innerArrows[a]);
        // - add event listeners to inner arrows
        this.addEventListenersToArrow(innerArrows[a]);
      }
      // backend
      let forloop = new ForLoop();
      forloop.setForSymbol(symbol);
      symComponent = forloop;
    } else if (id == "s_do_while_loop") {
      // frontend
      temp = document
        .getElementById("control_loop_list")
        .getElementsByClassName("do_while_div");
      symbol = temp[0].cloneNode(true);
      // - add inner arrows to dragula containers
      let innerArrows = symbol.getElementsByClassName("arrow dropzone");
      for (let a = 0; a < innerArrows.length; a++) {
        this.dragulaService
          .find("symbol")
          .drake.containers.push(innerArrows[a]);
        // - add event listeners to inner arrows
        this.addEventListenersToArrow(innerArrows[a]);
      }
      // backend
      let doWhileLoop = new DoWhileLoop();
      doWhileLoop.setDoWhileSymbol(symbol);
      symComponent = doWhileLoop;
    }

    let tempBranch = this.branch.cloneNode(true);
    this.addEventListenersToArrow(tempBranch);
    // Get the selected arrow/branch to append symbol after
    let activeArrow = document.getElementsByClassName("arrow dropzone active-arrow")[0];

    /* Checking which BLOCK the symbol should be added to */
    switch (activeArrow.parentElement.className) {
      case "ifTrueBlock":
        let par1 = activeArrow.parentElement.getElementsByClassName(
          "arrow dropzone"
        );
        for (let r = 0; r < par1.length; r++) {
          if (par1[r].className.endsWith("active-arrow")) {
            act_in = r;
          }
        }
        tempBranch.classList.remove("active-arrow");
        this.dragulaService.find("symbol").drake.containers.push(tempBranch);
        symbol.id = "s_temp_id";
        activeArrow.parentElement.insertBefore(symbol, activeArrow.nextSibling);
        activeArrow.parentElement.insertBefore(tempBranch, symbol.nextSibling);
        this.symbolId.generateId("s_temp_id", activeArrow.parentElement, symComponent);
        // this.flowchart[symComponent.parentIndex].addSymbolToTrueBlock(symComponent, symComponent.symbolIndex);
        for (let l = 0; l < this.flowchart.SYMBOLS.length; l++) {
          const el = this.flowchart.SYMBOLS[l];
          if (el instanceof IfCase) {
            el.addSymbolToTrueBlock(symComponent, symComponent.symbolIndex);
          }
        }
        break;
      case "ifFalseBlock":
        let par2 = activeArrow.parentElement.getElementsByClassName(
          "arrow dropzone"
        );
        for (let r = 0; r < par2.length; r++) {
          if (par2[r].className.endsWith("active-arrow")) {
            act_in = r;
          }
        }
        tempBranch.classList.remove("active-arrow");
        this.dragulaService.find("symbol").drake.containers.push(tempBranch);
        symbol.id = "s_temp_id";
        activeArrow.parentElement.insertBefore(symbol, activeArrow.nextSibling);
        activeArrow.parentElement.insertBefore(tempBranch, symbol.nextSibling);
        this.symbolId.generateId("s_temp_id", activeArrow.parentElement, symComponent);
        // this.flowchart[symComponent.parentIndex].addSymbolToTrueBlock(symComponent, symComponent.symbolIndex);
        for (let l = 0; l < this.flowchart.SYMBOLS.length; l++) {
          const el = this.flowchart.SYMBOLS[l];
          if (el instanceof IfCase) {
            el.addSymbolToFalseBlock(symComponent, symComponent.symbolIndex);
          }
        }
        break;
      case "forTrueBlock":
        let par3 = activeArrow.parentElement.getElementsByClassName("arrow dropzone");
        for (let r = 0; r < par3.length; r++) {
          if (par3[r].className.endsWith("active-arrow")) {
            act_in = r;
          }
        }
        tempBranch.classList.remove("active-arrow");
        this.dragulaService.find("symbol").drake.containers.push(tempBranch);
        symbol.id = "s_temp_id";
        activeArrow.parentElement.insertBefore(symbol, activeArrow.nextSibling);
        activeArrow.parentElement.insertBefore(tempBranch, symbol.nextSibling);
        this.symbolId.generateId("s_temp_id", activeArrow.parentElement, symComponent);
        // this.flowchart[symComponent.parentIndex].addSymbolToTrueBlock(symComponent, symComponent.symbolIndex);
        for (let l = 0; l < this.flowchart.SYMBOLS.length; l++) {
          const el = this.flowchart.SYMBOLS[l];
          if (el instanceof ForLoop) {
            el.addSymbolToTrueBlock(symComponent, symComponent.symbolIndex);
          }
        }
        break;
      case "whileTrueBlock":
        let par4 = activeArrow.parentElement.getElementsByClassName(
          "arrow dropzone"
        );
        for (let r = 0; r < par4.length; r++) {
          if (par4[r].className.endsWith("active-arrow")) {
            act_in = r;
          }
        }
        tempBranch.classList.remove("active-arrow");
        this.dragulaService.find("symbol").drake.containers.push(tempBranch);
        symbol.id = "s_temp_id";
        activeArrow.parentElement.insertBefore(symbol, activeArrow.nextSibling);
        activeArrow.parentElement.insertBefore(tempBranch, symbol.nextSibling);
        this.symbolId.generateId("s_temp_id", activeArrow.parentElement, symComponent);
        // this.flowchart[symComponent.parentIndex].addSymbolToTrueBlock(symComponent, symComponent.symbolIndex);
        for (let l = 0; l < this.flowchart.SYMBOLS.length; l++) {
          const el = this.flowchart.SYMBOLS[l];
          if (el instanceof WhileLoop) {
            el.addSymbolToTrueBlock(symComponent, symComponent.symbolIndex);
          }
        }
        break;
      case "doWhileTrueBlock":
        let par5 = activeArrow.parentElement.getElementsByClassName(
          "arrow dropzone"
        );
        for (let r = 0; r < par5.length; r++) {
          if (par5[r].className.endsWith("active-arrow")) {
            act_in = r;
          }
        }
        tempBranch.classList.remove("active-arrow");
        this.dragulaService.find("symbol").drake.containers.push(tempBranch);
        symbol.id = "s_temp_id";
        activeArrow.parentElement.insertBefore(symbol, activeArrow.nextSibling);
        activeArrow.parentElement.insertBefore(tempBranch, symbol.nextSibling);
        this.symbolId.generateId("s_temp_id", activeArrow.parentElement, symComponent);
        // this.flowchart[symComponent.parentIndex].addSymbolToTrueBlock(symComponent, symComponent.symbolIndex);
        for (let l = 0; l < this.flowchart.SYMBOLS.length; l++) {
          const el = this.flowchart.SYMBOLS[l];
          if (el instanceof DoWhileLoop) {
            el.addSymbolToTrueBlock(symComponent, symComponent.symbolIndex);
          }
        }
        break;
      default:
        let ai, totalAD = 0;
        
        symbol.addEventListener("contextmenu", (e) => {
          e.preventDefault();
          this.openSymbolsAS(e);
        });
        interact(symbol)
          .gesturable({ hold: 1500 })
          .on("tap", (e) => { e.preventDefault() })
          .on("doubletap", (e) => this.openSymbolDialog(e, id))
          .on("hold", (e) => this.openSymbolsAS(e));

        let b1 = this.workspace.getElementsByClassName("arrow dropzone");
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

        console.log("workspace active arrow: ", tempBranch);
        tempBranch.classList.remove("active-arrow");
        this.dragulaService.find("symbol").drake.containers.push(tempBranch);
        // TODO: assign temp id
        symbol.id = "s_temp_id";
        // Add symbol and corresponding arrow/branch to Workspace
        this.workspace.insertBefore(symbol, activeArrow.nextSibling);
        this.workspace.insertBefore(tempBranch, symbol.nextSibling);
        this.symbolId.generateId("s_temp_id", activeArrow.parentElement, symComponent);
        this.flowchart.addSymbolToFlowchart(symComponent, symComponent.symbolIndex);
        break;
    }

    // Make all the arrows/branches on the Workspace inactive
    arrows = document.getElementsByClassName("arrow dropzone active-arrow");
    for (let i = 0; i < arrows.length; i++) {
      arrows[i].classList.remove("active-arrow");
    }

    if (this.popOver)
      this.popCtrl.dismiss();
    console.log(this.flowchart.SYMBOLS);

    let sy = this.workspace.getElementsByClassName("symbol");
    console.log("workspace symbols: ", sy);
  }

  public addEventListenersToArrow(arrow) {
    arrow.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      this.openArrowsAS(e);
    });
    arrow.addEventListener("mouseover", (e) => {
      let prompt = document.getElementById("infoPrompt");
      prompt.style.display = "flex";
      this.infoMessage = "Double-Click on an Arrow to Open small Symbol List";
      setTimeout(() => {
        prompt.style.display = "none";
        this.infoMessage = "";
      }, 3000);
    });
    arrow.addEventListener("mouseout", (e) => {
      let prompt = document.getElementById("infoPrompt");
      prompt.style.display = "none";
      this.infoMessage = "";
    });
    interact(arrow)
      .gesturable({ hold: 1500 })
      .on("doubletap", (e) => this.openSymbolPopUp(e))
      .on("tap", (e) => this.openSymbolsFAB(e))
      .on("hold", (e) => this.openArrowsAS(e));
  }

  public consoleLog(textColourClass, lineOutput) {
    let chapConsole = document.getElementById("console") as HTMLDivElement;
    chapConsole.innerHTML += `<span class="` + textColourClass + `"> ` + lineOutput + "</span> \n";
  }

  async showAlert(alertTitle: string, alertMsg: string) {
    const alert = await this.alertC.create({
      header: alertTitle,
      message: alertMsg,
      buttons: ["OK"],
    });
    await alert.present();
  }

  public toggleConsole() {
    let chapConsole = document.getElementById("console");
    let consoleBtns = document.getElementById("consoleBtns");
    if (chapConsole.classList.contains("toggleConsole")) {
      chapConsole.classList.remove("toggleConsole");
      chapConsole.style.display = "block";
      chapConsole.style.position = "absolute";
      chapConsole.style.bottom = "0";
      if (!this.isSymbolsFABOpen) chapConsole.style.marginLeft = "100px";
      else chapConsole.style.marginLeft = "0px";
      consoleBtns.style.position = "absolute";
      consoleBtns.style.right = "5px";
      consoleBtns.style.bottom = chapConsole.offsetHeight + "px";
      this.consoleButtonText = "Close Console";
      this.isConsoleOpen = true;
    } else {
      chapConsole.classList.add("toggleConsole");
      chapConsole.style.display = "none";
      consoleBtns.style.position = "absolute";
      consoleBtns.style.right = "5px";
      consoleBtns.style.bottom = "5px";
      this.consoleButtonText = "Open Console";
      this.isConsoleOpen = false;
    }
  }

  public clearConsole() {
    let consoleCHAP = document.getElementById("console") as HTMLDivElement;
    consoleCHAP.innerHTML = "";
  }

  async clearWorkspaceAlert(newProject: boolean) {
    const alert = await this.alertC.create({
      cssClass: '',
      header: 'Clear Workspace...',
      message: 'Are you sure?',
      buttons: [
        {
          text: 'Yes',
          cssClass: 'danger',
          handler: () => {
            this.clearWorkspace(newProject);
          }
        },
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => { }
        }
      ]
    });
    await alert.present();
  }

  public clearWorkspace(clearProjectName: boolean) {
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

    workspace.innerHTML = "";
    workspace.appendChild(startSym);
    workspace.appendChild(arrowInit);
    workspace.appendChild(stopSym);
    // workspace.appendChild(symbolsList);
    this.loopBlockState.initialize();
    this.flowchart = new Flowchart(this.alertC, this.loopBlockState);
    this.paste_sym_buffer = [];

    if (clearProjectName) {
      let fileN = document.getElementById("fileName") as HTMLInputElement;
      fileN.value = "";
    }

  }

  public newProject() {
    this.clearWorkspaceAlert(true);
  }

  async openProjectOptions() {
    this.menu.close();
    let buttons = [];
    if (this.auth.mode == 'trial' || this.auth.mode == 'offline') {
      buttons = [
        {
          text: "Internal Storage",
          icon: "folder-open",
          handler: () => {
            this.openProject();
          },
        },
        {
          text: "Cancel",
          icon: "close",
          role: "cancel",
          handler: () => { }
        }
      ];
    } else {
      buttons = [
        {
          text: "Internal Storage",
          icon: "folder-open",
          handler: () => {
            this.openProject();
          },
        },
        {
          text: "Database",
          icon: "cloud-outline",
          handler: () => {
            this.checkInternetConnection();
            this.openProjectFromDatabase();
          },
        },
        {
          text: "Cancel",
          icon: "close",
          role: "cancel",
          handler: () => { }
        }
      ];
    }
    // Open Project From...
    const actionSheet = await this.arrowsOptionsAS.create({
      header: "Open Project From...",
      buttons: buttons
    });
    await actionSheet.present();
  }

  async openProject() {
    const modal = await this.modalC.create({
      component: OpenProjectPage,
      componentProps: { openFrom: "internal" },
    });
    modal.onDidDismiss().then((data) => {
      if (data.data != undefined) {
        let chapFileName = data.data.name.replace(".chap", "");
        this.loadProject(chapFileName, data.data.data);
      }
    });
    await modal.present();
  }

  async openProjectFromDatabase() {
    // Check if it is in Offline Mode
    if (this.auth.mode == "offline") {
      let alert = await this.alertC.create({
        header: "Offline Mode",
        message: "Please turn on your internet connection to use CHAP online.",
        buttons: [
          {
            text: "Go Online",
            handler: () => {
              //this.auth.mode = 'online';
              this.navCtrl.navigateRoot("/login");
            },
          },
          {
            text: "Close",
            role: "cancel",
            handler: () => { },
          },
        ],
      });
      alert.present();
    } else if (this.auth.isLoggedIn) {
      const modal = await this.modalC.create({
        component: OpenProjectPage,
        componentProps: {
          openFrom: "online",
          userID: this.auth.sessionToken.session.user_id,
        },
      });
      modal.onDidDismiss().then((data) => {
        if (data.data != undefined) {
          let chapFileName = data.data.name.replace(".chap", "");
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
            text: "Login",
            handler: () => {
              //this.auth.mode = 'online';
              this.navCtrl.navigateRoot("/login");
            },
          },
          {
            text: "Use Offline Mode",
            role: "cancel",
            handler: () => { },
          },
        ],
      });
      alert.present();
    }
  }

  public loadProject(chapFileName, fileData: string) {
    this.clearWorkspace(true);
    let dataSyms, arrowT, els, p, tlb, flb;
    console.log(fileData);
    dataSyms = JSON.parse(fileData);
    console.log("symbols data", dataSyms);

    for (let i = 0; i < dataSyms.length; i++) {
      let sym: any;
      switch (dataSyms[i].id) {
        case "s_declare":
          sym = new Declare();
          sym.createDeclareSymbol(dataSyms[i]);
          arrowT = document.getElementsByClassName("arrow dropzone");
          arrowT[i].classList.add("active-arrow");
          this.addSymbol(sym.id);
          els = document.getElementById("workspace").getElementsByClassName("symbol");
          p = i + 1;
          els[p].innerHTML = sym.getDeclareExpression();
          break;
        case "s_input":
          sym = new Input();
          sym.createInputSymbol(dataSyms[i]);
          arrowT = document.getElementsByClassName("arrow dropzone");
          arrowT[i].classList.add("active-arrow");
          this.addSymbol(sym.id);
          els = document.getElementById("workspace").getElementsByClassName("symbol");
          p = i + 1;
          els[p].innerHTML = sym.getInputExpression();
          break;
        case "s_output":
          sym = new Output();
          sym.createOutputSymbol(dataSyms[i]);
          arrowT = document.getElementsByClassName("arrow dropzone");
          arrowT[i].classList.add("active-arrow");
          this.addSymbol(sym.id);
          els = document.getElementById("workspace").getElementsByClassName("symbol");
          p = i + 1;
          let tempX = sym.getOutputExpression().replace(/`/g, '"');
          sym.setOutputExpression(tempX);
          els[p].innerHTML = sym.getOutputExpression();
          break;
        case "s_process":
          sym = new Process();
          sym.createProcessSymbol(dataSyms[i]);
          arrowT = document.getElementsByClassName("arrow dropzone");
          arrowT[i].classList.add("active-arrow");
          this.addSymbol(sym.id);
          els = document.getElementById("workspace").getElementsByClassName("symbol");
          p = i + 1;
          els[p].innerHTML = sym.getProcessExpression();
          break;
        case "s_comment":
          sym = new Comment();
          sym.createCommentSymbol(dataSyms[i]);
          arrowT = document.getElementsByClassName("arrow dropzone");
          arrowT[i].classList.add("active-arrow");
          this.addSymbol(sym.id);
          els = document.getElementById("workspace").getElementsByClassName("symbol");
          p = i + 1;
          els[p].innerHTML = sym.getCommentExpression();
          break;
        case "s_if_case":
          sym = new IfCase();
          sym.createIfCaseSymbol(dataSyms[i]);
          arrowT = document.getElementsByClassName("arrow dropzone");
          arrowT[i].classList.add("active-arrow");
          this.addSymbol(sym.id);
          els = document.getElementById("workspace").getElementsByClassName("symbol");
          p = i + 1;
          els[p].innerHTML = sym.getIfStatement();
          tlb = els[p].parentElement.querySelector("#ifTrueBlock");
          this.loadLoopSymbols(sym.trueBlockSymbols, tlb);
          flb = els[p].parentElement.querySelector("#ifFalseBlock");
          this.loadLoopSymbols(sym.falseBlockSymbols, flb);
          break;
        case "s_for_loop":
          sym = new ForLoop();
          sym.createForLoopSymbol(dataSyms[i]);
          arrowT = document.getElementsByClassName("arrow dropzone");
          arrowT[i].classList.add("active-arrow");
          this.addSymbol(sym.id);
          els = document.getElementById("workspace").getElementsByClassName("symbol");
          p = i + 1;
          els[p].innerHTML = sym.getForExpression();
          tlb = els[p].parentElement.querySelector("#forTrueBlock");
          this.loadLoopSymbols(sym.trueLoopBlock, tlb);
          break;
        case "s_while_loop":
          sym = new WhileLoop();
          sym.createWhileLoopSymbol(dataSyms[i]);
          arrowT = document.getElementsByClassName("arrow dropzone");
          arrowT[i].classList.add("active-arrow");
          this.addSymbol(sym.id);
          els = document.getElementById("workspace").getElementsByClassName("symbol");
          p = i + 1;
          els[p].innerHTML = sym.getWhileExpression();
          tlb = els[p].parentElement.querySelector("#whileTrueBlock");
          this.loadLoopSymbols(sym.trueLoopBlock, tlb);
          break;
        case "s_do_while_loop":
          sym = new DoWhileLoop();
          sym.createDoWhileLoopSymbol(dataSyms[i]);
          arrowT = document.getElementsByClassName("arrow dropzone");
          arrowT[i].classList.add("active-arrow");
          this.addSymbol(sym.id);
          els = document.getElementById("workspace").getElementsByClassName("symbol");
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
    let fName = document.getElementById("fileName") as HTMLInputElement;
    fName.value = this.fileName;
    this.toggleSymbolsFAB();

    this.toast
      .show(
        '"' + chapFileName + '.chap" has successfully opened.',
        "3000",
        "bottom"
      )
      .subscribe((toast) => {
        console.log(toast);
      });
  }

  public loadLoopSymbols(dataSyms, loopBlock) {
    let arrowT, els, tlb, flb;

    for (let i = 0; i < dataSyms.length; i++) {
      let sym: any;
      switch (dataSyms[i].id) {
        case "s_declare":
          sym = new Declare();
          sym.createDeclareSymbol(dataSyms[i]);
          arrowT = loopBlock.getElementsByClassName("arrow dropzone");
          arrowT[i].classList.add("active-arrow");
          this.addSymbol(sym.id);
          els = loopBlock.getElementsByClassName("symbol");
          els[i].innerHTML = sym.getDeclareExpression();
          break;
        case "s_input":
          sym = new Input();
          sym.createInputSymbol(dataSyms[i]);
          arrowT = loopBlock.getElementsByClassName("arrow dropzone");
          arrowT[i].classList.add("active-arrow");
          this.addSymbol(sym.id);
          els = loopBlock.getElementsByClassName("symbol");
          els[i].innerHTML = sym.getInputExpression();
          break;
        case "s_output":
          sym = new Output();
          sym.createOutputSymbol(dataSyms[i]);
          arrowT = loopBlock.getElementsByClassName("arrow dropzone");
          arrowT[i].classList.add("active-arrow");
          this.addSymbol(sym.id);
          els = loopBlock.getElementsByClassName("symbol");
          let tempX = sym.getOutputExpression().replace(/`/g, '"');
          sym.setOutputExpression(tempX);
          els[i].innerHTML = sym.getOutputExpression();
          break;
        case "s_process":
          sym = new Process();
          sym.createProcessSymbol(dataSyms[i]);
          arrowT = loopBlock.getElementsByClassName("arrow dropzone");
          arrowT[i].classList.add("active-arrow");
          this.addSymbol(sym.id);
          els = loopBlock.getElementsByClassName("symbol");
          els[i].innerHTML = sym.getProcessExpression();
          break;
        case "s_comment":
          sym = new Comment();
          sym.createCommentSymbol(dataSyms[i]);
          arrowT = loopBlock.getElementsByClassName("arrow dropzone");
          arrowT[i].classList.add("active-arrow");
          this.addSymbol(sym.id);
          els = loopBlock.getElementsByClassName("symbol");
          els[i].innerHTML = sym.getCommentExpression();
          break;
        case "s_if_case":
          sym = new IfCase();
          sym.createIfCaseSymbol(dataSyms[i]);
          arrowT = loopBlock.getElementsByClassName("arrow dropzone");
          arrowT[i].classList.add("active-arrow");
          this.addSymbol(sym.id);
          els = loopBlock.getElementsByClassName("symbol");
          els[i].innerHTML = sym.getIfStatement();
          tlb = els[i].parentElement.querySelector("#ifTrueBlock");
          this.loadLoopSymbols(sym.trueBlockSymbols, tlb);
          flb = els[i].parentElement.querySelector("#ifFalseBlock");
          this.loadLoopSymbols(sym.falseBlockSymbols, flb);
          break;
        case "s_for_loop":
          sym = new ForLoop();
          sym.createForLoopSymbol(dataSyms[i]);
          arrowT = loopBlock.getElementsByClassName("arrow dropzone");
          arrowT[i].classList.add("active-arrow");
          this.addSymbol(sym.id);
          els = loopBlock.getElementsByClassName("symbol");
          els[i].innerHTML = sym.getForExpression();
          tlb = els[i].parentElement.querySelector("#forTrueBlock");
          this.loadLoopSymbols(sym.trueLoopBlock, tlb);
          break;
        case "s_while_loop":
          sym = new WhileLoop();
          sym.createWhileLoopSymbol(dataSyms[i]);
          arrowT = loopBlock.getElementsByClassName("arrow dropzone");
          arrowT[i].classList.add("active-arrow");
          this.addSymbol(sym.id);
          els = loopBlock.getElementsByClassName("symbol");
          els[i].innerHTML = sym.getWhileExpression();
          tlb = els[i].parentElement.querySelector("#whileTrueBlock");
          this.loadLoopSymbols(sym.trueLoopBlock, tlb);
          break;
        case "s_do_while_loop":
          sym = new DoWhileLoop();
          sym.createDoWhileLoopSymbol(dataSyms[i]);
          arrowT = loopBlock.getElementsByClassName("arrow dropzone");
          arrowT[i].classList.add("active-arrow");
          this.addSymbol(sym.id);
          els = loopBlock.getElementsByClassName("symbol");
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
    let buttons = [];
    if (this.auth.mode == 'trial' || this.auth.mode == 'offline') {
      buttons = [
        {
          text: "Internal Storage",
          icon: "folder",
          handler: () => {
            this.saver.saveProject(this.fileName, this.flowchart, this.platform);
          },
        },
        {
          text: "Cancel",
          icon: "close",
          role: "cancel",
          handler: () => { },
        },
      ];
    } else {
      buttons = [
        {
          text: "Internal Storage",
          icon: "folder",
          handler: () => {
            this.saver.saveProject(this.fileName, this.flowchart, this.platform);
          },
        },
        {
          text: "Database",
          icon: "cloud-upload",
          handler: () => {
            this.checkInternetConnection();
            this.saver.saveProjectToDatabase(this.fileName, this.flowchart, this.platform);
          },
        },
        {
          text: "Cancel",
          icon: "close",
          role: "cancel",
          handler: () => { },
        },
      ];
    }
    // Open Project From...
    const actionSheet = await this.arrowsOptionsAS.create({
      header: "Save Project to...",
      buttons: buttons
    });
    await actionSheet.present();
  }

  public debugProgram() {
    this.menu.close();
    this.clearConsole();
    if (this.isConsoleOpen == false) {
      this.toggleConsole();
    }
    this.loopBlockState.initialize();
    this.flowchart.isProgramRunning = true;
    this.flowchart.validateFlowchart(0, this.flowchart.SYMBOLS.length, null);
  }

  public generatePseudoCode() {
    this.openCodeViewer(this.flowchart);
    this.menu.close();
  }

  async openCodeViewer(flowchart) {
    let isTrialVersion: boolean;
    if (this.auth.mode == 'trial')
      isTrialVersion = true;
    else
      isTrialVersion = false;

    const modal = await this.modalC.create({
      component: CodeViewerPage,
      componentProps: { flowchart: flowchart, isTrialVersion: isTrialVersion },
    });
    modal.onDidDismiss().then((data) => {
      let fc = data.data as Flowchart;
    });
    await modal.present();
  }

  async openAboutPage() {
    this.menu.close();
    const modal = await this.modalC.create({
      component: AboutPage,
    });
    await modal.present();
  }

  async openTutorialPage() {
    this.menu.close();
    const modal = await this.modalC.create({
      component: TutorialPage,
    });
    await modal.present();
  }

  public printFlowchart() {
    this.closeMenu();

    html2canvas(document.body).then((canvas) => {
      // canvas.style.width = '500px';
      // canvas.style.height = '500px';
      // canvas.style.display = 'block';
      // document.body.appendChild(canvas);
      // canvas.appendChild(document.getElementById("workspace"));

      var image = canvas.toDataURL("image/png");
      //.replace('image/png', 'image/octet-stream');
      console.log(image);
      // window.location.href = image;
      // window.open('', image);

      // this.saveAsImageFile(image, 'fileName');
    });
  }

  async logOut() {
    this.checkInternetConnection();
    // Check if it is in Offline Mode
    if (this.auth.mode == "offline") {
      let alert = await this.alertC.create({
        header: "Offline Mode",
        message: "Please turn on your internet connection to use CHAP online.",
        buttons: [
          {
            text: "Go Online",
            handler: () => {
              //this.auth.mode = 'online';
              this.navCtrl.navigateRoot("/welcome");
            },
          },
          {
            text: "Close",
            role: "cancel",
            handler: () => { },
          },
        ],
      });
      alert.present();
    } else {
      let alert = await this.alertC.create({
        header: "Log Out",
        message: "Are you sure you want to log out?",
        buttons: [
          {
            text: "Yes",
            handler: () => {
              console.log("Log Out");
              var headers = new HttpHeaders();
              headers.append("Accept", "application/json");
              headers.append("Content-Type", "application/json");

              console.log(this.auth.sessionToken.session);
              this.http.post("http://www.chapprogramming.com/logout.php", this.auth.sessionToken.session, {})
              // this.http.post("http://www.chapchap.ga/logout.php", this.auth.sessionToken.session, {})
                //this.http.post('https://chapweb.000webhostapp.com/logout.php', data, {})
                //this.http.post('http://localhost:80/chap_2/logout.php', data, {})
                .map((res: any) => res)
                .subscribe(async (res) => {
                  console.log(res);

                  if (res.message == "Log Out") {
                    this.closeMenu();
                    this.navCtrl.navigateRoot("/welcome");
                  } else {
                    let alert = await this.alertC.create({
                      header: "ERROR",
                      message: res.message,
                      buttons: ["OK"],
                    });
                    alert.present();
                  }
                });
            },
          },
          {
            text: "No",
            role: "cancel",
            handler: () => {
              console.log("Cancel");
            },
          },
        ],
      });
      alert.present();
    }
  }

  async checkInternetConnection() {
    if (!navigator.onLine) {
      this.auth.mode = "offline";
    } else {
      this.auth.mode = "online";
    }
  }

  async openFeedback() {
    this.closeMenu();

    const modal = await this.modalC.create({
      component: FeedbackPage,
      componentProps: {
        userID: this.auth.sessionToken.session.user_id,
      },
    });

    modal.onDidDismiss().then((data) => { });
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
