import '../polyfills';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';

import { AmChartsModule } from '@amcharts/amcharts3-angular';

import { AngularModule} from './angular.module';
import { Bootstrap4Module} from './bootstrap4.module';

import {AppComponent} from './app.component';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AngularModule,
    Bootstrap4Module,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpModule,
    ReactiveFormsModule,
    AmChartsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})

export class AppModule { }
