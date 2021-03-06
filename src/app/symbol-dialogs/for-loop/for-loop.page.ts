import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { ForLoop } from '../../classes/ForLoop';

@Component({
  selector: 'app-for-loop',
  templateUrl: './for-loop.page.html',
  styleUrls: ['./for-loop.page.scss'],
})
export class ForLoopPage implements OnInit {

  symbol: ForLoop;
  stepDirection: string = "";
  toolTipInfoText: string = 'INFO: Hover over any option to view more information.';

  constructor(public modal: ModalController, public navP: NavParams) {
    this.symbol = navP.get('symbol');
    this.stepDirection = this.symbol.getStepDirection();
  }

  ngOnInit() {
    let var_name = (document.getElementById("for_var_name") as HTMLIonInputElement);
    var_name.value = this.symbol.getVariableName();

    let start_value = (document.getElementById("for_start_val") as HTMLIonInputElement);
    start_value.value = this.symbol.getStartValue().toString();

    let end_value = (document.getElementById("for_end_val") as HTMLIonInputElement);
    end_value.value = this.symbol.getEndValue().toString();

    let step_direction = (document.getElementById("for_step_dir") as HTMLIonSelectElement);
    step_direction.value = this.symbol.getStepDirection();

    let step_value = (document.getElementById("for_step_val") as HTMLIonInputElement);
    step_value.value = this.symbol.getStepValue().toString();

    this.initializeHoverEvents();
    // Colourful Textboxes
    let tbs = document.getElementsByClassName("dialogTextbox") as HTMLCollectionOf<HTMLElement>;
    for (let i = 0; i < tbs.length; i++) {
      tbs[i].addEventListener("focusin", () => {
        tbs[i].style.borderColor = "#9CDCFE";
        tbs[i].style.backgroundColor = "#DEF3FE";
      });
      tbs[i].addEventListener("focusout", () => {
        tbs[i].style.borderColor = "#ffffff";
        tbs[i].style.backgroundColor = "#ffffff";
      });
    }
  }

  public initializeHoverEvents() {
    let forLoopElements = document.getElementsByClassName("forloop_elements");
    for (let i = 0; i < forLoopElements.length; i++) {
      forLoopElements[i].addEventListener("mouseover", (e) => {
        this.toolTipInfoText = forLoopElements[i].getAttribute("data-text");
      });
      forLoopElements[i].addEventListener("mouseleave", (e) => {
        this.toolTipInfoText = "INFO: Hover over any option to view more information.";
      });
    }
  }

  public applyAndCloseModal() {
    let var_name = (document.getElementById("for_var_name") as HTMLIonInputElement);
    this.symbol.setVariableName(var_name.value);

    let start_value = (document.getElementById("for_start_val") as HTMLIonInputElement);
    this.symbol.setStartValue(Number(start_value.value));

    let end_value = (document.getElementById("for_end_val") as HTMLIonInputElement);
    this.symbol.setEndValue(Number(end_value.value));

    let step_direction = (document.getElementById("for_step_dir") as HTMLIonSelectElement);
    this.symbol.setStepDirection(step_direction.value);

    let step_value = (document.getElementById("for_step_val") as HTMLIonInputElement);
    this.symbol.setStepValue(Number(step_value.value));

    this.symbol.setForExpression();

    this.modal.dismiss(this.symbol);
  }

  public closeModal() { this.modal.dismiss(this.symbol); }

}
