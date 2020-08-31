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
  toolTipInfoText: string = 'INFO: Hover over an option to view more information.';

  constructor(public modal: ModalController, public navP: NavParams) {
    this.symbol = navP.get('symbol');
  }

  ngOnInit() {
    let var_name = (document.getElementById("process_var_name") as HTMLInputElement);
    var_name.value = this.symbol.getVariableName();
    let p_exp = (document.getElementById("process_expression") as HTMLInputElement);
    p_exp.value = this.symbol.getExpression();

    this.initializeHoverEvents();
  }

  public initializeHoverEvents() {
    let processElements = document.getElementsByClassName("process_elements");
    for (let i = 0; i < processElements.length; i++) {
      processElements[i].addEventListener("mouseover", (e) => {
        this.toolTipInfoText = processElements[i].getAttribute("data-text");
      });
      processElements[i].addEventListener("mouseleave", (e) => {
        this.toolTipInfoText = "INFO: Hover over an option to view more information.";
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
