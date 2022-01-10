import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-tutorial-q',
  templateUrl: './tutorial-q.page.html',
  styleUrls: ['./tutorial-q.page.scss'],
})
export class TutorialQPage implements OnInit {

 

  slideOpts = {
    effect: 'flip'
  };

  constructor(public modal: ModalController) {
   
  }

  ngOnInit() {
    
  }

 

  public closeModal(){ this.modal.dismiss(); }

}
