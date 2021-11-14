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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var symbol_list_1 = require("../symbol-list"); // importing the symbol array from symbol-list.ts
require("libraries/scripts/menubareditor.js");
require("libraries/scripts/drag&drop.js");
var angular_1 = require("@ionic/angular");
var dialog_symbols_page_1 = require("../dialog-symbols/dialog-symbols.page");
var HomePage = /** @class */ (function () {
    function HomePage(modal) {
        this.modal = modal;
        // @ViewChild(Nav) nav: Nav;
        // rootPage = "DashboardTabsPage";
        this.workspace = document.getElementById("workspace");
        this.title = 'CHAP';
        this.fileName = '';
        this.symbols = symbol_list_1.SYMBOLS;
    }
    HomePage.prototype.ngOnInit = function () {
        // Loading of external JavaScript libraries
        // this.loadScript('libraries/scripts/menubareditor.js');
        // this.loadScript('libraries/scripts/drag&drop.js');
        var _this = this;
        this.workspace = document.getElementById("workspace");
        //this.workspace.addEventListener('click', (e) => this.checkActiveBranches(e) );
        var branches = document.getElementsByClassName("branch-link dropzone");
        for (var i = 0; i < branches.length; i++) {
            branches[i].addEventListener('click', function (e) { return _this.openSymbolsFAB(e); });
        }
    };
    // Open Symbols Palette
    HomePage.prototype.openModal = function (event) {
        return __awaiter(this, void 0, void 0, function () {
            var t, myModal;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        t = event.target || event.srcElement || event.currentTarget;
                        return [4 /*yield*/, this.modal.create({
                                component: dialog_symbols_page_1.DialogSymbolsPage,
                                componentProps: {
                                    newSymbol: this.newSymbol,
                                    newBranch: document.getElementsByClassName("branch-link dropzone")
                                }
                            })];
                    case 1:
                        myModal = _a.sent();
                        // Make current Branch ACTIVE
                        t.classList.add('active-branch');
                        // Display Symbols Palette
                        return [4 /*yield*/, myModal.present()];
                    case 2:
                        // Display Symbols Palette
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    HomePage.prototype.closeModal = function (event) {
        //this.workspace.addEventListener('click', (e) => EditorDirective.prototype.checkForNewBranches(e) );
        //this.newSymbol = this.navParams.get("newSymbol");
        var branches = document.getElementsByClassName("branch-link dropzone active-branch");
        for (var i = 0; i < branches.length; i++) {
            branches[i].classList.remove('active-branch');
        }
        //console.log(nav);
        this.modal.dismiss();
    };
    HomePage.prototype.openSymbolsFAB = function (event) {
        var arrows = document.getElementsByClassName("branch-link dropzone active-branch");
        if (arrows.length < 1) {
            var t = event.target || event.srcElement || event.currentTarget;
            t.classList.add('active-branch');
            var symbolsFAB = document.getElementById("symbolsFAB");
            if (!symbolsFAB.getAttribute("activated")) {
                this.symbolsFAB.activated = true;
                //alert("symbolsFAB");
            }
        }
        else {
            alert("Already active arrow!");
        }
    };
    HomePage.prototype.addSymbol = function (id, event) {
        //let t = event.target || event.srcElement || event.currentTarget;
        //t.classList.add('active-branch');
        var _this = this;
        var flowchart = document.getElementById("workspace");
        var temp = document.getElementById(id);
        var symbol = temp.cloneNode(true);
        symbol.textContent = "";
        var branches = document.getElementsByClassName("branch-link dropzone active-branch");
        var branch = branches[0].cloneNode(true);
        branch.addEventListener('click', function (e) { return _this.openSymbolsFAB(e); });
        flowchart.insertBefore(symbol, branches[0].nextSibling);
        flowchart.insertBefore(branch, symbol.nextSibling);
        branches = document.getElementsByClassName("branch-link dropzone active-branch");
        for (var i = 0; i < branches.length; i++) {
            branches[i].classList.remove('active-branch');
        }
    };
    // zoomIn(){
    //   this.wsStyles = {
    //     'transform' : 'scale(1.5)',
    //     'transform-origin' : '0 0'
    //   };
    //   alert('whatever');
    // }
    // zoomOut(){
    //   this.wsStyles = {
    //     'transform' : 'scale(0.5)',
    //     'transform-origin' : '0 0'
    //   }
    // }
    HomePage.prototype.checkActiveBranches = function (e) {
        if (this.symbolsFAB.activated) {
            var branches = document.getElementsByClassName("branch-link dropzone active-branch");
            for (var i = branches.length - 1; i < branches.length; i++) {
                branches[i].classList.remove('active-branch');
            }
        }
    };
    // To be able to use external JavaScript libraries with TypeScript, they must be loaded
    HomePage.prototype.loadScript = function (url) {
        var body = document.body;
        var script = document.createElement('script');
        script.innerHTML = '';
        script.src = url;
        script.async = false;
        script.defer = true;
        script.type = 'text/javascript';
        body.appendChild(script);
    };
    __decorate([
        core_1.ViewChild('symbolsFAB'),
        __metadata("design:type", angular_1.Fab)
    ], HomePage.prototype, "symbolsFAB", void 0);
    HomePage = __decorate([
        core_1.Component({
            selector: 'app-home',
            templateUrl: 'home.page.html',
            styleUrls: ['home.page.scss'],
        }),
        __metadata("design:paramtypes", [angular_1.ModalController])
    ], HomePage);
    return HomePage;
}());
exports.HomePage = HomePage;
//# sourceMappingURL=home.page.js.map