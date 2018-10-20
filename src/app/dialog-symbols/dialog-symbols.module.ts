import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { DialogSymbolsPage } from './dialog-symbols.page';

const routes: Routes = [
  {
    path: '',
    component: DialogSymbolsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [DialogSymbolsPage]
})
export class DialogSymbolsPageModule {}
