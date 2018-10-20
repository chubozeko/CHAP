import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, RouteReuseStrategy, Routes } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { SymbolsComponent } from './symbols/symbols.component';
import { WorkspaceComponent } from './workspace/workspace.component';
import { ConsoleComponent } from './console/console.component';
import { VariablesComponent } from './variables/variables.component';
import { DialogSymbolsPage } from './dialog-symbols/dialog-symbols.page';
import { HomePage } from './home/home.page';
import { EditorDirective } from './editor.directive';

@NgModule({
  declarations: [
    AppComponent,
    SymbolsComponent,
    WorkspaceComponent,
    ConsoleComponent,
    VariablesComponent,
    DialogSymbolsPage,
    EditorDirective
  ],
  entryComponents: [DialogSymbolsPage],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
