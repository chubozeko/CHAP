import { ModalController, AlertController, NavController, Platform } from "@ionic/angular";
// import { File } from "@ionic-native/file/ngx";
import { Toast } from "@ionic-native/toast/ngx";
import { AuthService } from "../auth.service";
// import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Flowchart } from "../classes/Flowchart";
import { Comment } from "../classes/Comment";
import { Declare } from "../classes/Declare";
import { DoWhileLoop } from "../classes/DoWhileLoop";
import { ForLoop } from "../classes/ForLoop";
import { IfCase } from "../classes/IfCase";
import { Input } from "../classes/Input";
import { Output } from "../classes/Output";
import { Process } from "../classes/Process";
import { WhileLoop } from "../classes/WhileLoop";
import { OpenProjectPage } from "../open-project/open-project.page";
import { HomePage } from "./home.page";


export class Opener {

  constructor(
    public alertC: AlertController,
    public navCtrl: NavController,
    private auth: AuthService,
    public modalC: ModalController,
    public toast: Toast,
  ) {}


  async openProject(flowchart: Flowchart) {
    const modal = await this.modalC.create({
      component: OpenProjectPage,
      componentProps: { openFrom: "internal" },
    });
    modal.onDidDismiss().then((data) => {
      if (data.data != undefined) {
        let chapFileName = data.data.name.replace(".chap", "");
        this.loadProject(chapFileName, data.data.data, flowchart);
      }
    });
    await modal.present();
  }

  async openProjectFromDatabase(flowchart: Flowchart) {
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
          this.loadProject(chapFileName, data.data.data, flowchart);
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

  public loadProject(chapFileName, fileData: string, flowchart: Flowchart) {
    // HomePage.prototype.clearWorkspace(true);
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
          HomePage.prototype.addSymbol(sym.id);
          els = document.getElementById("workspace").getElementsByClassName("symbol");
          p = i + 1;
          els[p].innerHTML = sym.getDeclareExpression();
          break;
        case "s_input":
          sym = new Input();
          sym.createInputSymbol(dataSyms[i]);
          arrowT = document.getElementsByClassName("arrow dropzone");
          arrowT[i].classList.add("active-arrow");
          HomePage.prototype.addSymbol(sym.id);
          els = document.getElementById("workspace").getElementsByClassName("symbol");
          p = i + 1;
          els[p].innerHTML = sym.getInputExpression();
          break;
        case "s_output":
          sym = new Output();
          sym.createOutputSymbol(dataSyms[i]);
          arrowT = document.getElementsByClassName("arrow dropzone");
          arrowT[i].classList.add("active-arrow");
          HomePage.prototype.addSymbol(sym.id);
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
          HomePage.prototype.addSymbol(sym.id);
          els = document.getElementById("workspace").getElementsByClassName("symbol");
          p = i + 1;
          els[p].innerHTML = sym.getProcessExpression();
          break;
        case "s_comment":
          sym = new Comment();
          sym.createCommentSymbol(dataSyms[i]);
          arrowT = document.getElementsByClassName("arrow dropzone");
          arrowT[i].classList.add("active-arrow");
          HomePage.prototype.addSymbol(sym.id);
          els = document.getElementById("workspace").getElementsByClassName("symbol");
          p = i + 1;
          els[p].innerHTML = sym.getCommentExpression();
          break;
        case "s_if_case":
          sym = new IfCase();
          sym.createIfCaseSymbol(dataSyms[i]);
          arrowT = document.getElementsByClassName("arrow dropzone");
          arrowT[i].classList.add("active-arrow");
          HomePage.prototype.addSymbol(sym.id);
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
          HomePage.prototype.addSymbol(sym.id);
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
          HomePage.prototype.addSymbol(sym.id);
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
          HomePage.prototype.addSymbol(sym.id);
          els = document.getElementById("workspace").getElementsByClassName("symbol");
          p = i + 1;
          els[p].innerHTML = sym.getDoWhileExpression();
          tlb = els[p].parentElement.querySelector("#doWhileTrueBlock");
          this.loadLoopSymbols(sym.trueLoopBlock, tlb);
          break;
        default:
          break;
      }
      flowchart.SYMBOLS.splice(i, 1, sym);
    }
    let fileName = chapFileName;
    let fName = document.getElementById("fileName") as HTMLInputElement;
    fName.value = fileName;
    HomePage.prototype.toggleSymbolsFAB();

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
          HomePage.prototype.addSymbol(sym.id);
          els = loopBlock.getElementsByClassName("symbol");
          els[i].innerHTML = sym.getDeclareExpression();
          break;
        case "s_input":
          sym = new Input();
          sym.createInputSymbol(dataSyms[i]);
          arrowT = loopBlock.getElementsByClassName("arrow dropzone");
          arrowT[i].classList.add("active-arrow");
          HomePage.prototype.addSymbol(sym.id);
          els = loopBlock.getElementsByClassName("symbol");
          els[i].innerHTML = sym.getInputExpression();
          break;
        case "s_output":
          sym = new Output();
          sym.createOutputSymbol(dataSyms[i]);
          arrowT = loopBlock.getElementsByClassName("arrow dropzone");
          arrowT[i].classList.add("active-arrow");
          HomePage.prototype.addSymbol(sym.id);
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
          HomePage.prototype.addSymbol(sym.id);
          els = loopBlock.getElementsByClassName("symbol");
          els[i].innerHTML = sym.getProcessExpression();
          break;
        case "s_comment":
          sym = new Comment();
          sym.createCommentSymbol(dataSyms[i]);
          arrowT = loopBlock.getElementsByClassName("arrow dropzone");
          arrowT[i].classList.add("active-arrow");
          HomePage.prototype.addSymbol(sym.id);
          els = loopBlock.getElementsByClassName("symbol");
          els[i].innerHTML = sym.getCommentExpression();
          break;
        case "s_if_case":
          sym = new IfCase();
          sym.createIfCaseSymbol(dataSyms[i]);
          arrowT = loopBlock.getElementsByClassName("arrow dropzone");
          arrowT[i].classList.add("active-arrow");
          HomePage.prototype.addSymbol(sym.id);
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
          HomePage.prototype.addSymbol(sym.id);
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
          HomePage.prototype.addSymbol(sym.id);
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
          HomePage.prototype.addSymbol(sym.id);
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
}