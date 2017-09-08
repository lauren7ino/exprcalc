import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ButtonComponent } from './button/button.component';
import { DisplayComponent } from './display/display.component';

import { LocalStorageModule } from 'angular-2-local-storage';
import { HistoryComponent } from './history/history.component';

@NgModule({
  declarations: [
    AppComponent,
    ButtonComponent,
    DisplayComponent,
    HistoryComponent
],
  imports: [
    BrowserModule,
    LocalStorageModule.withConfig({
      prefix: 'exprcalc',
      storageType: 'localStorage'
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
