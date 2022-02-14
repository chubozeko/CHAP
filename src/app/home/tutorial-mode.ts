import { Flowchart } from "../classes/Flowchart";
import { LoopblockstateService } from "../loopblockstate.service";


export class TutorialMode {

  constructor(){}

  tutorialExercise = { title: ``, level: ``, description: ``, filename: ``, solution: [] }
  timerValue = "00:00";
  startExerciseBtnDisabled = false;

  public toggleTutorialPanel(hideSolution?: boolean) {
    let debugicon = document.getElementById("play");
    debugicon.style.display = 'none';
    let tutorialBtns = document.getElementById("tutorialBtns");
    let wrapper = document.getElementsByClassName("wrapper")[0];
    if (tutorialBtns.classList.contains("toggleTutorialP")) {
      // Close Tutorial Panel
      wrapper.classList.remove("showTutorialPanel");
      tutorialBtns.classList.remove("toggleTutorialP");
      tutorialBtns.style.display = "none";
      debugicon.style.display = 'inline';
      // let timerstop = document.getElementById("timerstop");
      // timerstop.innerHTML = "00:00";
     
    } else {
      // Open Tutorial Panel
      wrapper.classList.add("showTutorialPanel");
      tutorialBtns.classList.add("toggleTutorialP");
      tutorialBtns.style.display = "block";
      document.getElementById("tut_solutionResultsPanel").style.display = "none";
    }
  }

  public animateValue(id, start, end, duration) {
    if (start === end) return;
    var range = end + start;  // If we made "-" its start countdown
    var current = start;
    var increment = end > start ? 1 : +1;  // Here we can "-1" decrement "+1" and increment
    var stepTime = Math.abs(Math.floor(duration / range));
    var obj = document.getElementById(id);
    var timer = setInterval(() => {
      current += increment;
      obj.innerHTML = current;
      if (current == end) {
        clearInterval(timer);
      }
    }, stepTime);
  }

  public activateTimer(startTimeInMinutes: number, endTimeInMinutes: number, stepDirection: number) {
    let time = startTimeInMinutes * 60;
    let timer = setInterval(() => {
      time += stepDirection;
      let minutes = Math.floor(time / 60);
      let second = time % 60;
      this.timerValue = 
        minutes.toLocaleString('en-US', { minimumIntegerDigits: 2 }) + ':' + 
        second.toLocaleString('en-US', { minimumIntegerDigits: 2 });
      if (time == endTimeInMinutes) {
        clearInterval(timer);
      } else if (startTimeInMinutes == endTimeInMinutes) {
        clearInterval(timer);
      }
      
    }, 1000);
    
  }
  
  public startExercise() {
    this.startExerciseBtnDisabled = true;
    // Hide Solution panel
    let tutSolutionPanel = document.getElementById("tut_solutionResultsPanel");
    tutSolutionPanel.style.display = "none";
    document.getElementById("btn_tut_checkSolution").innerHTML = "Check Solution";
    // Start Timer
    
  }

  public minimizeOrMaximizeTutorialPanel() {
    let tutToolbar = document.getElementById("tut_toolbar");
    let tutExercisePanel = document.getElementById("tut_exercisePanel");
    let tutSolutionPanel = document.getElementById("tut_solutionResultsPanel");
    if (tutToolbar.classList.contains('minimized')) {
      // Maximize
      document.getElementById("tut_toolbar_maxi").style.display = "block";
      document.getElementById("tut_toolbar_mini").style.display = "none";
      tutExercisePanel.style.display = "block";
      tutSolutionPanel.style.display = "none";
      document.getElementById("btn_tut_checkSolution").innerHTML = "Check Solution";
      tutToolbar.classList.remove("minimized");
    } else {
      // Minimize
      document.getElementById("tut_toolbar_maxi").style.display = "none";
      document.getElementById("tut_toolbar_mini").style.display = "block";
      tutExercisePanel.style.display = "none";
      tutSolutionPanel.style.display = "none";
      tutToolbar.classList.add("minimized");
    }
    
  }

