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
  }

  public applyAndCloseModal(){

    let expression = (document.getElementById("output_expression") as HTMLInputElement);
    this.symbol.setOutputExpression( expression.value );

    this.modal.dismiss( this.symbol );
  }

  public closeModal(){ this.modal.dismiss(); }

}
