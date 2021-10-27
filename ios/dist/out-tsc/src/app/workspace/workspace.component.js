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
// import 'src/assets/libraries/interact.js';
// import 'src/assets/libraries/draganddrop.js';
// import 'src/libraries/scripts/menubareditor.js';
require("libraries/scripts/drag&drop.js");
var WorkspaceComponent = /** @class */ (function () {
    function WorkspaceComponent() {
    }
    WorkspaceComponent.prototype.ngOnInit = function () {
        // this.loadScript('libraries/scripts/drag&drop.js');
        // this.loadScript('assets/libraries/draganddrop.js');
        // this.loadScript('assets/libraries/interact.js');
        this.loadScript('libraries/scripts/menubareditor.js');
    };
    WorkspaceComponent.prototype.loadScript = function (url) {
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
        core_1.Input(),
        __metadata("design:type", Object)
    ], WorkspaceComponent.prototype, "wsStyles", void 0);
    WorkspaceComponent = __decorate([
        core_1.Component({
            selector: 'app-workspace',
            templateUrl: './workspace.component.html'
        }),
        __metadata("design:paramtypes", [])
    ], WorkspaceComponent);
    return WorkspaceComponent;
}());
exports.WorkspaceComponent = WorkspaceComponent;
//# sourceMappingURL=workspace.component.js.map