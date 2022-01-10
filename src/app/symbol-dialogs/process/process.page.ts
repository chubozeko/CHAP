import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { Process } from '../../classes/Process';

@Component({
  selector: 'app-process',
  templateUrl: './process.page.html',
  styleUrls: ['./process.page.scss'],
})
export class ProcessPage implements OnInit {

  symbol: Process;
  toolTipInfoText: string = 'INFO: Hover over any option to view more information.';

  constructor(public modal: ModalController, public navP: NavParams) {
    this.symbol = navP.get('symbol') as Process;
  }

  ngOnInit() {
    let var_name = (document.getElementById("process_var_name") as HTMLIonInputElement);
    var_name.value = this.symbol.getVariableName();
    let p_exp = (document.getElementById("process_expression") as HTMLIonInputElement);
    p_exp.value = this.symbol.getThisExpression();

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
    let processElements = document.getElementsByClassName("process_elements");
    for (let i = 0; i < processElements.length; i++) {
      processElements[i].addEventListener("mouseover", (e) => {
        this.toolTipInfoText = processElements[i].getAttribute("data-text");
      });
      processElements[i].addEventListener("mouseleave", (e) => {
        this.toolTipInfoText = "INFO: Hover over any option to view more information.";
      });
    }
  }

  public applyAndCloseModal() {

    let var_name = (document.getElementById("process_var_name") as HTMLInputElement);
    this.symbol.setVariableName(var_name.value);

    let p_exp = (document.getElementById("process_expression") as HTMLInputElement);
    this.symbol.setExpression(p_exp.value);

    this.modal.dismiss(this.symbol);
  }

  public closeModal() { this.modal.dismiss(); }

}
