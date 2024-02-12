import { File } from "@ionic-native/file/ngx";
import { Flowchart } from "../classes/Flowchart";
import { ForLoop } from "../classes/ForLoop";
import { LoopblockstateService } from "../loopblockstate.service";
import { ExerciseReader } from "../tutorial-q/read-exercise-data";


export class TutorialMode {
  exReader: ExerciseReader;
  referenceFC: Flowchart;
  tutorialExercise = { title: ``, level: ``, description: ``, filename: ``, solution: [] }
  timerValue = "00:00";
  startExerciseBtnDisabled = false;

  constructor(
    file: File
  ) {
    this.exReader = new ExerciseReader(file);
    let exData = this.exReader.loadExercises();
    // this.tutorialExercise.solution = this.exReader.loadExerciseSolutionFromFile(this.tutorialMode.tutorialExercise.filename);
  }

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
    let btnRunSolution = document.getElementById("btn_tut_runSolution");
    let tutSolutionPanel = document.getElementById("tut_solutionResultsPanel");
    let marksObtained = 0;

    if (tutSolutionPanel.style.display == "none" || showSolution) {
      if (flowchart.SYMBOLS.length > 0) {
        if (this.tutorialExercise.title == "Exercise 1") {
          marksObtained = this.checkExercise1(flowchart, loopBlockState);
          this.activateTimer(0, 0, 0);
        } else if (this.tutorialExercise.title == "Exercise 2") {
          marksObtained = this.checkExercise2(flowchart, loopBlockState);
        } else if (this.tutorialExercise.title == "Exercise 3") {
          marksObtained = this.checkExercise3(flowchart, loopBlockState);
        } else if (this.tutorialExercise.title == "Exercise 4") {
          marksObtained = this.checkExercise4(flowchart, loopBlockState);
        } else if (this.tutorialExercise.title == "Exercise 5") {
          marksObtained = this.checkExercise5(flowchart, loopBlockState);
        } else {
          console.error("Exercise Selection ERROR! Please contact Developers.");
        }
        // Show Solution panel
        tutSolutionPanel.style.display = "block";
        if (marksObtained >= 1) {
          btnRunSolution.style.display = "block";
          btnCheckSolution.style.display = "none";
          btnCheckSolution.innerHTML = "Check Solution";
        } else {
          btnRunSolution.style.display = "none";
          btnCheckSolution.style.display = "block";
          btnCheckSolution.innerHTML = "Hide Solution";
        }
        
        if (tutToolbar.classList.contains('minimized')) {
          tutExercisePanel.style.display = "block";
          // Show Maximized toolbar buttons
          document.getElementById("tut_toolbar_maxi").style.display = "block";
          document.getElementById("tut_toolbar_mini").style.display = "none";
          tutToolbar.classList.remove("minimized");
        }
        return true;
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
      btnRunSolution.style.display = "none";
      btnCheckSolution.style.display = "none";
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
    let userFCSyms = flowchart.SYMBOLS;
    let referenceFCSyms = this.referenceFC.SYMBOLS;
    let marks = 0;
    // 1. Compare Console Outputs (CO)
    let referenceCO = this.debugTutorialExerciseProgram(this.referenceFC, loopBlockState, null);
    this.clearConsole();
    let userCO = this.debugTutorialExerciseProgram(flowchart, loopBlockState, null);
    this.clearConsole();
    // console.log("userCO: ", userCO);
    // console.log("referenceCO: ", referenceCO);
    if (userCO == referenceCO) {
      marks++;
    }
    // 2. Compare Flowchart Structure
    if (userFCSyms[0].id == referenceFCSyms[0].id && userFCSyms[0].outputExp.toLowerCase().includes("hello world")) {
      marks++;
    }

    switch (marks) {
      case 2:
        result.innerHTML = `<span style="color: #10dc60">✔ CORRECT!</span> <br/> <span style="font-size: medium">🥇 Well Done! 🥇 Marks: ${marks}/2 </span>`;
        errorChecker.innerHTML = "";
        // TODO: add 100 XP points to user's account (this.tutorialExercise.xp)
      break;
      case 1:
        result.innerHTML = `<span style="color: #10dc60">✔ CORRECT!</span> <br/> <span style="font-size: medium">🥈 Good Job! 🥈 Marks: ${marks}/2 </span>`;
        errorChecker.innerHTML = `<span> ⚠ Make sure you print out \"Hello World\" (case-insensitive) in the Output symbol. </span> <br/>
          <span> ⚠ Try to use as few Symbols as possible to gain more Marks and XP points. </span>`;
        // TODO: add 50 XP points to user's account (this.tutorialExercise.xp / 2)
      break;
      case 0:
        result.innerHTML = `<span style="color: #f04141">❌ WRONG!</span> <br/> <span style="font-size: medium">🥉 Sorry, Try Again 🥉 Marks: ${marks}/2 </span>`;
        errorChecker.innerHTML = `❗ Make sure you use an Output Symbol to print out \"Hello World\".`;
        // TODO: add 10 XP points to user's account (this.tutorialExercise.xp / 10)
      break;
      default: break;
    }

    return marks;
  }

  private checkExercise2(flowchart: Flowchart, loopBlockState: LoopblockstateService) {
    let symbolType = document.getElementById("symbolType");
    let symbolIndex = document.getElementById("symbolIndex");
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
    let result = document.getElementById("result");
    let errorChecker = document.getElementById("errorChecker");
    let userFCSyms = flowchart.SYMBOLS;
    let referenceFCSyms = this.referenceFC.SYMBOLS;
    let marks = 0;
    // 1. Compare Console Outputs (CO)
    let dummyInputs = [
      { inputIndex: 0, input: 2 },
      { inputIndex: 1, input: 2 }
    ];
    this.debugTutorialExerciseProgram(this.referenceFC, loopBlockState, dummyInputs);
    let referenceCO = document.getElementById("console").innerHTML.toLowerCase().toString();
    this.clearConsole();
    this.debugTutorialExerciseProgram(flowchart, loopBlockState, dummyInputs);
    let userCO = document.getElementById("console").innerHTML.toLowerCase();
    this.clearConsole();
    // console.log("userCO: ", userCO);
    // console.log("referenceCO: ", referenceCO);
    if (userCO == referenceCO && userCO != '') {
      marks++;
    }
    // 2. Compare Flowchart Structure
    if (userFCSyms[0].id == referenceFCSyms[0].id) {
      if (userFCSyms[1].id == referenceFCSyms[1].id) {
        if (userFCSyms[2].id == referenceFCSyms[2].id) {
          if (userFCSyms[3].id == referenceFCSyms[3].id && userFCSyms[3].expression.includes("+")==true) {
            if (userFCSyms[4].id == referenceFCSyms[4].id) {
              marks++;
              errorChecker.innerHTML = `[1] Declare ✔, [2] Input ✔, [3] Input ✔, [4] Process ✔, [5] Output ✔`;
            } else {      
              result.innerHTML = "SORRY🥈 Wrong Answer ❌";
              errorChecker.innerHTML = "⚠ Please Use OUTPUT SYMBOL[5] & Make Sure You Enter Declared Variable Name Correctly❗";
              symbolType.style.display = "none";
              symbolIndex.style.display = "none";
              
            }
          } else {
            result.innerHTML = "SORRY🥈 Wrong Answer ❌";
            errorChecker.innerHTML = "⚠ Please Use Process SYMBOL[4] & Make Sure You Use Declared Variable Name Correctly❗";
            symbolType.style.display = "none";
            symbolIndex.style.display = "none";
            
          }
        } else {
          result.innerHTML = "SORRY🥉 Wrong Answer ❌";
          errorChecker.innerHTML = "⚠ Please Use Input SYMBOL[3] & Make Sure You Use Declared Variable Name Correctly❗";
          symbolType.style.display = "none";
          symbolIndex.style.display = "none";
          
        }
      } else {
        result.innerHTML = "SORRY🥉 Wrong Answer ❌";
        errorChecker.innerHTML = "⚠ Please Use Input SYMBOL[2] & Make Sure You Use Declared Variable Name Correctly❗";
        symbolType.style.display = "none";
        symbolIndex.style.display = "none";
        
      }
    } else {
      result.innerHTML="SORRY 🥉Wrong Answer ❌";
      errorChecker.innerHTML = "⚠ Please Use Declare SYMBOL[1] to Declare Variable❗";
      symbolType.style.display = "hide";
      symbolIndex.style.display = "hide";
      
    }

    return marks;
  }

  private checkExercise3(flowchart: Flowchart, loopBlockState: LoopblockstateService) {
    let result = document.getElementById("result");
    let symbolType = document.getElementById("symbolType");
    let symbolIndex = document.getElementById("symbolIndex");
    let errorChecker = document.getElementById("errorChecker");
    let userFCSyms = flowchart.SYMBOLS;
    let referenceFCSyms = this.referenceFC.SYMBOLS;
    let marks = 0;
    // 1. Compare Console Outputs (CO)
    // ** Test 1: Run program with dummyInputs: 2 -> even **
    let dummyInputs = [
      { inputIndex: 0, input: 2 }
    ];
    this.debugTutorialExerciseProgram(this.referenceFC, loopBlockState, dummyInputs);
    let referenceCO = document.getElementById("console").innerHTML.toLowerCase();
    this.clearConsole();
    this.debugTutorialExerciseProgram(flowchart, loopBlockState, dummyInputs);
    let userCO = document.getElementById("console").innerHTML.toLowerCase();
    this.clearConsole();
    // ** Test 2: Run program with dummyInputs: 3 -> odd**
    dummyInputs = [
      { inputIndex: 3, input: 3 }
    ];
    this.debugTutorialExerciseProgram(this.referenceFC, loopBlockState, dummyInputs);
    referenceCO += this.debugTutorialExerciseProgram(this.referenceFC, loopBlockState, dummyInputs);
    this.clearConsole();
    this.debugTutorialExerciseProgram(flowchart, loopBlockState, dummyInputs);
    userCO += this.debugTutorialExerciseProgram(flowchart, loopBlockState, dummyInputs);
    this.clearConsole();
    // console.log("userCO: ", userCO);
    // console.log("referenceCO: ", referenceCO);
    if (userCO == referenceCO) {
      marks++;
    }
    // 2. Compare Flowchart Structure
    if (userFCSyms[0].id == referenceFCSyms[0].id) {
      if (userFCSyms[1].id == referenceFCSyms[1].id) {
        if (userFCSyms[2].id == referenceFCSyms[2].id && userFCSyms[2].trueBlockId == referenceFCSyms[2].trueBlockId && userFCSyms[2].falseBlockId == referenceFCSyms[2].falseBlockId) {
          if (userFCSyms[2].ifStatement.includes("%") == true) {
            if (userFCSyms[2].trueBlockSymbols[0].id == referenceFCSyms[2].trueBlockSymbols[0].id && 
            (userFCSyms[2].trueBlockSymbols[0].outputExp.toLowerCase().includes("odd") || 
            userFCSyms[2].trueBlockSymbols[0].outputExp.toLowerCase().includes("even"))) {
              if (userFCSyms[2].falseBlockSymbols[0].id == referenceFCSyms[2].falseBlockSymbols[0].id && 
              (userFCSyms[2].falseBlockSymbols[0].outputExp.toLowerCase().includes("odd") || 
              userFCSyms[2].falseBlockSymbols[0].outputExp.toLowerCase().includes("even"))) {
                marks++;
                errorChecker.innerHTML = `[1] Declare ✔, [2] Input ✔, [3] If Case ✔, [3][IfCase-True][1] Output ✔, [3][IfCase-False][1] Output ✔`;
              } else {
                result.innerHTML = "SORRY🥈 Wrong Answer ❌";
                errorChecker.innerHTML = "⚠ Please Use Output SYMBOL[3.1]❗";
                symbolType.style.display = "none";
                symbolIndex.style.display = "none";
              }
            } else {
              result.innerHTML = "SORRY🥈 Wrong Answer ❌";
              errorChecker.innerHTML = "⚠ Please Use Output SYMBOL[3.1]❗";
              symbolType.style.display = "none";
              symbolIndex.style.display = "none";
            }
          }
        } else {
          result.innerHTML = "SORRY🥈 Wrong Answer ❌";
          errorChecker.innerHTML = "⚠ Please Use If Case SYMBOL[3] & Make Sure You Use Declared Variable Name Correctly❗";
          symbolType.style.display = "none";
          symbolIndex.style.display = "none";
        }
      } else {
        result.innerHTML = "SORRY🥉 Wrong Answer ❌";
        errorChecker.innerHTML = "⚠ Please Use Input SYMBOL[2] & Make Sure You Use Declared Variable Name Correctly❗";
        symbolType.style.display = "none";
        symbolIndex.style.display = "none";
      }
    } else {
      result.innerHTML = "SORRY🥉 Wrong Answer ❌";
      errorChecker.innerHTML = "⚠ Please Use Declare SYMBOL[1] & Make Sure You Use Declared Variable Name ❗";
      symbolType.style.display = "none";
      symbolIndex.style.display = "none";
      console.log("Wrong");
    }

    return marks;
  }

  private checkExercise4(flowchart: Flowchart, loopBlockState: LoopblockstateService) {
    let result = document.getElementById("result");
    let symbolType = document.getElementById("symbolType");
    let symbolIndex = document.getElementById("symbolIndex");
    let errorChecker = document.getElementById("errorChecker");
    let userFCSyms = flowchart.SYMBOLS;
    let referenceFCSyms = this.referenceFC.SYMBOLS;
    let marks = 0;
    // 1. Compare Console Outputs (CO)
   // this.debugTutorialExerciseProgram(this.referenceFC, loopBlockState, null);
    let referenceCO = document.getElementById("console").innerHTML.toLowerCase();
    this.clearConsole();
    //let referenceCO = document.getElementById("console").innerHTML.toLowerCase();
   
    let userCO = document.getElementById("console").innerHTML.toLowerCase();

   // this.clearConsole();
    // console.log("userCO: ", userCO);
    // console.log("referenceCO: ", referenceCO);
    if (userCO == referenceCO) {
      marks++;
    }
    // 2. Compare Flowchart Structure
    if (userFCSyms[0].id == referenceFCSyms[0].id) {
      if (userFCSyms[1].id == referenceFCSyms[1].id && userFCSyms[1].trueBlockId == referenceFCSyms[1].trueBlockId) {
        if (userFCSyms[1].forLoopVariable.getName() == userFCSyms[0].getVariableName()) {
          let forSymbol = userFCSyms[1] as ForLoop;
          let nrOfIterations = Math.abs((forSymbol.endValue - forSymbol.startValue) / forSymbol.stepValue);
          if (nrOfIterations == 4) {
            if (userFCSyms[1].trueLoopBlock[0].id == referenceFCSyms[1].trueLoopBlock[0].id && userFCSyms[1].trueLoopBlock[0].outputExp.toLowerCase().includes('hello chap')) {
              marks++;
              errorChecker.innerHTML = `[1] Declare ✔, [2] For Loop ✔, [2][ForLoop-True][1] Output ✔`;
            } else {
              errorChecker.innerHTML = `⚠ Please use an Output Symbol in the For Loop [2] to print out the given expression: \"HELLO CHAP\".`;
            }
          } else {
            symbolType.style.display = "none";
            symbolIndex.style.display = "none";
            result.innerHTML = "SORRY 🥈Wrong Answer ❌";
            errorChecker.innerHTML = " ⚠ Please Use OUTPUT SYMBOL[2.1] & Make Sure You Type HELLO CHAP❗";
            console.log("Wrong");
          }
        } else {
          
        }
      } else {
        symbolType.style.display = "none";
        symbolIndex.style.display = "none";
        result.innerHTML = "SORRY 🥈Wrong Answer ❌";
        errorChecker.innerHTML = "⚠Please Use For Loop[2] SYMBOL❗";
        console.log("Wrong");
      }
   /* } else {
      errorChecker.innerHTML = `⚠ Please use a Declare Symbol [1] to declare a variable that will be used in the For Loop. 
        <br/> ⚠ Make sure you use the correct Data Type.`;
    }*/
  
    switch (marks) {
      case 2:
        result.innerHTML = `<span style="color: #10dc60">✔ CORRECT!</span> <br/> <span style="font-size: medium">🥇 Well Done! 🥇 Marks: ${marks}/2 </span>`;
        // TODO: add 200 XP points to user's account (this.tutorialExercise.xp)
      break;
      case 1:
        result.innerHTML = `<span style="color: #10dc60">✔ CORRECT!</span> <br/> <span style="font-size: medium">🥈 Good Job! 🥈 Marks: ${marks}/2 </span>`;
        errorChecker.innerHTML += `<br/><span> ⚠ Try to use as few Symbols as possible to gain more Marks and XP points. </span>`;
        // TODO: add 100 XP points to user's account (this.tutorialExercise.xp / 2)
      break;
      case 0:
        result.innerHTML = `<span style="color: #f04141">❌ WRONG!</span> <br/> <span style="font-size: medium">🥉 Sorry, Try Again 🥉 Marks: ${marks}/2 </span>`;
        // TODO: add 20 XP points to user's account (this.tutorialExercise.xp / 10)
      break;
      default: break;
    }

    return marks;
  }
  }

  private checkExercise5(flowchart: Flowchart, loopBlockState: LoopblockstateService) {
    let result = document.getElementById("result");
    let symbolType = document.getElementById("symbolType");
    let symbolIndex = document.getElementById("symbolIndex");
    let errorChecker = document.getElementById("errorChecker");
    let userFCSyms = flowchart.SYMBOLS;
    let referenceFCSyms = this.referenceFC.SYMBOLS;
    let marks = 0;
    // 1. Compare Console Outputs (CO)
   // this.debugTutorialExerciseProgram(this.referenceFC, loopBlockState, null);
    let referenceCO = document.getElementById("console").innerHTML.toLowerCase();
   // this.clearConsole();
    //
    let userCO = document.getElementById("console").innerHTML.toLowerCase();
   // this.clearConsole();
    // console.log("userCO: ", userCO);
    // console.log("referenceCO: ", referenceCO);
    if (userCO == referenceCO) {
      marks++;
    }
    // 2. Compare Flowchart Structure *
    if (userFCSyms[0].id == referenceFCSyms[0].id) {//Declare
      if (userFCSyms[1].id == referenceFCSyms[1].id) {//Process
        if (userFCSyms[2].id == referenceFCSyms[2].id && 
          (userFCSyms[2].whileExpression.includes("<=10")==true || userFCSyms[2].whileExpression.includes("<11")==true) ) {//While
          if (userFCSyms[2].trueLoopBlock[0].id == referenceFCSyms[2].trueLoopBlock[0].id && userFCSyms[2].trueLoopBlock[0].ifStatement.includes("%")==true) {//if case
            if (userFCSyms[2].trueLoopBlock[0].trueBlockSymbols[0].id == referenceFCSyms[2].trueLoopBlock[0].trueBlockSymbols[0].id || 
              userFCSyms[2].trueLoopBlock[0].falseBlockSymbols[0].id == referenceFCSyms[2].trueLoopBlock[0].trueBlockSymbols[0].id) {//Output
                //console.log(userFCSyms[2].trueLoopBlock[1].id,"TEST" );
              if (userFCSyms[2].trueLoopBlock[1].id=="whit_2_lvl_1_proc_1" && //Error is here it has referenceFCSyms not match with userFCsyms REFENCE HAS MISS LOADING ISSUES
                userFCSyms[2].trueLoopBlock[1].expression.includes("+1")==true) {//Process
               
                marks++;
                errorChecker.innerHTML = "[1] Declare ✔, [2] Process ✔, [3] While Loop ✔, [3.1] If Case ✔, [3.1.0] Output ✔ , [3.2] Process ✔";
              } else {
                errorChecker.innerHTML = `❗⚠❗ Please use a Process Symbol after the If Case Symbol [3.2] to iterate the declared variable after each loop.
                <br/> ❗⚠❗ Make sure you iterate the variable to prevent an Infinite Loop❗ { e.g. i = i + 1 }`;
              }
            } else {
              errorChecker.innerHTML = `⚠ Please use an Output Symbol in the If Case Symbol [3.1] to print the even value.
              <br/> ⚠ Make sure you ONLY output the Even numbers.`;
            }
          } else {
            errorChecker.innerHTML = `⚠ Please use an If Case Symbol within a While Loop Symbol [3] to check whether the value is Even or Odd.
            <br/> ⚠ Make sure you have entered the declared Variables correctly.
            <br/> ⚠ [Hint: use the Modulus operator (%) in the expression { e.g. variable_name % 2 == 0 }]`
          }
        } else {
          errorChecker.innerHTML = `⚠ Please use a While Loop Symbol [3] to loop through an iterated variable.
           <br/> ⚠ Make sure the While Loop has an expression that checks the value of the declared variable { variable_name <= value }`;
        }
      } else {
        errorChecker.innerHTML = `⚠ Please use a Process Symbol [2] to assign a value to the declared variable. 
        <br/> ⚠ Make sure you assign the variable to a starting value of 0 { variable_name = 0 }`;
      }
    } else {
      errorChecker.innerHTML = `⚠ Please use a Declare Symbol [1] to declare an Integer variable that will be used in the While Loop. 
      <br/> ⚠ Make sure you use the correct Data Type.`;
    }

    switch (marks) {
      case 2:
        result.innerHTML = `<span style="color: #10dc60">✔ CORRECT!</span> <br/> <span style="font-size: medium">🥇 Well Done! 🥇 Marks: ${marks}/2 </span>`;
        // TODO: add 300 XP points to user's account (this.tutorialExercise.xp)
      break;
      case 1:
        result.innerHTML = `<span style="color: #10dc60">✔ CORRECT!</span> <br/> <span style="font-size: medium">🥈 Good Job! 🥈 Marks: ${marks}/2 </span>`;
        errorChecker.innerHTML += `<br/><span> ⚠ Try to use as few Symbols as possible to gain more Marks and XP points. </span>`;
        // TODO: add 150 XP points to user's account (this.tutorialExercise.xp / 2)
      break;
      case 0:
        result.innerHTML = `<span style="color: #f04141">❌ WRONG!</span> <br/> <span style="font-size: medium">🥉 Sorry, Try Again 🥉 Marks: ${marks}/2 </span>`;
        // TODO: add 30 XP points to user's account (this.tutorialExercise.xp / 10)
      break;
      default: break;
    }

    return marks;
  }
  /* Tutorial Exercise Functions End */

  public debugTutorialExerciseProgram(flowchart: Flowchart, loopBlockState: LoopblockstateService, dummyInputs) {
    // this.menu.close();
    // this.clearConsole();
    // if (this.isConsoleOpen == false) {
    //   this.toggleConsole();
    // }
    loopBlockState.initialize();
    flowchart.isProgramRunning = true;
    flowchart.isAnInputBlockRunning = false;
    flowchart.validateFlowchart(0, flowchart.SYMBOLS.length, null, dummyInputs);
  }

  public clearConsole() {
    let consoleCHAP = document.getElementById("console") as HTMLDivElement;
    consoleCHAP.innerHTML = "";
  }

}