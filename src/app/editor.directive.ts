import { Directive, ElementRef, HostListener } from '@angular/core';
import { ModalController } from '@ionic/angular';
// import { DialogSymbolsPage } from './dialog-symbols/dialog-symbols.page';

@Directive({
  selector: '[appEditor]'
})
export class EditorDirective {

  constructor(element: ElementRef, public modal: ModalController) { }

}
