import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { WhileLoop } from '../../classes/WhileLoop';

@Component({
  selector: 'app-while-loop',
  templateUrl: './while-loop.page.html',
  styleUrls: ['./while-loop.page.scss'],
})
export class WhileLoopPage implements OnInit {

  symbol: WhileLoop;
  constructor(public modal: ModalController, public navP: NavParams) {
    this.symbol = navP.get('symbol');
  }

  ngOnInit() {
    let exps = (document.getElementById("while_expression") as HTMLInputElement);
    exps.value = this.symbol.getWhileExpression();
  }

  public applyAndCloseModal(){
    let exps = (document.getElementById("while_expression") as HTMLInputElement);
    this.symbol.setWhileExpression( exps.value );

    this.modal.dismiss( this.symbol );
  }

  public closeModal(){
    this.modal.dismiss( this.symbol );
  }

}
