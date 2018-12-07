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
    this.aboutText = `
    CHAP is a Flowchart-creating program that allows users to interactively build and run solutions to programming problems. \n
    Users can solely concentrate on the logical structure of an algorithm, rather than the syntactic format of a typical programming language. \n
    Additionally, users can generate the corresponding Pseudo Code of their created flowcharts, along with the source code of a few conventional programming languages, such as C++. \n\n
    Developed by:
    Chubo Zeko
    Hasan Tuncel Çoban
    Penondjira Tjahuha-Kakujaha \n\n
    EPR402 - Capstone Project - 2018`;
  }

  public closeModal(){ this.modal.dismiss(); }

}
