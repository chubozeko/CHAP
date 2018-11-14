import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { Process } from '../../classes/Process';

@Component({
  selector: 'app-process',
  templateUrl: './process.page.html',
  styleUrls: ['./process.page.scss'],
})
export class ProcessPage implements OnInit {

  symbol: Process;
  constructor(public modal: ModalController, public navP: NavParams) { 
    this.symbol = navP.get('symbol');
  }

  ngOnInit() {
    let var_name = (document.getElementById("process_var_name") as HTMLInputElement);
    var_name.value = this.symbol.getVariableName();
    let p_exp = (document.getElementById("process_expression") as HTMLInputElement);
    p_exp.value = this.symbol.getExpression();
  }

  public applyAndCloseModal(){

    let var_name = (document.getElementById("process_var_name") as HTMLInputElement);
    this.symbol.setVariableName( var_name.value );

    let p_exp = (document.getElementById("process_expression") as HTMLInputElement);
    this.symbol.setExpression( p_exp.value );

    this.modal.dismiss( this.symbol );
  }

  public closeModal(){ this.modal.dismiss(); }

}
