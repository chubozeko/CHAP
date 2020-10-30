import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-input',
  templateUrl: './input.page.html',
  styleUrls: ['./input.page.scss'],
})
export class InputPage implements OnInit {

  symbol;

  constructor(public modal: ModalController, public navP: NavParams) {
    this.symbol = navP.get('symbol');
  }

  ngOnInit() {
    let var_name = (document.getElementById("input_var_name") as HTMLIonInputElement);
    var_name.value = this.symbol.getVariableName();

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

    let var_name = (document.getElementById("input_var_name") as HTMLIonInputElement);
    this.symbol.setVariableName(var_name.value);

    this.modal.dismiss(this.symbol);
  }

  public closeModal() {
    this.modal.dismiss();
  }

}
