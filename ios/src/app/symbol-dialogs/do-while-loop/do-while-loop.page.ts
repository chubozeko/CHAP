import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { DoWhileLoop } from '../../classes/DoWhileLoop';

@Component({
  selector: 'app-do-while-loop',
  templateUrl: './do-while-loop.page.html',
  styleUrls: ['./do-while-loop.page.scss'],
})
export class DoWhileLoopPage implements OnInit {

  symbol: DoWhileLoop;
  constructor(public modal: ModalController, public navP: NavParams) {
    this.symbol = navP.get('symbol');
  }

  ngOnInit() {
    let exps = (document.getElementById("do_while_expression") as HTMLInputElement);
    exps.value = this.symbol.getDoWhileExpression();

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
    let exps = (document.getElementById("do_while_expression") as HTMLInputElement);
    this.symbol.setDoWhileExpression(exps.value);

    this.modal.dismiss(this.symbol);
  }

  public closeModal() {
    this.modal.dismiss(this.symbol);
  }

}
