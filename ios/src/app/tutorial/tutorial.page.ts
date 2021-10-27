import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-tutorial',
  templateUrl: './tutorial.page.html',
  styleUrls: ['./tutorial.page.scss'],
})
export class TutorialPage implements OnInit {

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

  prevSlide(){ this.slides.slidePrev(500); }
  nextSlide(){ this.slides.slideNext(500); }

  public closeModal(){ this.modal.dismiss(); }

}