  public checkTutorialSolution(flowchart: Flowchart, loopBlockState: LoopblockstateService, showSolution?: boolean) { 
    let tutToolbar = document.getElementById("tut_toolbar");
    let tutExercisePanel = document.getElementById("tut_exercisePanel");
    let btnCheckSolution = document.getElementById("btn_tut_checkSolution");
    let tutSolutionPanel = document.getElementById("tut_solutionResultsPanel");

    if (tutSolutionPanel.style.display == "none" || showSolution) {
      // TODO: compare the solutions
      if (this.tutorialExercise.title == "Exercise 1") {
        this.checkExercise1(flowchart, loopBlockState);
        this.activateTimer(0, 0, 0);
      } else if (this.tutorialExercise.title == "Exercise 2") {
        this.checkExercise2(flowchart, loopBlockState);
      } else if (this.tutorialExercise.title == "Exercise 3") {
        this.checkExercise3(flowchart, loopBlockState);
      } else if (this.tutorialExercise.title == "Exercise 4") {
        this.checkExercise4(flowchart, loopBlockState);
      } else if (this.tutorialExercise.title == "Exercise 5") {
        this.checkExercise5(flowchart, loopBlockState);
      } else {
        console.error("Exercise Selection ERROR! Please contact Developers.");
      }
      // Show Solution panel
      tutSolutionPanel.style.display = "block";
      btnCheckSolution.innerHTML = "Hide Solution";
      if (tutToolbar.classList.contains('minimized')) {
        tutExercisePanel.style.display = "block";
        // Show Maximized toolbar buttons
        document.getElementById("tut_toolbar_maxi").style.display = "block";
        document.getElementById("tut_toolbar_mini").style.display = "none";
        tutToolbar.classList.remove("minimized");
      }
    } else {
      // Hide Solution panel
      tutSolutionPanel.style.display = "none";
      btnCheckSolution.innerHTML = "Check Solution";
     
      if (tutExercisePanel.style.display == "block") {
        // Show Maximized toolbar buttons
        document.getElementById("tut_toolbar_maxi").style.display = "block";
        document.getElementById("tut_toolbar_mini").style.display = "none";
        tutToolbar.classList.remove("minimized");
      } else {
        // Show Minimized toolbar buttons
        document.getElementById("tut_toolbar_maxi").style.display = "none";
        document.getElementById("tut_toolbar_mini").style.display = "block";
        tutToolbar.classList.add("minimized");
      }
      
    }
  }

  /* Tutorial Exercise Functions Start */
  private checkExercise1(flowchart: Flowchart, loopBlockState: LoopblockstateService) {
    let result = document.getElementById("result");
    let symbolType = document.getElementById("symbolType");
    let symbolIndex = document.getElementById("symbolIndex");
    let errorChecker = document.getElementById("errorChecker");
    flowchart.prepareFlowchartForSaving();
    let flowchartJSON = JSON.stringify(flowchart.SYMBOLS);
    let new_checker = JSON.parse(flowchartJSON);
  
    console.log(new_checker[0].outputExp, "Test");
  
    if (new_checker[0].id == "fc_lvl_0_out_0" && new_checker[0].outputExp == '"Hello World"') {
      errorChecker.style.display = "hide";
      symbolIndex.innerHTML = "1";
      symbolType.innerHTML = "Output";
      result.innerHTML = "WELL DONE Correct Answer ✔";
      console.log("Correct");
      this.debugTutorialExerciseProgram(flowchart, loopBlockState);
    } else {
      symbolType.style.display = "none";
      symbolIndex.style.display = "none";
      result.innerHTML = "SORRY Wrong Answer ❌";
      errorChecker.innerHTML = "⚠ Please Use OUTPUT SYMBOL & Make Sure You Type Hello World❗";
      console.log("Wrong");
    }

  }

