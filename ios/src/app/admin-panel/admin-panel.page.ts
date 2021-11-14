import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.page.html',
  styleUrls: ['./admin-panel.page.scss'],
})
export class AdminPanelPage implements OnInit {

  constructor() { }

  ngOnInit() {
    // this.loadScript("");
    //this.loadScript("https://www.gstatic.com/charts/loader.js");

    alert('Opening ADMIN PANEL...');
  }

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
