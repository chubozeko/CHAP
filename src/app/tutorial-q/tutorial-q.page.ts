import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-tutorial-q',
  templateUrl: './tutorial-q.page.html',
  styleUrls: ['./tutorial-q.page.scss'],
})
export class TutorialQPage implements OnInit {

  slides: HTMLIonSlidesElement;

  slideOpts = {
    effect: 'flip'
  };

  constructor(public modal: ModalController) {
    this.slides = document.getElementById("tutorSlidess") as HTMLIonSlidesElement;
  }

  ngOnInit() {
    this.slides = document.getElementById("tutorSlidess") as HTMLIonSlidesElement;
  }

  prevSlide(){ this.slides.slidePrev(500); }
  nextSlide(){ this.slides.slideNext(500); }

  public closeModal(){ this.modal.dismiss(); }

}
