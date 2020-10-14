import { Component, OnInit } from '@angular/core';
import { NavParams, PopoverController } from '@ionic/angular';
import { SYMBOLS } from '../../symbol-list';

@Component({
  selector: 'app-operation',
  templateUrl: './operation.page.html',
  styleUrls: ['./operation.page.scss'],
})
export class OperationPage implements OnInit {

  symbols = SYMBOLS;
  event;

  constructor(private popCtrl: PopoverController,
    public navP: NavParams) {
    this.event = navP.get("event");
  }

  ngOnInit() {

  }

  addSymbol(id, e) {
    this.popCtrl.dismiss({ id: id, e: this.event });
  }

  closePopup() {
    this.popCtrl.dismiss();
  }

}
