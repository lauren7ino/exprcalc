import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ButtonComponent } from './button/button.component';
import { DisplayComponent } from './display/display.component';
import { HistoryComponent } from './history/history.component';
import { IconbuttonComponent } from './iconbutton/iconbutton.component';

import { ClipboardModule } from 'ngx-clipboard';
import { LocalStorageModule } from 'angular-2-local-storage';

@NgModule({
  declarations: [
    AppComponent,
    ButtonComponent,
    DisplayComponent,
    HistoryComponent,
    IconbuttonComponent
],
  imports: [
    BrowserModule,
    LocalStorageModule.withConfig({
      prefix: 'exprcalc',
      storageType: 'localStorage'
    }),
    ClipboardModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
