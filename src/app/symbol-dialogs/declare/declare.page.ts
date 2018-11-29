import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { Declare } from '../../classes/Declare';

@Component({
  selector: 'app-declare',
  templateUrl: './declare.page.html',
  styleUrls: ['./declare.page.scss'],
})
export class DeclarePage implements OnInit {

  symbol: Declare;
  dataType: string = '';

  constructor(public modal: ModalController, public navP: NavParams) {
    this.symbol = navP.get('symbol');
    // this.dataType = this.symbol.getDataType();
  }

  ngOnInit() {
    let var_name = (document.getElementById("declare_var_name") as HTMLInputElement);
    var_name.value = this.symbol.getVariableName();

    let datatype = (document.getElementById("declare_data_type") as HTMLIonSelectElement);
    datatype.value = this.symbol.getDataType();

    let arrayCB = (document.getElementById("declare_array_cb") as HTMLIonCheckboxElement);
    let arrayName = (document.getElementById("declare_array_size") as HTMLInputElement);

    if( !arrayCB.checked ){
      arrayName.disabled = true;
    } else {
      arrayName.disabled = false;
    }
    arrayCB.checked = this.symbol.getIsArray();
    arrayName.value = this.symbol.getArraySize().toString();
  }

  public toggleArraySize(){
    let arrayCB = (document.getElementById("declare_array_cb") as HTMLIonCheckboxElement);
    let arrayName = (document.getElementById("declare_array_size") as HTMLInputElement);

    if( !arrayCB.checked ){
      arrayName.disabled = true;
    } else {
      arrayName.disabled = false;
    }
  }

  public applyAndCloseModal(){

    let var_name = (document.getElementById("declare_var_name") as HTMLInputElement);
    this.symbol.setVariableName( var_name.value );

    let datatype = (document.getElementById("declare_data_type") as HTMLIonSelectElement);
    this.symbol.setDataType( datatype.value );

    let arrayCB = (document.getElementById("declare_array_cb") as HTMLIonCheckboxElement);
    if( arrayCB.checked == true ){ 
      let arrayName = (document.getElementById("declare_array_size") as HTMLInputElement);
      this.symbol.createArray( true, Number(arrayName.value) );
    } else {
      this.symbol.isArray = false;
    }

    this.modal.dismiss( this.symbol );
  }

  public closeModal(){ this.modal.dismiss(); }

}
