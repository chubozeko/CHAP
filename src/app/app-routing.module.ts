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
  { path: 'variables', loadChildren: './variables/variables.component#VariablesComponent' },  { path: 'CodeViewer', loadChildren: './code-viewer/code-viewer.module#CodeViewerPageModule' },
  { path: 'About', loadChildren: './about/about.module#AboutPageModule' },
  { path: 'Tutorial', loadChildren: './tutorial/tutorial.module#TutorialPageModule' },
  { path: 'open-project', loadChildren: './open-project/open-project.module#OpenProjectPageModule' },

  // { path: 'process', loadChildren: './symbol-dialogs/process/process.module#ProcessPageModule' },
  // { path: 'declare', loadChildren: './symbol-dialogs/declare/declare.module#DeclarePageModule' },
  // { path: 'input', loadChildren: './symbol-dialogs/input/input.module#InputPageModule' },
  // { path: 'output', loadChildren: './symbol-dialogs/output/output.module#OutputPageModule' },
  // { path: 'if-else', loadChildren: './symbol-dialogs/if-else/if-else.module#IfElsePageModule' },
  // { path: 'for-loop', loadChildren: './symbol-dialogs/for-loop/for-loop.module#ForLoopPageModule' },
  // { path: 'while-loop', loadChildren: './symbol-dialogs/while-loop/while-loop.module#WhileLoopPageModule' },
  // { path: 'do-while-loop', loadChildren: './symbol-dialogs/do-while-loop/do-while-loop.module#DoWhileLoopPageModule' },
  // { path: 'operation', loadChildren: './symbol-dialogs/operation/operation.module#OperationPageModule' },
  // { path: 'comment', loadChildren: './symbol-dialogs/comment/comment.module#CommentPageModule' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
