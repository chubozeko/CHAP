"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var angular_1 = require("@ionic/angular");
var symbol_list_1 = require("../symbol-list"); // importing the symbol array from symbol-list.ts
//import { HomePage } from "../home/home.page";
var DialogSymbolsPage = /** @class */ (function () {
    function DialogSymbolsPage(navCtrl, navParams, modal) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.modal = modal;
        this.symbols = symbol_list_1.SYMBOLS;
        this.workspace = document.getElementById("workspace");
    }
    DialogSymbolsPage.prototype.ngOnInit = function () { };
    // // Open Symbols Palette
    // public async openModal(event){
    //   let t = event.target || event.srcElement || event.currentTarget;
    //   const myModal = await this.modal.create({
    //     component: DialogSymbolsPage
    //   });
    //   // Make current Branch ACTIVE
    //   t.classList.add('active-branch');
    //   // Display Symbols Palette
    //   await myModal.present();
    // }
    DialogSymbolsPage.prototype.closeModal = function (event) {
        //this.workspace.addEventListener('click', (e) => EditorDirective.prototype.checkForNewBranches(e) );
        //this.newSymbol = this.navParams.get("newSymbol");
        var branches = document.getElementsByClassName("branch-link dropzone active-branch");
        for (var i = 0; i < branches.length; i++) {
            branches[i].classList.remove('active-branch');
        }
        //console.log(this.newSymbol);
        this.modal.dismiss();
    };
    DialogSymbolsPage.prototype.addSymbol = function (id, event) {
        var flowchart = document.getElementById("workspace");
        var temp = document.getElementById(id);
        var symbol = temp.cloneNode(true);
        var branches = document.getElementsByClassName("branch-link dropzone active-branch");
        var branch = branches[0].cloneNode(true);
        this.navParams.data = { newSymbol: symbol, newBranch: branch };
        console.log(this.navParams.get("newSymbol"));
        //let flowchart = document.getElementById("workspace");
        var tempSym = this.navParams.get("newSymbol");
        var tempBranch = this.navParams.get("newBranch");
        flowchart.insertBefore(tempSym, branches[0].nextSibling);
        flowchart.insertBefore(tempBranch, document.getElementById(id).nextSibling);
        // branches = document.getElementsByClassName("branch-link dropzone active-branch");
        // for(let i=0; i<branches.length; i++){
        //   // branches[i].addEventListener('click', (e) => this.openModal(e) );
        //   // checkForNewBranches();
        //   branches[i].classList.remove('active-branch');
        // }
        this.closeModal(event);
        //flowchart.innerText = tempSym;
    };
    DialogSymbolsPage = __decorate([
        core_1.Component({
            selector: 'app-dialog-symbols',
            templateUrl: './dialog-symbols.page.html',
            styleUrls: ['./dialog-symbols.page.scss'],
        }),
        __metadata("design:paramtypes", [angular_1.NavController, angular_1.NavParams, angular_1.ModalController])
    ], DialogSymbolsPage);
    return DialogSymbolsPage;
}());
exports.DialogSymbolsPage = DialogSymbolsPage;
//# sourceMappingURL=dialog-symbols.page.js.map