  private checkExercise2(flowchart: Flowchart, loopBlockState: LoopblockstateService) {
    let result = document.getElementById("result");
    let symbolType = document.getElementById("symbolType");
    let symbolIndex = document.getElementById("symbolIndex");
    let errorChecker = document.getElementById("errorChecker");
    let flowchartJSON;
    flowchart.prepareFlowchartForSaving();
    flowchartJSON = JSON.stringify(flowchart.SYMBOLS)   ;
    let new_checker;
    new_checker = JSON.parse(flowchartJSON);
    /*
      # Here we check the JSON STRING ELEMENT 
      1st by converting as a stringify
      2nd With JSON Parse 
      Ex:
        0: {s_id: 's_declare', id: 'fc_lvl_0_dec_0', symbolIndex: 0, parentIndex: -1, isInTrueLoopBlock: true, …}
        1: {s_id: 's_input', id: 'fc_lvl_0_inp_1', symbolIndex: 1, parentIndex: -1, isInTrueLoopBlock: true, …}
        2: {s_id: 's_input', id: 'fc_lvl_0_inp_2', symbolIndex: 2, parentIndex: -1, isInTrueLoopBlock: true, …}
        3: {s_id: 's_process', id: 'fc_lvl_0_proc_3', symbolIndex: 3, parentIndex: -1, isInTrueLoopBlock: true, …}
        4: {s_id: 's_output', id: 'fc_lvl_0_out_4', symbolInd
      3rd With using array format to specify unique keys with key words separated
        Ex: console.log(new_controller[1].id);-->Output : fc_lvl_0_inp_1
      4th Write the comparison controller
      * console.log( new_checker[1].id );
    */
 
    if (new_checker[0].id == "fc_lvl_0_dec_0") {
      if (new_checker[1].id == "fc_lvl_0_inp_1") {
        if (new_checker[2].id == "fc_lvl_0_inp_2") {
          if (new_checker[3].id == "fc_lvl_0_proc_3" && new_checker[3].expression.includes("+") == true) {
            if (new_checker[4].id == "fc_lvl_0_out_4") {
              symbolIndex.style.display = "hide";
              symbolType.innerHTML = "Declare[1]✔, Input[2]✔, Input[3]✔, Process[4]✔, Output[5]✔ ";
              result.innerHTML = "WELL DONE Correct Answer ✔";
              console.log("Correct");
              this.debugTutorialExerciseProgram(flowchart, loopBlockState);
              errorChecker.style.display = "hide";
            } else {      
              result.innerHTML = "SORRY Wrong Answer ❌";
              errorChecker.innerHTML = "⚠ Please Use OUTPUT SYMBOL[5] & Make Sure You Enter Declared Variable Name Correctly❗";
              symbolType.style.display = "none";
              symbolIndex.style.display = "none";
            }
          } else {
            result.innerHTML = "SORRY Wrong Answer ❌";
            errorChecker.innerHTML = "⚠ Please Use Process SYMBOL[4] & Make Sure You Use Declared Variable Name Correctly❗";
            symbolType.style.display = "none";
            symbolIndex.style.display = "none";
          }
        } else {
          result.innerHTML = "SORRY Wrong Answer ❌";
          errorChecker.innerHTML = "⚠ Please Use Input SYMBOL[3] & Make Sure You Use Declared Variable Name Correctly❗";
          symbolType.style.display = "none";
          symbolIndex.style.display = "none";
        }
      } else {
        result.innerHTML = "SORRY Wrong Answer ❌";
        errorChecker.innerHTML = "⚠ Please Use Input SYMBOL[2] & Make Sure You Use Declared Variable Name Correctly❗";
        symbolType.style.display = "none";
        symbolIndex.style.display = "none";
      }
    } else {
      result.innerHTML="SORRY Wrong Answer ❌";
      errorChecker.innerHTML = "⚠ Please Use Declare SYMBOL[1] to Declare Variable❗";
      symbolType.style.display = "hide";
      symbolIndex.style.display = "hide";
    }
  }

  private checkExercise3(flowchart: Flowchart, loopBlockState: LoopblockstateService) {
    let result = document.getElementById("result");
    let symbolType = document.getElementById("symbolType");
    let symbolIndex = document.getElementById("symbolIndex");
    let errorChecker = document.getElementById("errorChecker");
    flowchart.prepareFlowchartForSaving();
    let flowchartJSON = JSON.stringify(flowchart.SYMBOLS);
    let new_checker = JSON.parse(flowchartJSON);
   
    if (new_checker[0].id == "fc_lvl_0_dec_0") {
      if (new_checker[1].id == "fc_lvl_0_inp_1") {
        if (new_checker[2].id == "fc_lvl_0_if_2" && new_checker[2].ifStatement.includes("%") == true) {
          if (new_checker[2].trueBlockId == "lvl_0_if_true_2") {
            if (new_checker[2].falseBlockId == "lvl_0_if_false_2") {
              if (new_checker[2].trueBlockSymbols[0].id == "ift_2_lvl_1_out_0") {
                if (new_checker[2].falseBlockSymbols[0].id == "iff_2_lvl_1_out_0") {
                  symbolIndex.style.display = "hide";
                  symbolType.innerHTML = "Declare[1] ✔ , Input[2] ✔ , If Case[3] ✔ , Output[3.1] ✔ , Output[3.2] ✔ ";
                  result.innerHTML = "WELL DONE Correct Answer ✔ ";
                  console.log("Correct");
                  this.debugTutorialExerciseProgram(flowchart, loopBlockState);
                  errorChecker.style.display = "hide";
                } else {
                  result.innerHTML = "SORRY Wrong Answer ❌ ";
                  errorChecker.innerHTML = "⚠ Please Use Output SYMBOL[3.2]❗";
                  symbolType.style.display = "none";
                  symbolIndex.style.display = "none";
                }
              } else {
                result.innerHTML = "SORRY Wrong Answer ❌";
                errorChecker.innerHTML = "⚠ Please Use Output SYMBOL[3.1]❗";
                symbolType.style.display = "none";
                symbolIndex.style.display = "none";
              }
            } else {
              result.innerHTML = "SORRY Wrong Answer ❌";
              errorChecker.innerHTML = "⚠ Please Use Output SYMBOL[3.1]❗";
              symbolType.style.display = "none";
              symbolIndex.style.display = "none";
            }
          }
        } else {
          result.innerHTML = "SORRY Wrong Answer ❌";
          errorChecker.innerHTML = "⚠ Please Use If Case SYMBOL[3] & Make Sure You Use Declared Variable Name Correctly❗";
          symbolType.style.display = "none";
          symbolIndex.style.display = "none";
        }
      } else {
        result.innerHTML = "SORRY Wrong Answer ❌";
        errorChecker.innerHTML = "⚠ Please Use Input SYMBOL[2] & Make Sure You Use Declared Variable Name Correctly❗";
        symbolType.style.display = "none";
        symbolIndex.style.display = "none";
      }
    } else {
      result.innerHTML = "SORRY Wrong Answer ❌";
      errorChecker.innerHTML = "⚠ Please Use Declare SYMBOL[1] & Make Sure You Use Declared Variable Name ❗";
      symbolType.style.display = "none";
      symbolIndex.style.display = "none";
      console.log("Wrong");
    }
  }

