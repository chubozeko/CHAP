import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { Output } from '../../classes/Output';

@Component({
  selector: 'app-output',
  templateUrl: './output.page.html',
  styleUrls: ['./output.page.scss'],
})
export class OutputPage implements OnInit {

  symbol: Output;

  constructor(public modal: ModalController, public navP: NavParams) {
    this.symbol = navP.get('symbol');
  }

  ngOnInit() {
    let expression = (document.getElementById("output_expression") as HTMLInputElement);
    expression.value = this.symbol.getOutputExpression();

    // Colourful Textboxes
    let tbs = document.getElementsByClassName("dialogTextbox") as HTMLCollectionOf<HTMLElement>;
    for (let i = 0; i < tbs.length; i++) {
      tbs[i].addEventListener("focusin", () => {
        tbs[i].style.border = "2px solid #9CDCFE";
        tbs[i].style.borderRadius = "5px";
        tbs[i].style.backgroundColor = "#DEF3FE";
      });
      tbs[i].addEventListener("focusout", () => {
        tbs[i].style.border = "none";
        tbs[i].style.backgroundColor = "#ffffff";
      });
    }
  }

  public applyAndCloseModal() {

    let expression = (document.getElementById("output_expression") as HTMLInputElement);
    this.symbol.setOutputExpression(expression.value);

    this.modal.dismiss(this.symbol);
  }

  public closeModal() { this.modal.dismiss(); }

}
