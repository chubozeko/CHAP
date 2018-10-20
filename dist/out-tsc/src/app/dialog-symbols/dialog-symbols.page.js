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
var DialogSymbolsPage = /** @class */ (function () {
    function DialogSymbolsPage(navCtrl, navParams, modal) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.modal = modal;
        this.symbols = symbol_list_1.SYMBOLS;
    }
    DialogSymbolsPage.prototype.ngOnInit = function () {
    };
    DialogSymbolsPage.prototype.addSymbol = function (id, text) {
        this.dismiss();
        alert('You have added a ' + text + ' symbol.');
    };
    DialogSymbolsPage.prototype.dismiss = function () {
        this.modal.dismiss();
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