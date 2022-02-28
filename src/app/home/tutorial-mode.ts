import { AlertController } from "@ionic/angular";
import { Flowchart } from "../classes/Flowchart";
import { ForLoop } from "../classes/ForLoop";
import { Output } from "../classes/Output";
import { LoopblockstateService } from "../loopblockstate.service";


export class TutorialMode {

  constructor(
    public alertC: AlertController
  ) {}

  referenceFC: Flowchart;
  tutorialExercise = { title: ``, level: ``, description: ``, filename: ``, solution: [], xp: `` }
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

  public minimizeOrMaximizeTutorialPanel(isExerciseOngoing?: boolean) {
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
      if (isExerciseOngoing) {
        document.getElementById("btn_tut_restartExercise_minimized").style.display = "none";
      } else {
        document.getElementById("btn_tut_restartExercise_minimized").style.display = "block";
      }
      tutExercisePanel.style.display = "none";
      tutSolutionPanel.style.display = "none";
      tutToolbar.classList.add("minimized"); 
      document.getElementById("tut_toolbar_mini_title").innerHTML = this.tutorialExercise.title;
    }
    
  }

  public checkTutorialSolution(flowchart: Flowchart, referenceFC: Flowchart, loopBlockState: LoopblockstateService, showSolution?: boolean) { 
    this.referenceFC = referenceFC;
    let tutToolbar = document.getElementById("tut_toolbar");
    let tutExercisePanel = document.getElementById("tut_exercisePanel");
    let btnCheckSolution = document.getElementById("btn_tut_checkSolution");
    let tutSolutionPanel = document.getElementById("tut_solutionResultsPanel");

    if (tutSolutionPanel.style.display == "none" || showSolution) {
      if (flowchart.SYMBOLS.length > 0) {
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
        return true;
      } else {
        return false;
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
      return true;
    }
  }

  /* Tutorial Exercise Functions Start */
  private checkExercise1(flowchart: Flowchart, loopBlockState: LoopblockstateService) {
    let result = document.getElementById("result");
    let errorChecker = document.getElementById("errorChecker");
    let userFCSyms = flowchart.SYMBOLS;
    let referenceFCSyms = this.referenceFC.SYMBOLS;
    let marks = 0;
    // 1. Compare Console Outputs (CO)
    let referenceCO = this.debugTutorialExerciseProgram(this.referenceFC, loopBlockState, null);
    this.clearConsole();
    let userCO = this.debugTutorialExerciseProgram(flowchart, loopBlockState, null);
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

  }

  private checkExercise2(flowchart: Flowchart, loopBlockState: LoopblockstateService) {
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
      * console.log( userFCSyms[1].id );
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
    let referenceCO = this.debugTutorialExerciseProgram(this.referenceFC, loopBlockState, dummyInputs);
    this.clearConsole();
    let userCO = this.debugTutorialExerciseProgram(flowchart, loopBlockState, dummyInputs);
    // console.log("userCO: ", userCO);
    // console.log("referenceCO: ", referenceCO);
    if (userCO == referenceCO) {
      marks++;
    }
    // 2. Compare Flowchart Structure
    if (userFCSyms[0].id == referenceFCSyms[0].id) {
      if (userFCSyms[1].id == referenceFCSyms[1].id) {
        if (userFCSyms[2].id == referenceFCSyms[2].id) {
          if (userFCSyms[3].id == referenceFCSyms[3].id && userFCSyms[3].expression.includes("+")) {
            if (userFCSyms[4].id == referenceFCSyms[4].id) {
              marks++;
              errorChecker.innerHTML = `[1] Declare ✔, [2] Input ✔, [3] Input ✔, [4] Process ✔, [5] Output ✔`;
            } else {      
              errorChecker.innerHTML = `⚠ Please use the Output Symbol [5] to print out the result. 
                <br/> ⚠ Make sure you have entered the declared Variables correctly.`;
            }
          } else {
            errorChecker.innerHTML = `⚠ Please use the Process Symbol [4] to get the summation of the entered values. 
              <br/> ⚠ Make sure you have entered the declared Variables correctly.`;
          }
        } else {
          errorChecker.innerHTML = `⚠ Please use the Input Symbol [3] to get a second input from the user. 
            <br/> ⚠ Make sure you have entered the declared Variables correctly.`;
        }
      } else {
        errorChecker.innerHTML = `⚠ Please use the Input Symbol [2] to get a first input from the user. 
          <br/> ⚠ Make sure you have entered the declared Variables correctly.`;
      }
    } else {
      errorChecker.innerHTML = `⚠ Please use the Declare Symbol [1] to declare the Variables that will be used in the Flowchart.
        <br/> ⚠ Make sure you use the correct Data Type.`;
    }

    switch (marks) {
      case 2:
        result.innerHTML = `<span style="color: #10dc60">✔ CORRECT!</span> <br/> <span style="font-size: medium">🥇 Well Done! 🥇 Marks: ${marks}/2 </span>`;
        // TODO: add 100 XP points to user's account (this.tutorialExercise.xp)
      break;
      case 1:
        result.innerHTML = `<span style="color: #10dc60">✔ CORRECT!</span> <br/> <span style="font-size: medium">🥈 Good Job! 🥈 Marks: ${marks}/2 </span>`;
        errorChecker.innerHTML += `<br/><span> ⚠ Try to use as few Symbols as possible to gain more Marks and XP points. </span>`;
        // TODO: add 50 XP points to user's account (this.tutorialExercise.xp / 2)
      break;
      case 0:
        result.innerHTML = `<span style="color: #f04141">❌ WRONG!</span> <br/> <span style="font-size: medium">🥉 Sorry, Try Again 🥉 Marks: ${marks}/2 </span>`;
        // TODO: add 10 XP points to user's account (this.tutorialExercise.xp / 10)
      break;
      default: break;
    }
  }

  private checkExercise3(flowchart: Flowchart, loopBlockState: LoopblockstateService) {
    let result = document.getElementById("result");
    let errorChecker = document.getElementById("errorChecker");
    let userFCSyms = flowchart.SYMBOLS;
    let referenceFCSyms = this.referenceFC.SYMBOLS;
    let marks = 0;
    // 1. Compare Console Outputs (CO)
    // ** Test 1: Run program with dummyInputs: 2 -> even **
    let dummyInputs = [
      { inputIndex: 0, input: 2 }
    ];
    let referenceCO = this.debugTutorialExerciseProgram(this.referenceFC, loopBlockState, dummyInputs);
    this.clearConsole();
    let userCO = this.debugTutorialExerciseProgram(flowchart, loopBlockState, dummyInputs);
    // ** Test 2: Run program with dummyInputs: 3 -> odd**
    dummyInputs = [
      { inputIndex: 3, input: 3 }
    ];
    referenceCO += this.debugTutorialExerciseProgram(this.referenceFC, loopBlockState, dummyInputs);
    this.clearConsole();
    userCO += this.debugTutorialExerciseProgram(flowchart, loopBlockState, dummyInputs);
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
            (userFCSyms[2].trueBlockSymbols[0].outputExp.localeCompare('"odd"', 'en', { sensitivity: 'base' }) === 0 || 
            userFCSyms[2].trueBlockSymbols[0].outputExp.localeCompare('"even"', 'en', { sensitivity: 'base' }) === 0)) {
              if (userFCSyms[2].falseBlockSymbols[0].id == referenceFCSyms[2].falseBlockSymbols[0].id && 
              (userFCSyms[2].falseBlockSymbols[0].outputExp.localeCompare('"odd"', 'en', { sensitivity: 'base' }) === 0 || 
              userFCSyms[2].falseBlockSymbols[0].outputExp.localeCompare('"even"', 'en', { sensitivity: 'base' }) === 0)) {
                marks++;
                errorChecker.innerHTML = `[1] Declare ✔, [2] Input ✔, [3] If Case ✔, [3][IfCase-True][1] Output ✔, [3][IfCase-False][1] Output ✔`;
              } else {
                errorChecker.innerHTML = `⚠ Please use the Output Symbol in the If Case [3] False block to print out if the entered value is Odd or Even.
                  <br/> ⚠ Make sure you have entered the declared Variables correctly.`;
              }
            } else {
              errorChecker.innerHTML = `⚠ Please use the Output Symbol in the If Case [3] True block to print out if the entered value is Odd or Even.
              <br/> ⚠ Make sure you have entered the declared Variables correctly.`;
            }
          } else {
            errorChecker.innerHTML = `⚠ Please use the If Case Symbol [3] to check whether the entered value is Odd or Even.
            <br/> ⚠ Make sure you have entered the declared Variables correctly.
            <br/> ⚠ [Hint: use the Modulus operator (%) in the equation]`;
          }
        } else {
          errorChecker.innerHTML = `⚠ Please use the If Case Symbol [3] to check whether the entered value is Odd or Even.
            <br/> ⚠ Make sure you have entered the declared Variables correctly.`;
        }
      } else {
        errorChecker.innerHTML = `⚠ Please use the Input Symbol [2] to get an input from the user. 
          <br/> ⚠ Make sure you have entered the declared Variables correctly.`;
      }
    } else {
      errorChecker.innerHTML = `⚠ Please Use Declare SYMBOL[1] to declare the Variables that will be used in the Flowchart.
        <br/> ⚠ Make sure you use the correct Data Type.`;
    }

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
  }

  private checkExercise4(flowchart: Flowchart, loopBlockState: LoopblockstateService) {
    let result = document.getElementById("result");
    let errorChecker = document.getElementById("errorChecker");
    let userFCSyms = flowchart.SYMBOLS;
    let referenceFCSyms = this.referenceFC.SYMBOLS;
    let marks = 0;
    // 1. Compare Console Outputs (CO)
    let referenceCO = this.debugTutorialExerciseProgram(this.referenceFC, loopBlockState, null);
    this.clearConsole();
    let userCO = this.debugTutorialExerciseProgram(flowchart, loopBlockState, null);
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
            if (userFCSyms[1].trueLoopBlock[0].id == referenceFCSyms[1].trueLoopBlock[0].id && userFCSyms[0].outputExp.localeCompare('"hello chap"', 'en', { sensitivity: 'base' }) === 0) {
              marks++;
              errorChecker.innerHTML = `[1] Declare ✔, [2] For Loop ✔, [2][ForLoop-True][1] Output ✔`;
            } else {
              errorChecker.innerHTML = `⚠ Please use an Output Symbol in the For Loop [2] to print out the given expression: \"Hello CHAP\".`;
            }
          } else {
            errorChecker.innerHTML = `⚠ Please make sure the For Loop Symbol [2] runs 4 times.
              <br/> ⚠ Make sure you have assigned the Loop properties correctly: 
              <br/> -> Start Value, End Value, Step Direction, Step Value`;
          }
        } else {
          errorChecker.innerHTML = `⚠ Please use the same declared variable in the For Loop Symbol [2] to use as the iterator.
            <br/> ⚠ Make sure you have assigned the declared Variables and Loop properties correctly.`;
        }
      } else {
        errorChecker.innerHTML = `⚠ Please use a For Loop [2] Symbol to create a loop structure with a given number of iterations.
          <br/> ⚠ Make sure you have assigned the declared Variables and Loop properties correctly.`;
      }
    } else {
      errorChecker.innerHTML = `⚠ Please use a Declare Symbol [1] to declare a variable that will be used in the For Loop. 
        <br/> ⚠ Make sure you use the correct Data Type.`;
    }
  
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
  }

  private checkExercise5(flowchart: Flowchart, loopBlockState: LoopblockstateService) {
    let result = document.getElementById("result");
    let errorChecker = document.getElementById("errorChecker");
    let userFCSyms = flowchart.SYMBOLS;
    let referenceFCSyms = this.referenceFC.SYMBOLS;
    let marks = 0;
    // 1. Compare Console Outputs (CO)
    let referenceCO = this.debugTutorialExerciseProgram(this.referenceFC, loopBlockState, null);
    this.clearConsole();
    let userCO = this.debugTutorialExerciseProgram(flowchart, loopBlockState, null);
    // console.log("userCO: ", userCO);
    // console.log("referenceCO: ", referenceCO);
    if (userCO == referenceCO) {
      marks++;
    }
    // 2. Compare Flowchart Structure *
    if (userFCSyms[0].id == referenceFCSyms[0].id) {
      if (userFCSyms[1].id == referenceFCSyms[1].id) {
        if (userFCSyms[2].id == referenceFCSyms[2].id) {
          if (userFCSyms[2].trueLoopBlock[0].id == referenceFCSyms[2].trueLoopBlock[0].id) {
            if (userFCSyms[2].trueLoopBlock[0].trueBlockSymbols[0].id == referenceFCSyms[2].trueLoopBlock[0].trueBlockSymbols[0].id) {
              if (userFCSyms[2].trueLoopBlock[1].id == referenceFCSyms[2].trueLoopBlock[1].id) {
                marks++;
                errorChecker.innerHTML = "[1] Declare ✔, [2] Process ✔, [3] While Loop ✔, [3.1] If Case ✔, [3.1.0] Output ✔ , [3.2] Process ✔";
              } else {
                errorChecker.innerHTML = " ⚠ Please Use PROCESS SYMBOL[3.2] & Make Sure You TYPE i=i+1❗";
              }
            } else {
              errorChecker.innerHTML = " ⚠ Please Use OUTPUT SYMBOL[3.1.0] & Make Sure You Display Even Numbers❗";
            }
          } else {
            errorChecker.innerHTML = " ⚠ Please Use IF CASE SYMBOL[3.1] & Make Sure You TYPE {VariableName %2==0}❗";
          }
        } else {
          errorChecker.innerHTML = " ⚠ Please Use WHILE LOOP SYMBOL[3] & Make Sure You TYPE {Variable Name <=10}❗";
        }
      } else {
        errorChecker.innerHTML = " ⚠ Please Use PROCESS SYMBOL[2] & Make Sure You TYPE {Variable Name = 0}❗";
      }
    } else {
      errorChecker.innerHTML = " ⚠ Please Use DECLARE SYMBOL[1] Create VARIABLE NAME as an INTEGER TYPE❗";
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

  }
  /* Tutorial Exercise Functions End */

  private debugTutorialExerciseProgram(flowchart: Flowchart, loopBlockState: LoopblockstateService, dummyInputs: any[]) {
    // this.menu.close();
    this.clearConsole();
    // if (this.isConsoleOpen == false) {
    //   this.toggleConsole();
    // }
    loopBlockState.initialize();
    flowchart.isProgramRunning = true;
    flowchart.isAnInputBlockRunning = false;
    flowchart.validateFlowchart(0, flowchart.SYMBOLS.length, null, dummyInputs);
    // Return the Console outputs
    let chapConsole = document.getElementById("console");
    return chapConsole.innerHTML.toLowerCase();
  }

  public clearConsole() {
    let consoleCHAP = document.getElementById("console") as HTMLDivElement;
    consoleCHAP.innerHTML = "";
  }

}