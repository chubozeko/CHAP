import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-about',
  templateUrl: './about.page.html',
  styleUrls: ['./about.page.scss'],
})
export class AboutPage implements OnInit {

  aboutText: string = '';

  constructor(public modal: ModalController) { }

  ngOnInit() {
    this.aboutText = "CHAP is a cool flowchart creating program to help newbies understand programming concepts.";
  }

  public closeModal(){ this.modal.dismiss(); }

}
