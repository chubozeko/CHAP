import { Component, OnInit } from '@angular/core';
import { File } from '@ionic-native/file/ngx';
import { AlertController, ModalController, NavParams } from '@ionic/angular';
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
  isAnExerciseRunning: boolean;

  slideOpts = {
    effect: 'flip'
  };

  constructor(
    public modal: ModalController, 
    private file: File, 
    public navP: NavParams, 
    public alertC: AlertController) {
    this.isAnExerciseRunning = navP.get('isExerciseRunning') as boolean;
  }

  ngOnInit() {

    // this.exReader = new ExerciseReader(this.file);
    // this.exercises = this.exReader.loadExercises();
  }

  async applyAndCloseModal(id) {
    if (!this.isAnExerciseRunning) {
      let tutExercise = {
        title: `Exercise ${this.exercises[id].exer_id}`,
        level: this.exercises[id].level,
        description: this.exercises[id].description,
        filename: this.exercises[id].filename,
        solution: this.exercises[id].solutionFlowchart,
        xp: this.exercises[id].xp
      };
      this.modal.dismiss(tutExercise);
    } else {
      let alert = await this.alertC.create({
        header: "Tutorial Exercise Running...",
        message: "You are already running an exercise! Please complete or close your current exercise before starting a new one.",
        buttons: [{
          text: "Close",
          role: "cancel",
          handler: () => {},
        }],
      });
      alert.onDidDismiss().then(() => this.modal.dismiss());
      alert.present();
    }
    
  }

  public closeModal() { this.modal.dismiss(); }

}
