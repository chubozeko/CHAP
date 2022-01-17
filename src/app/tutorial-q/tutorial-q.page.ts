import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-tutorial-q',
  templateUrl: './tutorial-q.page.html',
  styleUrls: ['./tutorial-q.page.scss'],
})
export class TutorialQPage implements OnInit {

  exercises = [
    {
      exer_id: 1,
      level: `Easy`,
      description: `Display "Hello World" with using OUTPUT SYMBOL on CHAP.`
    },
    {
      exer_id: 2,
      level: `Easy`,
      description: `Get two integers from user and display summation on console with using CHAP.`
    },
    {
      exer_id: 3,
      level: `Moderate`,
      description: `Get one integer number from user and check if entered number is odd or even as an output on console using CHAP.`
    },
    {
      exer_id: 4,
      level: `Moderate`,
      description: `Display 4 times "HELLO CHAP" as an output using For Loop.`
    },
    {
      exer_id: 5,
      level: `Advanced`,
      description: `Display numbers from 1 to 10 both number is included as an output using WHILE LOOP.`
    },
  ];

  slideOpts = {
    effect: 'flip'
  };

  constructor(public modal: ModalController) {
   
  }

  ngOnInit() {
    
  }

  public applyAndCloseModal(id) {
    let tutExercise = {
      title: `Exercise ${this.exercises[id].exer_id}`,
      level: this.exercises[id].level,
      description: this.exercises[id].description
    };
    this.modal.dismiss(tutExercise);
  }

  public closeModal() { this.modal.dismiss(); }

}
