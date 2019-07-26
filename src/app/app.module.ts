import { NgModule } from '@angular/core';
import { BrowserModule, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { RouterModule, RouteReuseStrategy, Routes } from '@angular/router';
import { Chooser } from '@ionic-native/chooser/ngx';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { IonicGestureConfig } from "./gestures/ionic-gesture-config";
import { DragulaModule } from "ng2-dragula";
import { HttpClientModule } from "@angular/common/http";
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { File } from '@ionic-native/file/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { FileTransfer } from '@ionic-native/file-transfer/ngx';
import { DocumentViewer } from '@ionic-native/document-viewer/ngx';

import { CommentPageModule } from './symbol-dialogs/comment/comment.module';
import { DeclarePageModule } from './symbol-dialogs/declare/declare.module';
import { DoWhileLoopPageModule } from './symbol-dialogs/do-while-loop/do-while-loop.module';
import { ForLoopPageModule } from './symbol-dialogs/for-loop/for-loop.module';
import { IfElsePageModule } from './symbol-dialogs/if-else/if-else.module';
import { InputPageModule } from './symbol-dialogs/input/input.module'
import { OutputPageModule } from './symbol-dialogs/output/output.module';
import { WhileLoopPageModule } from './symbol-dialogs/while-loop/while-loop.module';
import { ProcessPageModule } from './symbol-dialogs/process/process.module';
import { CodeViewerPageModule } from './code-viewer/code-viewer.module';
import { AboutPageModule } from './about/about.module';
import { TutorialPageModule } from './tutorial/tutorial.module';
import { OpenProjectPageModule } from './open-project/open-project.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    DragulaModule.forRoot(),
    AppRoutingModule,
    CommentPageModule,
    DeclarePageModule,
    DoWhileLoopPageModule,
    ForLoopPageModule,
    IfElsePageModule,
    InputPageModule,
    ProcessPageModule,
    OutputPageModule,
    WhileLoopPageModule,
    CodeViewerPageModule,
    AboutPageModule,
    TutorialPageModule,
    OpenProjectPageModule,
    HttpClientModule,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: HAMMER_GESTURE_CONFIG, useClass: IonicGestureConfig },
    Chooser, File, FileOpener, FileTransfer, DocumentViewer
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
