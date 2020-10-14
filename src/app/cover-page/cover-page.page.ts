import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-cover-page',
  templateUrl: './cover-page.page.html',
  styleUrls: ['./cover-page.page.scss'],
})
export class CoverPagePage implements OnInit {

  slides: HTMLIonSlidesElement;

  slideOpts = {
    effect: 'flip'
  };

  constructor(public modal: ModalController) {
    this.slides = document.getElementById("tutorSlides") as HTMLIonSlidesElement;
  }

  ngOnInit() {
    this.slides = document.getElementById("tutorSlides") as HTMLIonSlidesElement;
  }

  prevSlide() { this.slides.slidePrev(500); }
  nextSlide() { this.slides.slideNext(500); }

  public closeModal() { this.modal.dismiss(); }


}
