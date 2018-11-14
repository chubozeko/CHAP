import { NgModule } from '@angular/core';
import { BrowserModule, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { RouterModule, RouteReuseStrategy, Routes } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { IonicGestureConfig } from "./gestures/ionic-gesture-config";

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { SymbolsComponent } from './symbols/symbols.component';
import { WorkspaceComponent } from './workspace/workspace.component';
import { ConsoleComponent } from './console/console.component';
import { VariablesComponent } from './variables/variables.component';

import { CommentPageModule } from './symbol-dialogs/comment/comment.module';
import { DeclarePageModule } from './symbol-dialogs/declare/declare.module';
// import { DoWhileLoopPageModule } from './symbol-dialogs/do-while-loop/do-while-loop.module';
// import { ForLoopPageModule } from './symbol-dialogs/for-loop/for-loop.module';
import { IfElsePageModule } from './symbol-dialogs/if-else/if-else.module';
import { InputPageModule } from './symbol-dialogs/input/input.module';
// import { OperationPageModule } from './symbol-dialogs/operation/operation.module';
import { OutputPageModule } from './symbol-dialogs/output/output.module';
import { WhileLoopPageModule } from './symbol-dialogs/while-loop/while-loop.module';
import { ProcessPageModule } from './symbol-dialogs/process/process.module';

@NgModule({
  declarations: [
    AppComponent,
    SymbolsComponent,
    WorkspaceComponent,
    ConsoleComponent,
    VariablesComponent
  ],
  entryComponents: [],
  imports: [
    BrowserModule, 
    IonicModule.forRoot(), 
    AppRoutingModule,
    CommentPageModule,
    DeclarePageModule,
    // DoWhileLoopPageModule,
    // ForLoopPageModule,
    IfElsePageModule,
    InputPageModule,
    ProcessPageModule,
    OutputPageModule,
    WhileLoopPageModule
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: HAMMER_GESTURE_CONFIG, useClass: IonicGestureConfig },
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
