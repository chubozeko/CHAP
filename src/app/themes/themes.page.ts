import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams, PopoverController } from '@ionic/angular';
import { SYMBOLS } from '../symbol-list';
import { THEMES } from '../themes';

@Component({
  selector: 'app-themes',
  templateUrl: './themes.page.html',
  styleUrls: ['./themes.page.scss'],
})
export class ThemesPage implements OnInit {

  symbols = SYMBOLS;
  themes = THEMES;
  themeIndex: number;
  currTheme: string;
  event;

  constructor(private modalC: ModalController,
    public navP: NavParams) {
    // this.event = navP.get("event");
    this.themeIndex = navP.get("themeIndex");
  }

  ngOnInit() {
    console.log("THEMES: ", this.themes);
    console.log("T Index: ", this.themeIndex);
    let themeVal = (document.getElementById("themeSelect") as HTMLIonSelectElement);
    themeVal.value = this.themes[this.themeIndex].theme;
    this.currTheme = this.themes[this.themeIndex].theme;
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

  changeTheme() {
    let themeVal = (document.getElementById("themeSelect") as HTMLIonSelectElement);
    for (let i = 0; i < this.themes.length; i++) {
      if (this.themes[i].theme == themeVal.value) {
        this.themeIndex = i;
      }
    }
    // Declare Symbols
    let t1 = document.getElementById("s_declare");
    t1.style.backgroundColor = this.themes[this.themeIndex].colours.declare;
    // Input Symbols
    let t2 = document.getElementById("s_input");
    t2.style.backgroundColor = this.themes[this.themeIndex].colours.input;
    // Output Symbols
    let t3 = document.getElementById("s_output");
    t3.style.backgroundColor = this.themes[this.themeIndex].colours.output;
    // Process Symbols
    let t4 = document.getElementById("s_process");
    t4.style.backgroundColor = this.themes[this.themeIndex].colours.process;
    // If Case Symbols
    let t5 = document.getElementById("s_if_case");
    t5.style.backgroundColor = this.themes[this.themeIndex].colours.ifcase;
    // For Loop Symbols
    let t6 = document.getElementById("s_for_loop");
    t6.style.backgroundColor = this.themes[this.themeIndex].colours.forloop;
    // While Loop Symbols
    let t7 = document.getElementById("s_while_loop");
    t7.style.backgroundColor = this.themes[this.themeIndex].colours.whileloop;
    // Do While Loop Symbols
    let t8 = document.getElementById("s_do_while_loop");
    t8.style.backgroundColor = this.themes[this.themeIndex].colours.dowhileloop;
    // Comment Symbols
    let t9 = document.getElementById("s_comment");
    t9.style.backgroundColor = this.themes[this.themeIndex].colours.comment;
    // Start Symbols
    let t10 = document.getElementById("s_start");
    t10.style.backgroundColor = this.themes[this.themeIndex].colours.start;
    // Stop Symbols
    let t11 = document.getElementById("s_stop");
    t11.style.backgroundColor = this.themes[this.themeIndex].colours.stop;
  }

  closeModal() {
    this.modalC.dismiss({ themeIndex: this.themeIndex });
  }

}
