import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SymbolsComponent } from './symbols/symbols.component';
import { WorkspaceComponent } from './workspace/workspace.component';
import { ConsoleComponent } from './console/console.component';
import { VariablesComponent } from './variables/variables.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadChildren: './home/home.module#HomePageModule' },
  { path: 'symbols', loadChildren: './symbols/symbols.component#SymbolsComponent' },
  { path: 'workspace', loadChildren: './workspace/workspace.component#WorkspaceComponent' },
  { path: 'console', loadChildren: './console/console.component#ConsoleComponent' },
  { path: 'variables', loadChildren: './variables/variables.component#VariablesComponent' },
  { path: 'dialog-symbols', loadChildren: './dialog-symbols/dialog-symbols.module#DialogSymbolsPageModule' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
