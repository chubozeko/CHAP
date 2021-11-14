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
var symbol_list_1 = require("../symbol-list"); // importing the symbol array from symbol-list.ts
// import 'src/assets/libraries/interact.js';
// import 'src/assets/libraries/draganddrop.js';
require("libraries/scripts/menubareditor.js");
require("libraries/scripts/drag&drop.js");
var SymbolsComponent = /** @class */ (function () {
    function SymbolsComponent() {
        // Assigning 'symbols' to SYMBOLS (array) to use in [*ngFor] from "symbols.component.html" (Data Binding)
        this.symbols = symbol_list_1.SYMBOLS;
    }
    SymbolsComponent.prototype.ngOnInit = function () {
        // Loading of external JavaScript libraries
        // this.loadScript('assets/libraries/interact.js');
        // this.loadScript('assets/libraries/draganddrop.js');
        // this.loadScript('libraries/scripts/drag&drop.js');
        console.log();
    };
    // To be able to use external JavaScript libraries with TypeScript, they must be loaded
    SymbolsComponent.prototype.loadScript = function (url) {
        var body = document.body;
        var script = document.createElement('script');
        script.innerHTML = '';
        script.src = url;
        script.async = false;
        script.defer = true;
        script.type = 'text/javascript';
        body.appendChild(script);
    };
    SymbolsComponent = __decorate([
        core_1.Component({
            selector: 'app-symbols',
            templateUrl: './symbols.component.html',
        }),
        __metadata("design:paramtypes", [])
    ], SymbolsComponent);
    return SymbolsComponent;
}());
exports.SymbolsComponent = SymbolsComponent;
//# sourceMappingURL=symbols.component.js.map