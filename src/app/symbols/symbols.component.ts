import { Component, OnInit } from '@angular/core';
import { SYMBOLS } from "../symbol-list"; // importing the symbol array from symbol-list.ts

@Component({
  selector: 'app-symbols',
  templateUrl: './symbols.component.html'
  // styleUrls: ['./symbols.css'],
})
export class SymbolsComponent implements OnInit {
  // Assigning 'symbols' to SYMBOLS (array) to use in [*ngFor] from "symbols.component.html" (Data Binding)
  symbols = SYMBOLS;

  constructor() { }

  ngOnInit() {
  }

  // To be able to use external JavaScript libraries with TypeScript, they must be loaded
  public loadScript(url: string) {
    const body = <HTMLDivElement>document.body;
    const script = document.createElement('script');
    script.innerHTML = '';
    script.src = url;
    script.async = false;
    script.defer = true;
    script.type = 'text/javascript';
    body.appendChild(script);
  }

}
