import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-cover-page',
  templateUrl: './cover-page.page.html',
  styleUrls: ['./cover-page.page.scss'],
})
export class CoverPagePage implements OnInit {

  slides: HTMLIonSlidesElement;
  //toolbr: HTMLIonModalControllerElement;

  slideOpts = {
    effect: 'flip'
  };

  constructor(public modal: ModalController) {
    this.slides = document.getElementById("tutorSlides") as HTMLIonSlidesElement;
   // this.toolbr = document.getElementsByClassName('toolbr') as HTMLIonModalControllerElement;
  }

  ngOnInit() {
    this.slides = document.getElementById("tutorSlides") as HTMLIonSlidesElement;
  //  this.toolbr = document.getElementById("toolbr") as HTMLIonModalControllerElement;
  }

  prevSlide() { this.slides.slidePrev(500); }
  nextSlide() { this.slides.slideNext(500); }

  public closeModal() { this.modal.dismiss(); }


}
