import { Component, OnInit, Input } from '@angular/core';
// import 'src/assets/libraries/interact.js';
// import 'src/assets/libraries/draganddrop.js';
// import 'src/libraries/scripts/menubareditor.js';
//import 'libraries/scripts/drag&drop.js';

@Component({
  selector: 'app-workspace',
  templateUrl: './workspace.component.html'
})
export class WorkspaceComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    // this.loadScript('libraries/scripts/drag&drop.js');
    // this.loadScript('assets/libraries/draganddrop.js');
    // this.loadScript('assets/libraries/interact.js');
    this.loadScript('libraries/scripts/menubareditor.js');
  }

  @Input() public wsStyles;

  public loadScript(url: string) {
    const body = <HTMLDivElement> document.body;
    const script = document.createElement('script');
    script.innerHTML = '';
    script.src = url;
    script.async = false;
    script.defer = true;
    script.type = 'text/javascript';
    body.appendChild(script);
  }

}
