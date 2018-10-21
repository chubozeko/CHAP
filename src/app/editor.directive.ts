import { Directive, ElementRef, HostListener } from '@angular/core';
import { ModalController } from '@ionic/angular';
// import { DialogSymbolsPage } from './dialog-symbols/dialog-symbols.page';
// import { HomePage } from './home/home.page';

@Directive({
  selector: '[appEditor]'
})
export class EditorDirective {

  constructor(element: ElementRef, public modal: ModalController) { }

  // public async openModal(event){
    
  //   const myModal = await this.modal.create({
  //     component: DialogSymbolsPage
  //   });

  //   let t = event.target || event.srcElement || event.currentTarget;
  //   t.classList.add('active-branch');
  //   //alert(t.className);

  //   this.workspace.removeEventListener( 'click', (e) => this.checkForNewBranches(e) );

  //   await myModal.present();
  // }

}
