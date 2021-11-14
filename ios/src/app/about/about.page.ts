import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-about',
  templateUrl: './about.page.html',
  styleUrls: ['./about.page.scss'],
})
export class AboutPage implements OnInit {

  aboutText: string = '';
  headingText: string = '';

  aboutDiv: HTMLDivElement;
  tcDiv: HTMLDivElement;
  ppDiv: HTMLDivElement;

  constructor(public modal: ModalController) { }

  ngOnInit() {
    this.viewAbout();
  }

  public viewAbout() {
    this.headingText = 'About';
    this.aboutText = `
    CHAP is a Flowchart-creating program that allows users to interactively build and run solutions to programming problems. \n
      Users can solely concentrate on the logical structure of an algorithm, rather than the syntactic format of a typical programming language. \n
      Additionally, users can generate the corresponding Pseudo Code of their created flowcharts, along with the source code of a few conventional programming languages, such as C++ and Java. \n\n
      Developed by:
      Chubo Zeko
      Hasan Tuncel Çoban \n\n
      EPR402 - Capstone Project - 2018
    `;

    this.aboutDiv = document.getElementById("about_about") as HTMLDivElement;
    this.aboutDiv.classList.remove("hide");
    this.tcDiv = document.getElementById("about_TC") as HTMLDivElement;
    this.tcDiv.classList.add("hide");
    this.ppDiv = document.getElementById("about_PP") as HTMLDivElement;
    this.ppDiv.classList.add("hide");
  }

  public viewTermsAndConditions() {
    this.headingText = 'Terms and Conditions';

    this.aboutDiv = document.getElementById("about_about") as HTMLDivElement;
    this.aboutDiv.classList.add("hide");
    this.tcDiv = document.getElementById("about_TC") as HTMLDivElement;
    this.tcDiv.classList.remove("hide");
    this.ppDiv = document.getElementById("about_PP") as HTMLDivElement;
    this.ppDiv.classList.add("hide");
  }

  public viewPrivacyPolicy() {
    this.headingText = 'Privacy Policy';

    this.aboutDiv = document.getElementById("about_about") as HTMLDivElement;
    this.aboutDiv.classList.add("hide");
    this.tcDiv = document.getElementById("about_TC") as HTMLDivElement;
    this.tcDiv.classList.add("hide");
    this.ppDiv = document.getElementById("about_PP") as HTMLDivElement;
    this.ppDiv.classList.remove("hide");
  }

  public closeModal() { this.modal.dismiss(); }

}