  private checkExercise4(flowchart: Flowchart, loopBlockState: LoopblockstateService) {
    let result = document.getElementById("result");
    let symbolType = document.getElementById("symbolType");
    let symbolIndex = document.getElementById("symbolIndex");
    let errorChecker = document.getElementById("errorChecker");
    flowchart.prepareFlowchartForSaving();
    let flowchartJSON = JSON.stringify(flowchart.SYMBOLS);
    let new_checker = JSON.parse(flowchartJSON);
   
    if (new_checker[0].id == "fc_lvl_0_dec_0") {
      if (new_checker[1].id == "fc_lvl_0_for_1") {
        if (new_checker[1].trueBlockId == "lvl_0_for_true_1") {
          if (new_checker[1].trueLoopBlock[0].id == "fort_1_lvl_1_out_0") {
            symbolIndex.style.display = "hide";
            symbolType.innerHTML = "Declare[1] ✔ , For Loop[2] ✔ , Output[2.1] ✔ ";
            result.innerHTML="WELL DONE Correct Answer ✔";
            console.log("Correct");
            this.debugTutorialExerciseProgram(flowchart, loopBlockState);
            errorChecker.style.display = "hide";
          } else {
            symbolType.style.display = "none";
            symbolIndex.style.display = "none";
            result.innerHTML = "SORRY Wrong Answer ❌";
            errorChecker.innerHTML = " ⚠ Please Use OUTPUT SYMBOL & Make Sure You Type HELLO CHAP❗";
            console.log("Wrong");
          }
        } else {
          
        }
      } else {
        symbolType.style.display = "none";
        symbolIndex.style.display = "none";
        result.innerHTML = "SORRY Wrong Answer ❌";
        errorChecker.innerHTML = "⚠Please Use For Loop SYMBOL❗";
        console.log("Wrong");
      }
    } else {
      symbolType.style.display = "none";
      symbolIndex.style.display = "none";
      result.innerHTML = "SORRY Wrong Answer ❌";
      errorChecker.innerHTML = " ⚠ Please Use Declare SYMBOL & Make Sure You Select Correct Data Type❗";
      console.log("Wrong"); 
    }
  
  }

  private checkExercise5(flowchart: Flowchart, loopBlockState: LoopblockstateService) {
    let result = document.getElementById("result");
    let symbolType = document.getElementById("symbolType");
    let symbolIndex = document.getElementById("symbolIndex");
    let errorChecker = document.getElementById("errorChecker");
    flowchart.prepareFlowchartForSaving(); // Question Going To Be Changed
    let flowchartJSON = JSON.stringify(flowchart.SYMBOLS);
    let new_checker=JSON.parse(flowchartJSON);

    if (new_checker[0].id == "fc_lvl_0_dec_0") {
      if (new_checker[1].id == "fc_lvl_0_proc_1") {
        if (new_checker[2].id == "fc_lvl_0_whi_2") {
          if (new_checker[2].trueLoopBlock[0].id == "whit_2_lvl_1_if_0") {
            if (new_checker[2].trueLoopBlock[0].trueBlockSymbols[0].id == "ift_0_lvl_2_out_0") {
              if (new_checker[2].trueLoopBlock[1].id == "whit_2_lvl_1_proc_1") {
                result.innerHTML = "WELL DONE Correct Answer ✔";
                console.log("Correct");
                this.debugTutorialExerciseProgram(flowchart, loopBlockState);
              } else {
                console.log("Wrong");
              }
            } else {

            }
          } else {

          }
        } else {

        }
      } else {

      }
    } else {

    }

  }
  /* Tutorial Exercise Functions End */

  public debugTutorialExerciseProgram(flowchart: Flowchart, loopBlockState: LoopblockstateService) {
    // this.menu.close();
    // this.clearConsole();
    // if (this.isConsoleOpen == false) {
    //   this.toggleConsole();
    // }
    loopBlockState.initialize();
    flowchart.isProgramRunning = true;
    flowchart.isAnInputBlockRunning = false;
    flowchart.validateFlowchart(0, flowchart.SYMBOLS.length, null);
  }

}