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
    private auth: AuthService,
    public modalC: ModalController,
    public navCtrl: NavController,
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

  public loadProject(chapFileName, fileData: string, workspace) {
    let dataSyms;
    dataSyms = JSON.parse(fileData);
    console.log("symbols data", dataSyms);
    // this.loadSymbolsIntoBlock(dataSyms, workspace, dataSyms.length);

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

  // async loadSymbolsIntoBlock(syms, loopBlock, symCount?: number) {
  //   for (let i = 0; i < symCount; i++) {
  //     let sym: any;
  //     // console.log("... loading symbol (" + (i+1) + " of " + symCount + ") from " + loopBlock.id + " block: ", syms[i]);

  //     switch (syms[i].s_id) {
  //       case "s_declare":
  //         sym = new Declare();
  //         sym.createDeclareSymbol(syms[i]);
  //         break;
  //       case "s_input":
  //         sym = new Input();
  //         sym.createInputSymbol(syms[i]);
  //         break;
  //       case "s_output":
  //         sym = new Output();
  //         sym.createOutputSymbol(syms[i]);
  //         // let tempX = sym.getOutputExpression().replace(/`/g, '"');
  //         // sym.setOutputExpression(tempX);
  //         // els[p].innerHTML = sym.getOutputExpression();
  //         break;
  //       case "s_process":
  //         sym = new Process();
  //         sym.createProcessSymbol(syms[i]);
  //         break;
  //       case "s_comment":
  //         sym = new Comment();
  //         sym.createCommentSymbol(syms[i]);
  //         break;
  //       case "s_if_case":
  //         sym = new IfCase();
  //         sym.createIfCaseSymbol(syms[i]);
  //         break;
  //       case "s_for_loop":
  //         sym = new ForLoop();
  //         sym.createForLoopSymbol(syms[i]);
  //         break;
  //       case "s_while_loop":
  //         sym = new WhileLoop();
  //         sym.createWhileLoopSymbol(syms[i]);
  //         break;
  //       case "s_do_while_loop":
  //         sym = new DoWhileLoop();
  //         sym.createDoWhileLoopSymbol(syms[i]);
  //         break;
  //       default:
  //         break;
  //     }
  //     let arrowT = loopBlock.getElementsByClassName("arrow dropzone");
  //     arrowT[i].classList.add("active-arrow");
  //     this.addSymbol(syms[i].s_id, sym, false);
  //     let frontendSymbol = document.getElementById(syms[i].id);
  //     let backendSymbol = this.flowchart.searchForSymbolInFlowchart(syms[i].id);
  //     switch (backendSymbol.s_id) {
  //       case "s_if_case":
  //         frontendSymbol.getElementsByClassName("if_sym")[0].innerHTML = backendSymbol.getExpression();
  //         this.loadSymbolsIntoBlock(syms[i].trueBlockSymbols, frontendSymbol.getElementsByClassName("ifTrueBlock")[0], 
  //           syms[i].trueBlockSymbols.length);
  //         this.loadSymbolsIntoBlock(syms[i].falseBlockSymbols, frontendSymbol.getElementsByClassName("ifFalseBlock")[0], 
  //           syms[i].falseBlockSymbols.length);
  //         break;
  //       case "s_for_loop":
  //         frontendSymbol.getElementsByClassName("for_sym")[0].innerHTML = backendSymbol.getExpression();
  //         this.loadSymbolsIntoBlock(syms[i].trueLoopBlock, frontendSymbol.getElementsByClassName("forTrueBlock")[0], 
  //           syms[i].trueLoopBlock.length);
  //         break;
  //       case "s_while_loop":
  //         frontendSymbol.getElementsByClassName("while_sym")[0].innerHTML = backendSymbol.getExpression();
  //         this.loadSymbolsIntoBlock(syms[i].trueLoopBlock, frontendSymbol.getElementsByClassName("whileTrueBlock")[0], 
  //           syms[i].trueLoopBlock.length);
  //         break;
  //       case "s_do_while_loop":
  //         frontendSymbol.getElementsByClassName("do_while_sym")[0].innerHTML = backendSymbol.getExpression();
  //         this.loadSymbolsIntoBlock(syms[i].trueLoopBlock, frontendSymbol.getElementsByClassName("doWhileTrueBlock")[0], 
  //           syms[i].trueLoopBlock.length);
  //         break;
  //       default:
  //         frontendSymbol.innerHTML = backendSymbol.getExpression();
  //         break;
  //     }
  //   }
  // }
}