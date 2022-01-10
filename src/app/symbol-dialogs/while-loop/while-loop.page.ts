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
    this.symbol = navP.get('symbol') as WhileLoop;
  }

  ngOnInit() {
    let exps = (document.getElementById("while_expression") as HTMLInputElement);
    exps.value = this.symbol.getExpression();

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

  public applyAndCloseModal() {
    let exps = (document.getElementById("while_expression") as HTMLInputElement);
    this.symbol.setWhileExpression(exps.value);

    this.modal.dismiss(this.symbol);
  }

  public closeModal() {
    this.modal.dismiss(this.symbol);
  }

}
