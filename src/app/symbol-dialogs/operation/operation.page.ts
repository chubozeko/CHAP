import { Component, OnInit } from '@angular/core';
import { NavParams, PopoverController } from '@ionic/angular';
import { SymbolData } from '../../symbol-data';
import { THEMES } from '../../themes/themes';

@Component({
  selector: 'app-operation',
  templateUrl: './operation.page.html',
  styleUrls: ['./operation.page.scss'],
})
export class OperationPage {

  symbols = SymbolData;
  themes = THEMES;
  themeIndex: number;
  event;

  constructor(private popCtrl: PopoverController,
    public navP: NavParams) {
    this.event = navP.get("event");
  }

  setColor(id: string) {
    switch (id) {
      case "s_declare": return this.themes[this.themeIndex].colours.declare;
      case "s_input": return this.themes[this.themeIndex].colours.input;
      case "s_output": return this.themes[this.themeIndex].colours.output;
      case "s_process": return this.themes[this.themeIndex].colours.process;
      case "s_if_case": return this.themes[this.themeIndex].colours.ifcase;
      case "s_for_loop": return this.themes[this.themeIndex].colours.forloop;
      case "s_while_loop": return this.themes[this.themeIndex].colours.whileloop;
      case "s_do_while_loop": return this.themes[this.themeIndex].colours.dowhileloop;
      case "s_comment": return this.themes[this.themeIndex].colours.comment;
      case "s_start": return this.themes[this.themeIndex].colours.start;
      case "s_stop": return this.themes[this.themeIndex].colours.stop;
    }
  }

  selectSymbolToAdd(id) {
    this.popCtrl.dismiss({ id: id });
  }

  closePopup() {
    this.popCtrl.dismiss();
  }

}
