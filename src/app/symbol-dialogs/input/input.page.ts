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
