import { Component, OnInit } from '@angular/core';
import { File } from '@ionic-native/file/ngx';
import { ModalController } from '@ionic/angular';
import { ExerciseData } from './exercise-data';
import { ExerciseReader } from './read-exercise-data';

@Component({
  selector: 'app-tutorial-q',
  templateUrl: './tutorial-q.page.html',
  styleUrls: ['./tutorial-q.page.scss'],
})
export class TutorialQPage implements OnInit {

  exercises = ExerciseData;
  exReader: ExerciseReader;

  slideOpts = {
    effect: 'flip'
  };

  constructor(public modal: ModalController, private file: File) {}

  ngOnInit() {
    // this.exReader = new ExerciseReader(this.file);
    // this.exercises = this.exReader.loadExercises();
  }

  public applyAndCloseModal(id) {
    let tutExercise = {
      title: `Exercise ${this.exercises[id].exer_id}`,
      level: this.exercises[id].level,
      description: this.exercises[id].description,
      filename: this.exercises[id].filename,
      solution: this.exercises[id].solutionFlowchart
    };
    this.modal.dismiss(tutExercise);
  }

  public closeModal() { this.modal.dismiss(); }

}
