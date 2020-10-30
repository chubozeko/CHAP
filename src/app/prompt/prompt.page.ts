import { Component, OnInit } from '@angular/core';
import { NavParams, PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-prompt',
  templateUrl: './prompt.page.html',
  styleUrls: ['./prompt.page.scss'],
})
export class PromptPage implements OnInit {

  constructor(
    public popCtrl: PopoverController,
    public navP: NavParams
  ) { }

  ngOnInit() {
    if (this.navP.get('type') == 'symbol') {
      let sList = document.getElementById("p_symbolAS");
      sList.style.display = "block";
      let aList = document.getElementById("p_arrowAS");
      aList.style.display = "none";
    } else if (this.navP.get('type') == 'arrow') {
      let sList = document.getElementById("p_symbolAS");
      sList.style.display = "none";
      let aList = document.getElementById("p_arrowAS");
      aList.style.display = "block";
    }
  }

  cutSymbol() {
    this.popCtrl.dismiss('cut');
  }

  copySymbol() {
    this.popCtrl.dismiss('copy');
  }

  deleteSymbol() {
    this.popCtrl.dismiss('delete');
  }

  pasteSymbol() {
    this.popCtrl.dismiss('paste');
  }

}
