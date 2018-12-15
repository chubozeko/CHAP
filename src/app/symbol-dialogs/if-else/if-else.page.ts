import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { IfCase } from '../../classes/IfCase';

@Component({
  selector: 'app-if-else',
  templateUrl: './if-else.page.html',
  styleUrls: ['./if-else.page.scss'],
})
export class IfElsePage implements OnInit {

  symbol: IfCase;
  constructor(public modal: ModalController, public navP: NavParams) {
    this.symbol = navP.get('symbol'); 
  }

  ngOnInit() {
    let ifexp = (document.getElementById("if_expression") as HTMLInputElement);
    ifexp.value = this.symbol.getIfStatement();
  }

  public applyAndCloseModal(){

    let ifexp = (document.getElementById("if_expression") as HTMLInputElement);
    this.symbol.setIfStatement( ifexp.value );

    this.modal.dismiss( this.symbol );
  }

  public closeModal(){
    this.modal.dismiss( this.symbol );
  }

}
