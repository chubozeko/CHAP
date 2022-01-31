import { File, FileReader } from "@ionic-native/file/ngx";
import { ExerciseData } from "./exercise-data";

export class ExerciseReader {

  exData = ExerciseData;
  
  constructor(private file: File) {
    this.file = new File();
  }

  loadExercises() {
    this.exData.forEach(ex => {
      ex.solutionFlowchart = this.loadExerciseSolutionFromFile(ex.filename);
      console.log('^^^ loading exercise: ', ex);
    });
    return this.exData;
  }

  loadExerciseSolutionFromFile(exerciseFile: string) {
    let fileDir = ".../assets/exercises/";
    // console.log('fileDir = ')
    this.file.checkFile(fileDir, exerciseFile + '.chap')
      .then(result => {
        console.log('file found: ', result);
        this.file.readAsText(fileDir, exerciseFile + '.chap')
        .then(data => {
          let fileData = JSON.parse(data);
          console.log('fileData = ', fileData);
          return fileData;
        })
        .catch(err => console.error(`ERROR reading file ${exerciseFile}. \n${err}`));
      })
      .catch(err => console.error(`ERROR finding file ${exerciseFile}. \n${err}`));
    
    return [];
  }

}